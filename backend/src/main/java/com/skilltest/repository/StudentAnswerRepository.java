package com.skilltest.repository;

import com.skilltest.model.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {

    List<StudentAnswer> findByAttempt_Id(String attemptId);

    @Query("SELECT sa FROM StudentAnswer sa WHERE sa.attempt.student.id = :studentId")
    List<StudentAnswer> findAllByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT sa FROM StudentAnswer sa WHERE sa.attempt.student.id = :studentId AND sa.isCorrect = false")
    List<StudentAnswer> findIncorrectAnswersByStudentId(@Param("studentId") Long studentId);
}

