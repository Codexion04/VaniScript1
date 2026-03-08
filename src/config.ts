// Central API configuration
// Uses API Gateway (HTTPS) for production, localhost for local development
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

export const API_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://xu4ftbt71j.execute-api.us-east-1.amazonaws.com";
