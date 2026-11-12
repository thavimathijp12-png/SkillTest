/**
 * SkillTest - Dashboard Controller
 * Displays student performance summary, progress trend chart,
 * difficulty selectors (Easy, Medium, Hard), search/filter history, and retake tests.
 */

document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

let currentFilters = {
    search: "",
    category: "all",
    status: "all",
    sortBy: "newest"
};

function initDashboard() {
    const user = window.Storage ? window.Storage.getUser() : null;
    const history = window.Storage ? window.Storage.getHistory() : [];

    renderUserHeader(user);
    renderStats(history);
    renderPerformanceSummary(history);
    renderProgressChart(history);
    renderAvailableTests();
    renderFilteredHistory();

    setupHistoryControls();
}

function renderUserHeader(user) {
    const userNameEl = document.getElementById("dashboard-user-name");
    const userEmailEl = document.getElementById("dashboard-user-email");
    const guestNotice = document.getElementById("guest-banner");
    const profile = window.Storage ? window.Storage.getProfile() : {};

    if (user) {
        if (userNameEl) userNameEl.textContent = user.name || profile.name || "Student";
        if (userEmailEl) userEmailEl.textContent = user.email || profile.email || "";
        if (guestNotice) guestNotice.style.display = "none";
    } else {
        if (userNameEl) userNameEl.textContent = "Guest Learner";
        if (userEmailEl) userEmailEl.textContent = "Sign in to persist your progress and customize your student profile";
        if (guestNotice) guestNotice.style.display = "flex";
    }
}

function renderStats(history) {
    const totalTestsEl = document.getElementById("stat-total-tests");
    const avgScoreEl = document.getElementById("stat-avg-score");
    const passedTestsEl = document.getElementById("stat-passed-tests");
    const topScoreEl = document.getElementById("stat-top-score");

    const totalTests = history.length;
    let avgScore = 0;
    let passedCount = 0;
    let topScore = 0;

    if (totalTests > 0) {
        const sumPercentages = history.reduce((acc, item) => acc + (item.percentage || 0), 0);
        avgScore = Math.round(sumPercentages / totalTests);
        passedCount = history.filter(item => item.passed).length;
        topScore = Math.max(...history.map(item => item.percentage || 0));
    }

    if (totalTestsEl) totalTestsEl.textContent = totalTests;
    if (avgScoreEl) avgScoreEl.textContent = `${avgScore}%`;
    if (passedTestsEl) passedTestsEl.textContent = passedCount;
    if (topScoreEl) topScoreEl.textContent = `${topScore}%`;
}

// Student Performance Summary & Mastery Level
function renderPerformanceSummary(history) {
    const masteryBadgeEl = document.getElementById("student-mastery-badge");
    const catListContainer = document.getElementById("category-performance-list");
    if (!catListContainer) return;

    // Calculate category breakdown
    const categories = ["java", "sql", "html_css", "javascript"];
    const categoryLabels = {
        java: "Core Java",
        sql: "SQL Database",
        html_css: "HTML & CSS",
        javascript: "JavaScript"
    };

    const categoryStats = {};
    categories.forEach(cat => {
        categoryStats[cat] = { total: 0, sum: 0 };
    });

    history.forEach(item => {
        if (categoryStats[item.categoryId]) {
            categoryStats[item.categoryId].total++;
            categoryStats[item.categoryId].sum += (item.percentage || 0);
        }
    });

    // Mastery badge
    if (masteryBadgeEl) {
        const totalTests = history.length;
        const avg = totalTests > 0 ? Math.round(history.reduce((a, b) => a + (b.percentage || 0), 0) / totalTests) : 0;
        if (avg >= 85) {
            masteryBadgeEl.textContent = "🏆 Advanced Master";
            masteryBadgeEl.className = "badge badge-success";
        } else if (avg >= 70) {
            masteryBadgeEl.textContent = "⭐ Proficient";
            masteryBadgeEl.className = "badge badge-medium";
        } else if (avg >= 55) {
            masteryBadgeEl.textContent = "📈 Intermediate";
            masteryBadgeEl.className = "badge badge-warning";
        } else {
            masteryBadgeEl.textContent = "🌱 Beginner Explorer";
            masteryBadgeEl.className = "badge badge-difficulty";
        }
    }

    catListContainer.innerHTML = categories.map(cat => {
        const stats = categoryStats[cat];
        const avg = stats.total > 0 ? Math.round(stats.sum / stats.total) : 0;
        let color = "var(--blue-primary)";
        if (avg >= 80) color = "var(--success)";
        else if (avg < 50 && stats.total > 0) color = "var(--danger)";

        return `
            <div class="cat-progress-item">
                <div class="cat-progress-header">
                    <span>${categoryLabels[cat]}</span>
                    <span>${stats.total > 0 ? `${avg}% (${stats.total} tests)` : "Not tested yet"}</span>
                </div>
                <div class="cat-progress-track">
                    <div class="cat-progress-fill" style="width: ${avg}%; background-color: ${color};"></div>
                </div>
            </div>
        `;
    }).join("");

    // Check for weak topics from Java Backend
    if (window.ApiService) {
        const user = window.Storage ? window.Storage.getUser() : null;
        const studentId = user && user.id ? user.id : 1;
        window.ApiService.getAnalytics(studentId).then(analytics => {
            if (analytics && analytics.weakTopics && analytics.weakTopics.length > 0) {
                renderWeakTopicsBanner(analytics.weakTopics);
            }
        }).catch(err => console.log("Analytics notice:", err));
    }
}

