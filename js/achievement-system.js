/**
 * Achievement System for PlainID Training Course
 */
class AchievementSystem {
    constructor() {
        this.startTime = new Date();
        this.moduleStartTime = new Date();
        this.currentModule = null;
        this.timeSpent = {};
        this.interactions = [];
        
        this.init();
    }

    init() {
        this.loadUserProgress();
        this.setupEvents();
        this.    showAchievementPopup(achievement) {
        // Create popup container if it doesn't exist
        let popupContainer = document.getElementById('achievement-popup');
        if (!popupContainer) {
            popupContainer = document.createElement('div');
            popupContainer.id = 'achievement-popup';
            popupContainer.className = 'achievement-popup';
            document.body.appendChild(popupContainer);
        }
        
        // Create popup content
        popupContainer.innerHTML = `
            <div class="popup-content">
                <h3>🎉 New Achievement Unlocked! 🎉</h3>
                <div class="achievement-icon" style="color: ${achievement.color}">
                    ${achievement.icon}
                </div>
                <h4 style="color: ${achievement.color}">${achievement.title}</h4>
                <p>${achievement.description}</p>
                <button class="close-popup-btn">Awesome!</button>
            </div>
        `;
        
        // Show popup
        popupContainer.classList.add('show');
        
        // Add close button listener
        const closeBtn = popupContainer.querySelector('.close-popup-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupContainer.classList.remove('show');
                setTimeout(() => {
                    popupContainer.style.display = 'none';
                }, 500);
            });
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (popupContainer.classList.contains('show')) {
                popupContainer.classList.remove('show');
                setTimeout(() => {
                    popupContainer.style.display = 'none';
                }, 500);
            }
        }, 5000);
    }
    
    renderAchievementDisplay() {
        // Create a container for the achievements section
        let achievementSection = document.querySelector('.achievement-section');
        
        if (!achievementSection) {
            // Find a good location to insert the achievement section
            const aboutSection = document.getElementById('about');
            if (!aboutSection) return;
            
            // Create achievement section
            achievementSection = document.createElement('div');
            achievementSection.className = 'achievement-section';
            achievementSection.innerHTML = `
                <h2>Your Achievements</h2>
                <div class="achievements-container">
                    <div class="achievement-stats">
                        <div class="stat-card">
                            <h3>Achievements Earned</h3>
                            <div class="stat-value">0</div>
                            <div class="stat-label">out of ${this.getBadgeDefinitions().length} total</div>
                        </div>
                        <div class="stat-card">
                            <h3>Completion Rate</h3>
                            <div class="stat-value">0%</div>
                            <div class="stat-label">of all possible achievements</div>
                        </div>
                        <div class="stat-card">
                            <h3>Latest Achievement</h3>
                            <div class="stat-value">None yet</div>
                            <div class="stat-label">Start learning to earn badges</div>
                        </div>
                    </div>
                    <div class="achievement-filters">
                        <button class="filter-btn active" data-filter="all">All Badges</button>
                        <button class="filter-btn" data-filter="progress">Progress</button>
                        <button class="filter-btn" data-filter="achievement">Achievements</button>
                        <button class="filter-btn" data-filter="expertise">Expertise</button>
                        <button class="filter-btn" data-filter="dedication">Dedication</button>
                    </div>
                    <div class="achievement-grid"></div>
                </div>
            `;
            
            // Insert after the course grid
            const courseGrid = aboutSection.querySelector('.course-grid');
            if (courseGrid && courseGrid.nextElementSibling) {
                aboutSection.insertBefore(achievementSection, courseGrid.nextElementSibling);
            } else {
                aboutSection.appendChild(achievementSection);
            }
            
            // Add needed styles
            this.    formatDate(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    addAchievementStyles() {
        if (document.getElementById('achievement-styles')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'achievement-styles';
        styleEl.textContent = `
            .achievement-section {
                margin: 40px 0;
            }
            
            .achievement-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background-color: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .stat-card:nth-child(1) {
                background-color: #e3f2fd;
            }
            
            .stat-card:nth-child(2) {
                background-color: #e8f5e9;
            }
            
            .stat-card:nth-child(3) {
                background-color: #ede7f6;
            }
            
            .stat-card h3 {
                font-size: 1.2rem;
                margin-bottom: 10px;
                color: #333;
            }
            
            .stat-value {
                font-size: 2.5rem;
                font-weight: bold;
                margin-bottom: 5px;
                color: #0073e6;
            }
            
            .stat-card:nth-child(2) .stat-value {
                color: #2e7d32;
            }
            
            .stat-card:nth-child(3) .stat-value {
                color: #673ab7;
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: #666;
            }
            
            .achievement-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                overflow-x: auto;
            }
            
            .filter-btn {
                padding: 8px 15px;
                background: none;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                color: #666;
                white-space: nowrap;
                transition: all 0.3s ease;
            }
            
            .filter-btn.active {
                background-color: #0073e6;
                color: white;
            }
            
            .achievement-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .achievement-badge {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                text-align: center;
            }
            
            .achievement-badge.unlocked {
                border-left: 4px solid #4caf50;
            }
            
            .achievement-badge.locked {
                opacity: 0.6;
                filter: grayscale(70%);
            }
            
            .achievement-badge:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            }
            
            .badge-icon {
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
                background-color: #f5f5f5;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .achievement-badge.unlocked .badge-icon {
                background-color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .badge-title {
                font-size: 1.1rem;
                margin-bottom: 5px;
                color: #333;
            }
            
            .badge-description {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 15px;
            }
            
            .badge-earned {
                font-size: 0.8rem;
                color: #2e7d32;
                padding: 5px 10px;
                background-color: #e8f5e9;
                border-radius: 20px;
            }
            
            .badge-locked {
                font-size: 0.8rem;
                color: #666;
                display: flex;
                align-items: center;
                gap: 5px;
                justify-content: center;
            }
            
            /* Achievement Popup */
            .achievement-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.5s ease, visibility 0.5s;
            }
            
            .achievement-popup.show {
                opacity: 1;
                visibility: visible;
            }
            
            .popup-content {
                background-color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                max-width: 90%;
                width: 400px;
                animation: popup-bounce 0.5s ease;
            }
            
            @keyframes popup-bounce {
                0% { transform: scale(0.5); }
                70% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .popup-content h3 {
                margin-bottom: 20px;
                color: #333;
            }
            
            .popup-content .achievement-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background-color: #f5f5f5;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .popup-content h4 {
                margin-bottom: 10px;
                font-size: 1.5rem;
            }
            
            .popup-content p {
                margin-bottom: 25px;
                color: #666;
            }
            
            .close-popup-btn {
                padding: 10px 25px;
                background-color: #0073e6;
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s ease;
            }
            
            .close-popup-btn:hover {
                background-color: #0056b3;
            }
            
            @media (max-width: 768px) {
                .achievement-stats {
                    grid-template-columns: 1fr;
                }
                
                .achievement-grid {
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                }
            }
        `;
        
        document.head.appendChild(styleEl);
    }
}

// Initialize the achievement system when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});
            
            // Attach filter event listeners
            const filterBtns = achievementSection.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter');
                    
                    // Update active state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Filter achievements
                    this.    filterAchievements(filter) {
        // This just triggers a redraw of the achievement grid with the new filter
        this.updateAchievementGrid();
    }
                });
            });
        }
        
        // Update achievement grid with all badges
        this.    updateAchievementGrid() {
        const achievementGrid = document.querySelector('.achievement-grid');
        if (!achievementGrid) return;
        
        // Get all badge definitions
        const badgeDefinitions = this.getBadgeDefinitions();
        
        // Get current filter
        const activeFilter = document.querySelector('.filter-btn.active');
        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        
        // Clear existing grid
        achievementGrid.innerHTML = '';
        
        // Filter badges
        const filteredBadges = filter === 'all' 
            ? badgeDefinitions 
            : badgeDefinitions.filter(badge => badge.category === filter);
        
        // Add each badge to the grid
        filteredBadges.forEach(badge => {
            // Check if unlocked
            const isUnlocked = this.achievements && this.achievements.some(a => a.id === badge.id);
            const unlockedData = isUnlocked ? this.achievements.find(a => a.id === badge.id) : null;
            
            // Create badge element
            const badgeElement = document.createElement('div');
            badgeElement.className = `achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            badgeElement.innerHTML = `
                <div class="badge-icon" ${isUnlocked ? `style="color: ${badge.color}"` : ''}>
                    ${badge.icon}
                </div>
                <div class="badge-content">
                    <h4 class="badge-title">${badge.title}</h4>
                    <p class="badge-description">${badge.description}</p>
                    ${isUnlocked 
                        ? `<div class="badge-earned">Earned: ${this.formatDate(unlockedData.unlockedAt)}</div>` 
                        : `<div class="badge-locked"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"></path></svg> Locked</div>`
                    }
                </div>
            `;
            
            // Add to grid
            achievementGrid.appendChild(badgeElement);
        });
    }
        
        // Update achievement stats
        this.    updateAchievementStats() {
        const statsContainer = document.querySelector('.achievement-stats');
        if (!statsContainer) return;
        
        const totalBadges = this.getBadgeDefinitions().length;
        const earnedBadges = this.achievements ? this.achievements.length : 0;
        const completionRate = earnedBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;
        
        // Update stats values
        const statsValues = statsContainer.querySelectorAll('.stat-value');
        if (statsValues.length >= 3) {
            // Achievements earned
            statsValues[0].textContent = earnedBadges;
            
            // Completion rate
            statsValues[1].textContent = `${completionRate}%`;
            
            // Latest achievement
            if (earnedBadges > 0) {
                const latestAchievement = this.achievements.sort(
                    (a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)
                )[0];
                
                statsValues[2].textContent = latestAchievement.title;
                
                // Update the "Start learning" label to show date
                const statLabels = statsContainer.querySelectorAll('.stat-label');
                if (statLabels.length >= 3) {
                    statLabels[2].textContent = this.formatDate(latestAchievement.unlockedAt);
                }
            }
        }
    }
    }
    }

    loadUserProgress() {
        // Initialize with default values if not saved
        this.userProgress = {
            modules: {},
            quizResults: [],
            timeSpent: {}
        };
        
        // Try to load from localStorage
        try {
            const storedProgress = localStorage.getItem('plainidCourseProgress');
            if (storedProgress) {
                const parsedProgress = JSON.parse(storedProgress);
                
                // Get analytics data from localStorage for time tracking
                const storedAnalytics = localStorage.getItem('courseAnalytics');
                let timeSpent = {};
                if (storedAnalytics) {
                    try {
                        const parsedAnalytics = JSON.parse(storedAnalytics);
                        timeSpent = parsedAnalytics.timeSpent || {};
                    } catch (e) {
                        console.error('Error parsing analytics data:', e);
                    }
                }
                
                // Generate sample quiz results for demo purposes
                // In a real implementation, these would come from actual quiz data
                const quizResults = this.    generateSampleQuizResults(parsedProgress) {
        const results = [];
        
        // Check if modules exist in the progress data
        if (!parsedProgress.modules) {
            return results;
        }
        
        // For each completed lesson, generate a quiz result
        for (const moduleId in parsedProgress.modules) {
            for (const lessonId in parsedProgress.modules[moduleId].lessons) {
                if (parsedProgress.modules[moduleId].lessons[lessonId]) {
                    // Generate a random score between 70 and 100 for completed lessons
                    const score = Math.floor(Math.random() * 31) + 70;
                    // Generate a random time spent between 60 and 300 seconds
                    const timeSpent = Math.floor(Math.random() * 241) + 60;
                    
                    results.push({
                        moduleId: parseInt(moduleId),
                        lessonId: parseInt(lessonId),
                        score: score,
                        timeSpent: timeSpent
                    });
                }
            }
        }
        
        return results;
    }
                
                // Update user progress state
                this.userProgress = {
                    modules: parsedProgress.modules || {},
                    quizResults: quizResults,
                    timeSpent: timeSpent
                };
            } else {
                // If no progress data found, use demo data
                this.userProgress = {
                    modules: {
                        1: { completed: true, lessons: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true } },
                        2: { completed: false, lessons: { 1: true, 2: false, 3: false, 4: false, 5: false } },
                        3: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false } }
                    },
                    quizResults: [
                        { moduleId: 1, lessonId: 1, score: 100, timeSpent: 120 },
                        { moduleId: 1, lessonId: 2, score: 90, timeSpent: 180 },
                        { moduleId: 1, lessonId: 3, score: 80, timeSpent: 150 },
                        { moduleId: 1, lessonId: 4, score: 100, timeSpent: 90 },
                        { moduleId: 1, lessonId: 5, score: 70, timeSpent: 200 },
                        { moduleId: 1, lessonId: 6, score: 90, timeSpent: 160 },
                        { moduleId: 2, lessonId: 1, score: 85, timeSpent: 140 }
                    ],
                    timeSpent: {
                        "1-1": 350,
                        "1-2": 420,
                        "1-3": 280,
                        "1-4": 290,
                        "1-5": 410,
                        "1-6": 320,
                        "2-1": 280
                    }
                };
            }
        } catch (e) {
            console.error('Error loading user progress:', e);
        }
    }

    setupEvents() {
        // Listen for lesson completion events
        document.addEventListener('lesson-completed', (event) => {
            const { moduleId, lessonId } = event.detail;
            this.    checkAchievements() {
        if (!this.userProgress.modules || Object.keys(this.userProgress.modules).length === 0) {
            return;
        }
        
        // Load previously unlocked achievements
        let unlockedAchievements = [];
        try {
            const storedAchievements = localStorage.getItem('plainidAchievements');
            if (storedAchievements) {
                unlockedAchievements = JSON.parse(storedAchievements);
            }
        } catch (e) {
            console.error('Error loading achievements:', e);
        }
        
        // Get badge definitions
        const badgeDefinitions = this.getBadgeDefinitions();
        
        // Check for newly unlocked achievements
        const newlyUnlocked = [];
        badgeDefinitions.forEach(badge => {
            // Skip if already unlocked
            if (unlockedAchievements.some(a => a.id === badge.id)) {
                return;
            }
            
            // Check if badge criteria are met
            if (badge.criteria(this.userProgress)) {
                newlyUnlocked.push(badge);
            }
        });
        
        // Update achievements list with newly unlocked achievements
        if (newlyUnlocked.length > 0) {
            // Add unlocked timestamp
            const timestampedAchievements = newlyUnlocked.map(badge => ({
                ...badge,
                unlockedAt: new Date().toISOString()
            }));
            
            // Add to list of unlocked achievements
            const updatedAchievements = [...unlockedAchievements, ...timestampedAchievements];
            
            // Save to localStorage
            localStorage.setItem('plainidAchievements', JSON.stringify(updatedAchievements));
            
            // Update state
            this.achievements = updatedAchievements;
            
            // Show popup for the first newly unlocked achievement
            this.showAchievementPopup(timestampedAchievements[0]);
            
            // Update achievement display
            this.renderAchievementDisplay();
        } else {
            // Just update state with existing achievements
            this.achievements = unlockedAchievements;
            
            // Also update the display if needed
            this.renderAchievementDisplay();
        }
    }
        });
        
        // Track time spent on each module
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                if (header.classList.contains('active')) {
                    const moduleId = header.getAttribute('data-module');
                    const lessonId = header.getAttribute('data-lesson');
                    
                    // Record module change
                    if (this.currentModule !== `${moduleId}-${lessonId}`) {
                        // If we were tracking time for a previous module, save it
                        if (this.currentModule) {
                            const timeSpent = (new Date() - this.moduleStartTime) / 1000; // in seconds
                            
                            if (!this.timeSpent[this.currentModule]) {
                                this.timeSpent[this.currentModule] = 0;
                            }
                            
                            this.timeSpent[this.currentModule] += timeSpent;
                        }
                        
                        // Start tracking new module
                        this.currentModule = `${moduleId}-${lessonId}`;
                        this.moduleStartTime = new Date();
                        
                        // Check achievements
                        this.checkAchievements();
                    }
                }
            });
        });
        
        // Save on exit
        window.addEventListener('beforeunload', () => {
            // Save current time data
            if (this.currentModule) {
                const timeSpent = (new Date() - this.moduleStartTime) / 1000;
                
                if (!this.timeSpent[this.currentModule]) {
                    this.timeSpent[this.currentModule] = 0;
                }
                
                this.timeSpent[this.currentModule] += timeSpent;
            }
            
            // Save to analytics
            this.    saveAnalytics() {
        // Save analytics data to localStorage
        try {
            const analytics = {
                timeSpent: this.timeSpent,
                sessionStart: this.startTime.toISOString()
            };
            
            localStorage.setItem('courseAnalytics', JSON.stringify(analytics));
        } catch (e) {
            console.error('Error saving analytics:', e);
        }
    }
        });
    }

    // Badge definitions
    getBadgeDefinitions() {
        return [
            {
                id: 'first_lesson',
                title: 'First Steps',
                description: 'Completed your first lesson',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20 6.5,20C8.45,20 10.55,20.4 12,21.5C13.35,20.65 15.8,20 17.5,20C19.15,20 20.85,20.3 22.25,21.05C22.35,21.1 22.4,21.1 22.5,21.1C22.75,21.1 23,20.85 23,20.6V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.65 12,19.5V8C13.35,7.15 15.8,6.5 17.5,6.5C18.7,6.5 19.9,6.65 21,7V18.5Z"></path></svg>',
                color: '#4caf50',
                category: 'progress',
                criteria: (progress) => {
                    // Check if at least one lesson is completed
                    for (const moduleId in progress.modules) {
                        for (const lessonId in progress.modules[moduleId].lessons) {
                            if (progress.modules[moduleId].lessons[lessonId]) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
            },
            {
                id: 'first_module',
                title: 'Module Master',
                description: 'Completed your first entire module',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"></path></svg>',
                color: '#2196f3',
                category: 'progress',
                criteria: (progress) => {
                    // Check if at least one module is completed
                    for (const moduleId in progress.modules) {
                        if (progress.modules[moduleId].completed) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            {
                id: 'perfect_quiz',
                title: 'Perfect Score',
                description: 'Got 100% on a quiz',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>',
                color: '#ffeb3b',
                category: 'achievement',
                criteria: (progress) => {
                    // Check if any quiz has a perfect score
                    return progress.quizResults.some(quiz => quiz.score === 100);
                }
            },
            {
                id: 'fast_learner',
                title: 'Fast Learner',
                description: 'Completed a lesson in under 5 minutes',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M11,4.07V2.05C12.68,2.19 14.29,2.76 15.64,3.66L14.22,5.08C13.32,4.5 12.28,4.13 11,4.07M19.93,11H21.95C21.81,12.68 21.24,14.29 20.34,15.64L18.92,14.22C19.5,13.32 19.87,12.28 19.93,11M4.07,11H2.05C2.19,9.32 2.76,7.71 3.66,6.36L5.08,7.78C4.5,8.68 4.13,9.72 4.07,11M5.08,16.22L3.66,17.64C2.76,16.29 2.19,14.68 2.05,13H4.07C4.13,14.28 4.5,15.32 5.08,16.22M15.64,20.34L14.22,18.92C13.32,19.5 12.28,19.87 11,19.93V21.95C12.68,21.81 14.29,21.24 15.64,20.34M11,13H13V7H11V13M11,15V17H13V15H11M7.78,5.08L6.36,3.66C7.71,2.76 9.32,2.19 11,2.05V4.07C9.72,4.13 8.68,4.5 7.78,5.08M16.22,5.08C15.32,4.5 14.28,4.13 13,4.07V2.05C14.68,2.19 16.29,2.76 17.64,3.66L16.22,5.08M20.34,17.64L18.92,16.22C19.5,15.32 19.87,14.28 19.93,13H21.95C21.81,14.68 21.24,16.29 20.34,17.64M16.22,18.92L17.64,20.34C16.29,21.24 14.68,21.81 13,21.95V19.93C14.28,19.87 15.32,19.5 16.22,18.92Z"></path></svg>',
                color: '#ff9800',
                category: 'achievement',
                criteria: (progress) => {
                    // Check if any lesson was completed in under 5 minutes (300 seconds)
                    for (const key in progress.timeSpent) {
                        if (progress.timeSpent[key] < 300) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            {
                id: 'diligent_student',
                title: 'Diligent Student',
                description: 'Spent over 1 hour on training',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"></path></svg>',
                color: '#9c27b0',
                category: 'time',
                criteria: (progress) => {
                    // Calculate total time spent
                    let totalTime = 0;
                    for (const key in progress.timeSpent) {
                        totalTime += progress.timeSpent[key];
                    }
                    // Check if total time is more than 1 hour (3600 seconds)
                    return totalTime > 3600;
                }
            },
            {
                id: 'auth_expert',
                title: 'Authorization Expert',
                description: 'Completed all lessons in Module 1',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z"></path></svg>',
                color: '#e91e63',
                category: 'expertise',
                criteria: (progress) => {
                    return progress.modules[1]?.completed === true;
                }
            },
            {
                id: 'architecture_pro',
                title: 'Architecture Pro',
                description: 'Completed all lessons in Module 2',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z"></path></svg>',
                color: '#3f51b5',
                category: 'expertise',
                criteria: (progress) => {
                    return progress.modules[2]?.completed === true;
                }
            },
            {
                id: 'policy_guru',
                title: 'Policy Modeling Guru',
                description: 'Completed all lessons in Module 3',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H7V11H10V13M14,13H11V11H14V13M10,16H7V14H10V16M14,16H11V14H14V16Z"></path></svg>',
                color: '#009688',
                category: 'expertise',
                criteria: (progress) => {
                    return progress.modules[3]?.completed === true;
                }
            },
            {
                id: 'implementation_wizard',
                title: 'Implementation Wizard',
                description: 'Completed all lessons in Module 4',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"></path></svg>',
                color: '#607d8b',
                category: 'expertise',
                criteria: (progress) => {
                    return progress.modules[4]?.completed === true;
                }
            },
            {
                id: 'advanced_practitioner',
                title: 'Advanced Practitioner',
                description: 'Completed all lessons in Module 5',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M6,20L10.16,7.91L9.34,6H8V4H10V0.73C10.76,0.35 11.57,0.14 12.4,0.05L13,0L13.24,0.05C14.5,0.21 15.68,0.73 16.66,1.56C19.97,4.38 19.13,9.62 14.38,13.8C13.19,14.85 12.1,15.36 10.8,16.13L6,20M15.92,8.41C16.43,7.46 16.5,6 15.57,5.17C15.09,4.71 14.25,4.28 13.56,4.44C13.17,4.53 12.67,4.73 12.36,4.94C12,5.18 11.68,5.5 11.38,5.85C10.88,6.45 10.74,7.36 11.28,8.04C12.23,9.2 14.35,9.5 15.92,8.41M14.28,12.04C13.18,12.96 12.13,13.41 10.9,14.13L8.12,16.53L11.51,6.87C11.81,6.5 12.07,6.11 12.3,5.93C13,5.34 13.94,5.34 14.61,5.93C15.27,6.5 15.07,7.18 14.28,12.04Z"></path></svg>',
                color: '#ff5722',
                category: 'expertise',
                criteria: (progress) => {
                    return progress.modules[5]?.completed === true;
                }
            },
            {
                id: 'best_practices_expert',
                title: 'Best Practices Expert',
                description: 'Completed all lessons in Module 6',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path></svg>',
                color: '#795548',
                category: 'expertise',
                criteria: (progress) => {
                    return progress.modules[6]?.completed === true;
                }
            },
            {
                id: 'quiz_ace',
                title: 'Quiz Ace',
                description: 'Completed 5 quizzes with a score of 80% or higher',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22M4,4V20H20V4H4M8.47,7.17L10.64,8.75L9.58,11.36L6.43,12.83L7.83,15.17L11.28,13.06L14.57,14.38L13.47,12.2L15.96,10.07L12.91,9.91L11.93,7.04L9.13,10.32L8.47,7.17Z"></path></svg>',
                color: '#ffc107',
                category: 'achievement',
                criteria: (progress) => {
                    // Count quizzes with scores >= 80%
                    const highScoreQuizzes = progress.quizResults.filter(quiz => quiz.score >= 80);
                    return highScoreQuizzes.length >= 5;
                }
            },
            {
                id: 'half_way_there',
                title: 'Half Way There',
                description: 'Completed 50% of the course',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M16.82,15.19L12.71,11.08C13.12,10.04 12.89,8.82 12.03,7.97C11.13,7.06 9.78,6.88 8.69,7.38L10.63,9.32L9.28,10.68L7.29,8.73C6.75,9.82 7,11.17 7.88,12.08C8.74,12.94 9.96,13.16 11,12.76L15.11,16.86C15.29,17.05 15.56,17.05 15.74,16.86L16.78,15.83C17,15.65 17,15.33 16.82,15.19Z"></path></svg>',
                color: '#8bc34a',
                category: 'progress',
                criteria: (progress) => {
                    // Calculate total lessons and completed lessons
                    let totalLessons = 0;
                    let completedLessons = 0;
                    
                    for (const moduleId in progress.modules) {
                        for (const lessonId in progress.modules[moduleId].lessons) {
                            totalLessons++;
                            if (progress.modules[moduleId].lessons[lessonId]) {
                                completedLessons++;
                            }
                        }
                    }
                    
                    // Check if at least 50% of lessons are completed
                    return totalLessons > 0 && (completedLessons / totalLessons) >= 0.5;
                }
            },
            {
                id: 'weekend_warrior',
                title: 'Weekend Warrior',
                description: 'Studied on a weekend',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z"></path></svg>',
                color: '#795548',
                category: 'dedication',
                unlocked: false, // This will be checked via session timestamps
                criteria: () => {
                    // Check if today is a weekend
                    const day = new Date().getDay();
                    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
                }
            },
            {
                id: 'night_owl',
                title: 'Night Owl',
                description: 'Studied after 10PM',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z"></path></svg>',
                color: '#263238',
                category: 'dedication',
                unlocked: false, // This will be checked via session timestamps
                criteria: () => {
                    // Check if current hour is after 10PM (22:00)
                    const hour = new Date().getHours();
                    return hour >= 22 || hour < 5;
                }
            },
            {
                id: 'plainid_certified',
                title: 'PlainID Certified',
                description: 'Completed the entire course',
                icon: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M4,3C2.89,3 2,3.89 2,5V15A2,2 0 0,0 4,17H12V22L15,19L18,22V17H20A2,2 0 0,0 22,15V5C22,3.89 21.1,3 20,3H4M4,5H20V15H4V5M5,6V8H7V6H5M8,6V8H10V6H8M11,6V8H13V6H11M14,6V8H16V6H14M17,6V8H19V6H17M5,9V11H7V9H5M8,9V11H10V9H8M11,9V11H13V9H11M14,9V11H16V9H14M17,9V11H19V9H17M5,12V14H7V12H5M8,12V14H10V12H8M11,12V14H13V12H11M14,12V14H16V12H14M17,12V14H19V12H17Z"></path></svg>',
                color: '#f44336',
                category: 'completion',
                criteria: (progress) => {
                    // Check if all modules are completed
                    for (const moduleId in progress.modules) {
                        if (!progress.modules[moduleId].completed) {
                            return false;
                        }
                    }
                    return Object.keys(progress.modules).length > 0;
                }
            }
