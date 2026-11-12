package com.skilltest.controller;

import com.skilltest.dto.PerformanceAnalyticsResponse;
import com.skilltest.dto.WeakTopicDto;
import com.skilltest.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<PerformanceAnalyticsResponse> getAnalytics(@RequestParam Long studentId) {
        return ResponseEntity.ok(analyticsService.getAnalytics(studentId));
    }

    @GetMapping("/weak-topics")
    public ResponseEntity<List<WeakTopicDto>> getWeakTopics(@RequestParam Long studentId) {
        return ResponseEntity.ok(analyticsService.detectWeakTopics(studentId));
    }
}

