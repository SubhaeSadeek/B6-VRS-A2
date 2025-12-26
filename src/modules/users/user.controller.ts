import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
	try {
		const result = await userServices.createUserIntoDB(req.body);
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: result.rows[0],
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const getAllUsers = async (req: Request, res: Response) => {
	try {
		const result = await userServices.getAllUsersFromDB();
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: result.rows,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const getSingleUser = async (req: Request, res: Response) => {
	try {
		const result = await userServices.getSingleUsersFromDB(req.user!.email);
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: result.rows[0],
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
export const userController = {
	createUser,
	getAllUsers,
	getSingleUser,
};
