
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

    if (services.length === 0) {
      console.log(`[${new Date().toLocaleTimeString()}] No services to ping`);
      return;
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`[${new Date().toLocaleTimeString()}] Pinging ${services.length} service(s)...`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

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
      
      const uptimePercent = service.totalPings > 0 
        ? ((service.uptime / service.totalPings) * 100).toFixed(2) 
        : 0;
      
      const statusEmoji = result.success ? '✅' : '❌';
      const statusColor = result.success ? '\x1b[32m' : '\x1b[31m';
      const resetColor = '\x1b[0m';
      
      console.log(`${statusEmoji} ${service.name}`);
      console.log(`   URL: ${service.url}`);
      console.log(`   Status: ${statusColor}${service.status.toUpperCase()}${resetColor}`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Uptime: ${uptimePercent}%`);
      console.log(`   Next Ping: ${new Date(service.nextPingAt).toLocaleTimeString()}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
    }
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  } catch (error) {
    console.error('❌ Error pinging services:', error);
  }
}
