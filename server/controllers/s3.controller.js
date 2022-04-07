import { func1 } from "../services/s3ToDB.js";
import db from "../models/index.js";

export const getInfoFromS3 = async (req, res) => {
  try {
    const result = await func1();
    const arr = result.Body.toString()
      .split(/\r?\n/g)
      .map((item) =>
        item.split(",").map((element) => element.replace(/"/g, ""))
      );

    const promises = arr.map(
      ([productName, productPart, imageUrl, unitPrice]) =>
        db.Items.create({
          productName,
          productPart,
          imageUrl,
          unitPrice: Number(unitPrice),
        })
    );

    await Promise.all(promises);

    return res.status(200).send("ok");
  } catch (e) {
    return res.status(400).send("not ok");
  }
};
