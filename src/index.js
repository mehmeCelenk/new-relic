const newrelic = require('newrelic');

console.log("Hello, New Relic!");
console.log("Starting basic application that sends custom events...");

// Simple custom event sending function
function sendCustomEvent(eventType, data) {
  newrelic.recordCustomEvent(eventType, {
    ...data,
    timestamp: new Date().toISOString(),
    appName: 'new-relic-js-example'
  });
  
  console.log(`📡 Custom Event sent: ${eventType}`, data);
}

// Simple custom metric sending function
function sendCustomMetric(metricName, value) {
  newrelic.recordMetric(metricName, value);
  console.log(`📊 Custom Metric sent: ${metricName} = ${value}`);
}

// Application startup event
sendCustomEvent('ApplicationStarted', {
  nodeVersion: process.version,
  platform: process.platform,
  memory: process.memoryUsage(),
  pid: process.pid
});

// Send periodic custom events
let eventCounter = 0;

setInterval(() => {
  eventCounter++;
  
  // System status event
  sendCustomEvent('SystemStatus', {
    eventId: eventCounter,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  });
  
  // Random business event
  const businessEvents = ['UserLogin', 'DataProcessed', 'TaskCompleted', 'BackupCreated'];
  const randomEvent = businessEvents[Math.floor(Math.random() * businessEvents.length)];
  
  sendCustomEvent(randomEvent, {
    eventId: eventCounter,
    userId: Math.floor(Math.random() * 1000),
    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
    success: Math.random() > 0.2, // 80% success rate
    duration: Math.floor(Math.random() * 1000) + 100
  });
  
  // Send custom metrics
  sendCustomMetric('Custom/App/EventCounter', eventCounter);
  sendCustomMetric('Custom/System/MemoryUsed', process.memoryUsage().heapUsed);
  sendCustomMetric('Custom/System/Uptime', process.uptime());
  
}, 5000); // Every 5 seconds

// Error simulation
setInterval(() => {
  if (Math.random() > 0.8) { // 20% error probability
    const errorTypes = ['DatabaseError', 'NetworkError', 'ValidationError', 'TimeoutError'];
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    
    sendCustomEvent('ApplicationError', {
      errorType,
      errorMessage: `Simulated ${errorType} occurred`,
      severity: Math.random() > 0.5 ? 'high' : 'medium',
      component: 'background-process'
    });
    
    // Error metric
    newrelic.incrementMetric('Custom/Errors/Total');
    newrelic.incrementMetric(`Custom/Errors/${errorType}`);
    
    console.log(`❌ Error simulation: ${errorType}`);
  }
}, 8000); // Check every 8 seconds

// Performance monitoring
setInterval(() => {
  const startTime = Date.now();
  
  // Simulated heavy operation
  let result = 0;
  for (let i = 0; i < 100000; i++) {
    result += Math.sqrt(i);
  }
  
  const duration = Date.now() - startTime;
  
  sendCustomEvent('PerformanceTest', {
    operation: 'heavy-computation',
    duration,
    iterations: 100000,
    result: result.toString().substring(0, 10)
  });
  
  sendCustomMetric('Custom/Performance/ComputationTime', duration);
  
  console.log(`⏱️  Performance test: ${duration}ms`);
}, 15000); // Every 15 seconds

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Application shutting down...');
  
  sendCustomEvent('ApplicationShutdown', {
    reason: 'SIGINT',
    uptime: process.uptime(),
    totalEvents: eventCounter
  });
  
  // Wait for New Relic to send events
  setTimeout(() => {
    console.log('👋 Goodbye!');
    process.exit(0);
  }, 2000);
});

console.log('✅ Application started! Press CTRL+C to stop.');
console.log('📡 Custom events are sent every 5 seconds...');
console.log('❌ Error simulation checks every 8 seconds...');
console.log('⏱️  Performance test runs every 15 seconds...');

