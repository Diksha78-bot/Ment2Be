# Twilio Video Installation Guide

## Quick Start

Follow these steps to install and configure Twilio Video for the K23DX platform.

## Step 1: Install Dependencies

### Frontend
```bash
cd Frontend
npm install
```

This will install `twilio-video@^2.26.0` along with all other dependencies.

### Backend
```bash
cd Backend
npm install
```

This will install `twilio@^5.0.0` along with all other dependencies.

## Step 2: Configure Environment Variables

### Backend (.env file)

Create or update your `.env` file in the Backend directory with:

```env
# Twilio Video Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here
```

**How to get these credentials:**

1. Go to [Twilio Console](https://console.twilio.com)
2. **Account SID**: Visible at the top of the console dashboard
3. **Auth Token**: Visible at the top of the console dashboard (click "Show")
4. **API Key & Secret**: 
   - Navigate to **Account** → **API Keys & Tokens**
   - Create a new API Key if needed
   - Copy the API Key and API Secret

### Frontend (.env file)

Create or update your `.env` file in the Frontend directory with:

```env
REACT_APP_TWILIO_TOKEN_URL=http://localhost:4000/api/twilio/token
```

## Step 3: Start the Services

### Start Backend
```bash
cd Backend
npm run dev
```

You should see:
```
Server running in development mode
Port: 4000
Socket.IO enabled for real-time meetings
```

### Start Frontend (in a new terminal)
```bash
cd Frontend
npm run dev
```

You should see:
```
VITE v7.1.7  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Step 4: Test the Installation

1. Open your browser and go to: `http://localhost:5173`
2. Log in to your account
3. Navigate to a meeting room or create a session
4. Click "Join Session" to test the video conference
5. You should see the Twilio Video UI with:
   - Local video preview (bottom right)
   - Remote participant video (main area)
   - Control buttons (mute, camera, chat, leave)

## Troubleshooting

### "Failed to resolve import 'twilio-video'"
**Solution:**
```bash
cd Frontend
npm install twilio-video@^2.26.0
```

### "Twilio service is not properly configured"
**Solution:**
- Verify all Twilio credentials are in `.env` file
- Restart the backend server: `npm run dev`
- Check that credentials match exactly (no extra spaces)

### "Failed to get Twilio token"
**Solution:**
- Ensure backend is running on port 4000
- Check that you're logged in (valid JWT token)
- Verify `REACT_APP_TWILIO_TOKEN_URL` in frontend `.env`

### "Cannot find module 'twilio'"
**Solution:**
```bash
cd Backend
npm install twilio@^5.0.0
```

### Video not connecting
**Solution:**
1. Check browser console for errors (F12)
2. Verify camera/microphone permissions are granted
3. Check network connection
4. Try a different browser
5. Check backend logs for token generation errors

## File Structure

After installation, your project should have:

```
Frontend/
├── node_modules/
│   ├── twilio-video/
│   └── ... (other packages)
├── src/
│   ├── config/
│   │   └── twilioConfig.js
│   ├── pages/
│   │   └── MeetingRoom.jsx
│   └── App.jsx
├── package.json
└── .env

Backend/
├── node_modules/
│   ├── twilio/
│   └── ... (other packages)
├── controllers/
│   └── twilio.controller.js
├── routes/
│   └── twilio.routes.js
├── index.js
├── package.json
└── .env
```

## Verify Installation

### Check Frontend
```bash
cd Frontend
npm list twilio-video
```

Should output:
```
frontend@0.0.0 /path/to/Frontend
└── twilio-video@2.26.0
```

### Check Backend
```bash
cd Backend
npm list twilio
```

Should output:
```
backend@1.0.0 /path/to/Backend
└── twilio@5.0.0
```

## Next Steps

1. **Test with multiple users**: Open meeting in two different browsers
2. **Customize UI**: Edit `/Frontend/src/pages/MeetingRoom.jsx`
3. **Add features**: Screen sharing, recording, etc.
4. **Deploy**: Follow deployment guide for production setup

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` in the directory |
| Port already in use | Change port in vite.config.js or kill process |
| CORS errors | Verify `CLIENT_URL` in backend `.env` |
| Video permission denied | Grant camera/mic permissions in browser |
| Token generation fails | Check Twilio credentials in `.env` |

## Support Resources

- [Twilio Video Documentation](https://www.twilio.com/docs/video)
- [Twilio Console](https://console.twilio.com)
- [npm twilio-video](https://www.npmjs.com/package/twilio-video)
- [npm twilio](https://www.npmjs.com/package/twilio)

## Uninstalling ZegoCloud (Optional)

If you want to remove the old ZegoCloud implementation:

### Frontend
```bash
npm uninstall @zegocloud/zego-uikit-prebuilt
```

Then delete these files:
- `/Frontend/src/pages/MeetingRoomZego.jsx`
- `/Frontend/src/config/zegoConfig.js`

### Update imports in App.jsx
The import is already updated to use Twilio instead of ZegoCloud.

## Verification Checklist

- [ ] Backend dependencies installed (`npm install` in Backend)
- [ ] Frontend dependencies installed (`npm install` in Frontend)
- [ ] Twilio credentials added to Backend `.env`
- [ ] Twilio token URL added to Frontend `.env`
- [ ] Backend running on port 4000
- [ ] Frontend running on port 5173
- [ ] Can log in to application
- [ ] Can join a video meeting
- [ ] Video and audio working
- [ ] Chat functionality working

Once all items are checked, your Twilio Video integration is ready to use!
