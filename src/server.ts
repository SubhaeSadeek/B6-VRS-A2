import express from "express";
import config from "./config";
import initDB from "./config/db";
const app = express();
const PORT = config.port;

initDB();

app.listen(PORT, () => {
	console.log(`app is listening to port ${PORT}`);
});
