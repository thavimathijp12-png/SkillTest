package com.skilltest.repository;

import com.skilltest.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {

    List<Question> findByCategory_IdAndDifficulty(String categoryId, String difficulty);

    List<Question> findByCategory_Id(String categoryId);

    List<Question> findByDifficulty(String difficulty);

    List<Question> findByTopic(String topic);

    long countByCategory_Id(String categoryId);

    @Query("SELECT DISTINCT q.topic FROM Question q WHERE q.category.id = :categoryId AND q.topic IS NOT NULL")
    List<String> findDistinctTopicsByCategory(@Param("categoryId") String categoryId);
}

