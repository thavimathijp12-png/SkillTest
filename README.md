# SkillTest – Smart Skill Assessment Platform (Full Stack Java Application)

**SkillTest** is a complete Full Stack assessment platform featuring a modern **HTML5, CSS3, and Vanilla JavaScript** frontend powered by a robust **Java 25 LTS and Spring Boot** enterprise backend with **Spring Data JPA** and **MySQL**.

---

## 🌟 Full Stack Architecture

```mermaid
flowchart TD
    subgraph Frontend["Frontend Client (HTML5 / CSS3 / Vanilla JS)"]
        F1["Home (index.html)"]
        F2["Login / Register (pages/login.html)"]
        F3["Dashboard (pages/dashboard.html)"]
        F4["Assessment Engine (pages/test.html)"]
        F5["Results & Reviews (pages/result.html)"]
        API["API Service Client (js/api.js)"]
        F1 & F2 & F3 & F4 & F5 <--> API
    end

    subgraph Backend["Backend Application (Java 25 + Spring Boot 3)"]
        direction TB
        C1["AuthController (/api/auth)"]
        C2["QuestionController (/api/questions)"]
        C3["AssessmentController (/api/assessments)"]
        C4["AnalyticsController (/api/analytics)"]
        C5["LeaderboardController (/api/leaderboard)"]
        C6["AdminQuestionController (/api/admin/questions)"]
        C7["BookmarkController (/api/bookmarks)"]

        SEC["Security & BCrypt Password Encryption"]
        SRV["Service Layer & Score Engine"]
        REPO["Spring Data JPA Repositories"]

        C1 & C2 & C3 & C4 & C5 & C6 & C7 --> SEC --> SRV --> REPO
    end

    subgraph Database["Relational Database (MySQL 8.0+)"]
        T1["students"]
        T2["categories"]
        T3["questions"]
        T4["assessment_attempts"]
        T5["student_answers"]
        T6["bookmarks"]
        REPO <--> T1 & T2 & T3 & T4 & T5 & T6
    end

    API <-->|REST API + CORS (JSON)| Backend
```

---

## 🚀 Key Features

1. **Enterprise Student Authentication**:
   - Secure student registration and login with input validation (`jakarta.validation`).
   - Secure **BCrypt password hashing**; passwords are never stored in plain text.
2. **Server-Side Assessment & Scoring**:
   - Fetches questions filtered by category (`java`, `sql`, `html_css`, `javascript`) and difficulty (`easy`, `medium`, `hard`).
   - Correct answers and explanations are protected and kept server-side during the test.
   - Calculates exact scores, percentages, and pass/fail status directly on the backend.
3. **Relational MySQL Data Persistence**:
   - 6 structured database tables: `students`, `categories`, `questions`, `assessment_attempts`, `student_answers`, and `bookmarks`.
   - Complete assessment attempts and every individual student answer stored for deep analytics.
4. **Weak Topic Detection & AI Practice Recommendations**:
   - Automatically tracks incorrect answers grouped by technical topics (e.g., *OOP Principles*, *Multithreading*, *SQL Joins*, *Closures*).
   - Surfaces targeted weak topics and recommends practice questions.
5. **Real-time Leaderboard**:
   - Computes student performance rankings based on assessment averages, completion counts, and highest scores.
6. **Admin Question Management**:
   - Full REST CRUD APIs (`GET`, `POST`, `PUT`, `DELETE`) to add, update, and manage questions in the question bank.
7. **Resilient Dual Mode**:
   - Seamlessly talks to the Spring Boot REST API when online.
   - Gracefully falls back to local storage if the backend is temporarily offline, ensuring zero downtime for students.

---

## 📂 Project Structure

