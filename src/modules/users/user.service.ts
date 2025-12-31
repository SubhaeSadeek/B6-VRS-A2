import { pool } from "../../config/db";

const getAllUsersFromDB = async () => {
	const result = await pool.query(
		`SELECT id, name, email, phone, role FROM users`
	);

	return result;
};

const updateUsersFromDB = async (
	userId: number,
	payload: Record<string, unknown>
) => {
	const { name, email, phone, role } = payload;
	const result = await pool.query(
		`
		UPDATE users SET
		name=COALESCE($1, name),
		email= COALESCE($2, email),
		phone= COALESCE($3, phone), 
		role = COALESCE($4, role)
		WHERE id = $5 
		RETURNING *`,
		[name, email, phone, role, userId]
	);
	delete result.rows[0].password;

	return result;
};
const deleteUserFromDB = async (userId: number) => {
	const userHasBookingResult = await pool.query(
		`
		SELECT 1
    	FROM bookings
    	WHERE customer_id = $1
      	AND status = 'active'
    	LIMIT 1
		`,
		[userId]
	);
	if (userHasBookingResult.rows.length > 0) {
		throw new Error("User has an active booking. User cannot be deleted");
	}

	const result = pool.query(
		`
	DELETE FROM users 
	WHERE id = $1 
	RETURNING *`,
		[userId]
	);
	return result;
};

export const userServices = {
	getAllUsersFromDB,
	updateUsersFromDB,
	deleteUserFromDB,
};
