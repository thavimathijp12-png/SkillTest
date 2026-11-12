/**
 * SkillTest - Assessment Engine
 * Manages test timing, question rendering, navigation, state preservation,
 * question flagging, difficulty selection, and score computation.
 */

(function () {
    let currentCategory = null;
    let currentDifficulty = "easy";
    let questions = [];
    let currentIndex = 0;
    let userAnswers = {}; // { [questionIndex]: selectedOptionIndex }
    let flaggedQuestions = {}; // { [questionIndex]: boolean }
    let timerInterval = null;
    let totalSeconds = 600;
    let remainingSeconds = 600;
    let testSubmitted = false;

    document.addEventListener("DOMContentLoaded", () => {
        initTest();
    });

    function initTest() {
        const urlParams = new URLSearchParams(window.location.search);
        let catParam = urlParams.get("category");
        let diffParam = (urlParams.get("difficulty") || "easy").toLowerCase();

        if (catParam === "html-css") {
            catParam = "html_css";
        }

        if (!catParam || !window.TEST_CATEGORIES[catParam]) {
            catParam = "java";
        }

        if (!["easy", "medium", "hard"].includes(diffParam)) {
            diffParam = "easy";
        }

        currentCategory = window.TEST_CATEGORIES[catParam];
        currentDifficulty = diffParam;

        // Fetch questions for selected difficulty level
        if (typeof window.getCategoryQuestions === "function") {
            questions = window.getCategoryQuestions(catParam, currentDifficulty);
        } else if (currentCategory.difficulties && currentCategory.difficulties[currentDifficulty]) {
            questions = currentCategory.difficulties[currentDifficulty];
        } else {
            questions = currentCategory.questions || [];
        }

        // Configure timer duration based on difficulty
        const durationMap = {
            easy: 10 * 60,   // 10 minutes
            medium: 8 * 60,  // 8 minutes
            hard: 6 * 60     // 6 minutes
        };

        totalSeconds = durationMap[currentDifficulty] || 600;
        remainingSeconds = totalSeconds;

        // Update top bar info
        updateTopBarInfo();

        // Build question palette
        renderQuestionPalette();

        // Render first question
        renderQuestion(0);

        // Start countdown timer
        startTimer();

        // Setup event handlers & keyboard navigation
        setupControls();
    }

    function updateTopBarInfo() {
        const categoryBadge = document.getElementById("test-category-badge");
        const categoryTitle = document.getElementById("test-category-title");
        const difficultyBadge = document.getElementById("test-difficulty-badge");

        if (categoryBadge) categoryBadge.textContent = currentCategory.title;
        if (categoryTitle) categoryTitle.textContent = `${currentCategory.title} Assessment`;

        if (difficultyBadge) {
            const diffConfig = {
                easy: { label: "Easy Level", class: "badge-easy" },
                medium: { label: "Medium Level", class: "badge-medium" },
                hard: { label: "Hard Level", class: "badge-hard" }
            };
            const d = diffConfig[currentDifficulty] || diffConfig.easy;
            difficultyBadge.textContent = d.label;
            difficultyBadge.className = `badge ${d.class}`;
        }
    }

    function startTimer() {
        const timerDisplay = document.getElementById("timer-display");
        const timerContainer = document.getElementById("timer-container");
        const warningBanner = document.getElementById("timer-warning-banner");

        function tick() {
            if (timerDisplay) {
                timerDisplay.textContent = formatTime(remainingSeconds);
            }

            // Visual warning when under 60 seconds
            if (remainingSeconds <= 60) {
                if (timerContainer) timerContainer.classList.add("timer-urgent");
                if (warningBanner) warningBanner.style.display = "block";
            } else {
                if (timerContainer) timerContainer.classList.remove("timer-urgent");
                if (warningBanner) warningBanner.style.display = "none";
            }

            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                showToast("Time is up! Submitting your assessment automatically...", "warning");
                setTimeout(() => {
                    submitAssessment(true);
                }, 800);
                return;
            }

            remainingSeconds--;
        }

        tick();
        timerInterval = setInterval(tick, 1000);
    }

    function renderQuestionPalette() {
        const paletteContainer = document.getElementById("question-palette");
        if (!paletteContainer) return;

        paletteContainer.innerHTML = "";

        questions.forEach((q, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "palette-btn";
            btn.id = `palette-btn-${idx}`;
            btn.textContent = idx + 1;
            btn.title = `Go to question ${idx + 1}`;
            btn.addEventListener("click", () => {
                goToQuestion(idx);
            });
            paletteContainer.appendChild(btn);
        });

        updatePaletteUI();
    }

    function updatePaletteUI() {
        questions.forEach((_, idx) => {
            const btn = document.getElementById(`palette-btn-${idx}`);
            if (!btn) return;

            btn.classList.remove("active", "answered", "flagged");

            if (idx === currentIndex) {
                btn.classList.add("active");
            }
            if (userAnswers[idx] !== undefined && userAnswers[idx] !== null) {
                btn.classList.add("answered");
            }
            if (flaggedQuestions[idx]) {
                btn.classList.add("flagged");
            }
        });

        // Summary counters
        const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null && userAnswers[k] !== undefined).length;
        const flaggedCount = Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length;
        const unansweredCount = questions.length - answeredCount;

        const answeredEl = document.getElementById("palette-answered-count");
        const flaggedEl = document.getElementById("palette-flagged-count");
        const unansweredEl = document.getElementById("palette-unanswered-count");

        if (answeredEl) answeredEl.textContent = answeredCount;
        if (flaggedEl) flaggedEl.textContent = flaggedCount;
        if (unansweredEl) unansweredEl.textContent = unansweredCount;
    }

    function renderQuestion(index) {
        currentIndex = index;
        const q = questions[currentIndex];
        if (!q) return;

        // Update progress bar
        const progressFill = document.getElementById("test-progress-fill");
        const questionNumberEl = document.getElementById("question-number-indicator");
        const totalQuestionsEl = document.getElementById("total-questions-indicator");

        const progressPercent = ((currentIndex + 1) / questions.length) * 100;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
        if (questionNumberEl) questionNumberEl.textContent = currentIndex + 1;
        if (totalQuestionsEl) totalQuestionsEl.textContent = questions.length;

        // Update Question text
        const questionTextEl = document.getElementById("question-text");
        if (questionTextEl) questionTextEl.textContent = q.question;

        // Render Options
        const optionsContainer = document.getElementById("options-container");
        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            const optionLetters = ["A", "B", "C", "D"];

            q.options.forEach((optText, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;
                const optionCard = document.createElement("div");
                optionCard.className = `option-card ${isSelected ? "selected" : ""}`;
                optionCard.setAttribute("role", "button");
                optionCard.setAttribute("tabindex", "0");

                optionCard.innerHTML = `
                    <input type="radio" name="question_option" id="opt-${optIdx}" value="${optIdx}" ${isSelected ? "checked" : ""}>
                    <span class="option-letter">${optionLetters[optIdx]}</span>
                    <span class="option-label-text">${escapeHtml(optText)}</span>
                `;

                optionCard.addEventListener("click", () => {
                    selectAnswer(optIdx);
                });

                optionCard.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectAnswer(optIdx);
                    }
                });

                optionsContainer.appendChild(optionCard);
            });
        }

        // Update Flag Button state
        const flagBtn = document.getElementById("flag-btn");
        if (flagBtn) {
            const isFlagged = !!flaggedQuestions[currentIndex];
            flagBtn.classList.toggle("active", isFlagged);
            flagBtn.innerHTML = isFlagged ? `⚑ Flagged for Review` : `⚐ Flag for Review`;
        }

        // Update Prev / Next button states
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");

        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }

        if (nextBtn) {
            if (currentIndex === questions.length - 1) {
                nextBtn.innerHTML = `Review & Submit ➔`;
                nextBtn.classList.add("btn-accent");
            } else {
                nextBtn.innerHTML = `Next Question ➔`;
                nextBtn.classList.remove("btn-accent");
            }
        }

        updatePaletteUI();
    }

    function selectAnswer(optionIndex) {
        userAnswers[currentIndex] = optionIndex;

        const options = document.querySelectorAll(".option-card");
        options.forEach((opt, idx) => {
            if (idx === optionIndex) {
                opt.classList.add("selected");
                const radio = opt.querySelector("input");
                if (radio) radio.checked = true;
            } else {
                opt.classList.remove("selected");
            }
        });

        updatePaletteUI();
    }

    function clearSelection() {
        delete userAnswers[currentIndex];
        const options = document.querySelectorAll(".option-card");
        options.forEach(opt => {
            opt.classList.remove("selected");
            const radio = opt.querySelector("input");
            if (radio) radio.checked = false;
        });
        updatePaletteUI();
        showToast("Selection cleared.", "info");
    }

    function toggleFlag() {
        flaggedQuestions[currentIndex] = !flaggedQuestions[currentIndex];
        const isFlagged = flaggedQuestions[currentIndex];
        const flagBtn = document.getElementById("flag-btn");
        if (flagBtn) {
            flagBtn.classList.toggle("active", isFlagged);
            flagBtn.innerHTML = isFlagged ? `⚑ Flagged for Review` : `⚐ Flag for Review`;
        }
        updatePaletteUI();
        showToast(isFlagged ? `Question ${currentIndex + 1} flagged for review.` : `Flag removed for Question ${currentIndex + 1}.`, "info");
    }

    function goToQuestion(targetIndex) {
        if (targetIndex >= 0 && targetIndex < questions.length) {
            renderQuestion(targetIndex);
        }
    }

    function setupControls() {
        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");
        const submitBtn = document.getElementById("submit-test-btn");
        const clearBtn = document.getElementById("clear-selection-btn");
        const flagBtn = document.getElementById("flag-btn");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (currentIndex > 0) goToQuestion(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                if (currentIndex < questions.length - 1) {
                    goToQuestion(currentIndex + 1);
                } else {
                    openSubmitModal();
                }
            });
        }

        if (clearBtn) clearBtn.addEventListener("click", clearSelection);
        if (flagBtn) flagBtn.addEventListener("click", toggleFlag);
        if (submitBtn) submitBtn.addEventListener("click", openSubmitModal);

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            const modal = document.getElementById("submit-modal");
            if (modal && modal.classList.contains("modal-open")) return;
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            if (e.key === "ArrowLeft" && currentIndex > 0) {
                goToQuestion(currentIndex - 1);
            } else if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
                goToQuestion(currentIndex + 1);
            } else if (e.key.toLowerCase() === "f") {
                toggleFlag();
            } else if (["1", "2", "3", "4"].includes(e.key)) {
                const optIdx = parseInt(e.key, 10) - 1;
                if (optIdx >= 0 && optIdx < 4) selectAnswer(optIdx);
            }
        });

        // Modal triggers
        const modalCancelBtn = document.getElementById("modal-cancel-btn");
        const modalConfirmBtn = document.getElementById("modal-confirm-btn");
        const modalCloseBtn = document.getElementById("modal-close-btn");

        if (modalCancelBtn) modalCancelBtn.addEventListener("click", closeSubmitModal);
        if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeSubmitModal);
        if (modalConfirmBtn) {
            modalConfirmBtn.addEventListener("click", () => {
                closeSubmitModal();
                submitAssessment(false);
            });
        }

        window.addEventListener("beforeunload", (e) => {
            if (remainingSeconds > 0 && !testSubmitted) {
                e.preventDefault();
                e.returnValue = "You have an active assessment in progress. Are you sure you want to leave?";
            }
        });
    }

    function openSubmitModal() {
        const modal = document.getElementById("submit-modal");
        const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null && userAnswers[k] !== undefined).length;
        const flaggedCount = Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length;
        const unansweredCount = questions.length - answeredCount;

        const modalAnsweredEl = document.getElementById("modal-answered-count");
        const modalFlaggedEl = document.getElementById("modal-flagged-count");
        const modalUnansweredEl = document.getElementById("modal-unanswered-count");
        const modalWarningEl = document.getElementById("modal-warning-text");

        if (modalAnsweredEl) modalAnsweredEl.textContent = answeredCount;
        if (modalFlaggedEl) modalFlaggedEl.textContent = flaggedCount;
        if (modalUnansweredEl) modalUnansweredEl.textContent = unansweredCount;

        if (modalWarningEl) {
            if (unansweredCount > 0) {
                modalWarningEl.textContent = `Notice: You have ${unansweredCount} unanswered question(s). Unanswered questions will receive 0 points.`;
                modalWarningEl.style.display = "block";
            } else if (flaggedCount > 0) {
                modalWarningEl.textContent = `You have answered all questions, but still have ${flaggedCount} question(s) marked for review.`;
                modalWarningEl.style.display = "block";
            } else {
                modalWarningEl.textContent = "All 10 questions have been answered. Ready to generate your performance report?";
                modalWarningEl.style.display = "block";
            }
        }

        if (modal) modal.classList.add("modal-open");
    }

    function closeSubmitModal() {
        const modal = document.getElementById("submit-modal");
        if (modal) modal.classList.remove("modal-open");
    }

    function submitAssessment(isAutoSubmit = false) {
        if (testSubmitted) return;
        testSubmitted = true;
        clearInterval(timerInterval);

        let correctCount = 0;
        let incorrectCount = 0;
        let unansweredCount = 0;

        questions.forEach((q, idx) => {
            const userChoice = userAnswers[idx];
            if (userChoice === undefined || userChoice === null) {
                unansweredCount++;
            } else if (userChoice === q.correct) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        const total = questions.length;
        const percentage = Math.round((correctCount / total) * 100);
        const passed = percentage >= (currentCategory.passingPercentage || 60);
        const timeSpentSeconds = totalSeconds - Math.max(0, remainingSeconds);

        const resultData = {
            id: `attempt-${Date.now()}`,
            categoryId: currentCategory.id,
            categoryTitle: currentCategory.title,
            categoryIcon: currentCategory.icon,
            difficulty: currentDifficulty,
            total: total,
            score: correctCount,
            correctCount: correctCount,
            incorrectCount: incorrectCount,
            unansweredCount: unansweredCount,
            percentage: percentage,
            passed: passed,
            passingPercentage: currentCategory.passingPercentage || 60,
            timeSpentSeconds: timeSpentSeconds,
            date: new Date().toISOString(),
            isAutoSubmit: isAutoSubmit,
            userAnswers: userAnswers,
            flaggedQuestions: flaggedQuestions,
            questions: questions
        };

        if (window.Storage) {
            window.Storage.setActiveResult(resultData);
            window.Storage.addHistoryItem({
                id: resultData.id,
                categoryId: resultData.categoryId,
                categoryTitle: resultData.categoryTitle,
                difficulty: resultData.difficulty,
                score: resultData.score,
                total: resultData.total,
                percentage: resultData.percentage,
                passed: resultData.passed,
                date: resultData.date,
                timeSpentSeconds: resultData.timeSpentSeconds
            });
        }

        // Also persist attempt in Java Spring Boot Backend if available
        if (window.ApiService) {
            const backendAnswers = {};
            questions.forEach((q, idx) => {
                const qId = `${currentCategory.id}_${currentDifficulty}_${q.id}`;
                if (userAnswers[idx] !== undefined && userAnswers[idx] !== null) {
                    backendAnswers[qId] = userAnswers[idx];
                }
            });
            const user = window.Storage ? window.Storage.getUser() : null;
            const studentId = user && user.id ? user.id : 1;
            window.ApiService.submitAssessment(currentCategory.id, currentDifficulty, backendAnswers, timeSpentSeconds, studentId)
                .then(backendRes => {
                    console.log("Assessment stored in Java MySQL Backend:", backendRes.id);
                })
                .catch(err => {
                    console.warn("Backend submit notice (using local storage):", err.message);
                });
        }

        window.location.href = "result.html";
    }
})();
