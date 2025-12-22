import { Request, Response } from "express";
import { pool } from "../../config/db";

const createUser = async (req: Request, res: Response) => {
	const { name, email, password, phone, role } = req.body;
	const result = await pool.query(
		`
    INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5)`,
		[name, email, password, phone, role]
	);
	res.status(201).json({
		success: true,
		message: "User registered successfully",
		data: result.rows[0],
	});
};

export const userService = {
	createUser,
};
