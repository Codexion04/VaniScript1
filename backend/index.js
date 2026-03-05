require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const {
    TranscribeClient,
    StartTranscriptionJobCommand,
    GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");

const {
    BedrockRuntimeClient,
    InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const app = express();

/* =============================
   MIDDLEWARE
============================= */

app.use(cors());
app.use(express.json());

/* =============================
   REQUEST LOGGER
============================= */

app.use((req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

/* =============================
   MULTER SETUP
============================= */

const upload = multer({
    storage: multer.memoryStorage(),
});

/* =============================
   AWS CLIENTS
============================= */

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const transcribeClient = new TranscribeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const bedrock = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/* =============================
   TEST ROUTE
============================= */

app.get("/", (req, res) => {
    res.send("Backend working 🚀");
});

/* =============================
   FILE UPLOAD TO S3
============================= */

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("UPLOAD ROUTE HIT");

        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
            });
        }

        const file = req.file;
        const fileName = Date.now() + "-" + file.originalname;

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        console.log("File uploaded:", fileName);

        res.json({
            message: "File uploaded successfully",
            fileName: fileName,
        });

    } catch (error) {

        console.error("Upload error:", error);

        res.status(500).json({
            error: "Upload failed",
            details: error.message,
        });

    }
});

/* =============================
   SPEECH TO TEXT (AWS TRANSCRIBE)
============================= */

app.post("/transcribe", async (req, res) => {

    try {

        console.log("TRANSCRIBE ROUTE HIT");

        const { fileName } = req.body;

        if (!fileName) {
            return res.status(400).json({
                error: "fileName is required",
            });
        }

        const jobName = "transcribe-" + Date.now();

        const params = {
            TranscriptionJobName: jobName,
            LanguageCode: "en-IN",
            MediaFormat: "webm",
            Media: {
                MediaFileUri: `s3://${process.env.AWS_BUCKET_NAME}/${fileName}`,
            },
            OutputBucketName: process.env.AWS_BUCKET_NAME,
        };

        await transcribeClient.send(
            new StartTranscriptionJobCommand(params)
        );

        let transcriptUrl = null;
        let status = "IN_PROGRESS";

        while (status === "IN_PROGRESS") {

            const data = await transcribeClient.send(
                new GetTranscriptionJobCommand({
                    TranscriptionJobName: jobName,
                })
            );

            status = data.TranscriptionJob.TranscriptionJobStatus;

            if (status === "COMPLETED") {
                transcriptUrl =
                    data.TranscriptionJob.Transcript.TranscriptFileUri;
                break;
            }

            if (status === "FAILED") {
                throw new Error("Transcription job failed");
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        res.json({
            message: "Transcription completed",
            transcriptUrl,
        });

    } catch (error) {

        console.error("Transcribe error:", error);

        res.status(500).json({
            error: "Transcription failed",
            details: error.message,
        });

    }

});

/* =============================
   AI POST GENERATION (CLAUDE 3 HAIKU)
============================= */

app.post("/generate-post", async (req, res) => {

    try {

        const { prompt } = req.body;

        console.log("Generating AI post for:", prompt);

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-3-haiku-20240307-v1:0",
            contentType: "application/json",
            accept: "application/json",

            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 300,
                temperature: 0.7,

                messages: [
                    {
                        role: "user",
                        content: `Write a professional LinkedIn or Instagram post about: ${prompt}`
                    }
                ]
            })
        });

        const response = await bedrock.send(command);

        const responseBody = JSON.parse(
            new TextDecoder().decode(response.body)
        );

        const generatedText = responseBody.content[0].text;

        res.json({
            post: generatedText
        });

    } catch (error) {

        console.error("Bedrock error:", error);

        res.status(500).json({
            error: "AI generation failed",
            details: error.message
        });

    }

});

/* =============================
   SERVER START
============================= */

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

/* =============================
   GLOBAL ERROR HANDLING
============================= */

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});