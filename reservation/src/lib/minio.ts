import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "us-east-1", // Для MinIO указываем любую
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true, // Важно для MinIO!
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

export const uploadRestaurantFile = async (file: Buffer, fileName: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
    Body: file,
    ContentType: "image/png",
    ACL: ObjectCannedACL.public_read,
  };
  await s3.send(new PutObjectCommand(params));
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileName}`;
};

export const uploadUserFile = async (file: Buffer, fileName: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
    Body: file,
    ContentType: "image/png",
    ACL: ObjectCannedACL.public_read,
  };
  await s3.send(new PutObjectCommand(params));
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_USER}/${fileName}`;
};

export const deleteRestaurantFile = async (fileName: string) => {
  const bucketName = process.env.S3_BUCKET_NAME;

  const params = {
    Bucket: bucketName as string,
    Key: fileName,
  };

  await s3.send(new DeleteObjectCommand(params));
};

export const deleteUserFile = async (fileName: string) => {
  const bucketName = process.env.S3_BUCKET_USER;

  const params = {
    Bucket: bucketName as string,
    Key: fileName,
  };

  await s3.send(new DeleteObjectCommand(params));
};
