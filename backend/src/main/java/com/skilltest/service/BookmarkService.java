package com.skilltest.service;

import com.skilltest.exception.BadRequestException;
import com.skilltest.exception.ResourceNotFoundException;
import com.skilltest.model.Bookmark;
import com.skilltest.model.Question;
import com.skilltest.model.Student;
import com.skilltest.repository.BookmarkRepository;
import com.skilltest.repository.QuestionRepository;
import com.skilltest.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final StudentRepository studentRepository;
    private final QuestionRepository questionRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository,
                           StudentRepository studentRepository,
                           QuestionRepository questionRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.studentRepository = studentRepository;
        this.questionRepository = questionRepository;
    }

    public List<Bookmark> getBookmarks(Long studentId) {
        return bookmarkRepository.findByStudent_IdOrderByCreatedAtDesc(studentId);
    }

    @Transactional
    public Bookmark addBookmark(Long studentId, String questionId, String notes) {
        if (bookmarkRepository.existsByStudent_IdAndQuestion_Id(studentId, questionId)) {
            throw new BadRequestException("Question already bookmarked");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + questionId));

        Bookmark bookmark = new Bookmark(student, question, notes);
        return bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(Long studentId, String questionId) {
        bookmarkRepository.deleteByStudent_IdAndQuestion_Id(studentId, questionId);
    }
}

