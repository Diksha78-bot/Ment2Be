# Mentor Availability API - Java Backend Implementation

## Overview
This document describes the Java Spring Boot implementation of the Mentor Availability API, which allows mentors to set their available time slots and students to view and book them.

## Backend Implementation

### Files Created
1. **Model**: `src/main/java/com/app/model/Availability.java`
   - MongoDB document model for storing availability data
   - Contains nested TimeSlot class for individual time slots
   
2. **Repository**: `src/main/java/com/app/repository/AvailabilityRepository.java`
   - MongoDB repository interface
   - Custom query methods for finding availability by mentor and date
   
3. **Controller**: `src/main/java/com/app/controllers/AvailabilityController.java`
   - REST API endpoints for availability management
   - Comprehensive logging with 🟢/🔴/✅ indicators

### API Endpoints

#### 1. Save/Update Availability
```
POST /api/mentor-availability
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "date": "2024-12-10",
  "timeSlots": ["09:00 AM", "10:00 AM", "02:00 PM"],
  "duration": 30
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Availability saved successfully"
}
```

#### 2. Get Available Slots for a Date
```
GET /api/mentor-availability/{mentorId}?date=2024-12-10
Authorization: Bearer <token>

Response:
{
  "success": true,
  "availableSlots": ["09:00 AM", "10:00 AM", "02:00 PM"],
  "duration": 30,
  "message": "Available slots retrieved successfully"
}
```

#### 3. Get All Availability for Mentor
```
GET /api/mentor-availability/mentor/all
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [ ... ],
  "message": "Availability records retrieved successfully"
}
```

#### 4. Delete Availability
```
DELETE /api/mentor-availability/{availabilityId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Availability deleted successfully"
}
```

## Frontend Integration

### Availability Service
Location: `Frontend/src/services/availabilityService.js`

### Switching Between Backends

To switch between Node.js and Java backends, edit the `ACTIVE_BACKEND` constant:

```javascript
// In availabilityService.js
const ACTIVE_BACKEND = 'java';  // or 'nodejs'
```

### Backend URLs
- **Node.js**: `http://localhost:4000/api/mentor-availability`
- **Java**: `http://localhost:8081/api/mentor-availability`

## Logging

The Java backend includes comprehensive logging:

- 🟢 **Green Circle**: Request received
- ✅ **Green Checkmark**: Success
- 🔴 **Red Circle**: Error
- 🟡 **Yellow Circle**: Warning/Info

Example logs:
```
🟢 [JAVA BACKEND] POST /api/mentor-availability - Save availability request received
🟢 [JAVA BACKEND] Mentor ID: 123, Date: 2024-12-10, Duration: 30 min
✅ [JAVA BACKEND] Availability saved successfully with ID: abc123
```

## Running the Java Backend

1. **Start MongoDB** (if not already running)
   ```bash
   mongod
   ```

2. **Navigate to JavaMaven folder**
   ```bash
   cd JavaMaven
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Verify it's running**
   - Server should start on port 8081
   - Check logs for "🟢 [JAVA BACKEND]" messages

## Testing

### Using the Frontend
1. Set `ACTIVE_BACKEND = 'java'` in `availabilityService.js`
2. Go to Mentor Dashboard → My Mentees
3. Set availability slots
4. Check browser console for Java backend logs

### Using Postman/cURL
```bash
# Save availability
curl -X POST http://localhost:8081/api/mentor-availability \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-10",
    "timeSlots": ["09:00 AM", "10:00 AM"],
    "duration": 30
  }'

# Get available slots
curl -X GET "http://localhost:8081/api/mentor-availability/MENTOR_ID?date=2024-12-10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Data Model

### Availability Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "mentor": "mentor-user-id",
  "date": "2024-12-10",
  "timeSlots": [
    {
      "startTime": "09:00 AM",
      "endTime": "09:30 AM",
      "isBooked": false,
      "bookingId": null
    }
  ],
  "duration": 30,
  "isActive": true,
  "createdAt": "2024-12-09T10:30:00",
  "updatedAt": "2024-12-09T10:30:00"
}
```

## Features

✅ Create/Update availability slots
✅ Retrieve available slots for booking
✅ Soft delete (mark as inactive)
✅ Automatic end time calculation
✅ Comprehensive logging
✅ Easy backend switching
✅ Identical API to Node.js backend

## Troubleshooting

### Port Already in Use
If port 8081 is already in use, change it in `application.properties`:
```properties
server.port=8082
```

### MongoDB Connection Issues
Check MongoDB is running:
```bash
mongo --eval "db.adminCommand('ping')"
```

### Backend Not Switching
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check console logs for backend indicator

## Next Steps

1. Implement JWT token parsing in `extractUserIdFromToken()`
2. Add validation for date formats
3. Add pagination for large availability lists
4. Implement booking integration
5. Add unit tests
