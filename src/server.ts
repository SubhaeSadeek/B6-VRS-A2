import express from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { userRoute } from "./modules/users/user.route";
const app = express();
const PORT = config.port;

// middlewares
app.use(express.json());

initDB();

// app routes for USERS
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.listen(PORT, () => {
	console.log(`app is listening to port ${PORT}`);
});
