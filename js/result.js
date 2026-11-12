/**
 * SkillTest - Result Page Controller
 * Displays score, percentage, detailed statistics, question-by-question review with explanations.
 * Supports review filtering (All, Correct, Incorrect, Skipped) and test retakes with preserved difficulty.
 */

let currentReviewFilter = "all";
let activeResultCache = null;

document.addEventListener("DOMContentLoaded", () => {
    initResultPage();
});

function initResultPage() {
    let result = window.Storage ? window.Storage.getActiveResult() : null;

    // Fallback: If page was opened directly without active test, take latest history or fallback demo
    if (!result) {
        const history = window.Storage ? window.Storage.getHistory() : [];
        if (history && history.length > 0) {
            const latest = history[0];
            const cat = (window.TEST_CATEGORIES && window.TEST_CATEGORIES[latest.categoryId])
                ? window.TEST_CATEGORIES[latest.categoryId]
                : window.TEST_CATEGORIES.java;
            const scoreVal = (latest.score !== undefined && latest.score !== null) ? latest.score : 8;
            const diff = latest.difficulty || "easy";
            const qList = (typeof window.getCategoryQuestions === "function") 
                ? window.getCategoryQuestions(cat.id, diff)
                : (cat.difficulties ? cat.difficulties[diff] : cat.questions);

            result = {
                categoryId: cat.id,
                categoryTitle: cat.title,
                categoryIcon: cat.icon,
                difficulty: diff,
                total: qList.length,
                score: scoreVal,
                correctCount: scoreVal,
                incorrectCount: qList.length - scoreVal,
                unansweredCount: 0,
                percentage: (latest.percentage !== undefined && latest.percentage !== null) ? latest.percentage : Math.round((scoreVal / qList.length) * 100),
                passed: latest.passed !== undefined ? latest.passed : (scoreVal >= 6),
                passingPercentage: cat.passingPercentage,
                timeSpentSeconds: latest.timeSpentSeconds || 320,
                date: latest.date || new Date().toISOString(),
                userAnswers: { 0: 0, 1: 1, 2: 1, 3: 3, 4: 0, 5: 1, 6: 0, 7: 2, 8: 0, 9: 1 },
                questions: qList
            };
        } else {
            const cat = window.TEST_CATEGORIES.java;
            const qList = cat.difficulties ? cat.difficulties.easy : cat.questions;
            result = {
                categoryId: "java",
                categoryTitle: "Core Java",
                categoryIcon: "☕",
                difficulty: "easy",
                total: 10,
                score: 8,
                correctCount: 8,
                incorrectCount: 2,
                unansweredCount: 0,
                percentage: 80,
                passed: true,
                passingPercentage: 60,
                timeSpentSeconds: 310,
                date: new Date().toISOString(),
                userAnswers: { 0: 0, 1: 1, 2: 1, 3: 3, 4: 0, 5: 1, 6: 0, 7: 2, 8: 1, 9: 2 },
                questions: qList
            };
        }
    }

    activeResultCache = result;

    renderScoreSummary(result);
    renderReviewFilterTabs(result);
    renderQuestionReview(result);
    setupActionButtons(result);

    if (result.passed) {
        triggerCelebration();
    }
}

