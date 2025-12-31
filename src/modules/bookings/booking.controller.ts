import { Request, Response } from "express";
import { bookingService } from "./booking.service";
const createBooking = async (req: Request, res: Response) => {
	if (req.user!.role === "customer" && req.user!.id !== req.body.customer_id) {
		return res.status(400).json({
			success: false,
			message: "Dear Customer, we need your correct customer ID",
		});
	}
	try {
		const result = await bookingService.createBookingIntoDB(req.body);

		res.status(201).json({
			success: true,
			message: "Vehicle created successfully",
			data: result,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const getAllBookings = async (req: Request, res: Response) => {
	try {
		const result = await bookingService.getAllBookingsFromDB(req.user!);

		res.status(201).json({
			success: true,
			message: "Vehicle created successfully",
			data: result,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
const updateBooking = async (req: Request, res: Response) => {
	const id = Number(req.params.bookingId);
	if (Number.isNaN(id)) {
		throw new Error("Booking id must be number");
	}
	try {
		const result = await bookingService.updateBookingIntoDB(
			id,
			req.user!,
			req.body
		);
		const message =
			req.user!.role === "customer"
				? "Booking cancelled successfully"
				: "Booking marked as returned. Vehicle is now available ";
		res.status(200).json({
			success: true,
			message,
			data: result,
		});
	} catch (err: any) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

export const bookingController = {
	createBooking,
	getAllBookings,
	updateBooking,
};
