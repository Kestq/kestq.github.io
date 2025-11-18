// ===============================================
// KEST DESIGNS PORTAL - INTERACTIVE FEATURES
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCurrentYear();
    initSmoothScrolling();
    initActiveNavigation();
    initMobileNavigation();
    initScrollReveal();
    initTiltEffect();
});

// ===============================================
// CURRENT YEAR
// ===============================================
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===============================================
// SMOOTH SCROLLING
// ===============================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('[data-scroll]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-scroll');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = 80; // Height of sticky nav
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                nav.classList.remove('nav-mobile-open');
            }
        });
    });
}

// ===============================================
// ACTIVE NAVIGATION
// ===============================================
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100; // Offset for nav height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active to current section's nav link
                const activeLink = document.querySelector(`[data-scroll="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateActiveNav();
}

// ===============================================
// MOBILE NAVIGATION
// ===============================================
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-mobile-open');
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            nav.classList.contains('nav-mobile-open') ? 
                animateHamburgerOpen(spans) : 
                animateHamburgerClose(spans);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('nav-mobile-open');
                const spans = navToggle.querySelectorAll('span');
                animateHamburgerClose(spans);
            }
        });
    }
}

function animateHamburgerOpen(spans) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
}

function animateHamburgerClose(spans) {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// ===============================================
// SCROLL REVEAL ANIMATIONS
// ===============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .lower-section');
    
    // Add reveal class to elements that don't have it
    revealElements.forEach(element => {
        if (!element.classList.contains('reveal')) {
            element.classList.add('reveal');
        }
    });
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve to prevent re-triggering
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all reveal elements
    const allRevealElements = document.querySelectorAll('.reveal');
    allRevealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// ===============================================
// TILT EFFECT
// ===============================================
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        // Add event listeners for mouse move and leave
        element.addEventListener('mousemove', handleTiltMove);
        element.addEventListener('mouseleave', handleTiltLeave);
        
        // Set perspective for 3D effect
        element.style.perspective = '900px';
    });
}

function handleTiltMove(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Calculate mouse position relative to element center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (mouseY - centerY) / centerY * -10; // Max 10 degrees
    const rotateY = (mouseX - centerX) / centerX * 10;  // Max 10 degrees
    
    // Apply transform with subtle lift
    element.style.transform = `
        perspective(900px) 
        translate3d(0, -6px, 10px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
    `;
    
    // Update glow position based on mouse
    const glow = element.querySelector('.project-glow');
    if (glow) {
        const glowX = (mouseX / rect.width) * 100;
        const glowY = (mouseY / rect.height) * 100;
        glow.style.left = glowX + '%';
        glow.style.top = glowY + '%';
    }
}

function handleTiltLeave(e) {
    const element = e.currentTarget;
    
    // Smoothly reset transform
    element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.transform = `
        perspective(900px) 
        translate3d(0, 0, 0)
    `;
    
    // Reset glow
    const glow = element.querySelector('.project-glow');
    if (glow) {
        glow.style.left = '50%';
        glow.style.top = '10%';
    }
    
    // Remove transition after animation completes
    setTimeout(() => {
        element.style.transition = '';
    }, 300);
}

// ===============================================
// PERFORMANCE OPTIMIZATIONS
// ===============================================

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        // Add any background images here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload after DOM is ready
setTimeout(preloadImages, 1000);

// ===============================================
// ACCESSIBILITY ENHANCEMENTS
// ===============================================

// Keyboard navigation for tilt effects
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Reset any tilt effects when ESC is pressed
        const tiltElements = document.querySelectorAll('[data-tilt]');
        tiltElements.forEach(element => {
            element.style.transform = `
                perspective(900px) 
                translate3d(0, 0, 0)
            `;
        });
        
        // Close mobile menu
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.classList.remove('nav-mobile-open');
        }
    }
});

// Focus management for better accessibility
document.addEventListener('focusin', function(e) {
    const element = e.target;
    if (element.matches('.project-card')) {
        element.style.outline = '2px solid var(--neon-pink)';
        element.style.outlineOffset = '4px';
    }
});

document.addEventListener('focusout', function(e) {
    const element = e.target;
    if (element.matches('.project-card')) {
        element.style.outline = '';
        element.style.outlineOffset = '';
    }
});

// ===============================================
// ERROR HANDLING
// ===============================================

// Global error handler for any JS errors
window.addEventListener('error', function(e) {
    console.warn('Portal script error:', e.error);
    // Continue execution without breaking the page
});

// Handle missing elements gracefully
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}