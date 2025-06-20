// Tab System
class TabSystem {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.activeTab = 'prayer-calc';
        
        this.init();
    }
    
    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        // Remove active class from all tabs
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.classList.add('active');
            this.activeTab = tabId;
            
            // Update starred tab when switching to it
            if (tabId === 'starred' && window.marketplaceManager) {
                window.marketplaceManager.renderStarredCards();
            }
        }
    }
}

// Main application controller
class App {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        
        this.init();
    }
    
    init() {
        this.setupTheme();
        this.setupScrollEffects();
        this.setupAnimations();
    }
    
    setupTheme() {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Theme toggle event
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme icon
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Add theme transition class
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }
    
    setupScrollEffects() {
        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections for animations
        document.querySelectorAll('.calculator-section, .marketplace-section').forEach(section => {
            observer.observe(section);
        });
    }
    
    setupAnimations() {
        // Add stagger animation to marketplace cards
        const cards = document.querySelectorAll('.reward-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
        
        // Header scroll behavior
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) { // Start hiding after 100px scroll
                header.classList.add('scrolled');
                
                // Show header when scrolling up, hide when scrolling down
                if (scrollTop < lastScrollTop) {
                    header.classList.add('visible');
                } else {
                    header.classList.remove('visible');
                }
            } else {
                // Show header normally when at top
                header.classList.remove('scrolled', 'visible');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }
    
    // Utility method to show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontFamily: '"Tajawal", sans-serif',
            fontSize: '0.9rem',
            zIndex: '1002',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        };
        
        const colors = {
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        
        Object.assign(notification.style, styles);
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Method to handle responsive behavior
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    window.tabSystem = new TabSystem(); // Make tab system globally accessible
    
    // Handle window resize
    window.addEventListener('resize', () => app.handleResize());
    app.handleResize(); // Initial call
    
    // Add loading complete class
    document.body.classList.add('loaded');
});

// Service Worker registration (optional for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be implemented later if needed
        console.log('App loaded successfully');
    });
}

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can implement error reporting here
});

// Handle offline/online status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});
