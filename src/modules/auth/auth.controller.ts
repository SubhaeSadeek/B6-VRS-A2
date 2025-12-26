import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
	try {
		const result = await authService.loginUserIntoDB(
			req.body.email,
			req.body.password
		);
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: result,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

export const authController = {
	loginUser,
};
