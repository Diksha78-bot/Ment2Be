package com.app.repository;

import com.app.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    
    Page<Question> findAll(Pageable pageable);
    
    Page<Question> findByCategory(String category, Pageable pageable);
    
    @Query("{ 'author': ?0 }")
    Page<Question> findByAuthor(Object authorId, Pageable pageable);
    
    @Query("{ '$or': [ { 'title': { '$regex': ?0, '$options': 'i' } }, { 'content': { '$regex': ?0, '$options': 'i' } } ] }")
    Page<Question> searchByTitleOrContent(String query, Pageable pageable);
}
