import { searchImage } from "../services/elasticsearch/esClient";

export const searchImageController = async (req, res) => {
  try {
    const queryVector = req.body.queryVector;
    const docs = await searchImage(queryVector, "crop_feature_vector");
    return res.status(200).json({ ok: true, docs });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }
};
