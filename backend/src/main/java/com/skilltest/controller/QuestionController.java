package com.skilltest.controller;

import com.skilltest.dto.QuestionResponseDto;
import com.skilltest.model.Category;
import com.skilltest.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(questionService.getAllCategories());
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponseDto>> getQuestions(
            @RequestParam String categoryId,
            @RequestParam(defaultValue = "easy") String difficulty) {
        List<QuestionResponseDto> questions = questionService.getQuestionsForAssessment(categoryId, difficulty);
        return ResponseEntity.ok(questions);
    }
}

