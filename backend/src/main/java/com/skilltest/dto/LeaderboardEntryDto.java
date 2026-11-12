package com.skilltest.dto;

public class LeaderboardEntryDto {

    private Integer rank;
    private Long studentId;
    private String studentName;
    private Long testsCompleted;
    private Double averageScore;
    private Integer highestScore;
    private String badge;

    public LeaderboardEntryDto() {}

    public LeaderboardEntryDto(Integer rank, Long studentId, String studentName,
                               Long testsCompleted, Double averageScore, Integer highestScore, String badge) {
        this.rank = rank;
        this.studentId = studentId;
        this.studentName = studentName;
        this.testsCompleted = testsCompleted;
        this.averageScore = averageScore;
        this.highestScore = highestScore;
        this.badge = badge;
    }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Long getTestsCompleted() { return testsCompleted; }
    public void setTestsCompleted(Long testsCompleted) { this.testsCompleted = testsCompleted; }

    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }

    public Integer getHighestScore() { return highestScore; }
    public void setHighestScore(Integer highestScore) { this.highestScore = highestScore; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}

