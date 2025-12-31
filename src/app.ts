import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { bookingRoute } from "./modules/bookings/booking.route";
import { userRoute } from "./modules/users/user.route";
import { vehicleRoute } from "./modules/vehicles/vehicle.route";
import { autoReturnEndBooking } from "./utils/autoReturnEndBooking";
const app = express();

// middlewares
app.use(express.json());
// database table initiating if no table created
initDB();
// auto return function for booking exceeding rent_end_date
autoReturnEndBooking();

//  USERS Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

// VEHICLES Route
app.use("/api/v1/vehicles", vehicleRoute);
// BOOKING Route
app.use("/api/v1/bookings", bookingRoute);

// false route
app.use((req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
		path: req.path,
	});
});

export default app;
