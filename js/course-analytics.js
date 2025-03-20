/**
 * Course Analytics System
 * 
 * Tracks user interactions and progress for analytics:
 * - Time spent on each module
 * - Quiz performance
 * - Completion rates
 * - User behavior insights
 */
class CourseAnalytics {
    constructor() {
        this.startTime = new Date();
        this.moduleStartTime = new Date();
        this.currentModule = null;
        this.timeSpent = {};
        this.interactions = [];
        
        this.init();
    }

    init() {
        this.trackModuleViews();
        this.trackQuizAttempts();
        this.trackTimeSpent();
        this.setupPeriodicSaving();
    }

    trackModuleViews() {
        // Track when a module is viewed
        const moduleHeaders = document.querySelectorAll('.accordion-header');
        moduleHeaders.forEach(header => {
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
                        
                        // Record interaction
                        this.recordInteraction('module_view', {
                            moduleId,
                            lessonId
                        });
                    }
                }
            });
        });
    }

    trackQuizAttempts() {
        // Track quiz attempts
        const quizOptions = document.querySelectorAll('.quiz-option');
        quizOptions.forEach(option => {
            option.addEventListener('click', () => {
                const questionContainer = option.closest('.quiz-question');
                if (questionContainer.classList.contains('answered')) return;
                
                const moduleId = questionContainer.getAttribute('data-module');
                const lessonId = questionContainer.getAttribute('data-lesson');
                const questionId = questionContainer.getAttribute('data-question');
                const isCorrect = option.getAttribute('data-correct') === 'true';
                
                // Record interaction
                this.recordInteraction('quiz_attempt', {
                    moduleId,
                    lessonId,
                    questionId,
                    isCorrect
                });
            });
        });
    }

    trackTimeSpent() {
        // Save current module time when user leaves the page
        window.addEventListener('beforeunload', () => {
            if (this.currentModule) {
                const timeSpent = (new Date() - this.moduleStartTime) / 1000; // in seconds
                
                if (!this.timeSpent[this.currentModule]) {
                    this.timeSpent[this.currentModule] = 0;
                }
                
                this.timeSpent[this.currentModule] += timeSpent;
            }
            
            // Save total session time
            const totalTime = (new Date() - this.startTime) / 1000; // in seconds
            
            this.recordInteraction('session_end', {
                totalTime,
                timeSpent: this.timeSpent
            });
            
            this.saveAnalytics();
        });
    }

    recordInteraction(type, data) {
        const interaction = {
            type,
            timestamp: new Date().toISOString(),
            data
        };
        
        this.interactions.push(interaction);
    }

    setupPeriodicSaving() {
        // Save analytics data every 5 minutes
        setInterval(() => {
            this.saveAnalytics();
        }, 5 * 60 * 1000);
    }

    saveAnalytics() {
        // In a real implementation, this would send data to a server
        // For this demo, we'll just store in localStorage
        try {
            const analytics = {
                timeSpent: this.timeSpent,
                interactions: this.interactions,
                sessionStart: this.startTime.toISOString()
            };
            
            localStorage.setItem('courseAnalytics', JSON.stringify(analytics));
        } catch (e) {
            console.error('Error saving analytics:', e);
        }
    }
}

// Initialize the analytics system when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.courseAnalytics = new CourseAnalytics();
});
