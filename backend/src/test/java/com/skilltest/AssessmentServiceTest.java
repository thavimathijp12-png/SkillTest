package com.skilltest;

import com.skilltest.dto.AssessmentResultResponse;
import com.skilltest.dto.AssessmentSubmitRequest;
import com.skilltest.model.Category;
import com.skilltest.model.Question;
import com.skilltest.model.Student;
import com.skilltest.repository.CategoryRepository;
import com.skilltest.repository.QuestionRepository;
import com.skilltest.repository.StudentRepository;
import com.skilltest.service.AssessmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AssessmentServiceTest {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Student testStudent;
    private Category testCategory;
    private Question q1;
    private Question q2;

    @BeforeEach
    void setUp() {
        testCategory = categoryRepository.save(new Category("test_cat", "Test Category", "Description", "🧪", 2));

        testStudent = studentRepository.save(new Student("Test Student", "test." + System.currentTimeMillis() + "@test.com",
                passwordEncoder.encode("pass123"), "STUDENT"));

        q1 = questionRepository.save(new Question("test_q1", testCategory, "easy",
                "What is 2+2?", "1", "2", "3", "4", 3, "2+2=4", "Math Basics"));

        q2 = questionRepository.save(new Question("test_q2", testCategory, "easy",
                "What is capital of France?", "London", "Paris", "Berlin", "Rome", 1, "Paris is capital", "Geography"));
    }

    @Test
    void testAssessmentSubmissionAndScoring() {
        AssessmentSubmitRequest req = new AssessmentSubmitRequest();
        req.setStudentId(testStudent.getId());
        req.setCategoryId("test_cat");
        req.setDifficulty("easy");
        req.setTimeTakenSeconds(45);

        // q1 correct (3), q2 incorrect (0 instead of 1)
        Map<String, Integer> answers = new HashMap<>();
        answers.put("test_q1", 3);
        answers.put("test_q2", 0);
        req.setAnswers(answers);

        AssessmentResultResponse result = assessmentService.submitAssessment(req);

        assertNotNull(result.getId());
        assertEquals(2, result.getTotalQuestions());
        assertEquals(1, result.getCorrectCount());
        assertEquals(1, result.getIncorrectCount());
        assertEquals(0, result.getSkippedCount());
        assertEquals(50, result.getPercentage());
        assertFalse(result.getPassed()); // passing is >= 60%
        assertEquals(2, result.getReview().size());
    }

    @Test
    void testAssessmentPassingScore() {
        AssessmentSubmitRequest req = new AssessmentSubmitRequest();
        req.setStudentId(testStudent.getId());
        req.setCategoryId("test_cat");
        req.setDifficulty("easy");

        // Both correct (100%)
        Map<String, Integer> answers = new HashMap<>();
        answers.put("test_q1", 3);
        answers.put("test_q2", 1);
        req.setAnswers(answers);

        AssessmentResultResponse result = assessmentService.submitAssessment(req);

        assertEquals(2, result.getCorrectCount());
        assertEquals(100, result.getPercentage());
        assertTrue(result.getPassed());
    }
}

