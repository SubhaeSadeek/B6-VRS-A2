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
		success: false;
	}
};

export const userController = {
	createUser,
};
