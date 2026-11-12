package com.skilltest.dto;

public class WeakTopicDto {

    private String topic;
    private String categoryId;
    private String categoryName;
    private Integer incorrectCount;
    private Integer totalEncountered;
    private Integer accuracyPercentage;
    private String recommendation;

    public WeakTopicDto() {}

    public WeakTopicDto(String topic, String categoryId, String categoryName,
                        Integer incorrectCount, Integer totalEncountered,
                        Integer accuracyPercentage, String recommendation) {
        this.topic = topic;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.incorrectCount = incorrectCount;
        this.totalEncountered = totalEncountered;
        this.accuracyPercentage = accuracyPercentage;
        this.recommendation = recommendation;
    }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getIncorrectCount() { return incorrectCount; }
    public void setIncorrectCount(Integer incorrectCount) { this.incorrectCount = incorrectCount; }

    public Integer getTotalEncountered() { return totalEncountered; }
    public void setTotalEncountered(Integer totalEncountered) { this.totalEncountered = totalEncountered; }

    public Integer getAccuracyPercentage() { return accuracyPercentage; }
    public void setAccuracyPercentage(Integer accuracyPercentage) { this.accuracyPercentage = accuracyPercentage; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}

