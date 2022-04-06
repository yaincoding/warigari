import { func1 } from "../services/s3ToDB.js";

export const getInfoFromS3 = async (req, res) => {
  try {
    const result = await func1();
    const arr = result.Body.toString()
      .split(/\r?\n/g)
      .map((item) => item.split(","));
    return res.status(200).send("arr");
  } catch (e) {
    console.log(e);
    return res.status(400).send("not ok");
  }
};
