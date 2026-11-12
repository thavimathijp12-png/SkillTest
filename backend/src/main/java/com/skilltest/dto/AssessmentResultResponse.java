package com.skilltest.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentResultResponse {

    private String id;
    private String categoryId;
    private String categoryName;
    private String difficulty;
    private Integer score;
    private Integer totalQuestions;
    private Integer percentage;
    private Integer correctCount;
    private Integer incorrectCount;
    private Integer skippedCount;
    private Boolean passed;
    private Integer timeTakenSeconds;
    private LocalDateTime createdAt;
    private List<QuestionReviewDto> review;

    public AssessmentResultResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getPercentage() { return percentage; }
    public void setPercentage(Integer percentage) { this.percentage = percentage; }

    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }

    public Integer getIncorrectCount() { return incorrectCount; }
    public void setIncorrectCount(Integer incorrectCount) { this.incorrectCount = incorrectCount; }

    public Integer getSkippedCount() { return skippedCount; }
    public void setSkippedCount(Integer skippedCount) { this.skippedCount = skippedCount; }

    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }

    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<QuestionReviewDto> getReview() { return review; }
    public void setReview(List<QuestionReviewDto> review) { this.review = review; }

    public static class QuestionReviewDto {
        private String questionId;
        private String questionText;
        private List<String> options;
        private Integer selectedOption;
        private Integer correctAnswer;
        private Boolean isCorrect;
        private String status; // 'correct', 'incorrect', 'skipped'
        private String explanation;
        private String topic;

        public QuestionReviewDto() {}

        public QuestionReviewDto(String questionId, String questionText, List<String> options,
                                 Integer selectedOption, Integer correctAnswer, Boolean isCorrect,
                                 String status, String explanation, String topic) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.options = options;
            this.selectedOption = selectedOption;
            this.correctAnswer = correctAnswer;
            this.isCorrect = isCorrect;
            this.status = status;
            this.explanation = explanation;
            this.topic = topic;
        }

        public String getQuestionId() { return questionId; }
        public void setQuestionId(String questionId) { this.questionId = questionId; }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public Integer getSelectedOption() { return selectedOption; }
        public void setSelectedOption(Integer selectedOption) { this.selectedOption = selectedOption; }

        public Integer getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(Integer correctAnswer) { this.correctAnswer = correctAnswer; }

        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }

        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
    }
}

