/* ============================================
   Mobile Navigation Toggle
   ============================================ */

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
mobileNavLinks.forEach(link => {
    link.addEventListener('click', function () {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    if (!mobileNav || !hamburger) return;
    const isClickInsideNav = mobileNav.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger && mobileNav.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
    }
});

/* ============================================
   Contact Form Handling
   ============================================ */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (name === '' || email === '' || message === '') {
            alert('Please fill in all fields');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Success message
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}`);

        // Reset form
        contactForm.reset();

        // Add a success animation
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = '✓ Message Sent!';
        submitButton.style.backgroundColor = '#28a745';

        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
        }, 3000);
    });
}

/* ============================================
   Smooth Scroll Enhancement
   ============================================ */

// Add smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu if open
                if (hamburger) hamburger.classList.remove('active');
                if (mobileNav) mobileNav.classList.remove('active');

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ============================================
   Scroll Animation for Elements
   ============================================ */

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and destination cards
document.querySelectorAll('.feature-card, .destination-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ============================================
   Header Scroll Effect
   ============================================ */

let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
    if (!header) return;
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

/* ============================================
   Active Navigation Link
   ============================================ */

function updateActiveNav() {
    let scrollPosition = window.scrollY + 150;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    let currentSection = 'home';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update desktop nav
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });

    // Update mobile nav
    mobileLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

/* ============================================
   CTA Button Scroll to Next Section
   ============================================ */

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function () {
        const destinationsSection = document.getElementById('destinations');
        if (destinationsSection) {
            destinationsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/* ============================================
   Page Load Animation
   ============================================ */

window.addEventListener('load', function () {
    document.body.style.opacity = '1';
});

/* ============================================
   Resize handling for responsive behavior
   ============================================ */

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
    }
});

/* ============================================
   AUTH SYSTEM – Signup & Signin
   ============================================ */

(function () {
    'use strict';

    /* --------------------------------------------------
       Utility helpers
    -------------------------------------------------- */

    function $(id) { return document.getElementById(id); }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^\d{10}$/;
    const ALPHA_REGEX = /^[A-Za-z\s]+$/;
    const PW_REGEX    = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    function setValid(fieldId) {
        var wrap = document.getElementById('field-' + fieldId);
        if (!wrap) return;
        wrap.classList.remove('is-error');
        wrap.classList.add('is-valid');
        var err = document.getElementById('err-' + fieldId);
        if (err) err.textContent = '';
    }

    function setError(fieldId, msg) {
        var wrap = document.getElementById('field-' + fieldId);
        if (!wrap) return;
        wrap.classList.remove('is-valid');
        wrap.classList.add('is-error');
        var err = document.getElementById('err-' + fieldId);
        if (err) err.textContent = msg;
    }

    function clearState(fieldId) {
        var wrap = document.getElementById('field-' + fieldId);
        if (!wrap) return;
        wrap.classList.remove('is-valid', 'is-error');
        var err = document.getElementById('err-' + fieldId);
        if (err) err.textContent = '';
    }

    function showMsg(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.className = type === 'success' ? 'auth-success visible' : 'auth-global-error visible';
    }

    function hideMsg(el) {
        if (!el) return;
        el.textContent = '';
        el.classList.remove('visible');
    }

    function fakeAsync(btn, cb) {
        btn.disabled = true;
        btn.classList.add('loading');
        setTimeout(function () {
            btn.disabled = false;
            btn.classList.remove('loading');
            cb();
        }, 700);
    }

    /* --------------------------------------------------
       localStorage helpers
    -------------------------------------------------- */

    var STORAGE_KEY = 'wanderlust_users';

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    function findUser(email) {
        return getUsers().find(function (u) {
            return u.email.toLowerCase() === email.toLowerCase();
        });
    }

    function registerUser(data) {
        var users = getUsers();
        users.push(data);
        saveUsers(users);
    }

    /* --------------------------------------------------
       Password toggle – works on both auth pages
    -------------------------------------------------- */

    document.querySelectorAll('.auth-toggle-pw').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = this.dataset.target;
            var input = document.getElementById(targetId);
            if (!input) return;
            var isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            var icon = this.querySelector('.eye-icon');
            if (icon) icon.textContent = isHidden ? '🙈' : '👁️';
        });
    });

    /* ==================================================
       SIGNUP PAGE
    ================================================== */

    var signupForm = $('signupForm');

    if (signupForm) {

        var signupFields = ['fullName', 'email', 'phone', 'location', 'password', 'confirmPassword'];

        /* Live validation on blur / input */
        signupFields.forEach(function (id) {
            var input = $(id);
            if (!input) return;
            input.addEventListener('blur', function () { validateSignupField(id); });
            input.addEventListener('input', function () {
                var wrap = document.getElementById('field-' + id);
                if (wrap && wrap.classList.contains('is-error')) {
                    validateSignupField(id);
                }
            });
        });

        function validateSignupField(id) {
            var input = $(id);
            if (!input) return true;
            var val = input.value.trim();

            switch (id) {
                case 'fullName':
                    if (!val) { setError(id, 'Full name is required.'); return false; }
                    setValid(id); return true;

                case 'email':
                    if (!val) { setError(id, 'Email is required.'); return false; }
                    if (!EMAIL_REGEX.test(val)) { setError(id, 'Enter a valid email address.'); return false; }
                    setValid(id); return true;

                case 'phone':
                    if (!val) { setError(id, 'Phone number is required.'); return false; }
                    if (!PHONE_REGEX.test(val)) { setError(id, 'Phone must be exactly 10 digits.'); return false; }
                    setValid(id); return true;

                case 'location':
                    if (!val) { setError(id, 'City / Location is required.'); return false; }
                    if (!ALPHA_REGEX.test(val)) { setError(id, 'Location must contain only letters.'); return false; }
                    setValid(id); return true;

                case 'password':
                    if (!val) { setError(id, 'Password is required.'); return false; }
                    if (!PW_REGEX.test(val)) { setError(id, 'Min 8 characters with at least one letter and one number.'); return false; }
                    // Re-validate confirm password if already filled
                    var conf = $('confirmPassword');
                    if (conf && conf.value) validateSignupField('confirmPassword');
                    setValid(id); return true;

                case 'confirmPassword':
                    var pw = $('password') ? $('password').value.trim() : '';
                    if (!val) { setError(id, 'Please confirm your password.'); return false; }
                    if (val !== pw) { setError(id, 'Passwords do not match.'); return false; }
                    setValid(id); return true;

                default:
                    return true;
            }
        }

        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all fields together
            var allValid = signupFields.reduce(function (acc, id) {
                return validateSignupField(id) && acc;
            }, true);

            if (!allValid) return;

            // FIX: Read all values immediately before any async delay
            var fullName = $('fullName').value.trim();
            var email    = $('email').value.trim().toLowerCase();
            var phone    = $('phone').value.trim();
            var location = $('location').value.trim();
            var password = $('password').value.trim(); // FIX: trim before storing

            var btn   = $('signupBtn');
            var msgEl = $('signupSuccess');

            fakeAsync(btn, function () {

                // Block duplicate accounts
                if (findUser(email)) {
                    setError('email', 'An account with this email already exists.');
                    return;
                }

                // Persist trimmed values to localStorage
                registerUser({
                    fullName : fullName,
                    email    : email,
                    phone    : phone,
                    location : location,
                    password : password // FIX: stored as trimmed value
                });

                showMsg(msgEl, ' Account created! Redirecting to Sign In…', 'success');
                signupForm.reset();
                signupFields.forEach(function (id) { clearState(id); });

                setTimeout(function () {
                    window.location.href = 'signin.html';
                }, 1800);
            });
        });
    }

    /* ==================================================
       SIGNIN PAGE
    ================================================== */

    var signinForm = $('signinForm');

    if (signinForm) {

        var signinFields = ['si-email', 'si-password'];

        /* Live validation on blur / input */
        signinFields.forEach(function (id) {
            var input = $(id);
            if (!input) return;
            input.addEventListener('blur', function () { validateSigninField(id); });
            input.addEventListener('input', function () {
                var wrap = document.getElementById('field-' + id);
                if (wrap && wrap.classList.contains('is-error')) {
                    validateSigninField(id);
                }
                hideMsg($('si-global-error'));
            });
        });

        function validateSigninField(id) {
            var input = $(id);
            if (!input) return true;
            var val = input.value.trim();

            switch (id) {
                case 'si-email':
                    if (!val) { setError(id, 'Email is required.'); return false; }
                    if (!EMAIL_REGEX.test(val)) { setError(id, 'Enter a valid email address.'); return false; }
                    setValid(id); return true;

                case 'si-password':
                    if (!val) { setError(id, 'Password is required.'); return false; }
                    setValid(id); return true;

                default:
                    return true;
            }
        }

        signinForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var valid = signinFields.reduce(function (acc, id) {
                return validateSigninField(id) && acc;
            }, true);

            if (!valid) return;

            // FIX: Read values immediately on submit — before the 700ms async delay
            var email = $('si-email').value.trim().toLowerCase();
            var pw    = $('si-password').value.trim(); // FIX: trim to match stored value

            var btn      = $('signinBtn');
            var globalEl = $('si-global-error');
            hideMsg(globalEl);

            fakeAsync(btn, function () {
                var user = findUser(email); // FIX: uses pre-captured email value

                // FIX: compare trimmed passwords on both sides
                if (!user || user.password.trim() !== pw) {
                    showMsg(globalEl, '❌ Incorrect email or password. Please try again.', 'error');
                    var pwWrap = document.getElementById('field-si-password');
                    if (pwWrap) {
                        pwWrap.classList.add('is-error');
                        var errEl = $('err-si-password');
                        if (errEl) errEl.textContent = '';
                    }
                    return;
                }

                // Successful login – redirect to travel app
                window.location.href = 'index.html';
            });
        });
    }

})(); // end AUTH IIFE