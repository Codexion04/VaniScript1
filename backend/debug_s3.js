import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

console.log("Testing AWS Credentials...");
console.log("Region:", process.env.AWS_REGION);
console.log("Bucket:", process.env.AWS_BUCKET_NAME);

const awsConfig = {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
};

const s3 = new S3Client(awsConfig);

async function testS3() {
    try {
        const data = await s3.send(new ListBucketsCommand({}));
        console.log("✅ Credentials are valid. Buckets found:", data.Buckets.length);
        const bucketExists = data.Buckets.some(b => b.Name === process.env.AWS_BUCKET_NAME);
        if (bucketExists) {
            console.log(`✅ Bucket "${process.env.AWS_BUCKET_NAME}" found!`);
        } else {
            console.log(`❌ Bucket "${process.env.AWS_BUCKET_NAME}" NOT found!`);
            console.log("Available buckets:", data.Buckets.map(b => b.Name).join(", "));
        }
    } catch (err) {
        console.log("❌ Error testing S3:", err.message);
        if (err.code) console.log("Error Code:", err.code);
    }
}

testS3();
