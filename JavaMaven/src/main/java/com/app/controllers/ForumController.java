package com.app.controllers;

import com.app.model.Question;
import com.app.service.QuestionService;
import com.app.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ForumController {
    
    private static final Logger logger = LoggerFactory.getLogger(ForumController.class);
    
    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(defaultValue = "-createdAt") String sort) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions - page: {}, limit: {}", page, limit);
            Page<Question> questions = questionService.getAllQuestions(page, limit, sort);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching questions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable String id) {
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions/{}", id);
            Question question = questionService.getQuestionById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("question", question);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching question: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] POST /api/forum/questions - Creating question");
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.extractUserId(token);
            
            Question question = questionService.createQuestion(
                request.get("title"),
                request.get("content"),
                request.get("category"),
                request.get("domain"),
                userId
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question created successfully");
            response.put("question", question);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error creating question: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(
        @PathVariable String id,
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] PUT /api/forum/questions/{}", id);
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.extractUserId(token);
            
            Question question = questionService.updateQuestion(
                id,
                request.get("title"),
                request.get("content"),
                request.get("category"),
                userId
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question updated successfully");
            response.put("question", question);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating question: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(
        @PathVariable String id,
        @RequestHeader("Authorization") String authHeader) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] DELETE /api/forum/questions/{}", id);
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.extractUserId(token);
            questionService.deleteQuestion(id, userId);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Question deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting question: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/questions/{id}/answer")
    public ResponseEntity<?> addAnswer(
        @PathVariable String id,
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] POST /api/forum/questions/{}/answer", id);
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.extractUserId(token);
            
            Question question = questionService.addAnswer(id, request.get("content"), userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Answer added successfully");
            response.put("question", question);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error adding answer: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/questions/{id}/upvote")
    public ResponseEntity<?> upvoteQuestion(
        @PathVariable String id,
        @RequestHeader("Authorization") String authHeader) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] POST /api/forum/questions/{}/upvote", id);
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.extractUserId(token);
            
            Question question = questionService.upvoteQuestion(id, userId);
            
            return ResponseEntity.ok(Map.of("success", true, "upvotes", question.getUpvotes()));
        } catch (Exception e) {
            logger.error("Error upvoting question: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/questions/category/{category}")
    public ResponseEntity<?> getQuestionsByCategory(
        @PathVariable String category,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions/category/{}", category);
            Page<Question> questions = questionService.getQuestionsByCategory(category, page, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching questions by category: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/mentor/{mentorId}/questions")
    public ResponseEntity<?> getQuestionsByMentor(
        @PathVariable String mentorId,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/mentor/{}/questions", mentorId);
            Page<Question> questions = questionService.getQuestionsByMentor(mentorId, page, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching mentor questions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/questions/search")
    public ResponseEntity<?> searchQuestions(
        @RequestParam String q,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions/search - query: {}", q);
            Page<Question> questions = questionService.searchQuestions(q, page, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error searching questions: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
