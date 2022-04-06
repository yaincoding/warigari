import { func1 } from "../services/s3ToDB.js";
import db from "../models/index.js";

export const getInfoFromS3 = async (req, res) => {
  try {
    const result = await func1();
    const arr = result.Body.toString()
      .split(/\r?\n/g)
      .map((item) => item.split(","));

    const promises = arr.map((item) =>
      db.Items.create({
        productName: item[0],
        productPart: item[1],
        imageUrl: item[2],
        unitPrice: Number(item[3]),
      })
    );

    await Promise.all(promises);

    return res.status(200).send("ok");
  } catch (e) {
    console.log(e);
    return res.status(400).send("not ok");
  }
};
