package com.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "availabilities")
public class Availability {
    
    @Id
    private String id;
    
    @Field("mentor")
    private String mentor;
    
    @Field("date")
    private String date;
    
    @Field("timeSlots")
    private List<TimeSlot> timeSlots = new ArrayList<>();
    
    @Field("duration")
    private Integer duration;
    
    @Field("isActive")
    private Boolean isActive = true;
    
    @Field("createdAt")
    private String createdAt;
    
    @Field("updatedAt")
    private String updatedAt;
    
    // Inner class for TimeSlot
    public static class TimeSlot {
        private String startTime;
        private String endTime;
        private Boolean isBooked = false;
        private String bookingId;
        
        public TimeSlot() {}
        
        public TimeSlot(String startTime, String endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
            this.isBooked = false;
        }
        
        // Getters and Setters
        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        
        public String getEndTime() { return endTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }
        
        public Boolean getIsBooked() { return isBooked; }
        public void setIsBooked(Boolean isBooked) { this.isBooked = isBooked; }
        
        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    }
    
    // Constructors
    public Availability() {}
    
    public Availability(String mentor, String date, List<TimeSlot> timeSlots, Integer duration) {
        this.mentor = mentor;
        this.date = date;
        this.timeSlots = timeSlots;
        this.duration = duration;
        this.isActive = true;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getMentor() { return mentor; }
    public void setMentor(String mentor) { this.mentor = mentor; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public List<TimeSlot> getTimeSlots() { return timeSlots; }
    public void setTimeSlots(List<TimeSlot> timeSlots) { this.timeSlots = timeSlots; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