```text
SkillTest/
├── index.html                          # Landing page
├── README.md                           # Documentation
├── server.js                           # Frontend development server
├── assets/images/                      # SVG branding, logos & favicon
├── css/                                # Modular styles & dark/light theme
├── js/                                 # Frontend controllers
│   ├── api.js                          # REST API client connecting to Spring Boot
│   ├── app.js                          # Navigation, theme, & backend connection badge
│   ├── auth.js                         # Login & Registration controller
│   ├── dashboard.js                    # Analytics, charts, & weak topic display
│   ├── questions.js                    # Question bank dataset
│   ├── result.js                       # Result display & circular score meter
│   ├── storage.js                      # Local storage manager
│   └── test.js                         # Assessment test engine
│
└── backend/                            # Java 25 LTS Spring Boot Backend
    ├── pom.xml                         # Maven dependencies & build configuration
    ├── mvnw.cmd / mvnw                 # Maven Wrapper scripts
    ├── tools/                          # Bundled Apache Maven 3.9.9
    ├── src/main/java/com/skilltest/
    │   ├── SkillTestApplication.java   # Spring Boot Application Entry Point
    │   ├── config/                     # CORS, Security (BCrypt), Data Initializer
    │   ├── controller/                 # REST Controllers (Auth, Question, Assessment, Analytics, Leaderboard, Admin, Bookmark)
    │   ├── dto/                        # Data Transfer Objects with validation
    │   ├── exception/                  # Global @RestControllerAdvice exception handling
    │   ├── model/                      # JPA Entities (Student, Category, Question, AssessmentAttempt, StudentAnswer, Bookmark)
    │   ├── repository/                 # Spring Data JPA Repositories
    │   └── service/                    # Business Logic, Scoring Engine & Analytics
    └── src/main/resources/
        ├── application.properties      # MySQL configuration with environment variables
        ├── application-dev.properties  # Standalone persistent embedded profile
        ├── application-test.properties # Fast in-memory H2 test profile
        ├── schema.sql                  # MySQL table creation DDL
        └── data.sql                    # Seed data (120 curated questions & categories)
```

---

## 💻 How to Run the Backend

### Prerequisites
- **JDK 25 LTS**
- **MySQL 8.0+** (or use the built-in standalone `dev` profile)

### 1. Database Setup (MySQL)
Create the database in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS skilltest_db;
```

Run schema and seed data (optional, Spring Boot will also auto-initialize):
```bash
mysql -u root -p skilltest_db < backend/src/main/resources/schema.sql
mysql -u root -p skilltest_db < backend/src/main/resources/data.sql
```

Set your database credentials via environment variables (or rely on defaults in `application.properties`):
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/skilltest_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

### 2. Run Automated Maven Tests
From the `backend/` folder:
```powershell
cd backend
.\mvnw.cmd test
```
*All 7 automated tests execute against an in-memory database with 0 failures.*

### 3. Start the Spring Boot Backend

**Option A: With MySQL (Standard Mode)**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Option B: Standalone Persistent Mode (No MySQL setup needed)**
```powershell
cd backend
java "-Dspring.profiles.active=dev" -jar target\skilltest-backend-1.0.0.jar
```
The backend starts at: **`http://localhost:8080`**

---

## 🌐 How to Run the Frontend

Start the frontend development server:
```powershell
node server.js
```
Open **`http://localhost:3000/`** in your browser.

The top navigation bar will display:
- **`● Java Backend`** (Green): Connected to live Spring Boot REST API.
- **`○ Demo Mode`** (Amber): Running locally with graceful LocalStorage fallback.

---

## 🧪 Terminal API Testing (curl & PowerShell)

### 1. Categories API
```powershell
curl.exe -s http://localhost:8080/api/questions/categories
```

### 2. Student Registration
```powershell
$body = @{ name = "Sarah Connor"; email = "sarah@example.com"; password = "password123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -ContentType "application/json" -Body $body
```

### 3. Student Login (BCrypt Validation)
```powershell
$body = @{ email = "demo@skilltest.edu"; password = "demo123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -ContentType "application/json" -Body $body
```

### 4. Fetch Questions for Assessment (Hidden Correct Answers)
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/questions?categoryId=java&difficulty=easy"
```

### 5. Submit Assessment & Calculate Score on Backend
```powershell
$submit = @{
    studentId = 1
    categoryId = "java"
    difficulty = "easy"
    timeTakenSeconds = 180
    answers = @{
        "java_easy_1" = 0
        "java_easy_2" = 1
        "java_easy_3" = 1
    }
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/submit" -Method Post -ContentType "application/json" -Body $submit
```

### 6. Student Assessment History
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/assessments/history?studentId=1"
```

### 7. Performance Analytics & Weak Topic Detection
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/analytics?studentId=1"
```

### 8. Leaderboard Rankings
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard"
```

### 9. Admin Question Management (Create New Question)
```powershell
$adminQ = @{
    id = "custom_java_1"
    categoryId = "java"
    difficulty = "medium"
    questionText = "Which method of Object class is used to create a shallow copy?"
    optionA = "clone()"
    optionB = "copy()"
    optionC = "duplicate()"
    optionD = "newInstance()"
    correctAnswer = 0
    explanation = "The clone() method creates a field-by-field shallow copy of an object."
    topic = "Object-Oriented Programming"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/admin/questions" -Method Post -ContentType "application/json" -Body $adminQ
```

### 10. Bookmarks
```powershell
$bookmark = @{ studentId = 1; questionId = "java_easy_1"; notes = "Important Java history" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/api/bookmarks" -Method Post -ContentType "application/json" -Body $bookmark
```
