import { createAuthClient } from "better-auth/client";

// Create a single instance of the auth client with the correct base URL
const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  // Add support for session handling
  session: {
    refreshInterval: 5 * 60 * 1000 // Refresh session every 5 minutes
  }
});

// Export the singleton instance
export default authClient;