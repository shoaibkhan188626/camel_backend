import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
connectDB();
console.log(process.env.PORT)
console.log("-----------------------------")