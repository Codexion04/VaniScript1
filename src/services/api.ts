const API_URL = "http://localhost:5000";

/* GENERATE POST */

export const generatePost = async (prompt: string) => {

  const res = await fetch(`${API_URL}/generate-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt
    })
  });

  if (!res.ok) {
    throw new Error("Generate post failed");
  }

  return res.json();
};


/* VIRALITY SCORE */

export const getViralityScore = async (post: string) => {

  const res = await fetch(`${API_URL}/virality-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      post: post
    })
  });

  if (!res.ok) {
    throw new Error("Virality score failed");
  }

  return res.json();
};