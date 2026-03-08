// Central API configuration
// Uses the deployed EC2 backend, falls back to localhost for local development
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

export const API_URL = isLocalhost
    ? "http://localhost:5000"
    : "http://54.163.35.162:5000";
