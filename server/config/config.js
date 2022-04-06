import dotenv from "dotenv";

dotenv.config();

const envVars = process.env;

export default {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
};
