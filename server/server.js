import express from "express";
import globalRouter from "./routes/global.routes.js";
const app = express();

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", globalRouter);

export default app;
