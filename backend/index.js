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
   SPEECH TO TEXT
============================= */

app.post("/transcribe", async (req, res) => {
  try {
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
   AI POST GENERATION
============================= */

app.post("/generate-post", async (req, res) => {
  try {
    const { prompt } = req.body;

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
<|begin_of_text|>
You are a social media expert.

Write a viral LinkedIn or Instagram post with emojis, hooks and hashtags.

${prompt}
`,
        max_gen_len: 300,
        temperature: 0.8,
      }),
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      post: responseBody.generation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI generation failed",
    });
  }
});

/* =============================
   VIRALITY SCORE ANALYSIS
============================= */

app.post("/virality-score", (req, res) => {

  const { post } = req.body;

  if (!post) {
    return res.status(400).json({ error: "Post content missing" });
  }

  const text = post.toLowerCase();

  /* -----------------------------
     BASIC METRICS
  ----------------------------- */

  const length = text.length;
  const hashtags = (text.match(/#/g) || []).length;
  const emojis = (text.match(/🔥|🚀|✨|🎉|💡|😍|👏|📢|💥/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const exclamations = (text.match(/!/g) || []).length;

  /* -----------------------------
     VIRAL KEYWORDS
  ----------------------------- */

  const viralWords = [
    "secret",
    "tips",
    "growth",
    "viral",
    "hack",
    "learn",
    "ai",
    "free",
    "guide",
    "best"
  ];

  let keywordBoost = 0;

  viralWords.forEach(word => {
    if (text.includes(word)) {
      keywordBoost += 2;   // reduced boost
    }
  });

  /* -----------------------------
     LENGTH SCORE
  ----------------------------- */

  let lengthScore = 0;

  if (length < 50) lengthScore = 8;
  else if (length < 120) lengthScore = 18;
  else if (length < 250) lengthScore = 25;
  else if (length < 400) lengthScore = 22;
  else lengthScore = 15;

  /* -----------------------------
     ENGAGEMENT SCORE
  ----------------------------- */

  const hashtagScore = Math.min(hashtags * 3, 12);
  const emojiScore = Math.min(emojis * 3, 10);
  const questionScore = questions * 4;
  const exclaimScore = Math.min(exclamations * 2, 6);

  /* -----------------------------
     BASE SCORE
  ----------------------------- */

  let score =
    30 +                     // base score
    lengthScore +
    hashtagScore +
    emojiScore +
    questionScore +
    exclaimScore +
    keywordBoost;

  /* -----------------------------
     NORMALIZE SCORE
  ----------------------------- */

  score = Math.round(score);

  if (score > 95) score = 95;
  if (score < 25) score = 25;

  console.log("Virality score:", score);

  /* -----------------------------
     PREDICTION
  ----------------------------- */

  let prediction = "Low";

  if (score >= 85) prediction = "Highly Viral";
  else if (score >= 70) prediction = "Good Potential";
  else if (score >= 50) prediction = "Average";
  else prediction = "Low";

  /* -----------------------------
     METRICS (REALISTIC)
  ----------------------------- */

  const reach = Math.round(score * 8 + Math.random() * 40);
  const engagement = Math.round(score * 0.6);
  const shares = Math.round(score * 0.25);
  const impressions = Math.round(score * 12 + Math.random() * 60);

  res.json({
    score,
    prediction,
    reach,
    engagement,
    shares,
    impressions
  });

});
/* =============================
   BEST TIME SUGGESTION
============================= */

app.post("/best-time", async (req, res) => {
  try {
    const { post } = req.body;

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
You are a social media strategist.

Suggest the best time to post this content.

Return JSON:

{
 "instagram":"7 PM",
 "linkedin":"8 AM",
 "twitter":"6 PM"
}

Post:
${post}
`,
        max_gen_len: 120,
        temperature: 0.7,
      }),
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      suggestion: responseBody.generation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Scheduler AI failed",
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
   ERROR HANDLING
============================= */

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});