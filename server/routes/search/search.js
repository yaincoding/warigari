import express from "express";
import { searchImage } from "../../services/elasticsearch/esClient.js";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("req", req);
  const queryVector = req.body.queryVector;
  searchImage(queryVector, "crop_feature_vector")
    .then((docs) => {
      res.json({
        ok: true,
        docs: docs,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
});

export default router;
