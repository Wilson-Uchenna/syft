"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
exports.getGetSignedUrl = getGetSignedUrl;
exports.getPutSignedUrl = getPutSignedUrl;
const AWS = require("aws-sdk");
const config_1 = require("./config/config");
const env = process.env.NODE_ENV || "development";
const { aws_region, aws_bucket } = config_1.config[env].app;
exports.s3 = new AWS.S3({
    signatureVersion: "v4",
    region: aws_region,
    params: { Bucket: aws_bucket },
});
// Generates an AWS signed URL for retrieving objects
function getGetSignedUrl(key) {
    const signedUrlExpireSeconds = 60 * 5;
    return exports.s3.getSignedUrl("getObject", {
        Bucket: aws_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds,
    });
}
// Generates an AWS signed URL for uploading objects
function getPutSignedUrl(key) {
    const signedUrlExpireSeconds = 60 * 5;
    return exports.s3.getSignedUrl("putObject", {
        Bucket: aws_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds,
    });
}
