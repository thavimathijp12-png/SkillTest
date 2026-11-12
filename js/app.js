/**
 * SkillTest - Global Application Helpers & UI Interactions
 * Supports Theme Toggle (Light/Dark), Student Profile, Navigation State & Modals
 */

// Toast notification helper
function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
        warning: "⚠"
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || "ℹ"}</span>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==================== THEME MANAGEMENT ====================
function initTheme() {
    const savedTheme = window.Storage ? window.Storage.getTheme() : "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeToggleIcons(savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    if (window.Storage) window.Storage.setTheme(next);
    updateThemeToggleIcons(next);
    showToast(`Switched to ${next === "dark" ? "Dark" : "Light"} mode.`, "info");
}

function updateThemeToggleIcons(theme) {
    const btns = document.querySelectorAll(".theme-toggle-btn");
    btns.forEach(btn => {
        btn.innerHTML = theme === "dark" ? "☀️" : "🌙";
        btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "Light" : "Dark"} theme`);
        btn.setAttribute("title", `Switch to ${theme === "dark" ? "Light" : "Dark"} theme`);
    });
}

// ==================== NAVBAR & AUTH STATE ====================
function updateNavAuthUI() {
    const user = window.Storage ? window.Storage.getUser() : null;
    const authActions = document.getElementById("nav-auth-actions");
    const mobileAuthActions = document.getElementById("mobile-nav-auth-actions");

    if (!authActions) return;

    const isInPages = window.location.pathname.includes("/pages/") || 
                     (window.location.pathname.endsWith(".html") && !window.location.pathname.endsWith("index.html") && window.location.pathname.includes("pages"));
    const loginPath = isInPages ? "login.html" : "pages/login.html";
    const dashboardPath = isInPages ? "dashboard.html" : "pages/dashboard.html";

    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const themeIcon = currentTheme === "dark" ? "☀️" : "🌙";

    if (user) {
        const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "ST";
        const html = `
            <button type="button" class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">${themeIcon}</button>
            <div class="user-pill" onclick="openProfileModal()" style="cursor: pointer;" title="View Student Profile">
                <span class="user-avatar">${initials}</span>
                <span class="user-name">${escapeHtml(user.name || user.email)}</span>
            </div>
            <a href="${dashboardPath}" class="btn btn-outline-nav btn-sm">Dashboard</a>
            <button id="logout-btn" class="btn btn-ghost btn-sm" onclick="handleGlobalLogout()">Logout</button>
        `;
        authActions.innerHTML = html;

        if (mobileAuthActions) {
            mobileAuthActions.innerHTML = `
                <div class="mobile-user-info" onclick="openProfileModal()" style="cursor: pointer;">
                    <span class="user-avatar">${initials}</span>
                    <div>
                        <div class="user-name">${escapeHtml(user.name || user.email)}</div>
                        <div class="text-xs text-muted">Click to view profile</div>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button type="button" class="btn btn-outline btn-block" onclick="toggleTheme()">
                        ${themeIcon} Toggle Theme
                    </button>
                </div>
                <a href="${dashboardPath}" class="btn btn-primary btn-block">Go to Dashboard</a>
                <button class="btn btn-outline btn-block mt-2" onclick="handleGlobalLogout()">Logout</button>
            `;
        }
    } else {
        const html = `
            <button type="button" class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">${themeIcon}</button>
            <a href="${loginPath}" class="btn btn-ghost btn-sm">Login</a>
            <a href="${loginPath}" class="btn btn-primary btn-sm">Register</a>
        `;
        authActions.innerHTML = html;

        if (mobileAuthActions) {
            mobileAuthActions.innerHTML = `
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button type="button" class="btn btn-outline btn-block" onclick="toggleTheme()">
                        ${themeIcon} Toggle Theme
                    </button>
                </div>
                <a href="${loginPath}" class="btn btn-outline btn-block">Login</a>
                <a href="${loginPath}" class="btn btn-primary btn-block mt-2">Register</a>
            `;
        }
    }
}

// Global logout handler
function handleGlobalLogout() {
    if (confirm("Are you sure you want to log out of your session?")) {
        if (window.Storage) {
            window.Storage.logout();
        }
        showToast("Logged out successfully.", "info");

        const isInPages = window.location.pathname.includes("/pages/");
        setTimeout(() => {
            window.location.href = isInPages ? "login.html" : "pages/login.html";
        }, 500);
    }
}

// ==================== STUDENT PROFILE MODAL ====================
function ensureProfileModal() {
    if (document.getElementById("profile-modal")) return;

    const modal = document.createElement("div");
    modal.id = "profile-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-card">
            <div class="modal-header">
                <h3 class="modal-title">Student Profile</h3>
                <button type="button" class="modal-close-btn" onclick="closeProfileModal()" aria-label="Close">✕</button>
            </div>
            <div class="modal-body profile-modal-body">
                <div class="profile-avatar-row">
                    <div class="profile-avatar-circle" id="profile-modal-avatar">🎓</div>
                    <div>
                        <h4 id="profile-modal-name" style="font-size: 1.25rem; font-weight: 700; color: var(--navy-dark); margin-bottom: 0.2rem;">Student Name</h4>
                        <div id="profile-modal-email" style="font-size: 0.85rem; color: var(--text-muted);">student@skilltest.com</div>
                        <div id="profile-modal-role" class="badge badge-difficulty mt-1">Junior Developer</div>
                    </div>
                </div>

                <form id="profile-edit-form" onsubmit="handleSaveProfile(event)">
                    <div class="form-group mb-2">
                        <label class="form-label" style="font-size: 0.825rem;">Full Name</label>
                        <input type="text" id="profile-input-name" class="form-control" required>
                    </div>
                    <div class="form-group mb-2">
                        <label class="form-label" style="font-size: 0.825rem;">Target Career Goal</label>
                        <input type="text" id="profile-input-role" class="form-control" placeholder="e.g. Junior Java Developer, Frontend Engineer">
                    </div>
                    <div class="disclaimer-box mb-2">
                        <strong>Notice:</strong> Profile details and assessment records are stored locally in your browser's LocalStorage for demonstration purposes. This is a frontend demo and is not intended as production secure authentication.
                    </div>
                    <div class="modal-actions" style="margin-top: 1rem;">
                        <button type="button" class="btn btn-outline" onclick="closeProfileModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Profile Changes</button>
                    </div>
                </form>

                <div style="padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Session Management</span>
                    <button type="button" class="btn btn-ghost btn-sm" style="color: var(--danger);" onclick="closeProfileModal(); handleGlobalLogout();">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openProfileModal() {
    ensureProfileModal();
    const modal = document.getElementById("profile-modal");
    if (!modal) return;

    const profile = window.Storage ? window.Storage.getProfile() : {};
    const user = window.Storage ? window.Storage.getUser() : null;

    const name = (user && user.name) ? user.name : (profile.name || "Student Learner");
    const email = (user && user.email) ? user.email : (profile.email || "student@skilltest.com");
    const role = profile.targetCareer || profile.role || "Aspiring Developer";

    const nameEl = document.getElementById("profile-modal-name");
    const emailEl = document.getElementById("profile-modal-email");
    const roleEl = document.getElementById("profile-modal-role");
    const nameInput = document.getElementById("profile-input-name");
    const roleInput = document.getElementById("profile-input-role");

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    if (roleEl) roleEl.textContent = role;
    if (nameInput) nameInput.value = name;
    if (roleInput) roleInput.value = role;

    modal.classList.add("modal-open");
}

function closeProfileModal() {
    const modal = document.getElementById("profile-modal");
    if (modal) modal.classList.remove("modal-open");
}

function handleSaveProfile(e) {
    e.preventDefault();
    const nameInput = document.getElementById("profile-input-name");
    const roleInput = document.getElementById("profile-input-role");

    if (!nameInput || !nameInput.value.trim()) {
        showToast("Name cannot be empty.", "warning");
        return;
    }

    const updatedName = nameInput.value.trim();
    const updatedRole = roleInput ? roleInput.value.trim() : "Developer";

    if (window.Storage) {
        const currentProf = window.Storage.getProfile();
        const currentUser = window.Storage.getUser() || {};

        window.Storage.setProfile({
            ...currentProf,
            name: updatedName,
            targetCareer: updatedRole
        });

        window.Storage.setUser({
            ...currentUser,
            name: updatedName
        });
    }

    showToast("Profile details updated successfully!", "success");
    closeProfileModal();
    updateNavAuthUI();

    // If on dashboard, update dashboard user greeting
    const dashName = document.getElementById("dashboard-user-name");
    if (dashName) dashName.textContent = updatedName;
}

// ==================== MOBILE MENU ====================
function setupMobileNav() {
    const hamburger = document.getElementById("hamburger-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", isOpen);
        hamburger.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            mobileMenu.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.classList.remove("active");
        }
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.classList.remove("active");
        });
    });
}

// Utility: HTML escaping
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Format seconds into MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    updateNavAuthUI();
    setupMobileNav();
    checkBackendConnection();
});

async function checkBackendConnection() {
    if (!window.ApiService) return;
    const isOnline = await window.ApiService.checkHealth();
    let badge = document.getElementById("backend-status-badge");
    const navActions = document.querySelector(".nav-actions");
    if (!badge && navActions) {
        badge = document.createElement("span");
        badge.id = "backend-status-badge";
        badge.className = "backend-status-badge";
        badge.style.fontSize = "0.72rem";
        badge.style.padding = "3px 8px";
        badge.style.borderRadius = "12px";
        badge.style.display = "inline-flex";
        badge.style.alignItems = "center";
        badge.style.gap = "4px";
        badge.style.fontWeight = "600";
        badge.style.cursor = "default";
        badge.style.whiteSpace = "nowrap";
        navActions.appendChild(badge);
    }
    if (badge) {
        if (isOnline) {
            badge.style.background = "rgba(16, 185, 129, 0.15)";
            badge.style.color = "#10b981";
            badge.style.border = "1px solid rgba(16, 185, 129, 0.3)";
            badge.innerHTML = "● Java Backend";
            badge.title = "Connected to Spring Boot REST API at http://localhost:8080";
        } else {
            badge.style.background = "rgba(245, 158, 11, 0.15)";
            badge.style.color = "#f59e0b";
            badge.style.border = "1px solid rgba(245, 158, 11, 0.3)";
            badge.innerHTML = "○ Demo Mode";
            badge.title = "Local Demo Mode Active (Spring Boot offline)";
        }
    }
}
