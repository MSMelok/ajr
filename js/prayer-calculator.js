// Prayer Calculator class
class PrayerCalculator {
    constructor() {
        this.results = {
            totalDailyMinutes: 0,
            totalDailyHours: 0,
            percentageOfDay: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
    }
    
    setupEventListeners() {
        const calculateBtn = document.getElementById('prayerCalculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }
        
        // Auto-save input changes
        const inputs = ['wuduTimeInput', 'fajrTimeInput', 'duhurTimeInput', 'asrTimeInput', 'maghribTimeInput', 'ishaTimeInput'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.saveInputData());
            }
        });
    }
    
    loadSavedData() {
        const saved = localStorage.getItem('ajr-prayer-data');
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
        const inputs = ['wuduTimeInput', 'fajrTimeInput', 'duhurTimeInput', 'asrTimeInput', 'maghribTimeInput', 'ishaTimeInput'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                data[inputId] = input.value;
            }
        });
        
        localStorage.setItem('ajr-prayer-data', JSON.stringify(data));
    }
    
    calculate() {
        // Get input values with defaults
        const wuduTime = parseFloat(document.getElementById('wuduTimeInput')?.value) || 5;
        const fajrTime = parseFloat(document.getElementById('fajrTimeInput')?.value) || 10;
        const duhurTime = parseFloat(document.getElementById('duhurTimeInput')?.value) || 15;
        const asrTime = parseFloat(document.getElementById('asrTimeInput')?.value) || 15;
        const maghribTime = parseFloat(document.getElementById('maghribTimeInput')?.value) || 12;
        const ishaTime = parseFloat(document.getElementById('ishaTimeInput')?.value) || 15;
        
        // Calculate total prayer time (5 prayers + 5 wudu sessions)
        const totalPrayerMinutes = fajrTime + duhurTime + asrTime + maghribTime + ishaTime;
        const totalWuduMinutes = wuduTime * 5; // 5 prayers require wudu
        const totalMinutes = totalPrayerMinutes + totalWuduMinutes;
        
        // Convert to hours
        const totalHours = totalMinutes / 60;
        
        // Calculate percentage of day
        const percentageOfDay = (totalMinutes / (24 * 60)) * 100;
        
        // Store results
        this.results = {
            totalDailyMinutes: Math.round(totalMinutes),
            totalDailyHours: Math.round(totalHours * 100) / 100,
            percentageOfDay: Math.round(percentageOfDay * 10) / 10
        };
        
        // Display results
        this.displayResults();
        
        // Save calculation
        this.saveInputData();
        
        // Add animation
        this.animateResults();
    }
    
    displayResults() {
        const totalHoursElement = document.getElementById('totalPrayerHours');
        
        if (totalHoursElement) {
            totalHoursElement.textContent = this.results.totalDailyHours.toFixed(2);
        }
        
        // Show results container
        const resultsContainer = document.getElementById('prayerResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
        
        // Update result message with more details
        const resultIntro = resultsContainer.querySelector('.result-intro');
        if (resultIntro && this.results.percentageOfDay > 0) {
            resultIntro.innerHTML = `
                أعطاك الله 24 ساعة في اليوم وأمرك فقط أن تناجيه لمدة<br>
                <small style="opacity: 0.8; font-size: 0.9em;">
                    (${this.results.totalDailyMinutes} دقيقة - ${this.results.percentageOfDay}% من يومك)
                </small>
            `;
        }
    }
    
    animateResults() {
        const resultsContainer = document.getElementById('prayerResults');
        if (resultsContainer) {
            resultsContainer.style.opacity = '0';
            resultsContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultsContainer.style.transition = 'all 0.6s ease';
                resultsContainer.style.opacity = '1';
                resultsContainer.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Animate the number
        const numberElement = document.getElementById('totalPrayerHours');
        if (numberElement) {
            this.animateNumber(numberElement, 0, this.results.totalDailyHours, 1000);
        }
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * this.easeOutCubic(progress);
            
            element.textContent = current.toFixed(2);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    getResults() {
        return this.results;
    }
    
    // Method to get formatted time breakdown
    getTimeBreakdown() {
        const breakdown = {
            prayers: {},
            wudu: {},
            total: this.results
        };
        
        const inputs = {
            fajr: 'fajrTimeInput',
            duhur: 'duhurTimeInput',
            asr: 'asrTimeInput',
            maghrib: 'maghribTimeInput',
            isha: 'ishaTimeInput',
            wudu: 'wuduTimeInput'
        };
        
        Object.keys(inputs).forEach(prayer => {
            const input = document.getElementById(inputs[prayer]);
            if (input) {
                breakdown.prayers[prayer] = parseFloat(input.value) || 0;
            }
        });
        
        return breakdown;
    }
}