package com.skilltest.controller;

import com.skilltest.dto.QuestionAdminDto;
import com.skilltest.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/questions")
public class AdminQuestionController {

    private final QuestionService questionService;

    public AdminQuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<List<QuestionAdminDto>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestionsAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionAdminDto> getQuestionById(@PathVariable String id) {
        return ResponseEntity.ok(questionService.getQuestionByIdAdmin(id));
    }

    @PostMapping
    public ResponseEntity<QuestionAdminDto> createQuestion(@Valid @RequestBody QuestionAdminDto dto) {
        QuestionAdminDto created = questionService.createQuestion(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionAdminDto> updateQuestion(@PathVariable String id, @Valid @RequestBody QuestionAdminDto dto) {
        QuestionAdminDto updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteQuestion(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Question " + id + " deleted successfully"));
    }
}

