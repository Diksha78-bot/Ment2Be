# Twilio Video Integration Setup Guide

## Overview
This guide explains how to set up and use Twilio Video for video conferencing in the K23DX mentoring platform. Twilio Video replaces the previous ZegoCloud implementation and provides a fully customizable video UI.

## Prerequisites
- Node.js and npm installed
- Active Twilio account (sign up at https://www.twilio.com)
- Backend server running on port 4000
- Frontend running on port 3000 or 5173

## Step 1: Get Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Account** > **API Keys & Tokens**
3. Create a new API Key (if you don't have one)
4. Note down:
   - **Account SID** (visible at the top of the console)
   - **Auth Token** (visible at the top of the console)
   - **API Key** (from API Keys section)
   - **API Secret** (from API Keys section)

## Step 2: Configure Environment Variables

### Backend (.env file)
Add the following variables to your `.env` file:

```env
# Twilio Video Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=your_api_key_here
TWILIO_API_SECRET=your_api_secret_here
```

### Frontend (.env file)
Add the following variable to your frontend `.env` file:

```env
REACT_APP_TWILIO_TOKEN_URL=http://localhost:4000/api/twilio/token
```

## Step 3: Install Dependencies

### Backend
```bash
npm install twilio
```

### Frontend
```bash
npm install twilio-video
```

## Step 4: Verify Installation

### Backend
The Twilio routes are already integrated in `/Backend/index.js`:
```javascript
import twilioRouter from './routes/twilio.routes.js';
app.use('/api/twilio', twilioRouter);
```

### Frontend
The MeetingRoom component is already configured to use Twilio Video:
- Location: `/Frontend/src/pages/MeetingRoom.jsx`
- Uses: `twilio-video` SDK
- Provides custom UI for video conferencing

## Step 5: Test the Integration

1. Start the backend server:
```bash
npm start
```

2. Start the frontend:
```bash
npm run dev
```

3. Navigate to a meeting room URL:
```
http://localhost:3000/meeting?roomId=test-room&sessionId=123&userRole=mentor
```

## API Endpoints

### Generate Twilio Token
**POST** `/api/twilio/token`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "roomName": "room-id",
  "userName": "user-name",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Token generated successfully"
}
```

## Features

### Video Conference
- Real-time video and audio streaming
- Multiple participant support
- Automatic bandwidth management
- Network quality monitoring

### Custom UI
- Grid layout for multiple participants
- Picture-in-picture for local video
- Control buttons for audio/video toggle
- Leave call functionality

### Chat
- In-call text messaging
- Message history
- Participant identification

### Controls
- **Mute/Unmute Audio** - Toggle microphone
- **Toggle Video** - Turn camera on/off
- **Chat** - Open/close chat panel
- **Leave Call** - Disconnect from meeting

## Architecture

### Frontend Flow
1. User joins meeting room with URL parameters
2. Frontend requests Twilio token from backend
3. Backend generates JWT token with Twilio credentials
4. Frontend connects to Twilio Video room using token
5. Participants can see each other and communicate

### Backend Flow
1. Receive token request with room name and user info
2. Validate authentication
3. Generate Twilio JWT token
4. Return token to frontend
5. Frontend uses token to connect to Twilio Video

## Troubleshooting

### "Twilio service is not properly configured"
- Verify all Twilio credentials are in `.env` file
- Restart the backend server after adding credentials
- Check that credentials are correct in Twilio Console

### "Failed to connect to the session"
- Ensure backend is running on port 4000
- Check that frontend can reach backend API
- Verify JWT token is valid
- Check browser console for detailed error messages

### "Permission denied for camera/microphone"
- Grant camera and microphone permissions in browser
- Check browser settings for site permissions
- Try using HTTPS (required for some browsers)

### Video not displaying
- Check network connection
- Verify participant is sending video
- Check browser console for errors
- Try refreshing the page

## File Structure

```
Backend/
├── routes/
│   └── twilio.routes.js          # Twilio API routes
├── controllers/
│   └── twilio.controller.js       # Token generation logic
└── index.js                       # Twilio router integration

Frontend/
├── config/
│   └── twilioConfig.js            # Twilio configuration
├── pages/
│   └── MeetingRoom.jsx            # Main video conference component
└── App.jsx                        # Route configuration
```

## Security Considerations

1. **Token Expiration**: Tokens expire after 1 hour
2. **Authentication**: All token requests require JWT authentication
3. **User Validation**: Backend validates user before issuing token
4. **HTTPS**: Use HTTPS in production for secure token transmission
5. **Environment Variables**: Never commit credentials to version control

## Customization

### Change Video Quality
Edit `/Frontend/src/pages/MeetingRoom.jsx`:
```javascript
const videoTrack = await createLocalVideoTrack({
  width: { ideal: 1920 },  // Increase for higher quality
  height: { ideal: 1080 },
  frameRate: { ideal: 30 }
});
```

### Change Audio Settings
Edit `/Frontend/src/pages/MeetingRoom.jsx`:
```javascript
const audioTrack = await createLocalAudioTrack({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
});
```

### Customize UI
Edit `/Frontend/src/pages/MeetingRoom.jsx` to modify:
- Layout (grid, speaker view, etc.)
- Control button styling
- Chat panel appearance
- Participant display

## Support

For issues or questions:
1. Check Twilio documentation: https://www.twilio.com/docs/video
2. Review error messages in browser console
3. Check backend logs for API errors
4. Verify environment variables are set correctly

## Migration from ZegoCloud

The old ZegoCloud implementation files are still present but no longer used:
- `/Frontend/src/pages/MeetingRoomZego.jsx` (deprecated)
- `/Frontend/src/config/zegoConfig.js` (deprecated)

These can be safely deleted after verifying Twilio implementation works.

## Next Steps

1. Test video conferencing with multiple participants
2. Customize UI to match your design
3. Implement additional features (screen sharing, recording, etc.)
4. Deploy to production with HTTPS
5. Monitor Twilio usage and costs
