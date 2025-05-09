import { createAuthClient } from "better-auth/client";

// Create a single instance of the auth client with the correct base URL
const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  // Add support for session handling
  session: {
    cookieCrossDomain: true // Enable cross-domain cookie support
  }
});

// Export the singleton instance
export default authClient;