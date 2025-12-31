import { pool } from "../config/db";

export const autoReturnEndBooking = () => {
	setInterval(async () => {
		try {
			await pool.query("BEGIN");

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

			await pool.query("COMMIT");
		} catch (err) {
			await pool.query("ROLLBACK");
			console.error("Auto-return failed:", err);
		}
	}, 30 * 60 * 1000); /* will call after ecery 30 mins interval */
};
