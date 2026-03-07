import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";



const app = express();
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

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
   DYNAMODB
============================= */

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

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
      return res.status(400).json({ error: "No file uploaded" });
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
    console.error(error);

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
    console.error(error);

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
        prompt: `Write a professional LinkedIn post with emojis and hashtags about: ${prompt}`,
        max_gen_len: 300,
        temperature: 0.7,
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
      details: error.message,
    });
  }
});

/* =============================
   SAVE POST TO DYNAMODB
============================= */

app.post("/save-post", async (req, res) => {
  try {
    const { content } = req.body;

    const params = {
      TableName: "VaniScriptUsers",

      Item: {
        userId: "user-" + Date.now(),
        content: content,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDB.send(new PutCommand(params));

    res.json({
      message: "Post saved to DynamoDB",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database save failed",
    });
  }
});

/* =============================
   TEST DATABASE
============================= */

app.post("/test-db", async (req, res) => {
  try {
    const params = {
      TableName: "VaniScriptUsers",
      Item: {
        userId: "testUser",
      },
    };

    await dynamoDB.send(new PutCommand(params));

    res.json({
      message: "User saved to DynamoDB",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "DB error",
    });
  }
});

/* =============================
   SERVER
============================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.get("/my-posts", async (req, res) => {
  try {

    const params = {
      TableName: "VaniScriptUsers"
    };

    const data = await dynamoDB.send(new ScanCommand(params));

    res.json({
      posts: data.Items
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch posts"
    });

  }
});

app.delete("/delete-post", async (req, res) => {
  try {

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId required"
      });
    }

    const params = {
      TableName: "VaniScriptUsers",
      Key: {
        userId: userId
      }
    };

    await dynamoDB.send(new DeleteCommand(params));

    res.json({
      message: "Post deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Delete failed"
    });

  }
});

/* =============================
   HASHTAG GENERATOR AI
============================= */

app.post("/generate-hashtags", async (req, res) => {
  try {

    const { post } = req.body;

    if (!post) {
      return res.status(400).json({
        error: "post is required"
      });
    }

    console.log("Generating hashtags for:", post);

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
You are a social media expert.

Generate 10 viral hashtags for this post.

Post:
${post}

Return only hashtags.
        `,
        max_gen_len: 100,
        temperature: 0.7
      })
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      hashtags: responseBody.generation
    });

  } catch (error) {

    console.error("Hashtag AI error:", error);

    res.status(500).json({
      error: "Hashtag generation failed"
    });

  }
});


/* =============================
   REWRITE POST AI
============================= */

app.post("/rewrite-post", async (req, res) => {
  try {

    const { post } = req.body;

    if (!post) {
      return res.status(400).json({
        error: "post is required"
      });
    }

    console.log("Rewriting post:", post);

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
You are a social media expert.

Rewrite this post to make it more engaging and viral.

Post:
${post}

Return only improved post.
        `,
        max_gen_len: 200,
        temperature: 0.7
      })
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      rewrittenPost: responseBody.generation
    });

  } catch (error) {

    console.error("Rewrite AI error:", error);

    res.status(500).json({
      error: "Rewrite AI failed"
    });

  }
});


/* =============================
   TRENDING TOPICS AI
============================= */

app.post("/trending-topics", async (req, res) => {

  try {

    const { niche } = req.body;

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
You are a social media strategist.

Give 10 trending content topics for this niche.

Niche:
${niche}

Return as list.
`,
        max_gen_len: 200,
        temperature: 0.7
      })
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      topics: responseBody.generation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Trending topics generation failed"
    });

  }

});


/* =============================
   CONTENT IDEAS GENERATOR
============================= */

app.post("/content-ideas", async (req, res) => {

  try {

    const { niche } = req.body;

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
You are a social media strategist.

Generate 10 viral post ideas for this niche.

Niche:
${niche}

Return as numbered list.
`,
        max_gen_len: 200,
        temperature: 0.7
      })
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      ideas: responseBody.generation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Content ideas generation failed"
    });

  }

});

//best time to post-ai
app.post("/best-time", async (req, res) => {
  try {

    const { topic, platform } = req.body;

    if (!topic || !platform) {
      return res.status(400).json({
        error: "topic and platform are required"
      });
    }

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a social media expert.

Give the best 5 posting times for maximum engagement.

Return ONLY clean text.

<|start_header_id|>user<|end_header_id|>
Topic: ${topic}
Platform: ${platform}

Give best posting times.

<|start_header_id|>assistant<|end_header_id|>
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
      bestTime: responseBody.generation
    });

  } catch (error) {

    console.error("Best time error:", error);

    res.status(500).json({
      error: "Best time generation failed"
    });

  }
});

//virality score-ai
app.post("/virality-score", async (req, res) => {

  try {

    const { post } = req.body;

    if (!post) {
      return res.status(400).json({
        error: "post is required"
      });
    }

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      contentType: "application/json",
      accept: "application/json",

      body: JSON.stringify({
        prompt: `
<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a social media analytics expert.

Analyze the post and give a virality score from 1 to 100.

Return clean JSON like this:
{
 "score": number,
 "engagement": number,
 "hashtags": number,
 "quality": number,
 "timing": number
}

<|start_header_id|>user<|end_header_id|>
Post:
${post}

<|start_header_id|>assistant<|end_header_id|>
`,
        max_gen_len: 200,
        temperature: 0.6
      })
    });

    const response = await bedrock.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    res.json({
      virality: responseBody.generation
    });

  } catch (error) {

    console.error("Virality error:", error);

    res.status(500).json({
      error: "Virality analysis failed"
    });

  }

});

//history of posts
app.get("/history", async (req, res) => {

  try {

    const params = {
      TableName: "VaniScriptPosts"
    };

    const data = await docClient.send(new ScanCommand(params));

    res.json({
      history: data.Items
    });

  } catch (error) {

    console.error("History error:", error);

    res.status(500).json({
      error: "Failed to fetch history"
    });

  }

});

//analytics
app.get("/analytics", async (req, res) => {
  try {

    const params = {
      TableName: "VaniScriptPosts"
    };

    const data = await docClient.send(new ScanCommand(params));

    const posts = data.Items || [];

    const totalPosts = posts.length;

    let totalScore = 0;
    let topPost = null;

    posts.forEach(post => {
      const score = Number(post.viralityScore) || 0;

      totalScore += score;

      if (!topPost || score > topPost.viralityScore) {
        topPost = post;
      }
    });

    const averageVirality = totalPosts > 0 
      ? Math.round(totalScore / totalPosts)
      : 0;

    res.json({
      totalPosts,
      averageVirality,
      topPost
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Analytics failed" });
  }
});


//schedule-post
app.post("/schedule-post", async (req, res) => {
  try {

    const { content, scheduledTime } = req.body;

    if (!content || !scheduledTime) {
      return res.status(400).json({
        error: "content and scheduledTime required"
      });
    }

    const post = {
      postId: Date.now().toString(),   // IMPORTANT
      content: content,
      scheduledTime: scheduledTime,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: "VaniScriptPosts",
      Item: post
    };

    await docClient.send(new PutCommand(params));

    res.json({
      message: "Post scheduled successfully",
      post
    });

  } catch (error) {

    console.error("Schedule error:", error);

    res.status(500).json({
      error: "Scheduling failed"
    });

  }
});

app.post("/virality-score", (req, res) => {

  const score = Math.floor(Math.random() * 40) + 60;

  res.json({
    score: score,
    reach: Math.floor(Math.random() * 200000),
    engagement: (Math.random() * 10).toFixed(2),
    shares: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 500000),
  });

});