function renderWeakTopicsBanner(weakTopics) {
    let container = document.getElementById("weak-topics-container");
    if (!container) {
        const target = document.querySelector(".dashboard-summary-grid");
        if (!target) return;
        container = document.createElement("div");
        container.id = "weak-topics-container";
        container.className = "card";
        container.style.marginTop = "1.5rem";
        container.style.borderLeft = "4px solid var(--warning, #f59e0b)";
        target.parentNode.insertBefore(container, target.nextSibling);
    }

    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--navy-dark); display: flex; align-items: center; gap: 0.5rem; margin: 0;">
                <span>🎯 Recommended Practice Topics</span>
                <span class="badge badge-warning" style="font-size: 0.75rem;">AI Topic Diagnostics</span>
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Detected by Java Spring Boot backend</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            ${weakTopics.slice(0, 3).map(wt => `
                <div style="background: rgba(245, 158, 11, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(245, 158, 11, 0.2);">
                    <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy-dark);">${wt.topic}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0;">Category: ${wt.categoryName || wt.categoryId} • Accuracy: <strong style="color: #dc2626;">${wt.accuracyPercentage}%</strong></div>
                    <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 0.35rem;">💡 ${wt.recommendation}</div>
                </div>
            `).join("")}
        </div>
    `;
}

// Simple SVG Progress Trend Chart
function renderProgressChart(history) {
    const chartWrapper = document.getElementById("progress-chart-wrapper");
    if (!chartWrapper) return;

    if (!history || history.length === 0) {
        chartWrapper.innerHTML = `
            <div class="empty-state" style="padding: 1.5rem 0;">
                <div style="font-size: 1.75rem;">📊</div>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">Complete your first assessment to unlock score trend charts.</div>
            </div>
        `;
        return;
    }

    // Chronological order for chart (oldest to newest, up to last 8)
    const pointsData = [...history].reverse().slice(-8);

    const svgWidth = 460;
    const svgHeight = 160;
    const padding = { top: 20, right: 25, bottom: 30, left: 35 };

    const width = svgWidth - padding.left - padding.right;
    const height = svgHeight - padding.top - padding.bottom;

    const xStep = pointsData.length > 1 ? width / (pointsData.length - 1) : width / 2;

    const coords = pointsData.map((d, i) => {
        const x = pointsData.length === 1 ? padding.left + width / 2 : padding.left + i * xStep;
        const y = padding.top + height - ((d.percentage || 0) / 100) * height;
        return { x, y, percentage: d.percentage || 0, title: d.categoryTitle || "Test" };
    });

    const pointsStr = coords.map(c => `${c.x},${c.y}`).join(" ");
    const areaStr = `${coords[0].x},${padding.top + height} ` + pointsStr + ` ${coords[coords.length - 1].x},${padding.top + height}`;

    chartWrapper.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="chart-svg">
            <defs>
                <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
                </linearGradient>
            </defs>

            <!-- Gridlines -->
            <line x1="${padding.left}" y1="${padding.top}" x2="${svgWidth - padding.right}" y2="${padding.top}" class="chart-axis-line" />
            <text x="${padding.left - 8}" y="${padding.top + 4}" font-size="10" fill="var(--text-muted)" text-anchor="end">100%</text>

            <line x1="${padding.left}" y1="${padding.top + height / 2}" x2="${svgWidth - padding.right}" y2="${padding.top + height / 2}" class="chart-axis-line" />
            <text x="${padding.left - 8}" y="${padding.top + height / 2 + 4}" font-size="10" fill="var(--text-muted)" text-anchor="end">50%</text>

            <line x1="${padding.left}" y1="${padding.top + height}" x2="${svgWidth - padding.right}" y2="${padding.top + height}" stroke="var(--border-color)" stroke-width="1.5" />
            <text x="${padding.left - 8}" y="${padding.top + height + 4}" font-size="10" fill="var(--text-muted)" text-anchor="end">0%</text>

            <!-- Area & Line -->
            ${pointsData.length > 1 ? `<polygon points="${areaStr}" class="chart-trend-area" />` : ""}
            ${pointsData.length > 1 ? `<polyline points="${pointsStr}" class="chart-trend-line" />` : ""}

            <!-- Data Dots & Labels -->
            ${coords.map((c, i) => `
                <g>
                    <circle cx="${c.x}" cy="${c.y}" r="4.5" class="chart-dot">
                        <title>${c.title}: ${c.percentage}%</title>
                    </circle>
                    <text x="${c.x}" y="${c.y - 8}" font-size="10" font-weight="700" fill="var(--blue-primary)" text-anchor="middle">
                        ${c.percentage}%
                    </text>
                    <text x="${c.x}" y="${padding.top + height + 16}" font-size="9" fill="var(--text-muted)" text-anchor="middle">
                        #${i + 1}
                    </text>
                </g>
            `).join("")}
        </svg>
    `;
}

