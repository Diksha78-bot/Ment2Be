# Forum/Questions API Setup Guide

## Overview
Complete forum system for students to ask questions and get answers from mentors. Built with easy backend switching capability.

## Backend Implementation

### Files Created/Modified

**Node.js Backend:**
1. `/Backend/models/forum.model.js` - MongoDB schema for forum questions
2. `/Backend/controllers/forum.controller.js` - All CRUD operations
3. `/Backend/routes/forum.routes.js` - RESTful API endpoints
4. Already integrated in `/Backend/index.js`

**Frontend:**
1. `/Frontend/src/services/forumService.js` - API service layer (NEW)
2. `/Frontend/src/config/apiConfig.js` - Backend configuration (UPDATED)

## API Endpoints

### Public Routes (No Authentication Required)

**GET /api/forum/questions**
- Get all questions with pagination
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `sort` (default: '-createdAt')
- Response: Array of questions with pagination info

**GET /api/forum/questions/:id**
- Get single question by ID
- Response: Question object with all answers

**GET /api/forum/questions/category/:category**
- Get questions by category
- Categories: 'engineering', 'data-science', 'business', 'product', 'general'
- Query Parameters: `page`, `limit`
- Response: Array of questions

**GET /api/forum/questions/search**
- Search questions by title or content
- Query Parameters:
  - `q` - Search query (required)
  - `category` - Filter by category (optional)
  - `page` (default: 1)
  - `limit` (default: 10)
- Response: Array of matching questions

### Protected Routes (Authentication Required)

**POST /api/forum/questions**
- Create a new question
- Headers: `Authorization: Bearer {token}`
- Body:
  ```json
  {
    "title": "How to learn React?",
    "content": "I want to learn React from scratch...",
    "category": "engineering",
    "domain": "frontend" (optional)
  }
  ```
- Response: Created question object

**PUT /api/forum/questions/:id**
- Update a question (only author can update)
- Headers: `Authorization: Bearer {token}`
- Body: Same as POST (only modified fields needed)
- Response: Updated question object

**DELETE /api/forum/questions/:id**
- Delete a question (only author can delete)
- Headers: `Authorization: Bearer {token}`
- Response: Success message

**POST /api/forum/questions/:id/answer**
- Add an answer to a question
- Headers: `Authorization: Bearer {token}`
- Body:
  ```json
  {
    "content": "Here's how you can learn React..."
  }
  ```
- Response: Updated question with new answer

**POST /api/forum/questions/:id/upvote**
- Upvote/Remove upvote from a question
- Headers: `Authorization: Bearer {token}`
- Response: Updated upvote count

**GET /api/forum/mentor/:mentorId/questions**
- Get all questions asked by a specific mentor
- Headers: `Authorization: Bearer {token}`
- Query Parameters: `page`, `limit`
- Response: Array of mentor's questions

## Frontend Usage

### Import the Service
```javascript
import * as forumService from '../services/forumService';
```

### Example Usage

**Create a Question:**
```javascript
const questionData = {
  title: "How to optimize database queries?",
  content: "I'm having performance issues with my database...",
  category: "engineering"
};

try {
  const result = await forumService.createQuestion(questionData);
  console.log('Question created:', result.question);
} catch (error) {
  console.error('Error:', error);
}
```

**Get All Questions:**
```javascript
try {
  const result = await forumService.getAllQuestions(1, 10);
  console.log('Questions:', result.questions);
  console.log('Pagination:', result.pagination);
} catch (error) {
  console.error('Error:', error);
}
```

**Search Questions:**
```javascript
try {
  const result = await forumService.searchQuestions('React', 'engineering');
  console.log('Search results:', result.questions);
} catch (error) {
  console.error('Error:', error);
}
```

**Add an Answer:**
```javascript
try {
  const result = await forumService.answerQuestion(questionId, 'Your answer here...');
  console.log('Answer added:', result.question);
} catch (error) {
  console.error('Error:', error);
}
```

**Upvote a Question:**
```javascript
try {
  const result = await forumService.upvoteQuestion(questionId);
  console.log('New upvote count:', result.upvotes);
} catch (error) {
  console.error('Error:', error);
}
```

## Backend Switching

### How to Switch Backends

Edit `/Frontend/src/config/apiConfig.js`:

```javascript
// Change this line:
const ACTIVE_BACKEND = 'nodejs'; // or 'java'
```

### Available Backends

**Node.js Backend:**
- URL: `http://localhost:4000/api/forum`
- Status: ✅ Active and working

**Java Backend:**
- URL: `http://localhost:8081/api/forum`
- Status: ⏳ Ready for implementation

### Switching to Java Backend

1. Create Java Spring Boot controller with same endpoints
2. Update `/Frontend/src/config/apiConfig.js`:
   ```javascript
   const ACTIVE_BACKEND = 'java';
   ```
3. No frontend code changes needed - all API calls will automatically use Java backend

## Database Schema

### ForumQuestion Model

```javascript
{
  title: String (required, max 200 chars),
  content: String (required),
  category: String (enum: 'engineering', 'data-science', 'business', 'product', 'general'),
  domain: String (optional),
  author: ObjectId (ref: User),
  answers: [
    {
      author: ObjectId (ref: User),
      content: String,
      upvotes: Number,
      createdAt: Date
    }
  ],
  upvotes: Number (default: 0),
  upvoters: [ObjectId],
  views: Number (default: 0),
  tags: [String],
  isResolved: Boolean (default: false),
  resolvedAnswer: ObjectId,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

## Testing

### Test Creating a Question
```bash
curl -X POST http://localhost:4000/api/forum/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Question",
    "content": "This is a test question",
    "category": "engineering"
  }'
```

### Test Getting All Questions
```bash
curl http://localhost:4000/api/forum/questions?page=1&limit=10
```

### Test Searching Questions
```bash
curl "http://localhost:4000/api/forum/questions/search?q=React&category=engineering"
```

## Features

✅ Create, read, update, delete questions
✅ Add answers to questions
✅ Upvote questions and answers
✅ Search questions by title/content
✅ Filter by category
✅ Pagination support
✅ User authentication
✅ Authorization (users can only edit/delete their own questions)
✅ Easy backend switching
✅ Full text search capability
✅ Virtual fields for answer count

## Next Steps

1. **Frontend Forum Page:** Create `/Frontend/src/pages/ForumPage.jsx` to display questions
2. **Create Question Modal:** Build modal for creating new questions
3. **Question Detail Page:** Show single question with answers
4. **Answer Form:** Allow users to add answers
5. **Search & Filter:** Implement search and category filtering
6. **Java Backend:** Implement same endpoints in Java Spring Boot

## Troubleshooting

**Issue:** "Must be authenticated to create question"
- **Solution:** Ensure token is in localStorage and Authorization header is set

**Issue:** "You can only edit your own questions"
- **Solution:** Only the question author can edit/delete

**Issue:** Questions not appearing
- **Solution:** Check if questions are in the correct category and database connection is active

## Support

For issues or questions, check:
1. Backend logs for error messages
2. Browser console for frontend errors
3. Database connection status
4. JWT token validity
