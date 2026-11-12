package com.skilltest.repository;

import com.skilltest.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByStudent_IdOrderByCreatedAtDesc(Long studentId);

    Optional<Bookmark> findByStudent_IdAndQuestion_Id(Long studentId, String questionId);

    boolean existsByStudent_IdAndQuestion_Id(Long studentId, String questionId);

    void deleteByStudent_IdAndQuestion_Id(Long studentId, String questionId);
}

