// Prayer Time Calculator functionality
class PrayerCalculator {
    constructor() {
        this.wuduTimeInput = document.getElementById('wuduTimeInput');
        this.fajrTimeInput = document.getElementById('fajrTimeInput');
        this.duhurTimeInput = document.getElementById('duhurTimeInput');
        this.asrTimeInput = document.getElementById('asrTimeInput');
        this.maghribTimeInput = document.getElementById('maghribTimeInput');
        this.ishaTimeInput = document.getElementById('ishaTimeInput');
        this.calculateBtn = document.getElementById('prayerCalculateBtn');
        this.resultsContainer = document.getElementById('prayerResults');
        this.totalHoursElement = document.getElementById('totalPrayerHours');
        this.navigateBtn = document.getElementById('goToAgeCalc');
        
        this.init();
    }
    
    init() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.navigateBtn.addEventListener('click', () => this.navigateToAgeCalc());
        
        // Add input validation
        [this.wuduTimeInput, this.fajrTimeInput, this.duhurTimeInput, 
         this.asrTimeInput, this.maghribTimeInput, this.ishaTimeInput].forEach(input => {
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
        const inputs = [this.wuduTimeInput, this.fajrTimeInput, this.duhurTimeInput, 
                       this.asrTimeInput, this.maghribTimeInput, this.ishaTimeInput];
        const isValid = inputs.every(input => this.validateInput(input));
        
        if (!isValid) {
            this.showError('يرجى إدخال قيم صحيحة في جميع الحقول');
            return;
        }
        
        // Get input values in minutes
        const wuduTime = parseFloat(this.wuduTimeInput.value);
        const fajrTime = parseFloat(this.fajrTimeInput.value);
        const duhurTime = parseFloat(this.duhurTimeInput.value);
        const asrTime = parseFloat(this.asrTimeInput.value);
        const maghribTime = parseFloat(this.maghribTimeInput.value);
        const ishaTime = parseFloat(this.ishaTimeInput.value);
        
        // Calculate total prayer time (5 prayers + 5 wudu times)
        const totalPrayerMinutes = fajrTime + duhurTime + asrTime + maghribTime + ishaTime;
        const totalWuduMinutes = wuduTime * 5; // 5 prayers require wudu
        
        const totalMinutes = totalPrayerMinutes + totalWuduMinutes;
        const totalHours = totalMinutes / 60;
        
        // Display result with animation
        this.displayResult(totalHours);
    }
    
    displayResult(hours) {
        // Animate the hours number
        this.animateNumber(this.totalHoursElement, hours, 2, ' ');
        
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
    
    navigateToAgeCalc() {
        // Switch to age calculator tab
        const tabSystem = window.tabSystem;
        if (tabSystem) {
            tabSystem.switchTab('age-calc');
        }
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

// Initialize prayer calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrayerCalculator();
});