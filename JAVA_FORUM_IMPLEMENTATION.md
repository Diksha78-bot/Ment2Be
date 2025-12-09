# Java Backend - Forum System Implementation Guide

## Overview
This guide provides step-by-step instructions to implement the forum/questions system in the Java Maven backend, mirroring the Node.js implementation for seamless backend switching.

## API Endpoints to Implement

### 1. Get All Questions (Paginated)
```
GET /api/forum/questions?page=1&limit=50&sort=-createdAt
Response:
{
  "success": true,
  "questions": [
    {
      "_id": "ObjectId",
      "title": "Question Title",
      "content": "Question content...",
      "category": "engineering",
      "author": {
        "_id": "userId",
        "name": "Author Name",
        "email": "author@email.com"
      },
      "answers": [
        {
          "_id": "answerId",
          "content": "Answer content...",
          "author": {
            "_id": "mentorId",
            "name": "Mentor Name"
          },
          "upvotes": 5,
          "createdAt": "2025-12-08T10:00:00Z"
        }
      ],
      "upvotes": 10,
      "tags": ["java", "spring"],
      "createdAt": "2025-12-08T10:00:00Z",
      "updatedAt": "2025-12-08T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

### 2. Get Single Question by ID
```
GET /api/forum/questions/:id
Response:
{
  "success": true,
  "question": { ... (same structure as above) }
}
```

### 3. Create Question (Authenticated)
```
POST /api/forum/questions
Headers: Authorization: Bearer {token}
Body:
{
  "title": "How to use Spring Boot?",
  "content": "I want to learn Spring Boot...",
  "category": "engineering",
  "tags": ["java", "spring"]
}
Response:
{
  "success": true,
  "question": { ... (created question) }
}
```

### 4. Update Question (Authenticated - Author Only)
```
PUT /api/forum/questions/:id
Headers: Authorization: Bearer {token}
Body:
{
  "title": "Updated title",
  "content": "Updated content",
  "category": "engineering"
}
Response:
{
  "success": true,
  "question": { ... (updated question) }
}
```

### 5. Delete Question (Authenticated - Author Only)
```
DELETE /api/forum/questions/:id
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "message": "Question deleted successfully"
}
```

### 6. Add Answer to Question (Authenticated)
```
POST /api/forum/questions/:id/answer
Headers: Authorization: Bearer {token}
Body:
{
  "content": "Here's the answer to your question..."
}
Response:
{
  "success": true,
  "question": { ... (question with new answer) }
}
```

### 7. Upvote Question (Authenticated)
```
POST /api/forum/questions/:id/upvote
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "upvotes": 11
}
```

### 8. Get Questions by Category
```
GET /api/forum/questions/category/:category?page=1&limit=10
Response:
{
  "success": true,
  "questions": [ ... ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

### 9. Get Questions by Mentor
```
GET /api/forum/mentor/:mentorId/questions?page=1&limit=10
Headers: Authorization: Bearer {token}
Response:
{
  "success": true,
  "questions": [ ... ],
  "total": 15,
  "page": 1,
  "limit": 10
}
```

### 10. Search Questions
```
GET /api/forum/questions/search?q=spring&category=engineering&page=1&limit=10
Response:
{
  "success": true,
  "questions": [ ... ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

## Database Schema (MongoDB)

### Questions Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max 200),
  content: String (required),
  category: String (enum: ['engineering', 'data-science', 'business', 'product', 'general']),
  author: {
    _id: ObjectId (reference to User),
    name: String,
    email: String
  },
  answers: [
    {
      _id: ObjectId,
      content: String,
      author: {
        _id: ObjectId,
        name: String
      },
      upvotes: Number (default: 0),
      createdAt: Date,
      updatedAt: Date
    }
  ],
  upvotes: Number (default: 0),
  tags: [String],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Java Implementation Steps

### Step 1: Create Entity Class
```java
// src/main/java/com/mentorlink/entity/Question.java

@Document(collection = "questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    @Length(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @Enumerated(EnumType.STRING)
    private QuestionCategory category;
    
    @DBRef
    private User author;
    
    private List<Answer> answers = new ArrayList<>();
    
    private Integer upvotes = 0;
    
    private List<String> tags = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

enum QuestionCategory {
    ENGINEERING, DATA_SCIENCE, BUSINESS, PRODUCT, GENERAL
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Answer {
    
    @Id
    private String id;
    
    @NotBlank(message = "Answer content is required")
    private String content;
    
    @DBRef
    private User author;
    
    private Integer upvotes = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### Step 2: Create Repository
```java
// src/main/java/com/mentorlink/repository/QuestionRepository.java

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    
    Page<Question> findAll(Pageable pageable);
    
    Page<Question> findByCategory(QuestionCategory category, Pageable pageable);
    
    Page<Question> findByAuthorId(String authorId, Pageable pageable);
    
    Page<Question> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
        String title, String content, Pageable pageable);
    
    List<Question> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseAndCategory(
        String title, String content, QuestionCategory category);
}
```

### Step 3: Create Service
```java
// src/main/java/com/mentorlink/service/QuestionService.java

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    // Get all questions with pagination
    public Page<Question> getAllQuestions(int page, int limit, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String field = sort.replace("-", "");
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, field));
        return questionRepository.findAll(pageable);
    }
    
    // Get single question
    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
    }
    
    // Create question
    public Question createQuestion(CreateQuestionRequest request, String userId) {
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setCategory(QuestionCategory.valueOf(request.getCategory().toUpperCase()));
        question.setAuthor(author);
        question.setTags(request.getTags());
        
        return questionRepository.save(question);
    }
    
    // Update question
    public Question updateQuestion(String id, UpdateQuestionRequest request, String userId) {
        Question question = getQuestionById(id);
        
        if (!question.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own questions");
        }
        
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setCategory(QuestionCategory.valueOf(request.getCategory().toUpperCase()));
        
        return questionRepository.save(question);
    }
    
    // Delete question
    public void deleteQuestion(String id, String userId) {
        Question question = getQuestionById(id);
        
        if (!question.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own questions");
        }
        
        questionRepository.deleteById(id);
    }
    
    // Add answer
    public Question addAnswer(String questionId, AddAnswerRequest request, String userId) {
        Question question = getQuestionById(questionId);
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Answer answer = new Answer();
        answer.setId(new ObjectId().toString());
        answer.setContent(request.getContent());
        answer.setAuthor(author);
        
        question.getAnswers().add(answer);
        return questionRepository.save(question);
    }
    
    // Upvote question
    public Question upvoteQuestion(String id, String userId) {
        Question question = getQuestionById(id);
        question.setUpvotes(question.getUpvotes() + 1);
        return questionRepository.save(question);
    }
    
    // Get questions by category
    public Page<Question> getQuestionsByCategory(String category, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return questionRepository.findByCategory(
            QuestionCategory.valueOf(category.toUpperCase()), pageable);
    }
    
    // Get questions by mentor
    public Page<Question> getQuestionsByMentor(String mentorId, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return questionRepository.findByAuthorId(mentorId, pageable);
    }
    
    // Search questions
    public Page<Question> searchQuestions(String query, String category, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        
        if (category != null && !category.isEmpty()) {
            return questionRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                query, query, pageable);
        }
        
        return questionRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            query, query, pageable);
    }
}
```

### Step 4: Create Controller
```java
// src/main/java/com/mentorlink/controller/ForumController.java

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {
    
    private final QuestionService questionService;
    private final JwtTokenProvider jwtTokenProvider;
    
    // Get all questions
    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(defaultValue = "-createdAt") String sort) {
        
        Page<Question> questions = questionService.getAllQuestions(page, limit, sort);
        return ResponseEntity.ok(new ApiResponse(true, "Questions retrieved successfully", 
            Map.of("questions", questions.getContent(), 
                   "total", questions.getTotalElements(),
                   "page", page,
                   "limit", limit)));
    }
    
    // Get single question
    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable String id) {
        Question question = questionService.getQuestionById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Question retrieved successfully", 
            Map.of("question", question)));
    }
    
    // Create question
    @PostMapping("/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createQuestion(
        @Valid @RequestBody CreateQuestionRequest request,
        @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = getUserIdFromUserDetails(userDetails);
        Question question = questionService.createQuestion(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse(true, "Question created successfully", 
                Map.of("question", question)));
    }
    
    // Update question
    @PutMapping("/questions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateQuestion(
        @PathVariable String id,
        @Valid @RequestBody UpdateQuestionRequest request,
        @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = getUserIdFromUserDetails(userDetails);
        Question question = questionService.updateQuestion(id, request, userId);
        return ResponseEntity.ok(new ApiResponse(true, "Question updated successfully", 
            Map.of("question", question)));
    }
    
    // Delete question
    @DeleteMapping("/questions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteQuestion(
        @PathVariable String id,
        @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = getUserIdFromUserDetails(userDetails);
        questionService.deleteQuestion(id, userId);
        return ResponseEntity.ok(new ApiResponse(true, "Question deleted successfully"));
    }
    
    // Add answer
    @PostMapping("/questions/{id}/answer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addAnswer(
        @PathVariable String id,
        @Valid @RequestBody AddAnswerRequest request,
        @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = getUserIdFromUserDetails(userDetails);
        Question question = questionService.addAnswer(id, request, userId);
        return ResponseEntity.ok(new ApiResponse(true, "Answer added successfully", 
            Map.of("question", question)));
    }
    
    // Upvote question
    @PostMapping("/questions/{id}/upvote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> upvoteQuestion(
        @PathVariable String id,
        @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = getUserIdFromUserDetails(userDetails);
        Question question = questionService.upvoteQuestion(id, userId);
        return ResponseEntity.ok(new ApiResponse(true, "Question upvoted successfully", 
            Map.of("upvotes", question.getUpvotes())));
    }
    
    // Get questions by category
    @GetMapping("/questions/category/{category}")
    public ResponseEntity<?> getQuestionsByCategory(
        @PathVariable String category,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        Page<Question> questions = questionService.getQuestionsByCategory(category, page, limit);
        return ResponseEntity.ok(new ApiResponse(true, "Questions retrieved successfully", 
            Map.of("questions", questions.getContent(),
                   "total", questions.getTotalElements(),
                   "page", page,
                   "limit", limit)));
    }
    
    // Get questions by mentor
    @GetMapping("/mentor/{mentorId}/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuestionsByMentor(
        @PathVariable String mentorId,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        Page<Question> questions = questionService.getQuestionsByMentor(mentorId, page, limit);
        return ResponseEntity.ok(new ApiResponse(true, "Questions retrieved successfully", 
            Map.of("questions", questions.getContent(),
                   "total", questions.getTotalElements(),
                   "page", page,
                   "limit", limit)));
    }
    
    // Search questions
    @GetMapping("/questions/search")
    public ResponseEntity<?> searchQuestions(
        @RequestParam String q,
        @RequestParam(required = false) String category,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        Page<Question> questions = questionService.searchQuestions(q, category, page, limit);
        return ResponseEntity.ok(new ApiResponse(true, "Search results retrieved successfully", 
            Map.of("questions", questions.getContent(),
                   "total", questions.getTotalElements(),
                   "page", page,
                   "limit", limit)));
    }
    
    private String getUserIdFromUserDetails(UserDetails userDetails) {
        // Extract user ID from JWT token or UserDetails
        // Implementation depends on your authentication setup
        return userDetails.getUsername(); // or extract from JWT
    }
}
```

### Step 5: Create Request/Response DTOs
```java
// src/main/java/com/mentorlink/dto/CreateQuestionRequest.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateQuestionRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private List<String> tags;
}

// src/main/java/com/mentorlink/dto/UpdateQuestionRequest.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateQuestionRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotBlank(message = "Category is required")
    private String category;
}

// src/main/java/com/mentorlink/dto/AddAnswerRequest.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddAnswerRequest {
    @NotBlank(message = "Answer content is required")
    private String content;
}
```

## Frontend Switching

Once the Java backend is implemented with the same endpoints, switching is simple:

### In `/Frontend/src/config/apiConfig.js`:
```javascript
// Change this line:
const ACTIVE_BACKEND = 'nodejs'; // to 'java'

// All forum API calls automatically switch to Java backend
// No component changes needed!
```

## Testing the Implementation

### Test with cURL:
```bash
# Get all questions
curl -X GET http://localhost:8081/api/forum/questions?page=1&limit=50

# Create question (requires authentication)
curl -X POST http://localhost:8081/api/forum/questions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to use Spring Boot?",
    "content": "I want to learn Spring Boot...",
    "category": "engineering",
    "tags": ["java", "spring"]
  }'

# Add answer
curl -X POST http://localhost:8081/api/forum/questions/{questionId}/answer \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Here is the answer..."}'

# Upvote question
curl -X POST http://localhost:8081/api/forum/questions/{questionId}/upvote \
  -H "Authorization: Bearer {token}"
```

## Key Points

1. **Same Endpoints**: All endpoints match the Node.js implementation
2. **Same Response Format**: Response structure is identical for seamless switching
3. **Authentication**: Uses same JWT token validation
4. **Database**: Uses same MongoDB with identical schema
5. **Easy Switching**: Change one line in `apiConfig.js` to switch backends

## Dependencies Required

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

## Next Steps

1. Create the entity classes
2. Create the repository interface
3. Create the service class
4. Create the controller
5. Create the DTOs
6. Test all endpoints
7. Update `apiConfig.js` to switch backends
8. Verify frontend works with Java backend
