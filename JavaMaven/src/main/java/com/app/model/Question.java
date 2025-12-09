package com.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "forumquestions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    
    @Id
    private String id;
    
    private String title;
    
    private String content;
    
    private String category;
    
    private String domain;
    
    // Store author as ObjectId string - will be populated separately
    private Object author;
    
    // Store answers as list of maps to handle flexible structure
    private List<Map<String, Object>> answers = new ArrayList<>();
    
    private Integer upvotes = 0;
    
    private List<String> upvoters = new ArrayList<>();
    
    private List<String> tags = new ArrayList<>();
    
    private Integer views = 0;
    
    private Boolean isResolved = false;
    
    private String resolvedAnswer;
    
    private Date createdAt;
    
    private Date updatedAt;
}
