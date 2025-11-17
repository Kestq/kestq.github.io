// ===============================================
// KESTQ PORTFOLIO - INTERACTIVE JAVASCRIPT
// ===============================================

// Global state and utilities
const App = {
    // Animation settings
    animationDelay: 100,
    scrollThreshold: 100,
    
    // Particle system
    particles: [],
    particleCount: 50,
    
    // Skill animations
    skillAnimations: new Set(),
    
    // Stats counter
    statsAnimated: false,
    
    // Modal states
    modalOpen: false,
    
    // Loading state
    loadingComplete: false
};

// ===============================================
// INITIALIZATION
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

App.init = function() {
    // Initialize all components
    this.initLoadingScreen();
    this.initNavigation();
    this.initParticles();
    this.initScrollAnimations();
    this.initSkillBars();
    this.initStatsCounter();
    this.initFormHandling();
    this.initModal();
    this.initSmoothScrolling();
    this.initNavbarScroll();
    
    // Set up intersection observers
    this.initIntersectionObserver();
    
    console.log('Kestq Portfolio initialized successfully!');
};

// ===============================================
// LOADING SCREEN
// ===============================================

App.initLoadingScreen = function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                this.loadingComplete = true;
                this.startHeroAnimations();
            }, 500);
        }
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, 200);
};

// ===============================================
// HERO ANIMATIONS
// ===============================================

App.startHeroAnimations = function() {
    // Start floating cards animation
    this.animateFloatingCards();
    
    // Start particles
    this.startParticles();
};

App.animateFloatingCards = function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.15) rotate(5deg)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
};

// ===============================================
// PARTICLE SYSTEM
// ===============================================

App.initParticles = function() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Create initial particles
    for (let i = 0; i < this.particleCount; i++) {
        this.createParticle(particlesContainer);
    }
};

App.createParticle = function(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 4 + 1;
    const opacity = Math.random() * 0.5 + 0.2;
    const animationDuration = Math.random() * 4 + 4;
    
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.animationDuration = `${animationDuration}s`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(particle);
    
    this.particles.push({
        element: particle,
        x: x,
        y: y,
        size: size,
        opacity: opacity,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
    });
};

App.startParticles = function() {
    const animate = () => {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= 100) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= 100) particle.vy *= -1;
            
            // Apply to DOM
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();
};

// ===============================================
// NAVIGATION
// ===============================================

App.initNavigation = function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
};

App.initNavbarScroll = function() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
};

// ===============================================
// SCROLL ANIMATIONS
// ===============================================

App.initScrollAnimations = function() {
    // Add scroll animation classes to elements
    const animatedElements = document.querySelectorAll(`
        .portal-card,
        .skill-category,
        .project-card,
        .contact-item,
        .section-header
    `);
    
    animatedElements.forEach(element => {
        element.classList.add('scroll-animate');
    });
};

App.initIntersectionObserver = function() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Special handling for skill categories
                if (entry.target.classList.contains('skill-category')) {
                    this.animateSkillBars(entry.target);
                }
                
                // Special handling for stats
                if (entry.target.classList.contains('stat-card')) {
                    this.animateStatNumber(entry.target);
                }
            }
        });
    }, options);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(`
        .scroll-animate,
        .scroll-animate-left,
        .scroll-animate-right,
        .scroll-animate-scale,
        .stat-card
    `);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
};

// ===============================================
// SKILL BARS ANIMATION
// ===============================================

App.initSkillBars = function() {
    // Initially hide all skill bars
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
};

App.animateSkillBars = function(skillCategory) {
    if (this.skillAnimations.has(skillCategory)) return;
    
    this.skillAnimations.add(skillCategory);
    const skillBars = skillCategory.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const level = bar.getAttribute('data-level') || 50;
            bar.style.setProperty('--skill-level', `${level}%`);
            bar.style.width = `${level}%`;
        }, index * 200);
    });
};

// ===============================================
// STATS COUNTER ANIMATION
// ===============================================

App.initStatsCounter = function() {
    // Initialize stat numbers to 0
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.textContent = '0';
    });
};

App.animateStatNumber = function(statCard) {
    if (this.statsAnimated) return;
    
    this.statsAnimated = true;
    const statNumber = statCard.querySelector('.stat-number');
    const target = parseInt(statNumber.getAttribute('data-target')) || 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        statNumber.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            statNumber.textContent = target;
        }
    };
    
    requestAnimationFrame(animate);
};

// ===============================================
// FORM HANDLING
// ===============================================

App.initFormHandling = function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(contactForm);
        });
    }
};

App.handleFormSubmit = function(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Show success message
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitButton.style.background = 'var(--success-color)';
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 3000);
    }, 2000);
};

// ===============================================
// MODAL FUNCTIONALITY
// ===============================================

App.initModal = function() {
    const modal = document.getElementById('comingSoonModal');
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
    
    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modalOpen) {
            this.closeModal();
        }
    });
};

