package com.skilltest.service;

import com.skilltest.dto.AssessmentResultResponse;
import com.skilltest.dto.AssessmentResultResponse.QuestionReviewDto;
import com.skilltest.dto.AssessmentSubmitRequest;
import com.skilltest.exception.BadRequestException;
import com.skilltest.exception.ResourceNotFoundException;
import com.skilltest.model.*;
import com.skilltest.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentAttemptRepository attemptRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;
    private final StudentRepository studentRepository;

    public AssessmentService(AssessmentAttemptRepository attemptRepository,
                             StudentAnswerRepository studentAnswerRepository,
                             QuestionRepository questionRepository,
                             CategoryRepository categoryRepository,
                             StudentRepository studentRepository) {
        this.attemptRepository = attemptRepository;
        this.studentAnswerRepository = studentAnswerRepository;
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public AssessmentResultResponse submitAssessment(AssessmentSubmitRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Category not found: " + req.getCategoryId()));

        // Resolve student (if studentId provided, use it; otherwise use default demo student)
        Student student = null;
        if (req.getStudentId() != null) {
            student = studentRepository.findById(req.getStudentId()).orElse(null);
        }
        if (student == null) {
            student = studentRepository.findByEmail("demo@skilltest.edu")
                    .orElseGet(() -> studentRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new BadRequestException("No registered student found. Please register or login first.")));
        }

        List<Question> questions = questionRepository.findByCategory_IdAndDifficulty(
                req.getCategoryId(), req.getDifficulty().toLowerCase()
        );

        if (questions.isEmpty()) {
            throw new BadRequestException("No questions found for category '" + req.getCategoryId() +
                    "' and difficulty '" + req.getDifficulty() + "'");
        }

        Map<String, Integer> answers = req.getAnswers() != null ? req.getAnswers() : Collections.emptyMap();

        int correctCount = 0;
        int incorrectCount = 0;
        int skippedCount = 0;

        String attemptId = "test_" + System.currentTimeMillis();
        List<QuestionReviewDto> reviews = new ArrayList<>();
        List<StudentAnswer> studentAnswersToSave = new ArrayList<>();

        for (Question q : questions) {
            Integer selected = answers.get(q.getId());
            boolean isCorrect = false;
            String status;

            if (selected == null || selected < 0) {
                skippedCount++;
                status = "skipped";
            } else if (selected.equals(q.getCorrectAnswer())) {
                correctCount++;
                isCorrect = true;
                status = "correct";
            } else {
                incorrectCount++;
                status = "incorrect";
            }

            reviews.add(new QuestionReviewDto(
                    q.getId(),
                    q.getQuestionText(),
                    Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()),
                    selected,
                    q.getCorrectAnswer(),
                    isCorrect,
                    status,
                    q.getExplanation(),
                    q.getTopic()
            ));
        }

        int totalQuestions = questions.size();
        int score = correctCount;
        int percentage = Math.round(((float) score / totalQuestions) * 100);
        boolean passed = percentage >= 60;

        AssessmentAttempt attempt = new AssessmentAttempt(
                attemptId,
                student,
                category,
                req.getDifficulty().toLowerCase(),
                score,
                totalQuestions,
                percentage,
                correctCount,
                incorrectCount,
                skippedCount,
                passed,
                req.getTimeTakenSeconds() != null ? req.getTimeTakenSeconds() : 0
        );

        attempt = attemptRepository.save(attempt);

        // Save student answers
        for (Question q : questions) {
            Integer selected = answers.get(q.getId());
            boolean isCorrect = selected != null && selected.equals(q.getCorrectAnswer());
            StudentAnswer sa = new StudentAnswer(attempt, q, selected, isCorrect);
            studentAnswersToSave.add(sa);
        }
        studentAnswerRepository.saveAll(studentAnswersToSave);

        // Build Response
        AssessmentResultResponse response = new AssessmentResultResponse();
        response.setId(attempt.getId());
        response.setCategoryId(category.getId());
        response.setCategoryName(category.getName());
        response.setDifficulty(attempt.getDifficulty());
        response.setScore(score);
        response.setTotalQuestions(totalQuestions);
        response.setPercentage(percentage);
        response.setCorrectCount(correctCount);
        response.setIncorrectCount(incorrectCount);
        response.setSkippedCount(skippedCount);
        response.setPassed(passed);
        response.setTimeTakenSeconds(attempt.getTimeTakenSeconds());
        response.setCreatedAt(attempt.getCreatedAt());
        response.setReview(reviews);

        return response;
    }

    public List<AssessmentResultResponse> getStudentHistory(Long studentId) {
        List<AssessmentAttempt> attempts = attemptRepository.findByStudent_IdOrderByCreatedAtDesc(studentId);
        return attempts.stream().map(this::toResponseWithoutReviews).collect(Collectors.toList());
    }

    public AssessmentResultResponse getAttemptDetails(String attemptId) {
        AssessmentAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment attempt not found: " + attemptId));

        List<StudentAnswer> answers = studentAnswerRepository.findByAttempt_Id(attemptId);
        List<QuestionReviewDto> reviews = answers.stream().map(sa -> {
            Question q = sa.getQuestion();
            String status = sa.getSelectedOption() == null ? "skipped" : (sa.getIsCorrect() ? "correct" : "incorrect");
            return new QuestionReviewDto(
                    q.getId(),
                    q.getQuestionText(),
                    Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()),
                    sa.getSelectedOption(),
                    q.getCorrectAnswer(),
                    sa.getIsCorrect(),
                    status,
                    q.getExplanation(),
                    q.getTopic()
            );
        }).collect(Collectors.toList());

        AssessmentResultResponse response = toResponseWithoutReviews(attempt);
        response.setReview(reviews);
        return response;
    }

    private AssessmentResultResponse toResponseWithoutReviews(AssessmentAttempt a) {
        AssessmentResultResponse res = new AssessmentResultResponse();
        res.setId(a.getId());
        res.setCategoryId(a.getCategory().getId());
        res.setCategoryName(a.getCategory().getName());
        res.setDifficulty(a.getDifficulty());
        res.setScore(a.getScore());
        res.setTotalQuestions(a.getTotalQuestions());
        res.setPercentage(a.getPercentage());
        res.setCorrectCount(a.getCorrectCount());
        res.setIncorrectCount(a.getIncorrectCount());
        res.setSkippedCount(a.getSkippedCount());
        res.setPassed(a.getPassed());
        res.setTimeTakenSeconds(a.getTimeTakenSeconds());
        res.setCreatedAt(a.getCreatedAt());
        return res;
    }
}

