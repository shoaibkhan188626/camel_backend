import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./config.env" });

const app = express();
const router = express.Router();

router.post("/", () => {
  console.log("hello from server.js");
});
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`server running on the port ${PORT}`);
});
