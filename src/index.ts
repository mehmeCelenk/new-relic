// Import New Relic at the top
require('newrelic');

// Import New Relic at the top
const newrelic = require('newrelic');

import express, { Request, Response } from 'express';

// Performance Monitoring Utility
class PerformanceMonitor {
  static measureFunction<T>(functionName: string, fn: () => T): T {
    const startTime = Date.now();
    const result = fn();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Send to New Relic
    newrelic.recordMetric(`Custom/Function/${functionName}/Duration`, duration);
    newrelic.recordCustomEvent('FunctionPerformance', {
      functionName,
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      timestamp: new Date().toISOString()
    });

    console.log(`⏱️  ${functionName} function took ${duration}ms`);
    return result;
  }

  static async measureAsyncFunction<T>(functionName: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    const result = await fn();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Send to New Relic
    newrelic.recordMetric(`Custom/Function/${functionName}/Duration`, duration);
    newrelic.recordCustomEvent('FunctionPerformance', {
      functionName,
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      timestamp: new Date().toISOString(),
      isAsync: true
    });

    console.log(`⏱️  ${functionName} async function took ${duration}ms`);
    return result;
  }

  static startTimer(timerName: string): () => void {
    const startTime = Date.now();
    
    
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      newrelic.recordMetric(`Custom/Timer/${timerName}/Duration`, duration);
      newrelic.recordCustomEvent('TimerPerformance', {
        timerName,
        duration,
        startTime: new Date(startTime).toISOString(),
        name: 'mehmet',
        endTime: new Date(endTime).toISOString(),
        timestamp: new Date().toISOString()
      });

      console.log(`⏱️  Timer '${timerName}' took ${duration}ms`);
    };
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// JSON parser middleware
app.use(express.json());

// Simple GET endpoint
app.get('/', (req: Request, res: Response) => {
  // Custom event: Home page visit
  newrelic.recordCustomEvent('HomePage', {
    userAgent: req.get('User-Agent') || 'unknown',
    ip: req.ip,
    timestamp: new Date().toISOString(),
    responseTime: Date.now()
  });

  // Custom metric: Home page hit count
  newrelic.incrementMetric('Custom/HomePage/Visits');

  res.json({
    message: 'Hello! Node.js TypeScript application is running 🚀',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// User detail GET endpoint
app.get('/api/user/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const startTime = Date.now();
  
  // Custom event: User detail view
  newrelic.recordCustomEvent('UserDetail', {
    userId: userId,
    userAgent: req.get('User-Agent') || 'unknown',
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Custom metric: User detail request
  newrelic.incrementMetric('Custom/UserDetail/Requests');
  
  const response = {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    createdAt: new Date().toISOString()
  };

  // Response time metric
  const responseTime = Date.now() - startTime;
  newrelic.recordMetric('Custom/UserDetail/ResponseTime', responseTime);

  res.json(response);
});

// All users list endpoint
app.get('/api/users', (req: Request, res: Response) => {
  const startTime = Date.now();
  
  // Function measured with performance monitor
  const users = PerformanceMonitor.measureFunction('getUsersFromDatabase', () => {
    // Simulated database query
    const delay = Math.random() * 50 + 10; // 10-60ms random delay
    const start = Date.now();
    while (Date.now() - start < delay) {
      // Blocking operation simulation
    }
    
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];
  });

  // Custom event: User list view
  newrelic.recordCustomEvent('UsersList', {
    userCount: users.length,
    userAgent: req.get('User-Agent') || 'unknown',
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Custom metrics
  newrelic.incrementMetric('Custom/UsersList/Requests');
  newrelic.recordMetric('Custom/UsersList/UserCount', users.length);

  const response = {
    users,
    count: users.length,
    message: 'Users retrieved successfully'
  };

  // Response time metric
  const responseTime = Date.now() - startTime;
  newrelic.recordMetric('Custom/UsersList/ResponseTime', responseTime);

  res.json(response);
});

// Simple POST endpoint
app.post('/api/users', (req: Request, res: Response) => {
  const startTime = Date.now();
  const { name, email } = req.body;

  if (!name || !email) {
    // Custom event: Failed user creation attempt
    newrelic.recordCustomEvent('UserCreationError', {
      error: 'Missing required fields',
      providedFields: Object.keys(req.body),
      userAgent: req.get('User-Agent') || 'unknown',
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Error metric
    newrelic.incrementMetric('Custom/UserCreation/Errors');

    return res.status(400).json({
      error: 'Name and email fields are required',
      status: 'error'
    });
  }

  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
    createdAt: new Date().toISOString()
  };

  // Custom event: Successful user creation
  newrelic.recordCustomEvent('UserCreationSuccess', {
    userId: newUser.id,
    userName: name,
    userEmail: email,
    userAgent: req.get('User-Agent') || 'unknown',
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Success metrics
  newrelic.incrementMetric('Custom/UserCreation/Success');
  const responseTime = Date.now() - startTime;
  newrelic.recordMetric('Custom/UserCreation/ResponseTime', responseTime);

  res.status(201).json({
    message: 'User created successfully',
    user: newUser,
    status: 'success'
  });
});

// Performance test endpoint
app.get('/api/test/performance', async (req: Request, res: Response) => {
  try {
    // Measurement using timer
    const timerStop = PerformanceMonitor.startTimer('CompletePerformanceTest');

    // Sync function measurement
    const syncResult = PerformanceMonitor.measureFunction('heavyComputation', () => {
      let result = 0;
      for (let i = 0; i < 100000; i++) {
        result += Math.sqrt(i);
      }
      return result;
    });

    // Async function measurement
    const asyncResult = await PerformanceMonitor.measureAsyncFunction('databaseQuery', async () => {
      // Simulated async database query
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: 'Database query result',
            rows: Math.floor(Math.random() * 100),
            queryTime: Math.random() * 200 + 50
          });
        }, Math.random() * 100 + 50);
      });
    });

    // API call simulation
    const apiResult = await PerformanceMonitor.measureAsyncFunction('externalApiCall', async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 'success',
            data: { message: 'External API response' },
            statusCode: 200
          });
        }, Math.random() * 150 + 30);
      });
    });

    // Stop timer
    timerStop();

    // Custom event: Performance test completed
    newrelic.recordCustomEvent('PerformanceTestCompleted', {
      syncResult: typeof syncResult === 'number' ? syncResult.toString().substring(0, 10) : 'computed',
      asyncResultRows: (asyncResult as any).rows,
      apiStatus: (apiResult as any).status,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Performance test completed',
      results: {
        syncComputation: syncResult,
        databaseQuery: asyncResult,
        externalApi: apiResult
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    newrelic.recordCustomEvent('PerformanceTestError', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      error: 'Performance test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Heavy processing endpoint - Uzun süren işlemler
app.get('/api/heavy/process', async (req: Request, res: Response) => {
  try {
    const intensity = parseInt(req.query.intensity as string) || 1;
    const timerStop = PerformanceMonitor.startTimer('HeavyProcessingComplete');

    // CPU yoğun işlem
    const cpuResult = PerformanceMonitor.measureFunction('heavyCpuTask', () => {
      let result = 0;
      const iterations = 500000 * intensity; // Intensity'e göre artar
      for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
        // Her 50000 iterasyonda kısa pause
        if (i % 50000 === 0) {
          const start = Date.now();
          while (Date.now() - start < 1) {} // 1ms pause
        }
      }
      return result;
    });

    // Memory yoğun işlem
    const memoryResult = PerformanceMonitor.measureFunction('heavyMemoryTask', () => {
      const largeArray = [];
      const arraySize = 100000 * intensity;
      
      for (let i = 0; i < arraySize; i++) {
        largeArray.push({
          id: i,
          data: `Item ${i}`,
          random: Math.random(),
          timestamp: new Date().toISOString(),
          nested: {
            value: i * 2,
            squared: i * i,
            description: `Nested data for item ${i}`
          }
        });
      }
      
      // Array'i sırala (CPU + Memory yoğun)
      largeArray.sort((a, b) => a.random - b.random);
      
      return {
        arrayLength: largeArray.length,
        firstItem: largeArray[0],
        lastItem: largeArray[largeArray.length - 1],
        memoryUsage: process.memoryUsage()
      };
    });

    // Async heavy task - Network simulation
    const networkResult = await PerformanceMonitor.measureAsyncFunction('heavyNetworkTask', async () => {
      const requests = 5 * intensity;
      const results = [];
      
      for (let i = 0; i < requests; i++) {
        const delay = Math.random() * 200 + 100; // 100-300ms
        await new Promise(resolve => setTimeout(resolve, delay));
        
        results.push({
          requestId: i,
          delay,
          response: `Network response ${i}`,
          status: Math.random() > 0.1 ? 'success' : 'timeout'
        });
      }
      
      return {
        totalRequests: requests,
        successCount: results.filter(r => r.status === 'success').length,
        results
      };
    });

    timerStop();

    // Custom event: Heavy processing tamamlandı
    newrelic.recordCustomEvent('HeavyProcessingCompleted', {
      intensity,
      cpuResultType: typeof cpuResult,
      memoryArrayLength: memoryResult.arrayLength,
      networkSuccessCount: networkResult.successCount,
      finalMemoryUsage: process.memoryUsage().heapUsed,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Heavy processing tamamlandı',
      intensity,
      results: {
        cpu: cpuResult,
        memory: memoryResult,
        network: networkResult
      },
      currentMemory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    newrelic.recordCustomEvent('HeavyProcessingError', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      error: 'Heavy processing başarısız',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling test endpoint
app.get('/api/error/test', async (req: Request, res: Response) => {
  const errorType = req.query.type as string || 'random';
  
  try {
    switch (errorType) {
      case 'timeout':
        await PerformanceMonitor.measureAsyncFunction('timeoutError', async () => {
          // 10 saniye bekleyip timeout error
          return new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Operation timeout after 10 seconds'));
            }, 10000);
          });
        });
        break;

      case 'memory':
        PerformanceMonitor.measureFunction('memoryError', () => {
          // Çok büyük array oluşturup memory error'u tetikle
          const hugeArray = [];
          try {
            for (let i = 0; i < 10000000; i++) {
              hugeArray.push(new Array(1000).fill(`Data ${i}`));
            }
          } catch (err) {
            throw new Error('Memory allocation failed');
          }
          return hugeArray.length;
        });
        break;

      case 'calculation':
        PerformanceMonitor.measureFunction('calculationError', () => {
          // Sıfıra bölme ve NaN errors
          const x = 0;
          const result = 10 / x;
          if (!isFinite(result)) {
            throw new Error('Invalid calculation result: Division by zero');
          }
          return result;
        });
        break;

      case 'network':
        await PerformanceMonitor.measureAsyncFunction('networkError', async () => {
          // Simulated network error
          return new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Network connection failed: ECONNREFUSED'));
            }, Math.random() * 1000 + 500);
          });
        });
        break;

      case 'validation':
        PerformanceMonitor.measureFunction('validationError', () => {
          const data = req.query.data;
          if (!data) {
            throw new Error('Missing required parameter: data');
          }
          if (typeof data !== 'string' || data.length < 3) {
            throw new Error('Invalid data format: must be string with min 3 characters');
          }
          return data;
        });
        break;

      default:
        // Random error
        const errors = [
          'Database connection lost',
          'Authentication failed',
          'Rate limit exceeded',
          'Service temporarily unavailable',
          'Invalid API key'
        ];
        const randomError = errors[Math.floor(Math.random() * errors.length)];
        
        PerformanceMonitor.measureFunction('randomError', () => {
          throw new Error(randomError);
        });
    }

    // This line should normally not be reached
    res.json({
      message: 'Error test completed (unexpected situation)',
      errorType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Custom event: Error test
    newrelic.recordCustomEvent('ErrorTestExecuted', {
      errorType,
      errorMessage,
      errorStack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack',
      timestamp: new Date().toISOString()
    });

    // Error metrics
    newrelic.incrementMetric(`Custom/Error/${errorType}/Count`);
    newrelic.recordMetric('Custom/Error/Total', 1);

    res.status(500).json({
      error: 'Expected error occurred',
      errorType,
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});
// Batch processing endpoint
app.post('/api/batch/process', (req: Request, res: Response) => {
  const { items = [] } = req.body;
  const batchSize = items.length || 10;

  const results = PerformanceMonitor.measureFunction('batchProcessing', () => {
    const processedItems = [];
    
    // Separate measurement for each item
    for (let i = 0; i < batchSize; i++) {
      const itemResult = PerformanceMonitor.measureFunction(`batchItem_${i}`, () => {
        // Simulated processing
        const processingTime = Math.random() * 50 + 10;
        return {
          id: items[i]?.id || i,
          status: Math.random() > 0.1 ? 'success' : 'failed',
          processingTime: Math.round(processingTime),
          processedAt: new Date().toISOString()
        };
      });
      
      processedItems.push(itemResult);
    }

    return processedItems;
  });

  // Batch metrics
  newrelic.recordMetric('Custom/Batch/ProcessedItems', batchSize);
  newrelic.recordMetric('Custom/Batch/SuccessCount', 
    results.filter(item => item.status === 'success').length);
  newrelic.recordMetric('Custom/Batch/FailureCount', 
    results.filter(item => item.status === 'failed').length);

  // Custom event: Batch processing completed
  newrelic.recordCustomEvent('BatchProcessingCompleted', {
    batchSize,
    successCount: results.filter(item => item.status === 'success').length,
    failureCount: results.filter(item => item.status === 'failed').length,
    averageProcessingTime: Math.round(
      results.reduce((sum, item) => sum + item.processingTime, 0) / results.length
    ),
    timestamp: new Date().toISOString()
  });

  res.json({
    message: 'Batch processing completed',
    batchSize,
    results,
    summary: {
      total: results.length,
      successful: results.filter(item => item.status === 'success').length,
      failed: results.filter(item => item.status === 'failed').length
    },
    timestamp: new Date().toISOString()
  });
});
// Test endpoint - For load testing
app.get('/api/test/load', (req: Request, res: Response) => {
  const testType = req.query.type || 'basic';
  const iterations = parseInt(req.query.iterations as string) || 10;

  // Custom event: Load test started
  newrelic.recordCustomEvent('LoadTestStarted', {
    testType,
    iterations,
    userAgent: req.get('User-Agent') || 'unknown',
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Simulated load test
  for (let i = 0; i < iterations; i++) {
    // Random metrics
    newrelic.recordMetric('Custom/LoadTest/RequestCount', 1);
    newrelic.recordMetric('Custom/LoadTest/ResponseTime', Math.random() * 100 + 20);
    
    // Random events
    if (Math.random() > 0.8) {
      newrelic.recordCustomEvent('LoadTestError', {
        iteration: i,
        errorType: 'timeout',
        timestamp: new Date().toISOString()
      });
      newrelic.incrementMetric('Custom/LoadTest/Errors');
    } else {
      newrelic.recordCustomEvent('LoadTestSuccess', {
        iteration: i,
        responseTime: Math.random() * 50 + 10,
        timestamp: new Date().toISOString()
      });
      newrelic.incrementMetric('Custom/LoadTest/Success');
    }
  }

  res.json({
    message: `Load test completed: ${iterations} iterations`,
    testType,
    iterations,
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint - To view real-time status
app.get('/api/metrics', (req: Request, res: Response) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    },
    requests: {
      total: Math.floor(Math.random() * 1000) + 500,
      successful: Math.floor(Math.random() * 800) + 400,
      failed: Math.floor(Math.random() * 50) + 10
    },
    performance: {
      avgResponseTime: Math.random() * 100 + 50,
      maxResponseTime: Math.random() * 200 + 100,
      minResponseTime: Math.random() * 20 + 5
    }
  };

  // Custom event: Metrics viewed
  newrelic.recordCustomEvent('MetricsViewed', {
    serverUptime: metrics.server.uptime,
    totalRequests: metrics.requests.total,
    avgResponseTime: metrics.performance.avgResponseTime,
    timestamp: new Date().toISOString()
  });

  // Send metrics to New Relic
  newrelic.recordMetric('Custom/Server/Uptime', metrics.server.uptime);
  newrelic.recordMetric('Custom/Requests/Total', metrics.requests.total);
  newrelic.recordMetric('Custom/Requests/Successful', metrics.requests.successful);
  newrelic.recordMetric('Custom/Requests/Failed', metrics.requests.failed);
  newrelic.recordMetric('Custom/Performance/AvgResponseTime', metrics.performance.avgResponseTime);

  res.json(metrics);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📝 API documentation:`);
  console.log(`   GET  / - Home page`);
  console.log(`   GET  /api/users - All users`);
  console.log(`   GET  /api/user/:id - Specific user`);
  console.log(`   POST /api/users - Create new user`);
});

export default app;
