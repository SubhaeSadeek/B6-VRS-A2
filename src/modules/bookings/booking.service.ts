import { pool } from "../../config/db";

const createBookingIntoDB = async (payload: Record<string, unknown>) => {
	const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

	const vehicleResult = await pool.query(
		`
        SELECT vehicle_name, daily_rent_price, availability_status 
        FROM vehicles
        WHERE id = $1
        `,
		[vehicle_id]
	);

	if (vehicleResult.rows.length === 0) {
		throw new Error("No vehicle found in this ID");
	}
	const selectedVehicle = vehicleResult.rows[0];
	if (selectedVehicle.availability_status !== "available") {
		throw new Error("Vehicle is already booked or not available");
	}
	const bookingStartDay = new Date(rent_start_date as string);
	const bookingEndDay = new Date(rent_end_date as string);
	const numberOfDays =
		(bookingEndDay.getTime() - bookingStartDay.getTime()) /
		(1000 * 60 * 60 * 24);
	if (numberOfDays <= 0) {
		throw new Error("Start and end days for rent are not valid");
	}
	const totalRentPrice =
		numberOfDays * Number(selectedVehicle.daily_rent_price);
	const bookingResult = await pool.query(
		`
		INSERT INTO bookings
		(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
		VALUES ($1, $2, $3, $4, $5, 'active')
		RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
		`,
		[customer_id, vehicle_id, rent_start_date, rent_end_date, totalRentPrice]
	);
	await pool.query(
		`
		UPDATE vehicles
		SET availability_status = 'booked'
		WHERE id = $1
		`,
		[vehicle_id]
	);

	return {
		...bookingResult.rows[0],
		total_price: Number(bookingResult.rows[0].total_price),
		rent_start_date: bookingResult.rows[0].rent_start_date
			.toISOString()
			.split("T")[0],
		rent_end_date: bookingResult.rows[0].rent_end_date
			.toISOString()
			.split("T")[0],
		vehicle: {
			vehicle_name: selectedVehicle.vehicle_name,
			daily_rent_price: Number(selectedVehicle.daily_rent_price),
		},
	};
};

export const bookingService = {
	createBookingIntoDB,
};
