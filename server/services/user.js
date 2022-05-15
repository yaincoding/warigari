import db from "../models/index.js";

export const readOneUser = (account) =>
  db.Users.findOne({ where: { account } });
