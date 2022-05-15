import db from "../models/index.js";

export const readOneUser = (account) =>
  db.Users.findOne({ where: { account } });

export const readAllusers = () => db.Users.findAll();
