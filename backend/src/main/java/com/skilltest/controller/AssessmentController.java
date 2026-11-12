package com.skilltest.controller;

import com.skilltest.dto.AssessmentResultResponse;
import com.skilltest.dto.AssessmentSubmitRequest;
import com.skilltest.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/submit")
    public ResponseEntity<AssessmentResultResponse> submitAssessment(@Valid @RequestBody AssessmentSubmitRequest req) {
        AssessmentResultResponse result = assessmentService.submitAssessment(req);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AssessmentResultResponse>> getHistory(@RequestParam Long studentId) {
        List<AssessmentResultResponse> history = assessmentService.getStudentHistory(studentId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{attemptId}")
    public ResponseEntity<AssessmentResultResponse> getAttemptDetails(@PathVariable String attemptId) {
        AssessmentResultResponse details = assessmentService.getAttemptDetails(attemptId);
        return ResponseEntity.ok(details);
    }
}

