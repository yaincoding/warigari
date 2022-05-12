import express from "express";
import { searchImageController } from "../../controllers/search.controller.js";

const searchRouter = express.Router();

searchRouter.post("/", searchImageController);

export default searchRouter;
