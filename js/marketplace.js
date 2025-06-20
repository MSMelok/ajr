// Marketplace functionality
class MarketplaceManager {
    constructor() {
        this.gridContainer = document.getElementById('marketplaceGrid');
        this.starredGrid = document.getElementById('starredGrid');
        this.emptyStarred = document.getElementById('emptyStarred');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalThikr = document.getElementById('modalThikr');
        this.modalHadith = document.getElementById('modalHadith');
        this.modalSource = document.getElementById('modalSource');
        this.modalClose = document.getElementById('modalClose');
        
        // Load starred items from localStorage
        this.starredItems = this.loadStarredItems();
        
        this.init();
    }
    
    init() {
        this.renderCards();
        this.renderStarredCards();
        this.updateStarredTabBadge();
        this.setupModalEvents();
    }
    
    renderCards() {
        if (!this.gridContainer) {
            console.error('Grid container not found');
            return;
        }
        
        if (typeof rewards === 'undefined') {
            console.error('Rewards data not found - waiting for config.js to load');
            // Retry after a short delay
            setTimeout(() => this.renderCards(), 100);
            return;
        }
        
        this.gridContainer.innerHTML = '';
        
        rewards.forEach((reward, index) => {
            const card = this.createCard(reward, index);
            this.gridContainer.appendChild(card);
        });
    }
    
    createCard(reward, index) {
        const card = document.createElement('div');
        card.className = 'reward-card';
        card.setAttribute('data-index', index);
        
        const isStarred = this.isStarred(index);
        
        card.innerHTML = `
            <button class="star-button ${isStarred ? 'starred' : ''}" data-index="${index}">
                ${isStarred ? '⭐' : '☆'}
            </button>
            <div class="card-image">
                <span>${reward.icon || '🎁'}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${reward.title}</h3>
                <p class="card-description">${reward.description}</p>
                <button class="card-button" data-index="${index}">تفاصيل أكثر</button>
            </div>
        `;
        
        // Add click event to star button
        const starButton = card.querySelector('.star-button');
        starButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStar(index);
        });
        
        // Add click event to button
        const button = card.querySelector('.card-button');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(reward);
        });
        
        // Add click event to entire card
        card.addEventListener('click', () => {
            this.openModal(reward);
        });
        
        return card;
    }
    
    openModal(reward) {
        this.modalTitle.textContent = reward.title;
        this.modalThikr.textContent = reward.thikr;
        this.modalHadith.textContent = reward.hadith;
        this.modalSource.textContent = reward.source;
        
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeModal() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    loadStarredItems() {
        try {
            const starred = localStorage.getItem('starredRewards');
            const items = starred ? JSON.parse(starred) : [];
            console.log('Loaded starred items:', items);
            return items;
        } catch (error) {
            console.error('Error loading starred items:', error);
            return [];
        }
    }
    
    saveStarredItems() {
        try {
            localStorage.setItem('starredRewards', JSON.stringify(this.starredItems));
            console.log('Saved starred items:', this.starredItems);
        } catch (error) {
            console.error('Error saving starred items:', error);
        }
    }
    
    isStarred(index) {
        return this.starredItems.includes(index);
    }
    
    toggleStar(index) {
        if (this.isStarred(index)) {
            this.starredItems = this.starredItems.filter(item => item !== index);
        } else {
            this.starredItems.push(index);
        }
        
        this.saveStarredItems();
        this.updateStarButtons();
        this.renderStarredCards();
        
        // Update tab badge count if needed
        this.updateStarredTabBadge();
    }
    
    updateStarButtons() {
        const starButtons = document.querySelectorAll('.star-button');
        starButtons.forEach(button => {
            const index = parseInt(button.getAttribute('data-index'));
            const isStarred = this.isStarred(index);
            
            button.className = `star-button ${isStarred ? 'starred' : ''}`;
            button.textContent = isStarred ? '⭐' : '☆';
        });
    }
    
    renderStarredCards() {
        if (!this.starredGrid) return;
        
        // Ensure rewards data is available
        if (typeof rewards === 'undefined') {
            setTimeout(() => this.renderStarredCards(), 100);
            return;
        }
        
        // Clear existing cards
        this.starredGrid.innerHTML = '';
        
        if (this.starredItems.length === 0) {
            // Show empty state
            this.starredGrid.innerHTML = `
                <div class="empty-starred">
                    <div class="empty-icon">⭐</div>
                    <h3>لا توجد مفضلة محفوظة</h3>
                    <p>ابدأ بإضافة الأعمال الصالحة إلى مفضلتك من سوق الجنة</p>
                    <button class="navigate-btn" onclick="window.tabSystem.switchTab('marketplace')">تصفح سوق الجنة</button>
                </div>
            `;
        } else {
            // Show starred cards
            this.starredItems.forEach(index => {
                if (rewards[index]) {
                    const card = this.createCard(rewards[index], index);
                    this.starredGrid.appendChild(card);
                }
            });
        }
    }
    
    updateStarredTabBadge() {
        const starredTab = document.querySelector('[data-tab="starred"]');
        if (starredTab) {
            const count = this.starredItems.length;
            if (count > 0) {
                starredTab.textContent = `المفضلة ⭐ (${count})`;
            } else {
                starredTab.textContent = 'المفضلة ⭐';
            }
        }
    }
    
    setupModalEvents() {
        // Close modal when clicking close button
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal when clicking overlay
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.marketplaceManager = new MarketplaceManager();
});
