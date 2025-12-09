package com.app.service;

import com.app.model.Question;
import com.app.model.User;
import com.app.repository.QuestionRepository;
import com.app.repository.UserRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuestionService {
    
    private static final Logger logger = LoggerFactory.getLogger(QuestionService.class);
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<Question> getAllQuestions(int page, int limit, String sort) {
        logger.info("🔵 [FORUM - JAVA] Getting all questions - page: {}, limit: {}", page, limit);
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String field = sort.replace("-", "");
        if (field.equals("createdAt")) field = "createdAt";
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(direction, field));
        return questionRepository.findAll(pageable);
    }
    
    public Question getQuestionById(String id) {
        logger.info("🔵 [FORUM - JAVA] Getting question by ID: {}", id);
        return questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }
    
    public Question createQuestion(String title, String content, String category, String domain, String userId) {
        logger.info("🔵 [FORUM - JAVA] Creating question by user: {}", userId);
        
        Question question = new Question();
        question.setTitle(title);
        question.setContent(content);
        question.setCategory(category);
        question.setDomain(domain != null ? domain : category);
        question.setAuthor(new ObjectId(userId));
        question.setUpvotes(0);
        question.setAnswers(new ArrayList<>());
        question.setCreatedAt(new Date());
        question.setUpdatedAt(new Date());
        
        return questionRepository.save(question);
    }
    
    public Question updateQuestion(String id, String title, String content, String category, String userId) {
        logger.info("🔵 [FORUM - JAVA] Updating question: {}", id);
        Question question = getQuestionById(id);
        
        question.setTitle(title);
        question.setContent(content);
        question.setCategory(category);
        question.setUpdatedAt(new Date());
        
        return questionRepository.save(question);
    }
    
    public void deleteQuestion(String id, String userId) {
        logger.info("🔵 [FORUM - JAVA] Deleting question: {}", id);
        questionRepository.deleteById(id);
    }
    
    public Question addAnswer(String questionId, String content, String userId) {
        logger.info("🔵 [FORUM - JAVA] Adding answer to question: {}", questionId);
        Question question = getQuestionById(questionId);
        
        Map<String, Object> answer = new HashMap<>();
        answer.put("_id", new ObjectId().toString());
        answer.put("content", content);
        answer.put("author", new ObjectId(userId));
        answer.put("upvotes", 0);
        answer.put("createdAt", new Date());
        
        if (question.getAnswers() == null) {
            question.setAnswers(new ArrayList<>());
        }
        question.getAnswers().add(answer);
        question.setUpdatedAt(new Date());
        
        return questionRepository.save(question);
    }
    
    public Question upvoteQuestion(String id, String userId) {
        logger.info("🔵 [FORUM - JAVA] Upvoting question: {}", id);
        Question question = getQuestionById(id);
        
        if (question.getUpvoters() == null) {
            question.setUpvoters(new ArrayList<>());
        }
        
        if (question.getUpvoters().contains(userId)) {
            question.setUpvotes(Math.max(0, (question.getUpvotes() != null ? question.getUpvotes() : 0) - 1));
            question.getUpvoters().remove(userId);
        } else {
            question.setUpvotes((question.getUpvotes() != null ? question.getUpvotes() : 0) + 1);
            question.getUpvoters().add(userId);
        }
        question.setUpdatedAt(new Date());
        
        return questionRepository.save(question);
    }
    
    public Page<Question> getQuestionsByCategory(String category, int page, int limit) {
        logger.info("🔵 [FORUM - JAVA] Getting questions by category: {}", category);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findByCategory(category, pageable);
    }
    
    public Page<Question> getQuestionsByMentor(String mentorId, int page, int limit) {
        logger.info("🔵 [FORUM - JAVA] Getting questions by mentor: {}", mentorId);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findByAuthor(new ObjectId(mentorId), pageable);
    }
    
    public Page<Question> searchQuestions(String query, int page, int limit) {
        logger.info("🔵 [FORUM - JAVA] Searching questions with query: {}", query);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.searchByTitleOrContent(query, pageable);
    }
}
