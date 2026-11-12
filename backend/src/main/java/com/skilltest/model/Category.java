package com.skilltest.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @Column(length = 50)
    private String id; // 'java', 'sql', 'html-css', 'javascript'

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(length = 50)
    private String icon;

    @Column(name = "total_questions")
    private Integer totalQuestions = 0;

    public Category() {}

    public Category(String id, String name, String description, String icon, Integer totalQuestions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.totalQuestions = totalQuestions;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
}

