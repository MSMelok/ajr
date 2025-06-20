// Calculator functionality
class WorshipCalculator {
    constructor() {
        this.ageInput = document.getElementById('ageInput');
        this.sleepInput = document.getElementById('sleepInput');
        this.bathroomInput = document.getElementById('bathroomInput');
        this.workInput = document.getElementById('workInput');
        this.eatingInput = document.getElementById('eatingInput');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resultsContainer = document.getElementById('calculatorResults');
        this.totalLifeElement = document.getElementById('totalLifeYears');
        this.timeLostElement = document.getElementById('timeLostYears');
        this.worshipTimeElement = document.getElementById('worshipTimeYears');
        
        this.init();
    }
    
    init() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Add input validation
        [this.ageInput, this.sleepInput, this.bathroomInput, this.workInput, this.eatingInput].forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }
    
    validateInput(input) {
        const value = parseFloat(input.value);
        if (isNaN(value) || value <= 0) {
            input.style.borderColor = '#dc3545';
            return false;
        } else {
            input.style.borderColor = 'var(--border-color)';
            return true;
        }
    }
    
    calculate() {
        // Validate all inputs
        const inputs = [this.ageInput, this.sleepInput, this.bathroomInput, this.workInput, this.eatingInput];
        const isValid = inputs.every(input => this.validateInput(input));
        
        if (!isValid) {
            this.showError('يرجى إدخال قيم صحيحة في جميع الحقول');
            return;
        }
        
        // Get input values
        const totalAge = parseFloat(this.ageInput.value);
        const sleepHoursPerDay = parseFloat(this.sleepInput.value);
        const bathroomMinutesPerDay = parseFloat(this.bathroomInput.value);
        const workHoursPerDay = parseFloat(this.workInput.value);
        const eatingMinutesPerDay = parseFloat(this.eatingInput.value);
        
        // Validate ranges
        if (sleepHoursPerDay > 24) {
            this.showError('ساعات النوم لا يمكن أن تتجاوز 24 ساعة');
            return;
        }
        
        if (workHoursPerDay > 24) {
            this.showError('ساعات العمل لا يمكن أن تتجاوز 24 ساعة');
            return;
        }
        
        if (eatingMinutesPerDay > 1440) {
            this.showError('وقت الأكل لا يمكن أن يتجاوز 1440 دقيقة (24 ساعة)');
            return;
        }
        
        if (bathroomMinutesPerDay > 1440) {
            this.showError('وقت الحمام لا يمكن أن يتجاوز 1440 دقيقة (24 ساعة)');
            return;
        }
        
        // Calculate time lost per day in minutes
        const sleepMinutesPerDay = sleepHoursPerDay * 60;
        const workMinutesPerDay = workHoursPerDay * 60;
        const totalLostMinutesPerDay = sleepMinutesPerDay + workMinutesPerDay + eatingMinutesPerDay + bathroomMinutesPerDay;
        
        // Calculate total minutes in a day
        const minutesPerDay = 24 * 60; // 1440 minutes
        
        // Validate total doesn't exceed 24 hours
        if (totalLostMinutesPerDay >= minutesPerDay) {
            this.showError('مجموع الأوقات المدخلة يتجاوز 24 ساعة في اليوم');
            return;
        }
        
        // Deduct 14 years before maturity
        const maturityYears = 14;
        const matureAge = Math.max(0, totalAge - maturityYears);
        
        // Calculate available minutes per day for worship
        const availableMinutesPerDay = minutesPerDay - totalLostMinutesPerDay;
        
        // Convert to years (how many years worth of time is lost vs available)
        const timeLostYears = (totalLostMinutesPerDay / minutesPerDay) * matureAge;
        const worshipTimeYears = (availableMinutesPerDay / minutesPerDay) * matureAge;
        
        // Display results with animation
        this.displayResults(matureAge, timeLostYears, worshipTimeYears);
    }
    
    displayResults(totalAge, timeLost, worshipTime) {
        // Animate numbers
        this.animateNumber(this.totalLifeElement, totalAge, 0, ' سنة');
        this.animateNumber(this.timeLostElement, timeLost, 1, ' سنة');
        this.animateNumber(this.worshipTimeElement, worshipTime, 1, ' سنة');
        
        // Add fade-in animation to results
        this.resultsContainer.classList.add('fade-in');
    }
    
    animateNumber(element, targetValue, decimals, suffix = '') {
        const duration = 1000; // 1 second
        const steps = 50;
        const stepValue = targetValue / steps;
        const stepDuration = duration / steps;
        let currentValue = 0;
        
        element.classList.add('number-animate');
        
        const interval = setInterval(() => {
            currentValue += stepValue;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(interval);
                element.classList.remove('number-animate');
            }
            
            element.textContent = currentValue.toFixed(decimals) + suffix;
        }, stepDuration);
    }
    
    showError(message) {
        // Create temporary error message
        const errorElement = document.createElement('div');
        errorElement.textContent = message;
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1001;
            font-family: 'Tajawal', sans-serif;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        `;
        
        document.body.appendChild(errorElement);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 3000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorshipCalculator();
});
