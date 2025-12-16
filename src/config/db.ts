import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
	connectionString: `${config.connection_str}`,
});

const initDB = async () => {
	// CREATE table for ***VEHICLES***
	await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(180) UNIQUE NOT NULL CHECK(email = LOWER(email)),
        password TEXT NOT NULL CHECK(LENGTH(password) >= 6) ,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(10) CHECK(role IN('admin','customer'))

        )
        `);
	await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(4) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(9, 2) NOT NULL CHECK(daily_rent_price > 0),
        availability_status VARCHAR(9) CHECK(availability_status IN ('available', 'booked'))

        )
        `);

	await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE SET NULL,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
            total_price NUMERIC(10, 2) CHECK(total_price >= 0),
            status VARCHAR(15) CHECK(status IN ('active', 'cancelled', 'returned')) 
            )
            `);
	console.log("connecte to db");
};
export default initDB;
