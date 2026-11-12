package com.skilltest;

import com.skilltest.dto.AssessmentSubmitRequest;
import com.skilltest.dto.PerformanceAnalyticsResponse;
import com.skilltest.dto.WeakTopicDto;
import com.skilltest.model.Category;
import com.skilltest.model.Question;
import com.skilltest.model.Student;
import com.skilltest.repository.CategoryRepository;
import com.skilltest.repository.QuestionRepository;
import com.skilltest.repository.StudentRepository;
import com.skilltest.service.AnalyticsService;
import com.skilltest.service.AssessmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AnalyticsServiceTest {

    @Autowired
    private AnalyticsService analyticsService;

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

    @BeforeEach
    void setUp() {
        testCategory = categoryRepository.save(new Category("analytics_cat", "Analytics Test", "Desc", "📊", 2));

        testStudent = studentRepository.save(new Student("Analytics Student", "analytics." + System.currentTimeMillis() + "@test.com",
                passwordEncoder.encode("pass123"), "STUDENT"));

        questionRepository.save(new Question("an_q1", testCategory, "easy",
                "Q1 Text", "A", "B", "C", "D", 0, "Exp 1", "Multithreading"));

        questionRepository.save(new Question("an_q2", testCategory, "easy",
                "Q2 Text", "A", "B", "C", "D", 1, "Exp 2", "Multithreading"));
    }

    @Test
    void testWeakTopicDetection() {
        AssessmentSubmitRequest req = new AssessmentSubmitRequest();
        req.setStudentId(testStudent.getId());
        req.setCategoryId("analytics_cat");
        req.setDifficulty("easy");

        // Both incorrect on "Multithreading"
        Map<String, Integer> answers = new HashMap<>();
        answers.put("an_q1", 3); // wrong (correct 0)
        answers.put("an_q2", 3); // wrong (correct 1)
        req.setAnswers(answers);

        assessmentService.submitAssessment(req);

        List<WeakTopicDto> weakTopics = analyticsService.detectWeakTopics(testStudent.getId());
        assertFalse(weakTopics.isEmpty());
        assertEquals("Multithreading", weakTopics.get(0).getTopic());
        assertEquals(0, weakTopics.get(0).getAccuracyPercentage());

        PerformanceAnalyticsResponse analytics = analyticsService.getAnalytics(testStudent.getId());
        assertEquals(1, analytics.getTotalTests());
        assertEquals(0.0, analytics.getAverageScore());
        assertEquals(1, analytics.getFailedTests());
    }
}

