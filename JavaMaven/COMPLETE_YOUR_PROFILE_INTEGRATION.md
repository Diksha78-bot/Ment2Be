# Complete Your Profile - Integration Notes (Frontend + Java Backend)

This document explains how the **Complete Your Profile** flow is currently wired in the MentorLink/Ment2Be project, and what part of that flow is handled by the **Java backend**.

## Frontend Component

- **Component:** `Frontend/src/components/StudentProfileCompletion/index.jsx`
- **Page wrapper:** `Frontend/src/pages/ProfileCompletionPage.jsx`

The UI is the multi-step form titled **"Complete Your Profile"**.

## Current API Used by the Frontend (Important)

At the moment, the form submission from `ProfileCompletionPage.jsx` goes to the **Node.js backend**, not the Java backend:

- **Endpoint called by frontend:** `PUT http://localhost:4000/api/user/profile`
- **Frontend file:** `Frontend/src/pages/ProfileCompletionPage.jsx`

So the UI is **not yet directly using a Java controller** for saving the student profile.

## Where Java Backend IS Used in This Flow

Even though the profile save happens in Node.js, Java is involved for **karma points**.

### Node.js -> Java Karma Microservice Call

When a student profile becomes complete (threshold logic in Node.js), Node.js calls the Java service:

- **Java base URL (env):** `JAVA_KARMA_API=http://localhost:8081/api/karma`
- **Node.js controller:** `Backend/controllers/user.controller.js`
- **Java endpoint used:** `POST /api/karma/profile-progress`

This is how Java participates in the profile completion journey:

- **Frontend** saves profile to Node.js
- **Node.js** computes completion percentage and decides if profile is complete
- **Node.js** calls **Java** to compute karma points for profile progress/completion
- **Node.js** stores awarded karma points back into MongoDB

## Related Endpoints (Current)

### Node.js

- `PUT /api/user/profile` (authenticated)
  - Updates profile fields
  - Calculates `profileCompletionPercentage`
  - May mark `isProfileComplete`
  - May award karma through Java service

### Java

- `POST /api/karma/profile-progress`
  - Accepts completion stats
  - Returns `karmaPoints`

## If You Want This Flow to be "Java Backend" End-to-End

To make the frontend truly backed by Java for this component, you would need to implement in Java:

- `PUT /api/user/profile` (or a new Java equivalent, e.g. `PUT /api/profile/me`)
- MongoDB update logic for user profile fields
- Upload handling for `profilePicture` (if required)
- Completion percentage calculation

And then update the frontend to call:

- `http://localhost:8081/...` instead of `http://localhost:4000/...`

## Notes

- This document is meant to clarify **what is already Java-backed vs what is still Node-backed**.
- It helps reviewers verify the architecture from the code.
