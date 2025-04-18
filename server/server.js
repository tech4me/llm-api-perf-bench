const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const cors = require('cors');
const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// API Vendors Endpoints
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await prisma.apiVendor.findMany();
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

app.post('/api/vendors', async (req, res) => {
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

app.put('/api/vendors/:id', async (req, res) => {
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

app.delete('/api/vendors/:id', async (req, res) => {
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

// Performance Metrics Endpoints
app.get('/api/metrics', async (req, res) => {
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

app.post('/api/metrics', async (req, res) => {
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

app.delete('/api/metrics/:id', async (req, res) => {
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

app.delete('/api/vendors/:id/metrics', async (req, res) => {
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

// Original LLM API endpoint
app.post('/api/llm', async (req, res) => {
  const { prompt, apiVendorId } = req.body;
  
  try {
    // Mock LLM response for now
    // In a real implementation, you would use the vendor info to make the API call
    const vendor = await prisma.apiVendor.findUnique({
      where: { id: apiVendorId },
    });
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    const startTime = Date.now();
    
    // Simulate API call (replace with actual API call)
    setTimeout(async () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Create a performance metric
      await prisma.performanceMetric.create({
        data: {
          apiVendorId: vendorId,
          timeToFirstToken: responseTime,
          tokensPerSecond: 10, // Mock tokens per second
        },
      });
      
      res.json({
        response: `Response to: "${prompt}". This is a mock response from ${vendor.name}.`,
        metrics: {
          timeToFirstToken: responseTime,
          tokensPerSecond: 10,
        }
      });
    }, 500); // Simulate processing time
  } catch (error) {
    console.error('Error processing LLM request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
