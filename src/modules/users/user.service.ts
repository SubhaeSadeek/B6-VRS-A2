import { pool } from "../../config/db";

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
	getAllUsersFromDB,
	getSingleUsersFromDB,
};
