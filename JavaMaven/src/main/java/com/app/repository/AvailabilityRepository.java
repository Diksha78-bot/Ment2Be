package com.app.repository;

import com.app.model.Availability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepository extends MongoRepository<Availability, String> {
    
    // Find availability by mentor and date
    Optional<Availability> findByMentorAndDate(String mentor, String date);
    
    // Find all availabilities for a mentor
    List<Availability> findByMentorAndIsActive(String mentor, Boolean isActive);
    
    // Find all active availabilities for a mentor
    List<Availability> findByMentorAndIsActiveTrueOrderByDateAsc(String mentor);
    
    // Find availability by mentor, date and active status
    Optional<Availability> findByMentorAndDateAndIsActive(String mentor, String date, Boolean isActive);
}
