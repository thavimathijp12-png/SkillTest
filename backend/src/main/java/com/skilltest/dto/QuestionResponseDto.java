package com.skilltest.dto;

import java.util.List;

public class QuestionResponseDto {

    private String id;
    private String categoryId;
    private String categoryName;
    private String difficulty;
    private String questionText;
    private List<String> options;
    private String topic;

    public QuestionResponseDto() {}

    public QuestionResponseDto(String id, String categoryId, String categoryName, String difficulty,
                               String questionText, List<String> options, String topic) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.difficulty = difficulty;
        this.questionText = questionText;
        this.options = options;
        this.topic = topic;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}

