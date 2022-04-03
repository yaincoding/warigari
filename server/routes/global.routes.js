import express from "express";
const globalRouter = express.Router();

globalRouter.route("/").get((req, res) => {
  console.log("Health Check");
  res.status(200).send("OK");
});

export default globalRouter;
