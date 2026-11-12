package com.skilltest.service;

import com.skilltest.dto.PerformanceAnalyticsResponse;
import com.skilltest.dto.QuestionResponseDto;
import com.skilltest.dto.WeakTopicDto;
import com.skilltest.model.AssessmentAttempt;
import com.skilltest.model.Question;
import com.skilltest.model.StudentAnswer;
import com.skilltest.repository.AssessmentAttemptRepository;
import com.skilltest.repository.QuestionRepository;
import com.skilltest.repository.StudentAnswerRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AssessmentAttemptRepository attemptRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final QuestionRepository questionRepository;

    public AnalyticsService(AssessmentAttemptRepository attemptRepository,
                            StudentAnswerRepository studentAnswerRepository,
                            QuestionRepository questionRepository) {
        this.attemptRepository = attemptRepository;
        this.studentAnswerRepository = studentAnswerRepository;
        this.questionRepository = questionRepository;
    }

    public PerformanceAnalyticsResponse getAnalytics(Long studentId) {
        PerformanceAnalyticsResponse res = new PerformanceAnalyticsResponse();

        List<AssessmentAttempt> attempts = attemptRepository.findByStudent_IdOrderByCreatedAtDesc(studentId);
        long totalTests = attempts.size();
        res.setTotalTests(totalTests);

        if (totalTests == 0) {
            res.setAverageScore(0.0);
            res.setHighestScore(0);
            res.setPassedTests(0L);
            res.setFailedTests(0L);
            res.setMasteryBadge("Beginner");
            res.setCategoryScores(Collections.emptyMap());
            res.setWeakTopics(Collections.emptyList());
            res.setRecommendedQuestions(Collections.emptyList());
            return res;
        }

        double avg = attempts.stream().mapToInt(AssessmentAttempt::getPercentage).average().orElse(0.0);
        int highest = attempts.stream().mapToInt(AssessmentAttempt::getPercentage).max().orElse(0);
        long passed = attempts.stream().filter(AssessmentAttempt::getPassed).count();
        long failed = totalTests - passed;

        res.setAverageScore(Math.round(avg * 10.0) / 10.0);
        res.setHighestScore(highest);
        res.setPassedTests(passed);
        res.setFailedTests(failed);

        // Assign mastery badge
        if (avg >= 85) res.setMasteryBadge("Master");
        else if (avg >= 70) res.setMasteryBadge("Proficient");
        else if (avg >= 50) res.setMasteryBadge("Intermediate");
        else res.setMasteryBadge("Beginner");

        // Category score breakdown
        Map<String, List<Integer>> categoryMap = new HashMap<>();
        for (AssessmentAttempt a : attempts) {
            categoryMap.computeIfAbsent(a.getCategory().getName(), k -> new ArrayList<>()).add(a.getPercentage());
        }
        Map<String, Integer> categoryScores = new HashMap<>();
        categoryMap.forEach((cat, scores) -> {
            double cAvg = scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            categoryScores.put(cat, (int) Math.round(cAvg));
        });
        res.setCategoryScores(categoryScores);

        // Weak topic detection
        List<WeakTopicDto> weakTopics = detectWeakTopics(studentId);
        res.setWeakTopics(weakTopics);

        // Recommend questions based on weak topics
        List<QuestionResponseDto> recommendations = recommendQuestions(weakTopics);
        res.setRecommendedQuestions(recommendations);

        return res;
    }

    public List<WeakTopicDto> detectWeakTopics(Long studentId) {
        List<StudentAnswer> allAnswers = studentAnswerRepository.findAllByStudentId(studentId);

        // Map topic -> [correctCount, totalCount, categoryName, categoryId]
        Map<String, int[]> topicStats = new HashMap<>();
        Map<String, String> topicCategoryName = new HashMap<>();
        Map<String, String> topicCategoryId = new HashMap<>();

        for (StudentAnswer sa : allAnswers) {
            Question q = sa.getQuestion();
            String topic = q.getTopic() != null ? q.getTopic() : "General " + q.getCategory().getName();
            topicStats.putIfAbsent(topic, new int[]{0, 0}); // [correct, total]
            topicStats.get(topic)[1]++;
            if (Boolean.TRUE.equals(sa.getIsCorrect())) {
                topicStats.get(topic)[0]++;
            }
            topicCategoryName.putIfAbsent(topic, q.getCategory().getName());
            topicCategoryId.putIfAbsent(topic, q.getCategory().getId());
        }

        List<WeakTopicDto> weakList = new ArrayList<>();
        topicStats.forEach((topic, counts) -> {
            int correct = counts[0];
            int total = counts[1];
            int incorrect = total - correct;
            int accuracy = total > 0 ? Math.round(((float) correct / total) * 100) : 0;

            // Flag as weak if accuracy < 70% or more than 1 incorrect answer
            if (accuracy < 70 || incorrect >= 2) {
                String rec = "Review fundamentals in " + topic + " and practice medium/hard problems.";
                weakList.add(new WeakTopicDto(
                        topic,
                        topicCategoryId.get(topic),
                        topicCategoryName.get(topic),
                        incorrect,
                        total,
                        accuracy,
                        rec
                ));
            }
        });

        // Sort by lowest accuracy first, then by most incorrect answers
        weakList.sort(Comparator.comparingInt(WeakTopicDto::getAccuracyPercentage)
                .thenComparing(Comparator.comparingInt(WeakTopicDto::getIncorrectCount).reversed()));

        return weakList;
    }

    private List<QuestionResponseDto> recommendQuestions(List<WeakTopicDto> weakTopics) {
        if (weakTopics.isEmpty()) {
            return Collections.emptyList();
        }

        List<QuestionResponseDto> recommended = new ArrayList<>();
        Set<String> addedIds = new HashSet<>();

        for (WeakTopicDto wt : weakTopics) {
            List<Question> matching = questionRepository.findByTopic(wt.getTopic());
            for (Question q : matching) {
                if (addedIds.add(q.getId())) {
                    recommended.add(new QuestionResponseDto(
                            q.getId(),
                            q.getCategory().getId(),
                            q.getCategory().getName(),
                            q.getDifficulty(),
                            q.getQuestionText(),
                            Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()),
                            q.getTopic()
                    ));
                }
                if (recommended.size() >= 5) break;
            }
            if (recommended.size() >= 5) break;
        }

        return recommended;
    }
}

