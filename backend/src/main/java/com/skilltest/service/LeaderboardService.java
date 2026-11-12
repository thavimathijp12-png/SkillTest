package com.skilltest.service;

import com.skilltest.dto.LeaderboardEntryDto;
import com.skilltest.repository.AssessmentAttemptRepository;
import com.skilltest.repository.AssessmentAttemptRepository.LeaderboardProjection;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final AssessmentAttemptRepository attemptRepository;

    public LeaderboardService(AssessmentAttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public List<LeaderboardEntryDto> getLeaderboard() {
        List<LeaderboardProjection> rows = attemptRepository.findLeaderboard();
        List<LeaderboardEntryDto> list = new ArrayList<>();

        int rank = 1;
        for (LeaderboardProjection p : rows) {
            double avg = p.getAvgPercentage() != null ? Math.round(p.getAvgPercentage() * 10.0) / 10.0 : 0.0;
            String badge = avg >= 85 ? "Master" : (avg >= 70 ? "Proficient" : (avg >= 50 ? "Intermediate" : "Beginner"));

            list.add(new LeaderboardEntryDto(
                    rank++,
                    p.getStudentId(),
                    p.getStudentName(),
                    p.getAttemptsCount(),
                    avg,
                    p.getMaxPercentage(),
                    badge
            ));
        }

        return list;
    }
}

