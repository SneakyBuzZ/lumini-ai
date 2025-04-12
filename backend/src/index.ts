import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import indexRouter from "./routes/index.route.js";
const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_: Request, res: Response) => {
  return res.send("It's working 🙌");
});

app.use("/api", indexRouter);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
