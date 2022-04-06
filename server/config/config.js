import dotenv from "dotenv";

dotenv.config({
  path: `${process.cwd().split("/").slice(0, -1).join("/")}/.env`,
});

const envVars = process.env;

export default {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  s3: {
    S3_BUCKET_NAME: envVars.S3_BUCKET_NAME,
    s3Config: {
      accessKeyId: envVars.S3_ACCESS_KEY,
      secretAccessKey: envVars.S3_SECRET_KEY,
    },
  },
};
