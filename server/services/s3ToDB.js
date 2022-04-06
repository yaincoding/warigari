import AWS from "aws-sdk";
import config from "../config/config.js";

const s3 = new AWS.S3(config.s3.s3Config);

/**
 * @description
 * s3 버킷에서 csv 파일을 읽은 뒤, 문자열 처리 후 DB에 저장
 * @param
 * @return
 */
export const func1 = async (src) => getS3Object("musinsa.csv");

const getS3Object = async (objPath) =>
  s3.getObject({ Bucket: config.s3.S3_BUCKET_NAME, Key: objPath }).promise();

// const handleCsv = (data) => ["name", "url"];
