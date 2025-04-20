const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { fromNodeHeaders, toNodeHandler } = require("better-auth/node");
const app = express();
const prisma = new PrismaClient();
const { auth } = require('./auth');

// Raw body logger middleware
/*
app.use((req, res, next) => {
  let rawBody = '';

  req.on('data', (chunk) => {
    rawBody += chunk.toString();
  });

  req.on('end', () => {
    console.log('--- Raw Request Log ---');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    console.log('Raw Body:', rawBody);
    console.log('------------------------');

    // Optionally attach rawBody to req for later use
    req.rawBody = rawBody;
    next();
  });

  req.on('error', (err) => {
    console.error('Error reading raw request body:', err);
    next(err);
  });
});
*/

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Use Better Auth middleware
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

// Middleware to check for authentication
const requireAuth = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = session.user;
  next();
};

// API Vendors Endpoints - Protected
app.get('/api/vendors', requireAuth, async (req, res) => {
  try {
    const vendors = await prisma.apiVendor.findMany();
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

app.post('/api/vendors', requireAuth, async (req, res) => {
  try {
    const { name, url, apiKey, modelName } = req.body;
    const vendor = await prisma.apiVendor.create({
      data: {
        name,
        url,
        apiKey,
        modelName,
      },
    });
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

app.put('/api/vendors/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, apiKey, modelName } = req.body;
    const vendor = await prisma.apiVendor.update({
      where: { id },
      data: {
        name,
        url,
        apiKey,
        modelName,
      },
    });
    res.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

app.delete('/api/vendors/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete vendor and its metrics in a transaction
    await prisma.$transaction([
      prisma.performanceMetric.deleteMany({
        where: { apiVendorId: id },
      }),
      prisma.apiVendor.delete({
        where: { id },
      })
    ]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});

// Performance Metrics Endpoints - Protected
app.get('/api/metrics', requireAuth, async (req, res) => {
  try {
    const metrics = await prisma.performanceMetric.findMany({
      include: { apiVendor: true },
    });
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

app.post('/api/metrics', requireAuth, async (req, res) => {
  try {
    const { apiVendorId, timeToFirstToken, tokensPerSecond } = req.body;
    
    // Check if apiVendorId exists
    if (!apiVendorId) {
      return res.status(400).json({ error: 'apiVendorId is required' });
    }
    
    const metric = await prisma.performanceMetric.create({
      data: {
        timeToFirstToken,
        tokensPerSecond,
        apiVendor: {
          connect: { id: apiVendorId }
        }
      },
      include: { apiVendor: true },
    });
    res.status(201).json(metric);
  } catch (error) {
    console.error('Error creating metric:', error);
    res.status(500).json({ error: 'Failed to create metric' });
  }
});

app.delete('/api/metrics/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.performanceMetric.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting metric:', error);
    res.status(500).json({ error: 'Failed to delete metric' });
  }
});

app.delete('/api/vendors/:id/metrics', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.performanceMetric.deleteMany({
      where: { apiVendorId: id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor metrics:', error);
    res.status(500).json({ error: 'Failed to delete vendor metrics' });
  }
});

// Database connection test function
async function testDatabaseConnection() {
  try {
    // Attempt a simple query to test the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Start server
const port = process.env.PORT || 3000;

// Test database connection before starting the server
(async () => {
  const isDbConnected = await testDatabaseConnection();
  
  if (isDbConnected) {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } else {
    console.error('Server initialization aborted due to database connection failure');
    process.exit(1);
  }
})();
