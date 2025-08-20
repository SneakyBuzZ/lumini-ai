import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "@/_user/routes/user-route";
import { CLIENT_URL, COOKIE_SECRET, PORT } from "@/utils/constants";
import cors from "cors";
import workspaceRouter from "@/_workspace/routes/workspace-route";
import { errorMiddleware } from "./middlewares/error-middleware";
import authRouter from "@/_user/routes/auth-route";
import labRouter from "@/_lab/routes/lab-route";

const app = express();

app.use(cookieParser(COOKIE_SECRET));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/lab", labRouter);
app.use("/api/workspace", workspaceRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
