import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

import { errorHandlerDev, errorHandlerProd } from "./utils/GlobalErrorHandler";

// routes
import authRoute from "./routes/auth.route";
import todoRoute from "./routes/todo.route";

const app = express();

config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("<h1> server is running... <h1/>");
});

app.use("/api/v1/t", todoRoute);
app.use("/api/v1/auth", authRoute);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandlerDev);
} else {
  app.use(errorHandlerProd);
}

export default app;
