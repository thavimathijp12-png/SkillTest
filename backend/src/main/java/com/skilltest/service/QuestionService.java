package com.skilltest.service;

import com.skilltest.dto.QuestionAdminDto;
import com.skilltest.dto.QuestionResponseDto;
import com.skilltest.exception.BadRequestException;
import com.skilltest.exception.ResourceNotFoundException;
import com.skilltest.model.Category;
import com.skilltest.model.Question;
import com.skilltest.repository.CategoryRepository;
import com.skilltest.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;

    public QuestionService(QuestionRepository questionRepository, CategoryRepository categoryRepository) {
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
    }

    /**
     * Returns questions for taking an assessment.
     * Note: Correct answers and explanations are hidden to prevent client-side cheating.
     */
    public List<QuestionResponseDto> getQuestionsForAssessment(String categoryId, String difficulty) {
        Category category = getCategoryById(categoryId);
        List<Question> questions = questionRepository.findByCategory_IdAndDifficulty(categoryId, difficulty.toLowerCase());

        return questions.stream().map(q -> new QuestionResponseDto(
                q.getId(),
                q.getCategory().getId(),
                q.getCategory().getName(),
                q.getDifficulty(),
                q.getQuestionText(),
                Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()),
                q.getTopic()
        )).collect(Collectors.toList());
    }

    public List<QuestionAdminDto> getAllQuestionsAdmin() {
        return questionRepository.findAll().stream().map(this::toAdminDto).collect(Collectors.toList());
    }

    public QuestionAdminDto getQuestionByIdAdmin(String id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));
        return toAdminDto(q);
    }

    @Transactional
    public QuestionAdminDto createQuestion(QuestionAdminDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Invalid category ID: " + dto.getCategoryId()));

        String id = dto.getId() != null && !dto.getId().trim().isEmpty() ?
                dto.getId() : (dto.getCategoryId() + "_" + dto.getDifficulty() + "_" + UUID.randomUUID().toString().substring(0, 8));

        Question question = new Question(
                id,
                category,
                dto.getDifficulty().toLowerCase(),
                dto.getQuestionText(),
                dto.getOptionA(),
                dto.getOptionB(),
                dto.getOptionC(),
                dto.getOptionD(),
                dto.getCorrectAnswer(),
                dto.getExplanation(),
                dto.getTopic()
        );

        Question saved = questionRepository.save(question);
        category.setTotalQuestions(category.getTotalQuestions() + 1);
        categoryRepository.save(category);

        return toAdminDto(saved);
    }

    @Transactional
    public QuestionAdminDto updateQuestion(String id, QuestionAdminDto dto) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));

        if (!q.getCategory().getId().equals(dto.getCategoryId())) {
            Category newCategory = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new BadRequestException("Invalid category ID: " + dto.getCategoryId()));
            q.setCategory(newCategory);
        }

        q.setDifficulty(dto.getDifficulty().toLowerCase());
        q.setQuestionText(dto.getQuestionText());
        q.setOptionA(dto.getOptionA());
        q.setOptionB(dto.getOptionB());
        q.setOptionC(dto.getOptionC());
        q.setOptionD(dto.getOptionD());
        q.setCorrectAnswer(dto.getCorrectAnswer());
        q.setExplanation(dto.getExplanation());
        q.setTopic(dto.getTopic());

        return toAdminDto(questionRepository.save(q));
    }

    @Transactional
    public void deleteQuestion(String id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + id));
        Category cat = q.getCategory();
        questionRepository.delete(q);
        if (cat.getTotalQuestions() > 0) {
            cat.setTotalQuestions(cat.getTotalQuestions() - 1);
            categoryRepository.save(cat);
        }
    }

    private QuestionAdminDto toAdminDto(Question q) {
        QuestionAdminDto dto = new QuestionAdminDto();
        dto.setId(q.getId());
        dto.setCategoryId(q.getCategory().getId());
        dto.setDifficulty(q.getDifficulty());
        dto.setQuestionText(q.getQuestionText());
        dto.setOptionA(q.getOptionA());
        dto.setOptionB(q.getOptionB());
        dto.setOptionC(q.getOptionC());
        dto.setOptionD(q.getOptionD());
        dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setExplanation(q.getExplanation());
        dto.setTopic(q.getTopic());
        return dto;
    }
}

