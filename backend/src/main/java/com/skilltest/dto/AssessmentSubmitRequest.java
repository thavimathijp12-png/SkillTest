package com.skilltest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class AssessmentSubmitRequest {

    private Long studentId;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotNull(message = "Answers map is required")
    private Map<String, Integer> answers; // questionId -> selectedOption (0..3)

    private Integer timeTakenSeconds = 0;

    public AssessmentSubmitRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Map<String, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<String, Integer> answers) { this.answers = answers; }

    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
}