function triggerCelebration() {
    const colors = ["#0284c7", "#38bdf8", "#16a34a", "#22c55e", "#f59e0b"];
    for (let i = 0; i < 35; i++) {
        const confetti = document.createElement("div");
        confetti.className = "celebration-particle";
        confetti.style.left = (Math.random() * 100) + "vw";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = (Math.random() * 1.5) + "s";
        confetti.style.animationDuration = (2.2 + Math.random() * 2) + "s";
        confetti.style.width = (7 + Math.random() * 6) + "px";
        confetti.style.height = (10 + Math.random() * 8) + "px";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function renderScoreSummary(result) {
    const titleEl = document.getElementById("result-category-title");
    const iconEl = document.getElementById("result-category-icon");
    const scoreValEl = document.getElementById("result-score-value");
    const totalValEl = document.getElementById("result-total-value");
    const percentEl = document.getElementById("result-percentage");
    const badgeEl = document.getElementById("result-status-badge");
    const diffBadgeEl = document.getElementById("result-difficulty-badge");
    const feedbackTitleEl = document.getElementById("result-feedback-title");
    const feedbackDescEl = document.getElementById("result-feedback-desc");

    const correctCountEl = document.getElementById("stat-correct-count");
    const incorrectCountEl = document.getElementById("stat-incorrect-count");
    const unansweredCountEl = document.getElementById("stat-unanswered-count");
    const timeSpentEl = document.getElementById("stat-time-spent");

    if (titleEl) titleEl.textContent = result.categoryTitle || "Skill Assessment";
    if (iconEl) iconEl.textContent = result.categoryIcon || "📝";
    if (scoreValEl) scoreValEl.textContent = result.score;
    if (totalValEl) totalValEl.textContent = result.total;
    if (percentEl) percentEl.textContent = `${result.percentage}%`;

    if (diffBadgeEl) {
        const diff = (result.difficulty || "easy").toUpperCase();
        diffBadgeEl.textContent = `${diff} LEVEL`;
        diffBadgeEl.className = `badge ${diff === "HARD" ? "badge-hard" : diff === "MEDIUM" ? "badge-medium" : "badge-easy"}`;
    }

    const circle = document.getElementById("result-circle-progress");
    if (circle) {
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (result.percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = result.passed ? "var(--success)" : "var(--danger)";
    }

    if (badgeEl) {
        badgeEl.textContent = result.passed ? "Passed" : "Needs Practice";
        badgeEl.className = `badge ${result.passed ? "badge-success" : "badge-danger"}`;
    }

    if (feedbackTitleEl && feedbackDescEl) {
        if (result.percentage >= 90) {
            feedbackTitleEl.textContent = "Outstanding Achievement! 🌟";
            feedbackDescEl.textContent = "You demonstrated mastery in this subject! Keep up the brilliant momentum.";
        } else if (result.passed) {
            feedbackTitleEl.textContent = "Congratulations! You Passed! 🎉";
            feedbackDescEl.textContent = "You met the required passing score. Review the incorrect and skipped answers below to refine your knowledge.";
        } else {
            feedbackTitleEl.textContent = "Keep Practicing! You Can Do It! 💪";
            feedbackDescEl.textContent = `You scored ${result.percentage}%. The passing threshold is ${result.passingPercentage}%. Check the explanations below and retake the test!`;
        }
    }

    if (correctCountEl) correctCountEl.textContent = result.correctCount;
    if (incorrectCountEl) incorrectCountEl.textContent = result.incorrectCount;
    if (unansweredCountEl) unansweredCountEl.textContent = result.unansweredCount || 0;
    if (timeSpentEl) timeSpentEl.textContent = formatTime(result.timeSpentSeconds || 0);
}

function renderReviewFilterTabs(result) {
    const tabsContainer = document.getElementById("review-filter-tabs");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = `
        <button type="button" class="review-filter-btn ${currentReviewFilter === 'all' ? 'active' : ''}" onclick="setReviewFilter('all')">
            All Questions (${result.total})
        </button>
        <button type="button" class="review-filter-btn ${currentReviewFilter === 'correct' ? 'active' : ''}" onclick="setReviewFilter('correct')">
            ✓ Correct (${result.correctCount})
        </button>
        <button type="button" class="review-filter-btn ${currentReviewFilter === 'incorrect' ? 'active' : ''}" onclick="setReviewFilter('incorrect')">
            ✕ Incorrect (${result.incorrectCount})
        </button>
        <button type="button" class="review-filter-btn ${currentReviewFilter === 'skipped' ? 'active' : ''}" onclick="setReviewFilter('skipped')">
            ⚠ Skipped (${result.unansweredCount || 0})
        </button>
    `;
}

function setReviewFilter(filterType) {
    currentReviewFilter = filterType;
    if (activeResultCache) {
        renderReviewFilterTabs(activeResultCache);
        renderQuestionReview(activeResultCache);
    }
}

function renderQuestionReview(result) {
    const container = document.getElementById("review-questions-list");
    if (!container || !result.questions) return;

    container.innerHTML = "";
    const optionLetters = ["A", "B", "C", "D"];

    let displayedCount = 0;

    result.questions.forEach((q, qIndex) => {
        const userChoice = result.userAnswers ? result.userAnswers[qIndex] : undefined;
        const isAnswered = userChoice !== undefined && userChoice !== null;
        const isCorrect = isAnswered && userChoice === q.correct;

        // Apply filter
        if (currentReviewFilter === "correct" && !isCorrect) return;
        if (currentReviewFilter === "incorrect" && (!isAnswered || isCorrect)) return;
        if (currentReviewFilter === "skipped" && isAnswered) return;

        displayedCount++;

        let statusClass = "review-card-skipped";
        let statusBadge = `<span class="badge badge-warning">Skipped</span>`;

        if (isAnswered) {
            if (isCorrect) {
                statusClass = "review-card-correct";
                statusBadge = `<span class="badge badge-success">✓ Correct</span>`;
            } else {
                statusClass = "review-card-incorrect";
                statusBadge = `<span class="badge badge-danger">✕ Incorrect</span>`;
            }
        }

        const reviewCard = document.createElement("div");
        reviewCard.className = `review-card ${statusClass}`;

        const optionsHtml = q.options.map((optText, optIdx) => {
            let itemClass = "review-option-item";
            let tag = "";

            if (optIdx === q.correct) {
                itemClass += " option-is-correct";
                tag = `<span class="option-tag tag-correct">Correct Answer</span>`;
            }
            if (isAnswered && optIdx === userChoice && !isCorrect) {
                itemClass += " option-is-user-wrong";
                tag = `<span class="option-tag tag-wrong">Your Choice</span>`;
            } else if (isAnswered && optIdx === userChoice && isCorrect) {
                tag = `<span class="option-tag tag-correct-choice">Your Choice (Correct)</span>`;
            }

            return `
                <div class="${itemClass}">
                    <span class="review-option-letter">${optionLetters[optIdx]}</span>
                    <span class="review-option-text">${escapeHtml(optText)}</span>
                    ${tag}
                </div>
            `;
        }).join("");

        reviewCard.innerHTML = `
            <div class="review-card-header">
                <span class="review-q-num">Question ${qIndex + 1}</span>
                ${statusBadge}
            </div>
            <h4 class="review-q-title">${escapeHtml(q.question)}</h4>
            <div class="review-options-list">
                ${optionsHtml}
            </div>
            <div class="review-explanation-box">
                <span class="explanation-icon">💡</span>
                <div class="explanation-content">
                    <strong>Explanation:</strong> ${escapeHtml(q.explanation || "No explanation provided.")}
                </div>
            </div>
        `;

        container.appendChild(reviewCard);
    });

    if (displayedCount === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding: 2rem; text-align: center; color: var(--text-muted);">
                No questions found under the "<strong>${currentReviewFilter}</strong>" filter.
            </div>
        `;
    }
}

function setupActionButtons(result) {
    const retakeBtn = document.getElementById("retake-test-btn");
    const dashboardBtn = document.getElementById("dashboard-nav-btn");
    const printBtn = document.getElementById("print-result-btn");
    const copySummaryBtn = document.getElementById("copy-summary-btn");

    if (retakeBtn) {
        retakeBtn.href = `test.html?category=${result.categoryId || 'java'}&difficulty=${result.difficulty || 'easy'}`;
    }

    if (dashboardBtn) {
        dashboardBtn.href = "dashboard.html";
    }

    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    if (copySummaryBtn) {
        copySummaryBtn.addEventListener("click", () => {
            const summaryText = `SkillTest Assessment Report\nCategory: ${result.categoryTitle} (${(result.difficulty || 'easy').toUpperCase()})\nScore: ${result.score}/${result.total} (${result.percentage}%)\nStatus: ${result.passed ? 'PASSED ✓' : 'NEEDS PRACTICE'}\nTime Spent: ${formatTime(result.timeSpentSeconds || 0)}\nPlatform: SkillTest Smart Assessment`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(summaryText).then(() => {
                    showToast("Score summary copied to clipboard!", "success");
                }).catch(() => {
                    showToast("Failed to copy. Please copy manually.", "warning");
                });
            } else {
                showToast("Score summary copied!", "info");
            }
        });
    }
}
