// --- Dark Mode Toggle Functionality ---
const themeToggleBtns = [
    document.getElementById('theme-toggle'),
    document.getElementById('mobile-theme-toggle')
];

const darkIcons = [
    document.getElementById('theme-toggle-dark-icon'),
    document.getElementById('mobile-theme-toggle-dark-icon')
];

const lightIcons = [
    document.getElementById('theme-toggle-light-icon'),
    document.getElementById('mobile-theme-toggle-light-icon')
];

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialize theme
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    showDarkIcons();
} else {
    document.documentElement.classList.remove('dark');
    showLightIcons();
}

function showDarkIcons() {
    darkIcons.forEach(icon => {
        if (icon) icon.classList.remove('hidden');
    });
    lightIcons.forEach(icon => {
        if (icon) icon.classList.add('hidden');
    });
}

function showLightIcons() {
    lightIcons.forEach(icon => {
        if (icon) icon.classList.remove('hidden');
    });
    darkIcons.forEach(icon => {
        if (icon) icon.classList.add('hidden');
    });
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');

    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        showDarkIcons();
    } else {
        localStorage.setItem('theme', 'light');
        showLightIcons();
    }
}

// Add event listeners to both toggle buttons
themeToggleBtns.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.documentElement.classList.add('dark');
            showDarkIcons();
        } else {
            document.documentElement.classList.remove('dark');
            showLightIcons();
        }
    }
});

// --- Mobile Menu Toggle ---
const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
} else {
    console.error("Mobile menu button or menu element not found.");
}


// --- Set current year in footer ---
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
} else {
    console.error("Current year element not found.");
}


// --- Enhanced Intersection Observer for scroll animations and active nav link ---
const sections = document.querySelectorAll('section'); // Get all sections
const navLinks = document.querySelectorAll('.nav-link');
const navActiveColor = '#8E5572'; // Eggplant for active link

if (sections.length > 0) {
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '-100px 0px -100px 0px', // Adjust rootMargin for better trigger timing
        threshold: [0.15, 0.5] // Multiple thresholds for smoother transitions
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Section Animation Logic
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the animation
                entry.target.classList.add('is-visible');
                
                // Add a staggered animation to children elements
                const animatedElements = entry.target.querySelectorAll('.bg-white');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(20px)';
                        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100); // Stagger the animations
                });

                // Active Nav Link Logic (only if navLinks exist)
                if (navLinks.length > 0) {
                    const targetId = entry.target.id;
                    
                    // Only change active link if section is more than 50% visible
                    if (entry.intersectionRatio >= 0.5) {
                        navLinks.forEach(link => {
                            link.classList.remove('nav-link-active');
                            link.style.color = ''; // Reset color explicitly
                            
                            // Check if the link's href matches the intersecting section's ID
                            if (link.getAttribute('href') === `#${targetId}`) {
                                link.classList.add('nav-link-active');
                                link.style.color = navActiveColor; // Apply active color
                            }
                        });
                    }
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
} else {
    console.warn("No sections found for Intersection Observer.");
}


// --- Enhanced Typewriter Effect with more dynamic timing ---
const jobTitleElement = document.getElementById('job-title');
const cursorElement = document.getElementById('cursor');
const titles = ['Microsoft Certified Azure Data Scientist Associate', 'Data Analyst', 'Machine Learning Engineer', 'AI Engineer'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeedBase = 100;
const deleteSpeedBase = 50;
const pauseDuration = 1500;

function typeEffect() {
    if (!jobTitleElement || !cursorElement) {
        return;
    }

    const currentTitle = titles[titleIndex];
    
    // Add randomness to typing speed for more natural effect
    const randomSpeed = Math.floor(Math.random() * 50);
    let timeoutSpeed;

    if (isDeleting) {
        jobTitleElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        timeoutSpeed = deleteSpeedBase + randomSpeed;

        if (charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            timeoutSpeed = pauseDuration / 2;
        }
    } else {
        jobTitleElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        
        // Slow down typing at end of words for more natural effect
        if (charIndex === currentTitle.length) {
            timeoutSpeed = pauseDuration;
            isDeleting = true;
        } else {
            // Slight pause at commas and periods
            const currentChar = currentTitle.charAt(charIndex - 1);
            if (currentChar === ',' || currentChar === '.') {
                timeoutSpeed = typeSpeedBase * 3 + randomSpeed;
            } else {
                timeoutSpeed = typeSpeedBase + randomSpeed;
            }
        }
    }

    setTimeout(typeEffect, timeoutSpeed);
}

// Add subtle cursor movement animation
function animateCursor() {
    if (cursorElement) {
        cursorElement.style.animation = 'none';
        cursorElement.offsetHeight; // Trigger reflow
        cursorElement.style.animation = 'blink 1s step-end infinite';
    }
}

if (jobTitleElement && cursorElement) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            typeEffect();
            setInterval(animateCursor, 5000); // Periodically reset cursor animation
        }, pauseDuration / 2);
    });
} else {
    console.error("Job title or cursor element not found. Typewriter effect not started.");
}

