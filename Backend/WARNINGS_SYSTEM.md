# Dynamic Warnings System

## Overview

The Dynamic Warnings System automatically monitors police station case loads and generates warnings/notifications when configurable thresholds are exceeded. The system provides real-time notifications via WebSocket and maintains a comprehensive audit trail.

## Features

### 1. **Configurable Thresholds**
- Open cases threshold
- Pending cases threshold  
- High/Medium/Low priority case thresholds
- Customizable time frames for each threshold type
- Separate warning and notification levels

### 2. **Real-time Monitoring**
- Automatic warning generation when new alerts are reported
- Scheduled checks every 30 minutes
- Peak hours monitoring (9 AM - 6 PM) with hourly checks
- WebSocket notifications to police stations and district officers

### 3. **Warning Types**
- **Warning**: First level alert when threshold is reached
- **Notification**: Escalated alert when higher threshold is reached

### 4. **Notification System**
- Real-time WebSocket notifications
- Browser notifications (with permission)
- Acknowledgment system for warnings
- Automatic expiry after 24 hours

## Database Schema

### Warning Model
```javascript
{
  policeStationId: ObjectId,
  type: "Warning" | "Notification",
  reason: String,
  thresholdType: "open_cases" | "pending_cases" | "high_priority" | "medium_priority" | "low_priority",
  thresholdValue: Number,
  currentValue: Number,
  caseIds: [ObjectId],
  caseStats: {
    openCases: Number,
    pendingCases: Number,
    highPriority: Number,
    mediumPriority: Number,
    lowPriority: Number
  },
  isActive: Boolean,
  isAcknowledged: Boolean,
  acknowledgedAt: Date,
  acknowledgedBy: ObjectId,
  expiresAt: Date,
  notificationsSent: {
    policeStation: Boolean,
    districtOfficer: Boolean
  },
  timeFrame: String
}
```

### Warning Configuration Model
```javascript
{
  name: String,
  description: String,
  thresholds: {
    openCases: { warning: Number, notification: Number },
    pendingCases: { warning: Number, notification: Number },
    highPriority: { warning: Number, notification: Number },
    mediumPriority: { warning: Number, notification: Number },
    lowPriority: { warning: Number, notification: Number }
  },
  timeFrames: {
    openCases: String,
    pendingCases: String,
    highPriority: String,
    mediumPriority: String,
    lowPriority: String
  },
  isActive: Boolean,
  createdBy: ObjectId,
  lastModifiedBy: ObjectId
}
```

## API Endpoints

### Warning Management
- `GET /api/v1/web/warnings` - Get all warnings with filters
- `GET /api/v1/web/warnings/dashboard` - Get warning dashboard statistics
- `POST /api/v1/web/warnings/:warningId/acknowledge` - Acknowledge a warning
- `POST /api/v1/web/warnings/check/:policeStationId` - Manually trigger warning check

### Configuration Management
- `GET /api/v1/web/warnings/config` - Get warning configuration
- `PUT /api/v1/web/warnings/config` - Update warning configuration

## WebSocket Events

### Client Events (Listening)
- `new_warning` - New warning for police station
- `district_warning` - New warning for district officers

### Server Events (Emitting)
- `register` - Register client with police station ID

## Default Configuration

```javascript
{
  thresholds: {
    openCases: { warning: 6, notification: 10 },
    pendingCases: { warning: 6, notification: 10 },
    highPriority: { warning: 3, notification: 5 },
    mediumPriority: { warning: 8, notification: 15 },
    lowPriority: { warning: 15, notification: 25 }
  },
  timeFrames: {
    openCases: "7 days",
    pendingCases: "3 days", 
    highPriority: "24 hours",
    mediumPriority: "3 days",
    lowPriority: "7 days"
  }
}
```

## Frontend Integration

### Warnings Component
- Real-time warning display
- Filter by type (Warning/Notification/All)
- Acknowledgment functionality
- Case details with links
- Time remaining display

### Notifications Component  
- Tabular view of all warnings
- Time-based filtering
- Police station filtering
- Summary statistics
- Refresh functionality

### WebSocket Integration
```javascript
const socket = io("https://crimevision.onrender.com");

socket.on("new_warning", (data) => {
  // Handle new warning
  console.log("New warning:", data.warning);
  // Show browser notification
  new Notification(`New ${data.warning.type}`, {
    body: data.message
  });
});

socket.on("district_warning", (data) => {
  // Handle district warning
  console.log("District warning:", data.warning);
});
```

## Automatic Triggers

### 1. **New Alert Creation**
When a new alert is reported, the system automatically:
- Checks current case statistics for the police station
- Compares against configured thresholds
- Generates warnings if thresholds are exceeded
- Sends real-time notifications

### 2. **Scheduled Checks**
- Every 30 minutes: Full system check
- Peak hours (9 AM - 6 PM): Hourly checks
- Prevents duplicate warnings for same conditions

### 3. **Threshold Monitoring**
The system monitors:
- Open cases in last 7 days
- Pending cases in last 3 days
- High priority cases in last 24 hours
- Medium priority cases in last 3 days
- Low priority cases in last 7 days

## Configuration Management

### Updating Thresholds
```javascript
PUT /api/v1/web/warnings/config
{
  "thresholds": {
    "openCases": { "warning": 8, "notification": 15 },
    "highPriority": { "warning": 5, "notification": 8 }
  },
  "timeFrames": {
    "openCases": "10 days",
    "highPriority": "48 hours"
  },
  "lastModifiedBy": "authority_id"
}
```

### Manual Warning Check
```javascript
POST /api/v1/web/warnings/check/:policeStationId
```

## Security Considerations

1. **Authentication**: All API endpoints should be protected with proper authentication
2. **Authorization**: Only authorized personnel can modify warning configurations
3. **Rate Limiting**: Implement rate limiting on manual warning check endpoints
4. **Data Validation**: All inputs are validated before processing

## Monitoring and Logging

- All warning generation events are logged
- WebSocket connection status is monitored
- Failed notification attempts are logged
- Performance metrics for warning checks are tracked

## Future Enhancements

1. **Email Notifications**: Add email alerts for critical warnings
2. **SMS Integration**: Send SMS for high-priority warnings
3. **Machine Learning**: Predictive warning based on historical patterns
4. **Custom Rules**: Allow custom warning rules beyond simple thresholds
5. **Escalation Matrix**: Automatic escalation to higher authorities
6. **Mobile App Integration**: Push notifications to mobile apps 