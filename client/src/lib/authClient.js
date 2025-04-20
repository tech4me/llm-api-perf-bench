import { createAuthClient } from "better-auth/client";

// Create a single instance of the auth client with the correct base URL
const authClient = createAuthClient({
  baseURL: "https://llm-api-perf-bench-g3ef2.ondigitalocean.app" // Point to your server URL
});

// Export the singleton instance
export default authClient;