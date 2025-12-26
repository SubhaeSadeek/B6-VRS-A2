import { NextFunction, Request, Response } from "express";

const varify = (req: Request, res: Response, next: NextFunction) => {
	console.log("Id koi");
};

export default varify;
