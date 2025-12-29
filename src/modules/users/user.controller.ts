import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
	try {
		const result = await userServices.getAllUsersFromDB();
		res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			data: result.rows,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const updateUser = async (req: Request, res: Response) => {
	const id = Number(req.params.userId);
	if (Number.isNaN(id)) {
		return res.status(400).json({
			success: false,
			message: "id should be number",
		});
	}
	try {
		const result = await userServices.updateUsersFromDB(id, req.body);
		if (result.rows.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No user found on this Id",
			});
		}
		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: result.rows[0],
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const deleteUser = async (req: Request, res: Response) => {
	const id = Number(req.params.userId);
	if (Number.isNaN(id)) {
		return res.status(400).json({
			success: false,
			message: "Please give id as numbers only",
		});
	}
	try {
		const result = await userServices.deleteUserFromDB(id);
		if (!result.rowCount) {
			return res.status(400).json({
				success: false,
				message: "User is not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
export const userController = {
	getAllUsers,
	updateUser,
	deleteUser,
};
