import { Router } from "express";
import auth from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = Router();
// creating vehicles
router.post("/", auth("admin"), vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getSingleVehicle);

export const vehicleRoute = router;
