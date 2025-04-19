import { createAuthClient } from "better-auth/client";

// Create a single instance of the auth client with the correct base URL
const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL // Point to your server URL
});

// Export the singleton instance
export default authClient;