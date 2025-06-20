// Age Calculator class
class AgeCalculator {
    constructor() {
        this.results = {
            totalLifeYears: 0,
            timeLostYears: 0,
            worshipTimeYears: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
    }
    
    setupEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }
        
        // Auto-save input changes
        const inputs = ['ageInput', 'sleepInput', 'bathroomInput', 'workInput', 'eatingInput'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.saveInputData());
            }
        });
    }
    
    loadSavedData() {
        const saved = localStorage.getItem('ajr-calculator-data');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Load saved input values
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input && data[key] !== undefined) {
                    input.value = data[key];
                }
            });
        }
    }
    
    saveInputData() {
        const data = {};
        const inputs = ['ageInput', 'sleepInput', 'bathroomInput', 'workInput', 'eatingInput'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                data[inputId] = input.value;
            }
        });
        
        localStorage.setItem('ajr-calculator-data', JSON.stringify(data));
    }
    
    calculate() {
        // Get input values with defaults
        const expectedAge = parseFloat(document.getElementById('ageInput')?.value) || 70;
        const sleepHours = parseFloat(document.getElementById('sleepInput')?.value) || 8;
        const bathroomMinutes = parseFloat(document.getElementById('bathroomInput')?.value) || 30;
        const workHours = parseFloat(document.getElementById('workInput')?.value) || 8;
        const eatingMinutes = parseFloat(document.getElementById('eatingInput')?.value) || 120;
        
        // Calculate total life years after puberty (assuming puberty at 14)
        const totalLifeYears = Math.max(0, expectedAge - 14);
        
        // Calculate daily time lost (in hours)
        const dailyTimeLost = sleepHours + (bathroomMinutes / 60) + workHours + (eatingMinutes / 60);
        
        // Calculate yearly time lost
        const yearlyTimeLost = (dailyTimeLost * 365) / (24 * 365); // Convert to fraction of year
        
        // Calculate total time lost in years
        const timeLostYears = yearlyTimeLost * totalLifeYears;
        
        // Calculate available worship time
        const worshipTimeYears = Math.max(0, totalLifeYears - timeLostYears);
        
        // Store results
        this.results = {
            totalLifeYears: Math.round(totalLifeYears * 10) / 10,
            timeLostYears: Math.round(timeLostYears * 10) / 10,
            worshipTimeYears: Math.round(worshipTimeYears * 10) / 10
        };
        
        // Display results
        this.displayResults();
        
        // Save calculation
        this.saveInputData();
        
        // Add animation
        this.animateResults();
    }
    
    displayResults() {
        const totalLifeElement = document.getElementById('totalLifeYears');
        const timeLostElement = document.getElementById('timeLostYears');
        const worshipTimeElement = document.getElementById('worshipTimeYears');
        
        if (totalLifeElement) {
            totalLifeElement.textContent = this.results.totalLifeYears.toFixed(1);
        }
        
        if (timeLostElement) {
            timeLostElement.textContent = this.results.timeLostYears.toFixed(1);
        }
        
        if (worshipTimeElement) {
            worshipTimeElement.textContent = this.results.worshipTimeYears.toFixed(1);
        }
        
        // Show results container
        const resultsContainer = document.getElementById('calculatorResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'grid';
        }
    }
    
    animateResults() {
        const resultItems = document.querySelectorAll('#calculatorResults .result-item');
        resultItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    getResults() {
        return this.results;
    }
    
    // Utility method to format time
    formatTime(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)} دقيقة`;
        } else if (hours < 24) {
            return `${Math.round(hours * 10) / 10} ساعة`;
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = Math.round((hours % 24) * 10) / 10;
            return `${days} يوم و ${remainingHours} ساعة`;
        }
    }
}