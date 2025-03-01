import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// const connect = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}`);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.log(error);
//   }
// };

app.use("/api/orders", orderRoute);
app.use("/payment", paymentRoute);


app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Backend is running" });
});

// await connect();
app.listen(`${process.env.PORT}`, () => {
  console.log(`Backend is running at port ${process.env.PORT}`);
});

export default app;
