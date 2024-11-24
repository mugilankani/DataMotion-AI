import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
	process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT;
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;

const PROJECT_ID = process.env.PROJECT_ID;
const INFERENCE_ID = process.env.INFERENCE_ID;

const videoFilePath = path.join(process.cwd(), "my-video/output", "video.mp4");

const storageClient = new S3Client({
	region: "auto",
	endpoint: CLOUDFLARE_R2_ENDPOINT,
	credentials: {
		accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
		secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
	},
	forcePathStyle: true,
});

async function uploadFileToS3(filePath, key) {
	const fileStream = fs.createReadStream(filePath);
	const uploadParams = {
		Bucket: CLOUDFLARE_R2_BUCKET_NAME,
		Key: key,
		Body: fileStream,
		ContentType: mime.lookup(filePath) || "application/octet-stream",
	};

	try {
		await storageClient.send(new PutObjectCommand(uploadParams));
		console.log(`File uploaded successfully to ${key}`);
	} catch (err) {
		console.error(`Error uploading file: ${err.message}`);
		throw err;
	}
}

async function uploadVideo() {
	if (!fs.existsSync(videoFilePath)) {
		console.log(`File ${videoFilePath} does not exist.`);
		process.exit(1);
	}

	const videoKey = `${PROJECT_ID}/${INFERENCE_ID}/video.mp4`;

	try {
		console.log(`Starting to upload video: ${videoFilePath}`);
		await uploadFileToS3(videoFilePath, videoKey);
		console.log("Video upload successful.");
	} catch (err) {
		console.error(`Error during video upload: ${err.message}`);
		process.exit(1);
	}
}

uploadVideo();
