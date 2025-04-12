import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import labRouter from "@/routes/lab.route";
import userRouter from "@/routes/user.route";
import { CLIENT_URL, COOKIE_SECRET, PORT } from "@/utils/constants";
import cors from "cors";
import workspaceRouter from "./routes/workspace.route";

const app = express();

app.use(cookieParser(COOKIE_SECRET));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/api/lab", labRouter);
app.use("/api/user", userRouter);
app.use("/api/workspace", workspaceRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
