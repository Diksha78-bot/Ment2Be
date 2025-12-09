package com.app.controllers;

import com.app.model.Availability;
import com.app.repository.AvailabilityRepository;
import com.app.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mentor-availability")
@CrossOrigin(origins = "*")
public class AvailabilityController {
    
    private static final Logger logger = LoggerFactory.getLogger(AvailabilityController.class);
    
    @Autowired
    private AvailabilityRepository availabilityRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Save or update mentor availability
    @PostMapping
    public ResponseEntity<?> saveAvailability(@RequestBody Map<String, Object> request, @RequestHeader("Authorization") String token) {
        try {
            logger.info("🟢 [JAVA BACKEND] POST /api/mentor-availability - Save availability request received");
            logger.info("🟢 [JAVA BACKEND] Authorization token: {}", token.substring(0, Math.min(20, token.length())) + "...");
            
            String mentorId = extractUserIdFromToken(token);
            String date = (String) request.get("date");
            List<String> timeSlotStrings = (List<String>) request.get("timeSlots");
            Integer duration = request.get("duration") != null ? (Integer) request.get("duration") : 60;
            
            logger.info("🟢 [JAVA BACKEND] SAVING - Mentor ID: {}, Date: {}, Duration: {} min", mentorId, date, duration);
            logger.info("🟢 [JAVA BACKEND] Time slots received: {}", timeSlotStrings);
            
            if (date == null || timeSlotStrings == null || timeSlotStrings.isEmpty()) {
                logger.error("🔴 [JAVA BACKEND] Missing required fields");
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Date and time slots are required"
                ));
            }
            
            // Convert time slot strings to TimeSlot objects
            List<Availability.TimeSlot> timeSlots = new ArrayList<>();
            for (String timeString : timeSlotStrings) {
                String endTime = calculateEndTime(timeString, duration);
                Availability.TimeSlot slot = new Availability.TimeSlot(timeString, endTime);
                timeSlots.add(slot);
            }
            
            // Check if availability already exists for this date
            Optional<Availability> existingAvailability = availabilityRepository.findByMentorAndDate(mentorId, date);
            
            Availability availability;
            if (existingAvailability.isPresent()) {
                availability = existingAvailability.get();
                availability.setTimeSlots(timeSlots);
                availability.setDuration(duration);
                availability.setIsActive(true);
                availability.setUpdatedAt(getCurrentTimestamp());
                logger.info("🟢 [JAVA BACKEND] Updating existing availability for mentor {} on {}", mentorId, date);
            } else {
                availability = new Availability(mentorId, date, timeSlots, duration);
                availability.setCreatedAt(getCurrentTimestamp());
                availability.setUpdatedAt(getCurrentTimestamp());
                logger.info("🟢 [JAVA BACKEND] Creating new availability for mentor {} on {}", mentorId, date);
            }
            
            Availability savedAvailability = availabilityRepository.save(availability);
            logger.info("✅ [JAVA BACKEND] Availability saved successfully with ID: {}", savedAvailability.getId());
            logger.info("✅ [JAVA BACKEND] Saved availability - Mentor: {}, Date: {}, Slots: {}", 
                savedAvailability.getMentor(), savedAvailability.getDate(), savedAvailability.getTimeSlots().size());
            
