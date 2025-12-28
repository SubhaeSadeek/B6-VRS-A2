import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/", auth("admin"), userController.getAllUsers);
router.get(
	"/singleuser",
	auth("admin", "customer"),
	userController.getSingleUser
);

export const userRoute = router;
