
import axios from 'axios';
import Service from '../models/Service.js';

export async function pingService(service) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(service.url, {
      timeout: 30000,
      validateStatus: (status) => status < 500
    });
    
    const responseTime = Date.now() - startTime;
    const isSuccess = response.status >= 200 && response.status < 400;
    
    return {
      success: isSuccess,
      responseTime,
      statusCode: response.status,
      timestamp: new Date()
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      responseTime,
      statusCode: error.response?.status || 0,
      error: error.message,
      timestamp: new Date()
    };
  }
}

export async function pingAllServices() {
  try {
    const now = new Date();
    const services = await Service.find({
      isActive: true,
      $or: [
        { nextPingAt: { $lte: now } },
        { nextPingAt: null }
      ]
    });

    console.log(`Pinging ${services.length} services...`);

    for (const service of services) {
      const result = await pingService(service);
      
      service.lastPing = result.timestamp;
      service.status = result.success ? 'online' : 'offline';
      service.responseTime = result.responseTime;
      service.totalPings += 1;
      
      if (result.success) {
        service.uptime += 1;
      }
      
      service.pingHistory.push({
        timestamp: result.timestamp,
        status: result.success ? 'online' : 'offline',
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        error: result.error
      });
      
      service.nextPingAt = new Date(now.getTime() + service.interval * 60 * 1000);
      
      await service.save();
      
      console.log(`Pinged ${service.name}: ${service.status} (${result.responseTime}ms)`);
    }
  } catch (error) {
    console.error('Error pinging services:', error);
  }
}
