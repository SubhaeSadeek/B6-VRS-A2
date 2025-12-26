import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";

const loginUserIntoDB = async (email: string, password: string) => {
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
	};
	const jwtSecret = "04333816da7ae01b48524af3fe33b467";

	const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "7d" });
	delete user.rows[0].password;
	return { token, user: user.rows[0] };
};

export const authService = {
	loginUserIntoDB,
};
