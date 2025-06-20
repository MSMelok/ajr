// Main application controller
class AjrApp {
    constructor() {
        this.currentTab = 'prayer-calc';
        this.theme = 'light';
        this.starredItems = [];
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.loadStarredItems();
        this.setupEventListeners();
        
        // Initialize Feather icons first
        this.initializeFeatherIcons();
        
        // Initialize tab system
        window.tabSystem = new TabSystem();
        
        // Initialize calculators
        window.prayerCalculator = new PrayerCalculator();
        window.ageCalculator = new AgeCalculator();
        
        // Initialize marketplace
        window.marketplace = new Marketplace();
        
        console.log('Ajr App initialized successfully');
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // Hero CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-btn[data-tab]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tab = e.currentTarget.getAttribute('data-tab');
                if (window.tabSystem) {
                    window.tabSystem.switchTab(tab);
                }
                return false;
            });
        });
        
        // Navigation buttons
        const goToAgeCalc = document.getElementById('goToAgeCalc');
        if (goToAgeCalc) {
            goToAgeCalc.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.tabSystem) {
                    window.tabSystem.switchTab('age-calc');
                }
            });
        }
        
        const goToMarketplace = document.getElementById('goToMarketplace');
        if (goToMarketplace) {
            goToMarketplace.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.tabSystem) {
                    window.tabSystem.switchTab('marketplace');
                }
            });
        }
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('ajr-theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ajr-theme', theme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.setAttribute('data-feather', theme === 'dark' ? 'sun' : 'moon');
            // Refresh icons after setting the attribute
            this.initializeFeatherIcons();
        }
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    loadStarredItems() {
        const saved = localStorage.getItem('ajr-starred-items');
        this.starredItems = saved ? JSON.parse(saved) : [];
        console.log('Loaded starred items:', this.starredItems);
    }
    
    saveStarredItems() {
        localStorage.setItem('ajr-starred-items', JSON.stringify(this.starredItems));
    }
    
    toggleStarredItem(itemId) {
        const index = this.starredItems.indexOf(itemId);
        if (index > -1) {
            this.starredItems.splice(index, 1);
        } else {
            this.starredItems.push(itemId);
        }
        this.saveStarredItems();
        
        // Update UI
        if (window.marketplace) {
            window.marketplace.updateStarredButtons();
        }
        if (window.tabSystem && window.tabSystem.currentTab === 'starred') {
            window.marketplace.renderStarredItems();
        }
    }
    
    isItemStarred(itemId) {
        return this.starredItems.includes(itemId);
    }
    
    initializeFeatherIcons() {
        const initIcons = () => {
            if (window.feather) {
                try {
                    feather.replace();
                    console.log('Feather icons initialized successfully');
                } catch (error) {
                    console.warn('Feather icons failed to load:', error);
                }
            }
        };
        
        // Multiple initialization attempts for reliability
        initIcons();
        setTimeout(initIcons, 200);
        setTimeout(initIcons, 500);
        setTimeout(initIcons, 1000);
    }
}

// Tab System
class TabSystem {
    constructor() {
        this.currentTab = 'prayer-calc';
        this.init();
    }
    
    init() {
        this.setupTabButtons();
        this.showTab(this.currentTab);
    }
    
    setupTabButtons() {
        const tabButtons = document.querySelectorAll('.tab-button[data-tab]');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
                return false;
            });
        });
    }
    
    switchTab(tabName) {
        if (this.currentTab === tabName) return;
        
        // Validate tab exists
        const newTabContent = document.getElementById(tabName);
        if (!newTabContent) {
            console.warn(`Tab ${tabName} not found`);
            return;
        }
        
        // Hide current tab with animation
        const currentTabContent = document.getElementById(this.currentTab);
        const currentTabButtons = document.querySelectorAll(`[data-tab="${this.currentTab}"]`);
        
        if (currentTabContent) {
            currentTabContent.style.opacity = '0';
            setTimeout(() => {
                currentTabContent.classList.remove('active');
                currentTabContent.style.opacity = '';
            }, 150);
        }
        
        currentTabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show new tab with animation
        const newTabButtons = document.querySelectorAll(`[data-tab="${tabName}"]`);
        
        setTimeout(() => {
            newTabContent.classList.add('active');
            newTabContent.style.opacity = '0';
            setTimeout(() => {
                newTabContent.style.opacity = '1';
            }, 50);
        }, 150);
        
        newTabButtons.forEach(button => {
            button.classList.add('active');
        });
        
        this.currentTab = tabName;
        
        // Special handling for marketplace and starred tabs
        setTimeout(() => {
            if (tabName === 'marketplace' && window.marketplace) {
                window.marketplace.renderMarketplace();
            } else if (tabName === 'starred' && window.marketplace) {
                window.marketplace.renderStarredItems();
            }
        }, 200);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Re-initialize icons after tab switch
        setTimeout(() => {
            if (window.feather) {
                feather.replace();
            }
        }, 300);
    }
    
    showTab(tabName) {
        this.switchTab(tabName);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ajrApp = new AjrApp();
    console.log('App loaded successfully');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.feather) {
        feather.replace();
    }
});

// Reinitialize icons when the page becomes visible (for better reliability)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.feather) {
        feather.replace();
    }
});