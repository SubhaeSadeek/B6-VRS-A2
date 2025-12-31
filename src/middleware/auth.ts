import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";
const auth = (...roles: ("admin" | "customer")[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authorizationData = req.headers.authorization;
			if (!authorizationData) {
				throw new Error("Access token is not retrived!");
			}
			const [type, token] = authorizationData.split(" ");

			if (type !== "Bearer" || !token) {
				throw new Error("Authorization must be Bearer <token>");
			}
			const decoded = jwt.verify(
				token,
				config.jwtSecret as string
			) as JwtPayload;

			const user = await pool.query(
				`
            SELECT * FROM users WHERE email=$1
            `,
				[decoded.email]
			);
			if (user.rows.length === 0) {
				throw new Error(
					"JWT token may be expire or usert and email mismach with token"
				);
			}
			req.user = decoded;
			if (roles.length && !roles.includes(decoded.role)) {
				throw new Error("Role is not appropriate");
			}

			next();
		} catch (err: any) {
			res.status(500).json({
				success: false,
				message: err.message,
			});
		}
	};
};

export default auth;