App.showComingSoon = function(projectId) {
    const modal = document.getElementById('comingSoonModal');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const features = document.getElementById('modalFeatures');
    
    // Project data
    const projects = {
        'project-2': {
            title: 'Interactive Lab',
            description: 'An educational science platform featuring interactive experiments and simulations.',
            features: [
                'Physics simulation engine',
                'Chemistry reaction visualization',
                'Biology cell interactions',
                'Mathematical function plotting',
                'VR/AR integration support',
                'Collaborative multi-user sessions'
            ]
        },
        'project-3': {
            title: '3D Playground',
            description: 'A creative 3D environment for exploring procedural generation and WebXR experiences.',
            features: [
                'Real-time 3D rendering',
                'Procedural terrain generation',
                'WebXR virtual reality support',
                'Interactive object manipulation',
                'Custom shader development',
                'Multiplayer collaborative spaces'
            ]
        }
    };
    
    const project = projects[projectId];
    if (!project) return;
    
    // Populate modal content
    title.textContent = project.title;
    description.textContent = project.description;
    
    // Clear and populate features
    features.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        features.appendChild(li);
    });
    
    // Show modal
    modal.classList.add('show');
    this.modalOpen = true;
};

App.closeModal = function() {
    const modal = document.getElementById('comingSoonModal');
    modal.classList.remove('show');
    this.modalOpen = false;
};

// ===============================================
// PORTAL NAVIGATION
// ===============================================

App.navigateToProject = function(projectName) {
    // Add loading state
    const portalCard = document.querySelector(`[onclick="navigateToProject('${projectName}')"]`);
    if (portalCard) {
        portalCard.style.opacity = '0.7';
        portalCard.style.transform = 'scale(0.95)';
    }
    
    // Navigate to subfolder
    setTimeout(() => {
        if (projectName === 'phasmo-journal') {
            // Navigate to Phasmo Journal in subfolder
            window.location.href = './phasmo-journal/index.html';
        }
    }, 300);
};

// ===============================================
// SMOOTH SCROLLING
// ===============================================

App.initSmoothScrolling = function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            this.scrollToSection(targetId);
        });
    });
};

App.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = section.offsetTop - navbarHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// Throttle function for performance
App.throttle = function(func, limit) {
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
};

// Debounce function for performance
App.debounce = function(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// ===============================================
// EXTERNAL FUNCTIONS (called from HTML)
// ===============================================

// Navigate to project (called from HTML onclick)
function navigateToProject(projectName) {
    App.navigateToProject(projectName);
}

// Show coming soon modal (called from HTML onclick)
function showComingSoon(projectId) {
    App.showComingSoon(projectId);
}

// Close modal (called from HTML onclick)
function closeModal() {
    App.closeModal();
}

// Scroll to section (called from HTML onclick)
function scrollToSection(sectionId) {
    App.scrollToSection(sectionId);
}

// Download resume (called from HTML onclick)
function downloadResume() {
    // Create a dummy download link
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,This would be your resume PDF content';
    link.download = 'Kestq_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===============================================
// RESIZE HANDLER
// ===============================================

window.addEventListener('resize', App.throttle(function() {
    // Handle responsive behavior
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
}, 250));

// ===============================================
// PERFORMANCE MONITORING
// ===============================================

// Monitor performance and log warnings
if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure' && entry.duration > 100) {
                console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
}

// ===============================================
// ERROR HANDLING
// ===============================================

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===============================================
// SERVICE WORKER REGISTRATION (for offline support)
// ===============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===============================================
// ANALYTICS (placeholder)
// ===============================================

// Track page views and interactions
App.trackEvent = function(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
    
    // You could integrate with Google Analytics, Mixpanel, etc.
    // Example: gtag('event', eventName, properties);
};

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', App.throttle(() => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (maxScrollDepth % 25 === 0) { // Track every 25%
            this.trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
}, 1000));

// ===============================================
// ACCESSIBILITY ENHANCEMENTS
// ===============================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Focus management for modal
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

App.trapFocus = function(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
};

// Initialize focus trap for modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (modal.classList.contains('show')) {
                        App.trapFocus(modal);
                        const firstFocusable = modal.querySelector(focusableElements);
                        if (firstFocusable) firstFocusable.focus();
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
    }
});

// ===============================================
// PRELOADER FOR OPTIMIZATION
// ===============================================

App.preloadAssets = function() {
    // Preload critical images and fonts
    const criticalAssets = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
    ];
    
    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset;
        link.as = 'style';
        document.head.appendChild(link);
    });
};

// Initialize preloading
App.preloadAssets();

// ===============================================
// CONSOLE ART
// ===============================================

console.log(`
%c👻 Welcome to Kestq's Portfolio! 👻
%cBuilt with modern web technologies and lots of ❤️
%cWant to collaborate? Let's build something amazing together!

Website: kestq.github.io
Email: hello@kestq.dev
GitHub: @kestq
`, 
'color: #667eea; font-size: 16px; font-weight: bold;',
'color: #4facfe; font-size: 14px;',
'color: #6b7280; font-size: 12px;'
);

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}