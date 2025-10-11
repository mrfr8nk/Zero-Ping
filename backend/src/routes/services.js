
import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service
router.post('/', async (req, res) => {
  try {
    const { name, url, pingInterval } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({ error: 'URL must start with http:// or https://' });
    }

    const service = new Service({
      name,
      url,
      interval: pingInterval || 5,
      nextPingAt: new Date()
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const { name, url, interval, isActive } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (interval !== undefined) updateData.interval = interval;
    if (isActive !== undefined) updateData.isActive = isActive;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle service active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get service statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const uptimePercentage = service.totalPings > 0 
      ? ((service.uptime / service.totalPings) * 100).toFixed(2)
      : 0;

    const stats = {
      uptimePercentage,
      totalPings: service.totalPings,
      successfulPings: service.uptime,
      failedPings: service.totalPings - service.uptime,
      averageResponseTime: service.responseTime,
      recentHistory: service.pingHistory.slice(-20)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


