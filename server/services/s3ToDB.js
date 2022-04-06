import * as aws from "aws-sdk";
import config from "../config/config.js";

const s3 = aws.S3(config.s3.s3Config);

/**
 * @description
 * s3 버킷에서 csv 파일을 읽은 뒤, 문자열 처리 후 DB에 저장
 * @param
 * @return
 */
export const func1 = async (src) => {
  // 버킷에서 객체 가져온다
  const data = await getS3Object(src);
  console.log(data);
  // 가져온 객체 csv 파일 문자열 처리
  // const [name, imgUrl, ...args] = handleCsv(data);
  // db 연결해서 저장
};

const getS3Object = async (objPath) =>
  s3.getObject({ Bucket: "123", Key: objPath });

const handleCsv = (data) => ["name", "url"];
