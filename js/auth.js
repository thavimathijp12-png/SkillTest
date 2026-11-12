/**
 * SkillTest - Authentication & Form Validation
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const nameInput = document.getElementById("fullname");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const quickDemoBtn = document.getElementById("quick-demo-btn");

    // If user is already logged in, show existing session alert or allow direct continue
    const existingUser = window.Storage ? window.Storage.getUser() : null;
    const sessionNotice = document.getElementById("existing-session-notice");
    if (existingUser && sessionNotice) {
        sessionNotice.style.display = "block";
        const sessionName = document.getElementById("existing-user-name");
        if (sessionName) sessionName.textContent = existingUser.name || existingUser.email;
    }

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");
            togglePasswordBtn.textContent = isPassword ? "🔒" : "👁️";
            togglePasswordBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
        });
    }

    // Quick Demo Credentials Auto-Fill & Submit
    if (quickDemoBtn) {
        quickDemoBtn.addEventListener("click", () => {
            if (nameInput) nameInput.value = "Demo Student";
            if (emailInput) emailInput.value = "demo@skilltest.edu";
            if (passwordInput) passwordInput.value = "demo123";
            clearAllErrors();
            showToast("Demo credentials filled! Logging in...", "info");
            setTimeout(() => {
                performLogin("Demo Student", "demo@skilltest.edu", "demo123");
            }, 600);
        });
    }

    // Input blur / input event listeners to clear error dynamically
    [emailInput, passwordInput, nameInput].forEach(input => {
        if (!input) return;
        input.addEventListener("input", () => {
            clearFieldError(input);
        });
    });

    // Form submission
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clearAllErrors();

            let isValid = true;

            // Validate Name (if provided)
            let nameVal = nameInput ? nameInput.value.trim() : "";
            if (nameInput && nameVal.length < 2) {
                showFieldError(nameInput, "Please enter your full name (at least 2 characters).");
                isValid = false;
            }

            // Validate Email
            const emailVal = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal) {
                showFieldError(emailInput, "Email address is required.");
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                showFieldError(emailInput, "Please enter a valid email address (e.g., student@example.com).");
                isValid = false;
            }

            // Validate Password
            const passwordVal = passwordInput.value;
            if (!passwordVal) {
                showFieldError(passwordInput, "Password is required.");
                isValid = false;
            } else if (passwordVal.length < 6) {
                showFieldError(passwordInput, "Password must be at least 6 characters long.");
                isValid = false;
            }

            if (!isValid) {
                showToast("Please correct the errors in the form.", "warning");
                return;
            }

            // If name wasn't provided, derive friendly name from email
            if (!nameVal) {
                const prefix = emailVal.split("@")[0];
                nameVal = prefix.charAt(0).toUpperCase() + prefix.slice(1);
            }

            performLogin(nameVal, emailVal, passwordVal);
        });
    }

    async function performLogin(name, email, password = "password123") {
        const submitBtn = document.getElementById("submit-btn");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> Signing in...`;
        }

        const user = {
            name: name,
            email: email,
            loggedInAt: new Date().toISOString()
        };

        // Attempt live Java Spring Boot Authentication
        if (window.ApiService) {
            try {
                let authRes;
                try {
                    authRes = await window.ApiService.login(email, password);
                } catch (loginErr) {
                    // If account doesn't exist, automatically register student
                    authRes = await window.ApiService.register(name, email, password);
                }
                if (authRes && authRes.id) {
                    user.id = authRes.id;
                    user.token = authRes.token;
                    user.role = authRes.role;
                    console.log("Authenticated via Java Backend:", authRes);
                }
            } catch (err) {
                console.warn("Backend auth unavailable, falling back to local session:", err.message);
            }
        }

        if (window.Storage) {
            window.Storage.setUser(user);
        }

        showToast(`Welcome, ${name}! Redirecting to Dashboard...`, "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);
    }

    function showFieldError(inputElement, message) {
        inputElement.classList.add("input-error");
        const errorContainer = document.getElementById(`${inputElement.id}-error`);
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = "block";
        }
    }

    function clearFieldError(inputElement) {
        inputElement.classList.remove("input-error");
        const errorContainer = document.getElementById(`${inputElement.id}-error`);
        if (errorContainer) {
            errorContainer.textContent = "";
            errorContainer.style.display = "none";
        }
    }

    function clearAllErrors() {
        document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
        document.querySelectorAll(".form-error-msg").forEach(el => {
            el.textContent = "";
            el.style.display = "none";
        });
    }
});

