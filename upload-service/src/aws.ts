import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: process.env.ACCESS_ID,
  secretAccessKey: process.env.SECRET_KEY,
  endpoint: process.env.ENDPOINT,
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: process.env.S3_BUCKET!,
      Key: fileName,
    })
    .promise();
  console.log(response);
};
