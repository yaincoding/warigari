import dotenv from "dotenv";
dotenv.config();

const envVars = process.env;

export default {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  s3Config: {
    // S3_BUCKET_NAME : ,
    // S3_ACCESS_KEY: ,
    // S3_SECRET_KEY:
  },
};
