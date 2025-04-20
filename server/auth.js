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
  // Enable email/password authentication
  emailAndPassword: {
    enabled: true,
    verificationRequired: false, // For simplicity, no email verification required
    autoSignIn: true
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
      secure: true,
      sameSite: "none",
      path: "/",
    }
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    }
  },
  defaultCookieAttributes: {
    secure: true,
    sameSite: "none"
  }
});

module.exports = { auth }; 