import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
	try {
		const result = await vehicleService.createVehicleIntoDB(req.body);
		res.status(201).json({
			success: true,
			message: "Vehicle created successfully",
			data: result.rows[0],
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

const getAllVehicles = async (req: Request, res: Response) => {
	try {
		const result = await vehicleService.getAllVehicleFromDB();
		if (result.length === 0) {
			res.status(200).json({
				success: true,
				message: "No vehicles found",
				data: result,
			});
		}
		res.status(200).json({
			success: true,
			message: "Vehicles retrieved successfully",
			data: result,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

const getSingleVehicle = async (req: Request, res: Response) => {
	const id = Number(req.params.vehicleId);
	if (Number.isNaN(id)) {
		return res.status(400).json({
			success: false,
			message: "Invalid Id given, id is number",
		});
	}
	try {
		const result = await vehicleService.getSingleVehicleFromDB(id);

		if (result.length === 0) {
			return res.status(500).json({
				success: false,
				message: "No vehicle found with this Id. Please give correct id",
			});
		}
		res.status(200).json({
			success: true,
			message: "Vehicle is retrived",
			data: result,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const updateVehicle = async (req: Request, res: Response) => {
	console.log(req.params.vehicleId);
	const id = Number(req.params.vehicleId);
	if (Number.isNaN(id)) {
		return res.status(400).json({
			success: false,
			message: "Invalid Id given, id is number",
		});
	}
	try {
		const result = await vehicleService.updateVehicleFromDB(id, req.body);

		if (result.length === 0) {
			return res.status(500).json({
				success: false,
				message: "No vehicle found with this Id. Please give correct id",
			});
		}
		res.status(200).json({
			success: true,
			message: "Vehicle updated successfully",
			data: result,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const deleteVehicle = async (req: Request, res: Response) => {
	const id = Number(req.params.vehicleId);
	if (Number.isNaN(id)) {
		return res.status(500).json({
			success: false,
			message: "id is not valid, please give number for id",
		});
	}
	try {
		const result = await vehicleService.deleteVehicleFromDB(id);

		if (!result.rowCount) {
			return res.status(404).json({
				success: false,
				message: "Vehicle  can not be deleted or vehicle is not there",
			});
		}
		res.status(200).json({
			success: true,
			message: "Vehicle deleted successfully",
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

export const vehicleController = {
	createVehicle,
	getAllVehicles,
	getSingleVehicle,
	updateVehicle,
	deleteVehicle,
};
