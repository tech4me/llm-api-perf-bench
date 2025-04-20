const { betterAuth } = require('better-auth');
const { prismaAdapter } = require("better-auth/adapters/prisma");
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Create the auth instance
const auth = betterAuth({
  // Database configuration
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    connectionString: process.env.DATABASE_URL,
  }),
  // Trusted origins configuration
  trustedOrigins: [process.env.CLIENT_URL || 'http://localhost:5173'],
  // OAuth providers configuration
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      //callbackURL: process.env.CLIENT_URL + "/api/auth/callback/github" || 'http://localhost:5173/api/auth/callback/github'
    }
  },
  // Session configuration with recommended Better Auth settings
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds (default)
    updateAge: 60 * 60 * 24, // 1 day (refresh session expiration every day)
    freshAge: 60 * 60 * 24, // 1 day (consider session fresh for 1 day)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache duration of 5 minutes
    },
    cookie: {
      name: 'auth_session',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in milliseconds
    }
  }
});

module.exports = { auth }; 