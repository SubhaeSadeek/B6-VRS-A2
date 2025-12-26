import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();
router.post("/", userController.createUser);
router.get("/", auth(), userController.getAllUsers);
router.get("/singleuser", auth(), userController.getSingleUser);

export const userRoute = router;
