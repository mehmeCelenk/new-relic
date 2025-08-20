# New Relic Node.js Monitoring Examples

This repository contains comprehensive examples of integrating New Relic monitoring into Node.js applications, featuring both TypeScript and JavaScript implementations with custom events, metrics, and performance monitoring.

## 🚀 Features

- ✅ **New Relic Integration** - Complete APM setup with custom events and metrics
- ✅ **TypeScript Support** - Full TypeScript implementation with type safety
- ✅ **JavaScript Support** - Plain JavaScript version for simplicity
- ✅ **Performance Monitoring** - Custom performance measurement utilities
- ✅ **Error Tracking** - Comprehensive error simulation and tracking
- ✅ **RESTful API** - Express.js endpoints with monitoring
- ✅ **Background Processing** - Standalone monitoring without HTTP server
- ✅ **Custom Events** - Business logic tracking with detailed analytics
- ✅ **Custom Metrics** - System and application performance metrics

## 📁 Project Structure

```
new-relic/
├── src/
│   ├── index.ts          # TypeScript Express API with monitoring
│   └── index.js          # JavaScript background process with events
├── dist/                 # Compiled TypeScript output
├── newrelic.js          # New Relic configuration
├── .env.example         # Environment variables template
├── .env                 # Environment variables (not tracked in git)
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 🛠 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/new-relic.git
   cd new-relic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your New Relic license key:
   ```env
   NEW_RELIC_LICENSE_KEY=your_actual_license_key_here
   NEW_RELIC_APP_NAME=your_app_name
   NEW_RELIC_LOG_LEVEL=info
   PORT=3000
   ```

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd new-relic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Get Your New Relic License Key:**
   - Sign up at [New Relic](https://newrelic.com/)
   - Go to **Account settings** → **API keys**
   - Copy your **License key**
   - Add it to your `.env` file

## 🎯 Available Applications

### 1. TypeScript Express API (`src/index.ts`)

A comprehensive Express.js application with full New Relic monitoring:

**Features:**
- RESTful API endpoints
- Performance monitoring utilities
- Custom event tracking for all operations
- Error simulation and handling
- Heavy processing endpoints
- Batch processing monitoring

**Run the application:**
```bash
# Development mode
npm run dev

