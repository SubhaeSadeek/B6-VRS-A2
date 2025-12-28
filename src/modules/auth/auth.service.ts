import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
	const { name, email, password, phone, role } = payload;
	const hashPassword = await bcrypt.hash(password as string, 12);
	const result = await pool.query(
		`
    INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
		[name, email, hashPassword, phone, role]
	);
	delete result.rows[0].password;
	return result;
};

const loginUserFromDB = async (email: string, password: string) => {
	const user = await pool.query(
		`
        SELECT * FROM users  WHERE email=$1`,
		[email]
	);
	if (user.rows.length === 0) {
		throw new Error("User not found");
	}
	const matchPassword = await bcrypt.compare(password, user.rows[0].password);
	if (!matchPassword) {
		throw new Error("invalid credential");
	}
	const jwtPayload = {
		id: user.rows[0].id,
		name: user.rows[0].name,
		email: user.rows[0].email,
		role: user.rows[0].role,
	};
	// const jwtSecret = "04333816da7ae01b48524af3fe33b467";

	const token = jwt.sign(jwtPayload, config.jwtSecret as string, {
		expiresIn: "7d",
	});
	delete user.rows[0].password;
	return { token, user: user.rows[0] };
};

export const authService = {
	loginUserFromDB,
	createUserIntoDB,
};
