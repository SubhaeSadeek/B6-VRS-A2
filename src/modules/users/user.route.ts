import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();
router.post("/users", userController.createUser);

export const userRoute = router;
