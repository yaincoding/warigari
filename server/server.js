import express from "express";
import globalRouter from "./routes/global.routes.js";
import searchRouter from "./routes/search/search.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", globalRouter);
app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`express server is listening on ${PORT}`);
});

export default app;
