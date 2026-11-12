package com.skilltest.dto;

import java.util.List;
import java.util.Map;

public class PerformanceAnalyticsResponse {

    private Long totalTests;
    private Double averageScore;
    private Integer highestScore;
    private Long passedTests;
    private Long failedTests;
    private String masteryBadge;
    private Map<String, Integer> categoryScores;
    private List<WeakTopicDto> weakTopics;
    private List<QuestionResponseDto> recommendedQuestions;

    public PerformanceAnalyticsResponse() {}

    public Long getTotalTests() { return totalTests; }
    public void setTotalTests(Long totalTests) { this.totalTests = totalTests; }

    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }

    public Integer getHighestScore() { return highestScore; }
    public void setHighestScore(Integer highestScore) { this.highestScore = highestScore; }

    public Long getPassedTests() { return passedTests; }
    public void setPassedTests(Long passedTests) { this.passedTests = passedTests; }

    public Long getFailedTests() { return failedTests; }
    public void setFailedTests(Long failedTests) { this.failedTests = failedTests; }

    public String getMasteryBadge() { return masteryBadge; }
    public void setMasteryBadge(String masteryBadge) { this.masteryBadge = masteryBadge; }

    public Map<String, Integer> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(Map<String, Integer> categoryScores) { this.categoryScores = categoryScores; }

    public List<WeakTopicDto> getWeakTopics() { return weakTopics; }
    public void setWeakTopics(List<WeakTopicDto> weakTopics) { this.weakTopics = weakTopics; }

    public List<QuestionResponseDto> getRecommendedQuestions() { return recommendedQuestions; }
    public void setRecommendedQuestions(List<QuestionResponseDto> recommendedQuestions) { this.recommendedQuestions = recommendedQuestions; }
}

