/**
 * SkillTest - Java Spring Boot Backend API Client
 * Connects frontend to http://localhost:8080/api with graceful LocalStorage fallback.
 */

const API_BASE_URL = 'http://localhost:8080/api';

const ApiService = {
    isBackendAvailable: null,

    /**
     * Get authorization headers with JWT Bearer token if student is logged in
     */
    getAuthHeaders(customHeaders = {}) {
        const headers = { 'Content-Type': 'application/json', ...customHeaders };
        const user = window.Storage ? window.Storage.getUser() : null;
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }
        return headers;
    },

    /**
     * Check if the Java Spring Boot backend is active
     */
    async checkHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${API_BASE_URL}/questions/categories`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            this.isBackendAvailable = res.ok;
            return res.ok;
        } catch (err) {
            this.isBackendAvailable = false;
            return false;
        }
    },

    /**
     * Register a new student
     */
    async register(name, email, password) {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Registration failed');
        }
        return await res.json();
    },

    /**
     * Login student with email and password
     */
    async login(email, password) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Invalid email or password');
        }
        return await res.json();
    },

    /**
     * Verify JWT token with backend
     */
    async verifyToken(token) {
        const user = window.Storage ? window.Storage.getUser() : null;
        const jwtToken = token || (user ? user.token : null);
        if (!jwtToken) return { valid: false };

        const res = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });
        if (!res.ok) {
            return { valid: false };
        }
        return await res.json();
    },

    /**
     * Fetch questions for an assessment
     */
    async getQuestions(categoryId, difficulty) {
        const res = await fetch(`${API_BASE_URL}/questions?categoryId=${encodeURIComponent(categoryId)}&difficulty=${encodeURIComponent(difficulty)}`, {
            headers: this.getAuthHeaders()
        });
        if (!res.ok) {
            throw new Error('Failed to fetch questions from backend');
        }
        return await res.json();
    },

    /**
     * Submit an assessment attempt and compute score on the backend
     */
    async submitAssessment(categoryId, difficulty, answers, timeTakenSeconds, studentId) {
        const res = await fetch(`${API_BASE_URL}/assessments/submit`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                studentId: studentId || 1,
                categoryId,
                difficulty,
                answers,
                timeTakenSeconds
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Assessment submission failed');
        }
        return await res.json();
    },

    /**
     * Fetch student assessment history
     */
    async getHistory(studentId) {
        const res = await fetch(`${API_BASE_URL}/assessments/history?studentId=${studentId || 1}`, {
            headers: this.getAuthHeaders()
        });
        if (!res.ok) {
            throw new Error('Failed to fetch history');
        }
        return await res.json();
    },

    /**
     * Fetch student performance analytics and weak topics
     */
    async getAnalytics(studentId) {
        const res = await fetch(`${API_BASE_URL}/analytics?studentId=${studentId || 1}`, {
            headers: this.getAuthHeaders()
        });
        if (!res.ok) {
            throw new Error('Failed to fetch analytics');
        }
        return await res.json();
    },

    /**
     * Fetch global leaderboard
     */
    async getLeaderboard() {
        const res = await fetch(`${API_BASE_URL}/leaderboard`, {
            headers: this.getAuthHeaders()
        });
        if (!res.ok) {
            throw new Error('Failed to fetch leaderboard');
        }
        return await res.json();
    }
};

window.ApiService = ApiService;

