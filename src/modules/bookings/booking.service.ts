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

const getAllBookingsFromDB = async (userload: Record<string, unknown>) => {
	// get all bookings for CUSTOMER
	console.log(userload);
	if (userload.role === "admin") {
		const bookingResult = await pool.query(`SELECT * FROM bookings`);
		const finalView = [];
		for (const booking of bookingResult.rows) {
			const user = await pool.query(
				"SELECT name,email FROM users WHERE id=$1",
				[booking.customer_id]
			);
			const vehicle = await pool.query(
				"SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1",
				[booking.vehicle_id]
			);
			finalView.push({
				...booking,
				rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
				rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
				total_price: Number(booking.total_price),
				customer: user.rows[0],
				vehicle: vehicle.rows[0],
			});
		}
		return finalView;
	} else {
		const bookingResult = await pool.query(
			`
        SELECT id, vehicle_id, rent_start_date, rent_end_date, total_price, status FROM bookings
        WHERE customer_id = $1`,
			[userload.id]
		);
		const finalView = [];
		for (const booking of bookingResult.rows) {
			const vehicle = await pool.query(
				"SELECT vehicle_name,registration_number, type FROM vehicles WHERE id=$1",
				[booking.vehicle_id]
			);
			finalView.push({
				...booking,
				rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
				rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
				total_price: Number(booking.total_price),

				vehicle: vehicle.rows[0],
			});
		}
		return finalView;
	}
};

const updateBookingIntoDB = async (
	bookingID: number,
	userload: Record<string, unknown>,
	payload: Record<string, unknown>
) => {
	const { status } = payload;

	const updateResult = await pool.query(
		`
            UPDATE bookings
            SET status = $1
            WHERE id = $2
            RETURNING *`,
		[status, bookingID]
	);
	const updateVehicle = await pool.query(
		`
			UPDATE vehicles
			SET availability_status = $1
			WHERE id = $2
			RETURNING availability_status
			`,
		["available", updateResult.rows[0].vehicle_id]
	);
	if (userload.role === "customer") {
		if (status !== "cancelled") {
			throw new Error("customer can only cancell booking");
		}

		return {
			...updateResult.rows[0],
			rent_start_date: updateResult.rows[0].rent_start_date
				.toISOString()
				.split("T")[0],
			rent_end_date: updateResult.rows[0].rent_end_date
				.toISOString()
				.split("T")[0],
			total_price: Number(updateResult.rows[0].total_price),
		};
	}
	if (userload.role === "admin") {
		if (payload.status !== "returned") {
			throw new Error("Admin should change status to returned ONLY");
		}
		return {
			...updateResult.rows[0],
			rent_start_date: updateResult.rows[0].rent_start_date
				.toISOString()
				.split("T")[0],
			rent_end_date: updateResult.rows[0].rent_end_date
				.toISOString()
				.split("T")[0],
			total_price: Number(updateResult.rows[0].total_price),
			vehicle: {
				availability_status: updateVehicle.rows[0].availability_status,
			},
		};
	}
};
export const bookingService = {
	createBookingIntoDB,
	getAllBookingsFromDB,
	updateBookingIntoDB,
};
