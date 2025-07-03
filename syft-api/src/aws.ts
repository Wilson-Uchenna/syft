import AWS = require("aws-sdk");
import { config as fullConfig } from "./config/config";

const env = process.env.NODE_ENV || "development";
const { aws_region, aws_bucket } = fullConfig[env].app;

export const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: aws_region,
  params: { Bucket: aws_bucket },
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl("getObject", {
    Bucket: aws_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl("putObject", {
    Bucket: aws_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
