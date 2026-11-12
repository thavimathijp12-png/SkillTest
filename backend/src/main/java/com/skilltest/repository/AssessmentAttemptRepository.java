package com.skilltest.repository;

import com.skilltest.model.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, String> {

    List<AssessmentAttempt> findByStudent_IdOrderByCreatedAtDesc(Long studentId);

    List<AssessmentAttempt> findByStudent_IdAndCategory_IdOrderByCreatedAtDesc(Long studentId, String categoryId);

    long countByStudent_Id(Long studentId);

    @Query("SELECT AVG(a.percentage) FROM AssessmentAttempt a WHERE a.student.id = :studentId")
    Double findAverageScoreByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT MAX(a.percentage) FROM AssessmentAttempt a WHERE a.student.id = :studentId")
    Integer findHighestScoreByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT a.student.id AS studentId, a.student.name AS studentName, " +
           "COUNT(a.id) AS attemptsCount, AVG(a.percentage) AS avgPercentage, MAX(a.percentage) AS maxPercentage " +
           "FROM AssessmentAttempt a GROUP BY a.student.id, a.student.name " +
           "ORDER BY avgPercentage DESC, maxPercentage DESC")
    List<LeaderboardProjection> findLeaderboard();

    interface LeaderboardProjection {
        Long getStudentId();
        String getStudentName();
        Long getAttemptsCount();
        Double getAvgPercentage();
        Integer getMaxPercentage();
    }
}

