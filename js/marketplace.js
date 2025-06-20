// Marketplace class for managing rewards and starred items
class Marketplace {
    constructor() {
        this.rewards = this.getRewardData();
        this.currentModal = null;
        
        this.init();
    }
    
    getRewardData() {
        // Use rewards from config.js and add IDs for compatibility
        if (typeof rewards !== 'undefined') {
            return rewards.map((reward, index) => ({
                id: index + 1,
                title: reward.title,
                description: reward.description,
                reward: reward.description, // Use description as reward for now
                icon: reward.icon,
                thikr: reward.thikr,
                hadith: reward.hadith,
                source: reward.source
            }));
        }
        
        // Fallback data if config.js rewards are not available
        return [
            {
                id: 1,
                title: "نخلة في الجنة",
                description: "اغتنم الفرصة وازرع نخلة في الجنة بذكر واحد فقط",
                reward: "اغتنم الفرصة وازرع نخلة في الجنة بذكر واحد فقط",
                icon: "🌴",
                thikr: "سبحان الله وبحمده",
                hadith: "من قال سبحان الله وبحمده غُرست له نخلة في الجنة",
                source: "رواه الترمذي وصححه الألباني"
            }
        ];
    }
    
    init() {
        this.setupModalEventListeners();
        this.renderMarketplace();
        
        // Ensure icons are properly initialized after DOM updates
        this.ensureIconsLoaded();
    }
    
    ensureIconsLoaded() {
        // Multiple attempts to ensure Feather icons load properly
        const initIcons = () => {
            if (window.feather) {
                feather.replace();
            }
        };
        
        // Initial load
        initIcons();
        
        // Retry after short delays
        setTimeout(initIcons, 200);
        setTimeout(initIcons, 500);
    }
    
    setupModalEventListeners() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }
    
    renderMarketplace() {
        const grid = document.getElementById('marketplaceGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.rewards.forEach((reward, index) => {
            const card = this.createRewardCard(reward, index);
            grid.appendChild(card);
        });
        
        // Initialize Feather icons after rendering cards with proper timing
        setTimeout(() => {
            if (window.feather) {
                feather.replace();
            }
        }, 100);
        
        // Animate cards
        this.animateCards();
    }
    
    createRewardCard(reward, index) {
        const card = document.createElement('div');
        card.className = 'reward-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const isStarred = window.ajrApp ? window.ajrApp.isItemStarred(reward.id) : false;
        
        card.innerHTML = `
            <button class="star-button ${isStarred ? 'starred' : ''}" data-reward-id="${reward.id}">
                <i data-feather="star"></i>
            </button>
            <div class="card-image">
                <span>${reward.icon}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${reward.title}</h3>
                <p class="card-description">${reward.description}</p>
                <div class="card-reward">
                    <strong>الثواب: ${reward.reward}</strong>
                </div>
                <button class="card-button" data-reward-id="${reward.id}">
                    عرض التفاصيل
                </button>
            </div>
        `;
        
        // Add event listeners
        const detailsButton = card.querySelector('.card-button');
        const starButton = card.querySelector('.star-button');
        
        detailsButton.addEventListener('click', () => {
            this.openModal(reward);
        });
        
        starButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStar(reward.id);
        });

        
        // Make entire card clickable
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.star-button') && !e.target.closest('.card-button')) {
                this.openModal(reward);
            }
        });
        
        return card;
    }
    
    renderStarredItems() {
        const starredGrid = document.getElementById('starredGrid');
        const emptyStarred = document.getElementById('emptyStarred');
        
        if (!starredGrid) return;
        
        const starredIds = window.ajrApp ? window.ajrApp.starredItems : [];
        const starredRewards = this.rewards.filter(reward => starredIds.includes(reward.id));
        
        if (starredRewards.length === 0) {
            if (emptyStarred) {
                emptyStarred.style.display = 'block';
            }
            // Clear other content
            const existingCards = starredGrid.querySelectorAll('.reward-card');
            existingCards.forEach(card => card.remove());
        } else {
            if (emptyStarred) {
                emptyStarred.style.display = 'none';
            }
            
            // Clear existing cards
            const existingCards = starredGrid.querySelectorAll('.reward-card');
            existingCards.forEach(card => card.remove());
            
            // Add starred cards
            starredRewards.forEach((reward, index) => {
                const card = this.createRewardCard(reward, index);
                card.classList.add('starred-item');
                starredGrid.appendChild(card);
            });
            
            // Animate cards
            this.animateCards(starredGrid);
        }
        
        // Re-initialize Feather icons
        if (window.feather) {
            feather.replace();
        }
    }
    
    toggleStar(rewardId) {
        if (window.ajrApp) {
            window.ajrApp.toggleStarredItem(rewardId);
            this.updateStarredButtons();
            
            // If currently viewing starred items, re-render
            if (window.tabSystem && window.tabSystem.currentTab === 'starred') {
                this.renderStarredItems();
            }
        }
    }
    
    updateStarredButtons() {
        const starButtons = document.querySelectorAll('.star-button[data-reward-id]');
        starButtons.forEach(button => {
            const rewardId = parseInt(button.getAttribute('data-reward-id'));
            const isStarred = window.ajrApp ? window.ajrApp.isItemStarred(rewardId) : false;
            
            button.classList.toggle('starred', isStarred);
        });
    }
    
    openModal(reward) {
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const thikr = document.getElementById('modalThikr');
        const hadith = document.getElementById('modalHadith');
        const source = document.getElementById('modalSource');
        
        if (!modal) return;
        
        // Set modal content
        if (title) title.textContent = reward.title;
        if (thikr) thikr.textContent = reward.thikr;
        if (hadith) hadith.textContent = reward.hadith;
        if (source) source.textContent = reward.source;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.currentModal = reward;
        
        // Re-initialize Feather icons in modal
        if (window.feather) {
            feather.replace();
        }
    }
    
    closeModal() {
        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        this.currentModal = null;
    }
    
    animateCards(container = null) {
        const targetContainer = container || document.getElementById('marketplaceGrid');
        if (!targetContainer) return;
        
        const cards = targetContainer.querySelectorAll('.reward-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Get reward by ID
    getRewardById(id) {
        return this.rewards.find(reward => reward.id === id);
    }
    
    // Get random reward
    getRandomReward() {
        const randomIndex = Math.floor(Math.random() * this.rewards.length);
        return this.rewards[randomIndex];
    }
}

// Utility function to format Arabic numbers
function formatArabicNumber(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
}

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard');
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}