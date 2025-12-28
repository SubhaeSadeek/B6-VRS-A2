import { pool } from "../../config/db";

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
	const vehicles = result.rows.map((vehicle) => {
		return { ...vehicle, daily_rent_price: Number(vehicle.daily_rent_price) };
	});
	return vehicles;
};
const getSingleVehicleFromDB = async (vehicleID: number) => {
	const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
		vehicleID,
	]);
	return result;
};

export const vehicleService = {
	createVehicleIntoDB,
	getAllVehicleFromDB,
	getSingleVehicleFromDB,
};
