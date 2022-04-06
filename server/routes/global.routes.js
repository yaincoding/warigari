import express from "express";
import { getInfoFromS3 } from "../controllers/s3.controller.js";

const globalRouter = express.Router();

globalRouter.route("/").get((req, res) => {
  console.log("Health Check");
  res.status(200).send("OK");
});

globalRouter.route("/imaegInfo").get(getInfoFromS3);

export default globalRouter;
