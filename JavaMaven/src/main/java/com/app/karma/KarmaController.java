package com.app.karma;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/karma")
public class KarmaController {
    private static final Logger logger = LoggerFactory.getLogger(KarmaController.class);

    @Autowired
    private KarmaService karmaService;

    @PostMapping("/calculate")
    public KarmaResponse calculateKarma(@RequestBody KarmaService.KarmaCalculationRequest request) {
        int totalKarma = karmaService.calculateTotalKarma(request);
        return new KarmaResponse("user", totalKarma, "Karma calculated successfully");
    }

    @GetMapping("/profile-complete")
    public KarmaResponse profileComplete() {
        logger.info("🔔 Profile completion karma requested - Starting calculation");
        try {
            int points = karmaService.calculateProfileCompleteKarma();
            logger.info("✅ Profile completion karma calculated: {} points", points);
            return new KarmaResponse("user", points, "Profile completion karma awarded");
        } catch (Exception e) {
            logger.error("❌ Error calculating profile completion karma", e);
            throw e;
        }
    }

    @PostMapping("/profile-progress")
    public KarmaResponse profileProgress(@RequestBody ProfileProgressRequest request) {
        logger.info("🔔 Profile progress karma requested - Completion: {}%", request.getCompletionPercentage());
        try {
            int points = karmaService.calculateProfileProgressKarma(
                request.getCompletionPercentage(),
                request.getCompletedFields(),
                request.getTotalFields()
            );
            logger.info("✅ Profile progress karma calculated: {} points for {}% completion", points, request.getCompletionPercentage());
            return new KarmaResponse("user", points, "Profile progress karma awarded for " + request.getCompletionPercentage() + "% completion");
        } catch (Exception e) {
            logger.error("❌ Error calculating profile progress karma", e);
            throw e;
        }
    }

    @GetMapping("/session-completed")
    public KarmaResponse sessionCompleted() {
        int points = karmaService.calculateSessionCompletedKarma();
        return new KarmaResponse("user", points, "Session completion karma awarded");
    }

    @GetMapping("/message-sent")
    public KarmaResponse messageSent() {
        int points = karmaService.calculateMessageSentKarma();
        return new KarmaResponse("user", points, "Message sent karma awarded");
    }

    @GetMapping("/skill-added")
    public KarmaResponse skillAdded() {
        int points = karmaService.calculateSkillAddedKarma();
        return new KarmaResponse("user", points, "Skill added karma awarded");
    }

    @GetMapping("/goal-set")
    public KarmaResponse goalSet() {
        int points = karmaService.calculateGoalSetKarma();
        return new KarmaResponse("user", points, "Goal set karma awarded");
    }

    // Inner classes for request/response
    public static class KarmaRequest {
        private String userId;
        private int points;

        public KarmaRequest() {}

        public KarmaRequest(String userId, int points) {
            this.userId = userId;
            this.points = points;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public int getPoints() {
            return points;
        }

        public void setPoints(int points) {
            this.points = points;
        }
    }

    public static class KarmaResponse {
        private String userId;
        private int karmaPoints;
        private String message;

        public KarmaResponse() {}

        public KarmaResponse(String userId, int karmaPoints, String message) {
            this.userId = userId;
            this.karmaPoints = karmaPoints;
            this.message = message;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public int getKarmaPoints() {
            return karmaPoints;
        }

        public void setKarmaPoints(int karmaPoints) {
            this.karmaPoints = karmaPoints;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class ProfileProgressRequest {
        private int completionPercentage;
        private int completedFields;
        private int totalFields;

        public ProfileProgressRequest() {}

        public int getCompletionPercentage() {
            return completionPercentage;
        }

        public void setCompletionPercentage(int completionPercentage) {
            this.completionPercentage = completionPercentage;
        }

        public int getCompletedFields() {
            return completedFields;
        }

        public void setCompletedFields(int completedFields) {
            this.completedFields = completedFields;
        }

        public int getTotalFields() {
            return totalFields;
        }

        public void setTotalFields(int totalFields) {
            this.totalFields = totalFields;
        }
    }
}
