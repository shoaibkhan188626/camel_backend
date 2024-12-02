import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AppError from "./utils/ErrorHandler.js";
import gloabalErrorHandler from "./utils/globalErrorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

dotenv.config({ path: "./config.env" });

const app = express();
const router = express.Router();

router.post("/", () => {
  console.log("hello from server.js");
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on thid server!`, 404));
});

app.use(gloabalErrorHandler);
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`server running on the port ${PORT}`);
});
console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')