// Available Tests Grid with Easy, Medium, Hard selectors
function renderAvailableTests() {
    const container = document.getElementById("tests-grid");
    if (!container || !window.TEST_CATEGORIES) return;

    container.innerHTML = "";
    const categories = Object.values(window.TEST_CATEGORIES);

    categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "test-card";
        card.id = `card-${cat.id}`;

        card.innerHTML = `
            <div class="test-card-header">
                <span class="test-card-icon" style="background: rgba(2, 132, 199, 0.1);">${cat.icon}</span>
                <span class="badge badge-difficulty" id="badge-diff-${cat.id}">Beginner</span>
            </div>
            <h3 class="test-card-title">${cat.title}</h3>
            <p class="test-card-desc">${cat.tagline}</p>

            <!-- Difficulty Level Selector -->
            <div class="difficulty-selector" role="group" aria-label="Select Difficulty">
                <button type="button" class="diff-pill-btn active" data-diff="easy" onclick="setCardDifficulty('${cat.id}', 'easy')">Easy</button>
                <button type="button" class="diff-pill-btn" data-diff="medium" onclick="setCardDifficulty('${cat.id}', 'medium')">Medium</button>
                <button type="button" class="diff-pill-btn" data-diff="hard" onclick="setCardDifficulty('${cat.id}', 'hard')">Hard</button>
            </div>

            <div class="test-card-meta">
                <span class="meta-item">
                    <span class="meta-icon">⏱️</span> <span id="meta-time-${cat.id}">10 Mins</span>
                </span>
                <span class="meta-item">
                    <span class="meta-icon">❓</span> 10 MCQs
                </span>
                <span class="meta-item">
                    <span class="meta-icon">🎯</span> Pass: ${cat.passingPercentage}%
                </span>
            </div>
            <div class="test-card-action">
                <a href="test.html?category=${cat.id}&difficulty=easy" class="btn btn-primary btn-block" id="start-btn-${cat.id}">
                    Start Test ➔
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

function setCardDifficulty(catId, difficulty) {
    const card = document.getElementById(`card-${catId}`);
    if (!card) return;

    // Toggle active buttons
    const btns = card.querySelectorAll(".diff-pill-btn");
    btns.forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-diff") === difficulty);
    });

    // Update difficulty badge
    const badge = document.getElementById(`badge-diff-${catId}`);
    const timeEl = document.getElementById(`meta-time-${catId}`);
    const startBtn = document.getElementById(`start-btn-${catId}`);

    const config = {
        easy: { label: "Easy Level", class: "badge-easy", time: "10 Mins" },
        medium: { label: "Medium Level", class: "badge-medium", time: "8 Mins" },
        hard: { label: "Hard Level", class: "badge-hard", time: "6 Mins" }
    };

    const sel = config[difficulty] || config.easy;

    if (badge) {
        badge.textContent = sel.label;
        badge.className = `badge ${sel.class}`;
    }
    if (timeEl) timeEl.textContent = sel.time;
    if (startBtn) {
        startBtn.href = `test.html?category=${catId}&difficulty=${difficulty}`;
    }
}

// History Controls (Search & Filters)
function setupHistoryControls() {
    const searchInput = document.getElementById("history-search-input");
    const categorySelect = document.getElementById("history-category-select");
    const statusSelect = document.getElementById("history-status-select");
    const sortSelect = document.getElementById("history-sort-select");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentFilters.search = e.target.value;
            renderFilteredHistory();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", (e) => {
            currentFilters.category = e.target.value;
            renderFilteredHistory();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", (e) => {
            currentFilters.status = e.target.value;
            renderFilteredHistory();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentFilters.sortBy = e.target.value;
            renderFilteredHistory();
        });
    }

    const clearHistoryBtn = document.getElementById("clear-history-btn");
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset your assessment history?")) {
                if (window.Storage) window.Storage.clearHistory();
                showToast("Test history reset successfully.", "info");
                renderStats([]);
                renderPerformanceSummary([]);
                renderProgressChart([]);
                renderFilteredHistory();
            }
        });
    }
}

function renderFilteredHistory() {
    if (!window.Storage) return;
    const history = window.Storage.filterHistory(currentFilters);
    renderHistoryTable(history);

    const countEl = document.getElementById("history-results-count");
    if (countEl) countEl.textContent = `${history.length} attempt(s) found`;
}

function renderHistoryTable(history) {
    const tbody = document.getElementById("history-table-body");
    const emptyState = document.getElementById("history-empty-state");
    const tableContainer = document.getElementById("history-table-container");

    if (!tbody) return;

    if (!history || history.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        if (tableContainer) tableContainer.style.display = "none";
        tbody.innerHTML = "";
        return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (tableContainer) tableContainer.style.display = "block";

    tbody.innerHTML = history.map((item) => {
        const formattedDate = formatDate(item.date);
        const statusBadge = item.passed 
            ? `<span class="badge badge-success">Passed</span>`
            : `<span class="badge badge-danger">Needs Practice</span>`;
        
        const categoryIcon = window.TEST_CATEGORIES && window.TEST_CATEGORIES[item.categoryId] 
            ? window.TEST_CATEGORIES[item.categoryId].icon 
            : "📝";

        const difficultyLabel = item.difficulty ? item.difficulty.toUpperCase() : "EASY";
        let diffBadgeClass = "badge-easy";
        if (difficultyLabel === "MEDIUM") diffBadgeClass = "badge-medium";
        else if (difficultyLabel === "HARD") diffBadgeClass = "badge-hard";

        return `
            <tr>
                <td>
                    <div class="history-category-cell">
                        <span class="cat-icon-mini">${categoryIcon}</span>
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <strong>${escapeHtml(item.categoryTitle || item.categoryId)}</strong>
                                <span class="badge ${diffBadgeClass}" style="font-size: 0.65rem;">${difficultyLabel}</span>
                            </div>
                            <div class="text-muted text-xs">${formattedDate}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="score-badge">${item.score} / ${item.total}</span>
                </td>
                <td>
                    <div class="progress-wrap-mini">
                        <div class="progress-bar-mini" style="width: ${item.percentage}%;"></div>
                        <span class="progress-text-mini">${item.percentage}%</span>
                    </div>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <a href="test.html?category=${item.categoryId}&difficulty=${item.difficulty || 'easy'}" class="btn btn-outline-sm" title="Retake this assessment">
                        ↻ Retake
                    </a>
                </td>
            </tr>
        `;
    }).join("");

    // Check for weak topics from Java Backend
    if (window.ApiService) {
        const user = window.Storage ? window.Storage.getUser() : null;
        const studentId = user && user.id ? user.id : 1;
        window.ApiService.getAnalytics(studentId).then(analytics => {
            if (analytics && analytics.weakTopics && analytics.weakTopics.length > 0) {
                renderWeakTopicsBanner(analytics.weakTopics);
            }
        }).catch(err => console.log("Analytics notice:", err));
    }
}

function renderWeakTopicsBanner(weakTopics) {
    let container = document.getElementById("weak-topics-container");
    if (!container) {
        const target = document.querySelector(".dashboard-summary-grid");
        if (!target) return;
        container = document.createElement("div");
        container.id = "weak-topics-container";
        container.className = "card";
        container.style.marginTop = "1.5rem";
        container.style.borderLeft = "4px solid var(--warning, #f59e0b)";
        target.parentNode.insertBefore(container, target.nextSibling);
    }

    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--navy-dark); display: flex; align-items: center; gap: 0.5rem; margin: 0;">
                <span>🎯 Recommended Practice Topics</span>
                <span class="badge badge-warning" style="font-size: 0.75rem;">AI Topic Diagnostics</span>
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Detected by Java Spring Boot backend</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            ${weakTopics.slice(0, 3).map(wt => `
                <div style="background: rgba(245, 158, 11, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(245, 158, 11, 0.2);">
                    <div style="font-weight: 600; font-size: 0.95rem; color: var(--navy-dark);">${wt.topic}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0;">Category: ${wt.categoryName || wt.categoryId} • Accuracy: <strong style="color: #dc2626;">${wt.accuracyPercentage}%</strong></div>
                    <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 0.35rem;">💡 ${wt.recommendation}</div>
                </div>
            `).join("")}
        </div>
    `;
}

function formatDate(dateStr) {
    if (!dateStr) return "Recent";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch (e) {
        return "Recent";
    }
}
