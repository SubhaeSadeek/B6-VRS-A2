import { pool } from "../config/db";

export const autoReturnEndBooking = () => {
	setInterval(async () => {
		try {
			const { rows } = await pool.query(`
				UPDATE bookings
				SET status = 'returned'
				WHERE status = 'active'
				  AND rent_end_date < CURRENT_DATE
				RETURNING vehicle_id
			`);
			console.log(rows);
			if (rows.length > 0) {
				await pool.query(
					`
					UPDATE vehicles
					SET availability_status = 'available'
					WHERE id = ANY($1)
				`,
					[rows.map((r) => r.vehicle_id)]
				);
			}
		} catch (err) {
			console.error("Auto-return failed:", err);
		}
	}, 60 * 60 * 1000); /* will call after ecery 30 mins interval */
};