            // Verify it was saved by fetching it back
            Optional<Availability> verification = availabilityRepository.findByMentorAndDate(mentorId, date);
            logger.info("🔍 [JAVA BACKEND] Verification - Found in DB: {}", verification.isPresent());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "data", savedAvailability,
                "message", "Availability saved successfully"
            ));
            
        } catch (Exception e) {
            logger.error("🔴 [JAVA BACKEND] Error saving availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to save availability",
                "error", e.getMessage()
            ));
        }
    }
    
    // Get available slots for a mentor on a specific date
    @GetMapping("/{mentorId}")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable String mentorId,
            @RequestParam String date,
            @RequestHeader("Authorization") String token) {
        try {
            logger.info("🟢 [JAVA BACKEND] GET /api/mentor-availability/{} - Get available slots for date: {}", mentorId, date);
            
            Optional<Availability> availability = availabilityRepository.findByMentorAndDateAndIsActive(mentorId, date, true);
            
            if (availability.isEmpty()) {
                logger.info("🟡 [JAVA BACKEND] No availability found for mentor {} on {}", mentorId, date);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "availableSlots", new ArrayList<>(),
                    "message", "No availability found for this date"
                ));
            }
            
            // Filter out booked slots and return only available ones
            List<String> availableSlots = availability.get().getTimeSlots().stream()
                .filter(slot -> !slot.getIsBooked())
                .map(Availability.TimeSlot::getStartTime)
                .collect(Collectors.toList());
            
            logger.info("✅ [JAVA BACKEND] Found {} available slots for mentor {} on {}", availableSlots.size(), mentorId, date);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "availableSlots", availableSlots,
                "duration", availability.get().getDuration(),
                "message", "Available slots retrieved successfully"
            ));
            
        } catch (Exception e) {
            logger.error("🔴 [JAVA BACKEND] Error fetching available slots: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to fetch available slots",
                "error", e.getMessage()
            ));
        }
    }
    
    // Get all availability for authenticated mentor
    @GetMapping("/mentor/all")
    public ResponseEntity<?> getAllAvailability(@RequestHeader("Authorization") String token) {
        try {
            logger.info("🟢 [JAVA BACKEND] GET /api/mentor-availability/mentor/all - Request received");
            logger.info("🟢 [JAVA BACKEND] Authorization token: {}", token.substring(0, Math.min(20, token.length())) + "...");
            
            String mentorId = extractUserIdFromToken(token);
            logger.info("🟢 [JAVA BACKEND] FETCHING - Mentor ID: {}", mentorId);
            
            List<Availability> availabilities = availabilityRepository.findByMentorAndIsActiveTrueOrderByDateAsc(mentorId);
            
            logger.info("✅ [JAVA BACKEND] Retrieved {} availability records for mentor {}", availabilities.size(), mentorId);
            
            // Log all availabilities in DB for this mentor
            List<Availability> allForMentor = availabilityRepository.findByMentorAndIsActive(mentorId, true);
            logger.info("🔍 [JAVA BACKEND] Total active records in DB for mentor {}: {}", mentorId, allForMentor.size());
            
            // Debug: Show all availabilities in entire database
            try {
                List<Availability> allInDb = availabilityRepository.findAll();
                logger.info("🔍 [JAVA BACKEND] Total availabilities in entire DB: {}", allInDb.size());
                for (Availability av : allInDb) {
                    logger.info("🔍 [JAVA BACKEND] DB Record - Mentor: {}, Date: {}, Active: {}, Slots: {}", 
                        av.getMentor(), av.getDate(), av.getIsActive(), 
                        av.getTimeSlots() != null ? av.getTimeSlots().size() : 0);
                }
            } catch (Exception debugEx) {
                logger.error("🔴 [JAVA BACKEND] Error in debug logging: {}", debugEx.getMessage());
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", availabilities,
                "message", "Availability records retrieved successfully"
            ));
            
        } catch (Exception e) {
            logger.error("🔴 [JAVA BACKEND] Error fetching availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to fetch availability",
                "error", e.getMessage()
            ));
        }
    }
    
    // Delete availability
    @DeleteMapping("/{availabilityId}")
    public ResponseEntity<?> deleteAvailability(
            @PathVariable String availabilityId,
            @RequestHeader("Authorization") String token) {
        try {
            String mentorId = extractUserIdFromToken(token);
            logger.info("🟢 [JAVA BACKEND] DELETE /api/mentor-availability/{} - Delete availability", availabilityId);
            
            Optional<Availability> availability = availabilityRepository.findById(availabilityId);
            
            if (availability.isEmpty()) {
                logger.error("🔴 [JAVA BACKEND] Availability not found: {}", availabilityId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Availability not found"
                ));
            }
            
            if (!availability.get().getMentor().equals(mentorId)) {
                logger.error("🔴 [JAVA BACKEND] Unauthorized delete attempt by mentor {}", mentorId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "message", "Unauthorized to delete this availability"
                ));
            }
            
            // Soft delete by marking as inactive
            availability.get().setIsActive(false);
            availabilityRepository.save(availability.get());
            
            logger.info("✅ [JAVA BACKEND] Availability {} deleted successfully", availabilityId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Availability deleted successfully"
            ));
            
        } catch (Exception e) {
            logger.error("🔴 [JAVA BACKEND] Error deleting availability: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to delete availability",
                "error", e.getMessage()
            ));
        }
    }
    
    // Helper method to calculate end time
    private String calculateEndTime(String startTime, int durationMinutes) {
        try {
            String[] parts = startTime.split(" ");
            String[] timeParts = parts[0].split(":");
            int hours = Integer.parseInt(timeParts[0]);
            int minutes = Integer.parseInt(timeParts[1]);
            String period = parts[1];
            
            // Convert to 24-hour format
            if (period.equals("PM") && hours != 12) {
                hours += 12;
            } else if (period.equals("AM") && hours == 12) {
                hours = 0;
            }
            
            // Add duration
            int totalMinutes = hours * 60 + minutes + durationMinutes;
            int endHour24 = (totalMinutes / 60) % 24;
            int endMinutes = totalMinutes % 60;
            
            // Convert back to 12-hour format
            int endHour12 = endHour24 == 0 ? 12 : endHour24 > 12 ? endHour24 - 12 : endHour24;
            String endPeriod = endHour24 >= 12 ? "PM" : "AM";
            
            return String.format("%d:%02d %s", endHour12, endMinutes, endPeriod);
        } catch (Exception e) {
            logger.error("🔴 [JAVA BACKEND] Error calculating end time: {}", e.getMessage());
            return startTime;
        }
    }
    
    // Helper method to extract user ID from token
    private String extractUserIdFromToken(String token) {
        try {
            // Remove "Bearer " prefix if present
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            String userId = jwtUtil.extractUserId(token);
            
            if (userId == null || userId.isEmpty()) {
                logger.error("🔴 [JAVA BACKEND] Failed to extract user ID from token");
                throw new RuntimeException("Invalid token - could not extract user ID");
            }
            
            logger.info("🟢 [JAVA BACKEND] Extracted user ID from token: {}", userId);
            return userId;
        } catch (Exception e) {
            logger.error("🔴 [JAVA BACKEND] Error extracting user ID from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token: " + e.getMessage());
        }
    }
    
    // Helper method to get current timestamp
    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