# Production build and run
npm run build
npm run start:nr
```

**API Endpoints:**
- `GET /` - Home page with monitoring
- `GET /api/users` - User list with performance tracking
- `GET /api/user/:id` - User details with metrics
- `POST /api/users` - Create user with validation tracking
- `GET /api/test/performance` - Performance test suite
- `GET /api/heavy/process?intensity=1` - CPU/Memory intensive operations
- `GET /api/error/test?type=timeout` - Error simulation
- `POST /api/batch/process` - Batch processing with monitoring
- `GET /api/test/load?iterations=100` - Load testing
- `GET /api/metrics` - System metrics endpoint

### 2. JavaScript Background Process (`src/index.js`)

A lightweight background service that continuously sends custom events:

**Features:**
- No HTTP server - pure background processing
- Periodic system monitoring
- Random business event simulation
- Error simulation with different types
- Performance testing
- Graceful shutdown handling

**Run the application:**
```bash
npm run start:js
```

**Monitoring Schedule:**
- **Every 5 seconds:** System status + random business event
- **Every 8 seconds:** Error simulation (20% probability)
- **Every 15 seconds:** Performance computation test

## 📊 New Relic Dashboard Data

### Custom Events Generated

#### TypeScript API Events:
- `HomePage` - Landing page visits
- `UserDetail` - User profile views
- `UsersList` - User list requests
- `UserCreationSuccess` - Successful user creation
- `UserCreationError` - Failed user creation attempts
- `FunctionPerformance` - Function execution timing
- `TimerPerformance` - Timer-based measurements
- `PerformanceTestCompleted` - Performance test results
- `HeavyProcessingCompleted` - Resource-intensive operation results
- `ErrorTestExecuted` - Error simulation results
- `BatchProcessCompleted` - Batch operation results
- `LoadTestStarted` - Load test initiation
- `MetricsViewed` - Metrics endpoint access

#### JavaScript Background Events:
- `ApplicationStarted` - Application startup
- `SystemStatus` - Periodic system health
- `UserLogin` - Simulated user activity
- `DataProcessed` - Simulated data operations
- `TaskCompleted` - Simulated task completion
- `BackupCreated` - Simulated backup operations
- `ApplicationError` - Error occurrences
- `PerformanceTest` - Computation performance
- `ApplicationShutdown` - Graceful shutdown

### Custom Metrics Tracked

#### System Metrics:
- `Custom/System/MemoryUsed` - Memory consumption
- `Custom/System/Uptime` - Application uptime
- `Custom/Server/Uptime` - Server uptime

#### Performance Metrics:
- `Custom/Function/[functionName]/Duration` - Function execution times
- `Custom/Timer/[timerName]/Duration` - Timer measurements
- `Custom/Performance/ComputationTime` - Computation duration
- `Custom/Performance/AvgResponseTime` - Average response times

#### Business Metrics:
- `Custom/HomePage/Visits` - Page visit counter
- `Custom/UserDetail/Requests` - User detail requests
- `Custom/UserDetail/ResponseTime` - User detail response times
- `Custom/UsersList/Requests` - User list requests
- `Custom/UserCreation/Success` - Successful user creations
- `Custom/UserCreation/Errors` - User creation failures
- `Custom/App/EventCounter` - Total events processed

#### Error Metrics:
- `Custom/Errors/Total` - Total error count
- `Custom/Errors/[ErrorType]` - Errors by type
- `Custom/Error/[ErrorType]/Count` - Specific error counters

## 🔧 Configuration

### Environment Variables

Set these in your environment or update the package.json scripts:

```bash
NEW_RELIC_APP_NAME=your-app-name
NEW_RELIC_LICENSE_KEY=your-license-key
```

### Scripts Available

```json
{
  "build": "tsc",                    // Compile TypeScript
  "start": "node dist/index.js",     // Run compiled TypeScript app
  "start:js": "NEW_RELIC_APP_NAME=new-relic-js-example NEW_RELIC_LICENSE_KEY=your-key node -r newrelic src/index.js",
  "start:nr": "NEW_RELIC_APP_NAME=new-relic-example NEW_RELIC_LICENSE_KEY=your-key node -r newrelic dist/index.js",
  "dev": "ts-node src/index.ts",     // Development mode
  "watch": "tsc -w"                  // Watch mode compilation
}
```

## 📈 Viewing Data in New Relic

### Query Builder (NRQL)

Use these sample queries in New Relic's Query Builder:

```sql
-- View all custom events
SELECT * FROM HomePage, UserDetail, SystemStatus SINCE 1 hour ago

-- Performance analysis
SELECT average(duration) FROM FunctionPerformance FACET functionName SINCE 1 hour ago

-- Error tracking
SELECT count(*) FROM ApplicationError FACET errorType SINCE 1 hour ago

-- System monitoring
SELECT latest(Custom/System/MemoryUsed) FROM Metric SINCE 1 hour ago
```

### Dashboard Creation

1. Go to **Dashboards** in New Relic
2. Create a new dashboard
3. Add charts using the custom events and metrics
4. Use NRQL queries to visualize your data

### Metrics Explorer

Navigate to **Browse data** > **Metrics** and search for:
- `Custom/Function/*`
- `Custom/System/*`
- `Custom/Performance/*`
- `Custom/Errors/*`

## 🚦 Testing the Applications

### Test TypeScript API:

```bash
# Start the server
npm run build && npm run start:nr

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/api/users
curl http://localhost:3000/api/test/performance
curl http://localhost:3000/api/heavy/process?intensity=2
curl http://localhost:3000/api/error/test?type=timeout
```

### Test JavaScript Background Process:

```bash
# Start the background service
npm run start:js

# Watch the console for periodic events
# Press CTRL+C to trigger graceful shutdown
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use:** Change the PORT environment variable
2. **New Relic not receiving data:** Check your license key and app name
3. **TypeScript compilation errors:** Run `npm run build` to check for type errors

### Debug Mode:

Enable New Relic logging by adding to `newrelic.js`:
```javascript
logging: {
  level: 'trace'
}
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Monitoring!** 📊🚀
