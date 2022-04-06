import { func1 } from "../services/s3ToDB.js";

export const getInfoFromS3 = async (req, res) => {
  try {
    await func1();

    return res.status(200).send("ok");
  } catch (e) {
    return res.status(400).send("not ok");
  }
};
