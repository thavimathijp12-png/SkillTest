/**
 * SkillTest - Local Storage Management
 * Handles persistent state for user profile, theme preference, test results, and test history.
 * 
 * DISCLAIMER:
 * This application uses client-side Web LocalStorage exclusively for local demonstration 
 * and portfolio prototype purposes. LocalStorage data is unencrypted and client-managed;
 * it is not a replacement for production backend authentication, cryptographic sessions,
 * or server-side relational databases.
 */

const STORAGE_KEYS = {
    USER: "skilltest_user",
    PROFILE: "skilltest_profile",
    HISTORY: "skilltest_history",
    THEME: "skilltest_theme",
    ACTIVE_TEST: "skilltest_active_test",
    ACTIVE_RESULT: "skilltest_active_result"
};

// Seed demo history records for new visitors
const INITIAL_DEMO_HISTORY = [
    {
        id: "demo-attempt-1",
        categoryId: "java",
        categoryTitle: "Core Java",
        difficulty: "easy",
        score: 8,
        total: 10,
        percentage: 80,
        passed: true,
        date: "2026-11-10T14:30:00.000Z",
        timeSpentSeconds: 320,
        badge: "Passed"
    },
    {
        id: "demo-attempt-2",
        categoryId: "sql",
        categoryTitle: "SQL",
        difficulty: "medium",
        score: 9,
        total: 10,
        percentage: 90,
        passed: true,
        date: "2026-11-09T11:15:00.000Z",
        timeSpentSeconds: 280,
        badge: "Passed"
    },
    {
        id: "demo-attempt-3",
        categoryId: "javascript",
        categoryTitle: "JavaScript",
        difficulty: "hard",
        score: 7,
        total: 10,
        percentage: 70,
        passed: true,
        date: "2026-11-08T16:45:00.000Z",
        timeSpentSeconds: 410,
        badge: "Passed"
    }
];

const DEFAULT_PROFILE = {
    name: "Alex Morgan",
    email: "alex.morgan@skilltest.com",
    role: "Aspiring Full Stack Engineer",
    targetCareer: "Junior Software Developer",
    joinedDate: "Nov 2026",
    avatar: "🎓"
};

const Storage = {
    // ---- Theme Preference ----
    getTheme() {
        try {
            return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
        } catch (e) {
            return "light";
        }
    },

    setTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
        } catch (e) {
            console.error("Error saving theme to localStorage:", e);
        }
    },

    // ---- User Session & Profile ----
    getUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error reading user from localStorage:", e);
            return null;
        }
    },

    setUser(user) {
        try {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            // Keep profile in sync
            this.setProfile({
                ...this.getProfile(),
                name: user.name || "Student",
                email: user.email || ""
            });
        } catch (e) {
            console.error("Error saving user to localStorage:", e);
        }
    },

    logout() {
        try {
            localStorage.removeItem(STORAGE_KEYS.USER);
        } catch (e) {
            console.error("Error logging out:", e);
        }
    },

    getProfile() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
            if (!data) {
                const user = this.getUser();
                if (user) {
                    const prof = {
                        ...DEFAULT_PROFILE,
                        name: user.name || DEFAULT_PROFILE.name,
                        email: user.email || DEFAULT_PROFILE.email
                    };
                    this.setProfile(prof);
                    return prof;
                }
                return DEFAULT_PROFILE;
            }
            return JSON.parse(data);
        } catch (e) {
            console.error("Error reading profile:", e);
            return DEFAULT_PROFILE;
        }
    },

    setProfile(profile) {
        try {
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        } catch (e) {
            console.error("Error saving profile to localStorage:", e);
        }
    },

    // ---- Test History ----
    getHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
            if (!data) {
                // Initialize with seed demo history if empty
                this.setHistory(INITIAL_DEMO_HISTORY);
                return INITIAL_DEMO_HISTORY;
            }
            return JSON.parse(data);
        } catch (e) {
            console.error("Error reading history from localStorage:", e);
            return [];
        }
    },

    setHistory(historyArray) {
        try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyArray));
        } catch (e) {
            console.error("Error writing history to localStorage:", e);
        }
    },

    addHistoryItem(item) {
        const history = this.getHistory();
        history.unshift(item); // Latest first
        this.setHistory(history);
    },

    clearHistory() {
        try {
            localStorage.removeItem(STORAGE_KEYS.HISTORY);
        } catch (e) {
            console.error("Error clearing history:", e);
        }
    },

    // Filter and search history
    filterHistory({ search = "", category = "all", status = "all", sortBy = "newest" }) {
        let list = this.getHistory();

        // Search query
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(item => 
                (item.categoryTitle && item.categoryTitle.toLowerCase().includes(q)) ||
                (item.categoryId && item.categoryId.toLowerCase().includes(q)) ||
                (item.difficulty && item.difficulty.toLowerCase().includes(q))
            );
        }

        // Category filter
        if (category && category !== "all") {
            list = list.filter(item => item.categoryId === category);
        }

        // Status filter
        if (status && status !== "all") {
            if (status === "passed") {
                list = list.filter(item => item.passed === true);
            } else if (status === "failed") {
                list = list.filter(item => item.passed === false);
            }
        }

        // Sort
        if (sortBy === "highest") {
            list.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
        } else if (sortBy === "lowest") {
            list.sort((a, b) => (a.percentage || 0) - (b.percentage || 0));
        } else {
            // Newest first
            list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        }

        return list;
    },

    // ---- Active Test Session ----
    getActiveTest() {
        try {
            const data = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_TEST);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error reading active test:", e);
            return null;
        }
    },

    setActiveTest(testState) {
        try {
            sessionStorage.setItem(STORAGE_KEYS.ACTIVE_TEST, JSON.stringify(testState));
        } catch (e) {
            console.error("Error saving active test:", e);
        }
    },

    clearActiveTest() {
        try {
            sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_TEST);
        } catch (e) {
            console.error("Error clearing active test:", e);
        }
    },

    // ---- Active Result Session ----
    getActiveResult() {
        try {
            const data = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_RESULT);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error reading active result:", e);
            return null;
        }
    },

    setActiveResult(resultData) {
        try {
            sessionStorage.setItem(STORAGE_KEYS.ACTIVE_RESULT, JSON.stringify(resultData));
        } catch (e) {
            console.error("Error saving active result:", e);
        }
    }
};

// Export to window and module.exports
if (typeof window !== "undefined") {
    window.Storage = Storage;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { Storage, STORAGE_KEYS, INITIAL_DEMO_HISTORY, DEFAULT_PROFILE };
}
