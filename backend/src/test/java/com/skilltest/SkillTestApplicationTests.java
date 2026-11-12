package com.skilltest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SkillTestApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext loads cleanly with all beans
    }
}

