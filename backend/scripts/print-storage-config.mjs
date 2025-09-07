const red = (s)=>\x1b[31m\x1b[0m;
const green = (s)=>\x1b[32m\x1b[0m;
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET, S3_ENDPOINT, S3_PUBLIC_BASE_URL } = process.env;

const usingS3 = !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && S3_BUCKET);
console.log(usingS3 ? green("provider: s3") : green("provider: local"));
console.log("S3_REGION:", S3_REGION || "(unset)");
console.log("S3_BUCKET:", S3_BUCKET || "(unset)");
console.log("S3_ENDPOINT:", S3_ENDPOINT || "(unset)");
console.log("S3_PUBLIC_BASE_URL:", S3_PUBLIC_BASE_URL || "(unset)");