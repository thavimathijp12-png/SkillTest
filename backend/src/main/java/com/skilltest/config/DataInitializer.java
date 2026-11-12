package com.skilltest.config;

import com.skilltest.model.Category;
import com.skilltest.model.Student;
import com.skilltest.repository.CategoryRepository;
import com.skilltest.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CategoryRepository categoryRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoryRepository categoryRepository,
                           StudentRepository studentRepository,
                           PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure default categories exist
        if (categoryRepository.count() == 0) {
            log.info("Seeding initial categories...");
            categoryRepository.save(new Category("java", "Core Java", "Fundamentals, OOP, Collections, and JVM architecture.", "☕", 30));
            categoryRepository.save(new Category("sql", "SQL & Relational DB", "Queries, Joins, Aggregations, Indexing, and Schema Design.", "🗄️", 30));
            categoryRepository.save(new Category("html_css", "HTML5 & Modern CSS", "Semantic markup, Flexbox, CSS Grid, and responsive UI.", "🎨", 30));
            categoryRepository.save(new Category("javascript", "Modern JavaScript", "ES6+, Async/Await, Closures, DOM, and Event-driven JS.", "⚡", 30));
        }

        // Ensure default demo student exists with valid encoded password
        Student demo = studentRepository.findByEmail("demo@skilltest.edu").orElse(null);
        if (demo == null) {
            log.info("Creating default demo student account (demo@skilltest.edu)...");
            demo = new Student(
                    "Demo Student",
                    "demo@skilltest.edu",
                    passwordEncoder.encode("demo123"),
                    "STUDENT"
            );
            studentRepository.save(demo);
        } else {
            // Re-hash to ensure demo123 always matches
            demo.setPasswordHash(passwordEncoder.encode("demo123"));
            studentRepository.save(demo);
        }
    }
}