// --- Add parallax scroll effect to profile image ---
const profileImage = document.querySelector('img[alt="Yaksh Shah Profile Picture"]');
if (profileImage) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < 600) { // Only apply effect near the top of the page
            const translateY = scrollPosition * 0.05; // Adjust the multiplier for effect intensity
            profileImage.style.transform = `translateY(${translateY}px)`;
        }
    });
}

// --- Add hover effects to project cards ---
const projectCards = document.querySelectorAll('#projects .bg-white');
projectCards.forEach(card => {
    const projectImage = card.querySelector('.project-image');
    
    card.addEventListener('mouseenter', () => {
        if (projectImage) {
            projectImage.style.transform = 'scale(1.05)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (projectImage) {
            projectImage.style.transform = 'scale(1)';
        }
    });
});

// --- Add "scroll to top" button ---
document.addEventListener('DOMContentLoaded', function() {
    // Create the button element
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn hidden';
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });
    
    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// --- Add animation to skill tags ---
const skillTags = document.querySelectorAll('.skill-tag, [class*="rounded-full"]');
skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-3px)';
        tag.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = '';
        tag.style.boxShadow = '';
    });
});

// --- Initialize page extras ---
document.addEventListener('DOMContentLoaded', function() {
    // Add staggered animations to skill cards
    const skillCards = document.querySelectorAll('#skills .bg-white');
    skillCards.forEach((card, index) => {
        card.setAttribute('data-delay', index * 100);
        card.style.transitionDelay = (index * 0.1) + 's';
    });
    
    // Add page loaded class to body
    document.body.classList.add('page-loaded');
});

// --- Enhance card hover effects ---
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to all card elements
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add shine effect to buttons
    const buttons = document.querySelectorAll('.bg-\\[\\#8E5572\\], .bg-\\[\\#BCAA99\\]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});

// --- Timeline Animation ---
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineLine = document.querySelector('.timeline-line');
    
    // Make sure timeline items are visible immediately
    timelineItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.classList.add('animate-in');
    });
    
    // Ensure timeline line is visible
    if (timelineLine) {
        timelineLine.style.opacity = '1';

        // Create the line gradient fill effect
        const lineAfter = document.createElement('div');
        lineAfter.className = 'timeline-line-fill';
        lineAfter.style.position = 'absolute';
        lineAfter.style.top = '0';
        lineAfter.style.left = '0';
        lineAfter.style.width = '100%';
        lineAfter.style.height = '0%';
        lineAfter.style.background = 'linear-gradient(to bottom, #8E5572, #BBBE64)';
        lineAfter.style.animation = 'growDown 2s ease forwards';
        lineAfter.style.animationDelay = '0.5s';

        timelineLine.appendChild(lineAfter);
    }
    
    // Optional: Add scroll-triggered animations that don't hide content
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timelineCard = entry.target.querySelector('.timeline-card');
                if (timelineCard) {
                    timelineCard.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        timelineCard.style.transform = 'translateY(0)';
                    }, 200);
                }
            }
        });
    }, {
        rootMargin: '-100px 0px -100px 0px',
        threshold: 0.3
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('show-more-btn');
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    let projectsVisible = false;
    
    // Initially hide the projects with the 'hidden-project' class
    hiddenProjects.forEach(project => {
        project.style.display = 'none';
    });
    
    // Toggle visibility when button is clicked
    showMoreBtn.addEventListener('click', function() {
        if (!projectsVisible) {
            // Show all hidden projects with animation
            hiddenProjects.forEach((project, index) => {
                setTimeout(() => {
                    project.style.display = 'flex';
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 150); // Stagger the animations
            });
            showMoreBtn.textContent = 'Show Fewer Projects';
            projectsVisible = true;
        } else {
            // Hide all projects with 'hidden-project' class
            hiddenProjects.forEach(project => {
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    project.style.display = 'none';
                }, 500); // Wait for fade out animation to complete
            });
            showMoreBtn.textContent = 'Show More Projects';
            projectsVisible = false;
            
            // Scroll back to projects section
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
    });
});