import bcrypt from "bcryptjs";
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

const getAllUsersFromDB = async () => {
	const result = await pool.query(`SELECT * FROM users`);

	return result;
};

const getSingleUsersFromDB = async (email: string) => {
	const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
		email,
	]);

	return result;
};

export const userServices = {
	createUserIntoDB,
	getAllUsersFromDB,
	getSingleUsersFromDB,
};
