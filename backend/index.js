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
   AI CONTENT GENERATION (LLAMA)
============================= */

app.post("/generate-post", async (req, res) => {
    try {

        const { prompt } = req.body;

        console.log("Generating AI post for:", prompt);

        const command = new InvokeModelCommand({
            modelId: "meta.llama3-8b-instruct-v1:0",
            contentType: "application/json",
            accept: "application/json",

            body: JSON.stringify({
                prompt: `
<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a social media expert.

Write a professional LinkedIn or Instagram post with emojis and hashtags.

<|start_header_id|>user<|end_header_id|>
${prompt}

<|start_header_id|>assistant<|end_header_id|>
`,
                max_gen_len: 300,
                temperature: 0.7
            })
        });

        const response = await bedrock.send(command);

        const responseBody = JSON.parse(
            new TextDecoder().decode(response.body)
        );

        const generatedText = responseBody.generation;

        res.json({
            post: generatedText
        });

    } catch (error) {

        console.error("Llama error:", error);

        res.status(500).json({
            error: "AI generation failed",
            details: error.message
        });

    }
});

/* =============================
   VIRALITY SCORE ANALYSIS
============================= */

app.post("/virality-score", async (req, res) => {

    try {

        const { content } = req.body;

        const command = new InvokeModelCommand({
            modelId: "meta.llama3-8b-instruct-v1",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                prompt: `
Analyze this LinkedIn post and return virality score.

Post:
${content}

Return JSON like:
{
 score: number,
 engagement: number,
 hashtags: number,
 quality: number,
 timing: number
}
        `,
                max_gen_len: 200,
                temperature: 0.5
            })
        });

        const response = await bedrock.send(command);

        const responseBody = JSON.parse(
            new TextDecoder().decode(response.body)
        );

        res.json({
            analysis: responseBody.generation
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Virality analysis failed"
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

app.post("/best-time", async (req, res) => {

    try {

        const { post } = req.body;

        const command = new InvokeModelCommand({
            modelId: "meta.llama3-8b-instruct-v1:0",
            contentType: "application/json",
            accept: "application/json",

            body: JSON.stringify({
                prompt: `
<|begin_of_text|>
You are a social media expert.

Analyze this post and suggest the best posting time.

Return JSON format like:
{
 "instagram": "7 PM",
 "linkedin": "8 PM",
 "twitter": "6 PM"
}

Post:
${post}
`,
                max_gen_len: 150,
                temperature: 0.7
            })
        });

        const response = await bedrock.send(command);

        const responseBody = JSON.parse(
            new TextDecoder().decode(response.body)
        );

        res.json({
            suggestion: responseBody.generation
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Scheduler AI failed"
        });

    }

});