const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { fromNodeHeaders, toNodeHandler } = require("better-auth/node");
const app = express();
const prisma = new PrismaClient();
const { auth } = require('./auth');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['set-cookie']
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
    const vendors = await prisma.apiVendor.findMany({
      where: {
        userId: req.user.id
      }
    });
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
        user: {
          connect: { id: req.user.id }
        }
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

    // First check if the vendor belongs to the current user
    const existingVendor = await prisma.apiVendor.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    if (existingVendor.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this vendor' });
    }

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

    // First check if the vendor belongs to the current user
    const existingVendor = await prisma.apiVendor.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    if (existingVendor.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this vendor' });
    }

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

    // First check if the vendor belongs to the current user
    const existingVendor = await prisma.apiVendor.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    if (existingVendor.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete metrics for this vendor' });
    }

    await prisma.performanceMetric.deleteMany({
      where: { apiVendorId: id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor metrics:', error);
    res.status(500).json({ error: 'Failed to delete vendor metrics' });
  }
});

// Endpoint to export metrics as CSV
app.get('/api/metrics/export', requireAuth, async (req, res) => {
  try {
    // Fetch metrics that belong to the current user's vendors
    const metrics = await prisma.performanceMetric.findMany({
      where: { apiVendor: { userId: req.user.id } },
      include: { apiVendor: true },
      orderBy: { createdAt: 'asc' },
    });

    // Define CSV headers
    const headers = ['metricId','vendorId','vendorName','timeToFirstToken','tokensPerSecond','createdAt','updatedAt'];
    // Build CSV rows
    const csvRows = [headers.join(',')];
    metrics.forEach(m => {
      const row = [
        m.id,
        m.apiVendorId,
        m.apiVendor.name,
        m.timeToFirstToken,
        m.tokensPerSecond,
        m.createdAt.toISOString(),
        m.updatedAt.toISOString(),
      ].map(val => `"${val}"`).join(',');
      csvRows.push(row);
    });
    const csv = csvRows.join('\n');

    // Send CSV as file attachment
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="metrics.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting metrics:', error);
    res.status(500).json({ error: 'Failed to export metrics' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
