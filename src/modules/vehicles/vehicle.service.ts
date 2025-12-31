import { pool } from "../../config/db";
import { convertVehicleRentPriceIntoNumber } from "../../utils/vehiclePriceToNumber";

// Create Vehicle POST API
const createVehicleIntoDB = async (payload: Record<string, unknown>) => {
	const {
		vehicle_name,
		type,
		registration_number,
		daily_rent_price,
		availability_status,
	} = payload;
	const result = pool.query(
		`
    INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
		[
			vehicle_name,
			type,
			registration_number,
			daily_rent_price,
			availability_status,
		]
	);
	return result;
};

// get All Vehicle GET API

const getAllVehicleFromDB = async () => {
	const result = await pool.query(`
        SELECT * FROM vehicles
        `);
	console.log(result.rows);
	const vehicles = convertVehicleRentPriceIntoNumber(result.rows);
	return vehicles;
};
// GET single vehicle by ID
const getSingleVehicleFromDB = async (vehicleID: number) => {
	const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
		vehicleID,
	]);

	const vehicles = convertVehicleRentPriceIntoNumber(result.rows);
	return vehicles;
};
// UPDATE vehicle by id
const updateVehicleFromDB = async (
	vehicleID: number,
	payload: Record<string, unknown>
) => {
	const {
		vehicle_name,
		type,
		registration_number,
		daily_rent_price,
		availability_status,
	} = payload;
	const result = await pool.query(
		`
        UPDATE vehicles
		SET
			vehicle_name = COALESCE($1, vehicle_name),
			type = COALESCE($2, type),
			registration_number = COALESCE($3, registration_number),
			daily_rent_price = COALESCE($4, daily_rent_price),
			availability_status = COALESCE($5, availability_status)
		WHERE id = $6
		RETURNING *
        `,
		[
			vehicle_name,
			type,
			registration_number,
			daily_rent_price,
			availability_status,
			vehicleID,
		]
	);
	console.log(result.rows);
	const vehicles = convertVehicleRentPriceIntoNumber(result.rows);
	return vehicles;
};
const deleteVehicleFromDB = async (vehicleID: number) => {
	// selecting user who already booked that is active and if already booked, user is being barred to delete
	const vehicleHasBookingResult = await pool.query(
		`
		SELECT 1
    	FROM bookings
    	WHERE vehicle_id = $1
      	AND status = 'active'
    	LIMIT 1
		`,
		[vehicleID]
	);
	if (vehicleHasBookingResult.rows.length > 0) {
		throw new Error("Vehicle has an active booking. Vehicle cannot be deleted");
	}
	const result = await pool.query(
		`
    DELETE FROM vehicles 
    WHERE id=$1
    RETURNING *`,
		[vehicleID]
	);
	return result;
};
export const vehicleService = {
	createVehicleIntoDB,
	getAllVehicleFromDB,
	getSingleVehicleFromDB,
	updateVehicleFromDB,
	deleteVehicleFromDB,
};
