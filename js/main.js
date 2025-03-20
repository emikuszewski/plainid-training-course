document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
    
    // Setup event listeners for cross-component communication
    setupEventListeners();
});

/**
 * Initialize all course components
 */
function initializeComponents() {
    // Core functionality
    if (typeof QuizManager !== 'undefined') {
        window.quizManager = new QuizManager();
    }
    
    if (typeof ModuleNavigator !== 'undefined') {
        window.moduleNavigator = new ModuleNavigator();
    }
    
    if (typeof CertificateGenerator !== 'undefined') {
        window.certificateGenerator = new CertificateGenerator();
    }
    
    if (typeof InteractiveContentManager !== 'undefined') {
        window.interactiveContent = new InteractiveContentManager();
    }
    
    if (typeof CourseAnalytics !== 'undefined') {
        window.courseAnalytics = new CourseAnalytics();
    }
    
    // Enhanced features
    if (typeof PersonalizedLearningPath !== 'undefined') {
        window.personalizedLearningPath = new PersonalizedLearningPath();
    }
    
    if (typeof AccessibilityManager !== 'undefined') {
        window.accessibilityManager = new AccessibilityManager();
    }
    
    if (typeof InteractiveDiagrams !== 'undefined') {
        window.interactiveDiagrams = new InteractiveDiagrams();
    }
    
    if (typeof AchievementSystem !== 'undefined') {
        window.achievementSystem = new AchievementSystem();
    }
    
    // If components aren't loaded as separate modules, initialize built-in functions
    if (typeof window.quizManager === 'undefined') {
        initializeDefaultBehavior();
    }
}

/**
 * Setup event listeners for cross-component communication
 */
function setupEventListeners() {
    // Setup shared notification system
    window.showNotification = function(message, type = 'info', duration = 3000) {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 350px;
                z-index: 9999;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        // Add notification styles if not present
        if (!document.getElementById('notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = `
                .notification {
                    padding: 15px 20px 15px 50px;
                    margin-bottom: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    position: relative;
                    animation: slide-in 0.3s ease forwards;
                    max-width: 100%;
                    overflow: hidden;
                }
                .notification::before {
                    content: '';
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .notification.success {
                    background-color: #f1f9f1;
                    border-left: 4px solid #28a745;
                    color: #1e7e34;
                }
                .notification.success::before {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2328a745'%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z'/%3E%3C/svg%3E");
                }
                .notification.warning {
                    background-color: #fff9e6;
                    border-left: 4px solid #ffc107;
                    color: #856404;
                }
                .notification.warning::before {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffc107'%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z'/%3E%3C/svg%3E");
                }
                .notification.info {
                    background-color: #e6f3ff;
                    border-left: 4px solid #0073e6;
                    color: #0056b3;
                }
                .notification.info::before {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230073e6'%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z'/%3E%3C/svg%3E");
                }
                .notification-close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.3s;
                }
                .notification-close:hover {
                    opacity: 1;
                }
                .notification-close::before,
                .notification-close::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: currentColor;
                }
                .notification-close::before {
                    transform: translateY(-50%) rotate(45deg);
                }
                .notification-close::after {
                    transform: translateY(-50%) rotate(-45deg);
                }
                @keyframes slide-in {
                    0% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slide-out {
                    0% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.className = 'notification-close';
        closeButton.addEventListener('click', function() {
            removeNotification(notification);
        });
        notification.appendChild(closeButton);
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                removeNotification(notification);
            }
        }, duration);
        
        // Helper to remove notification with animation
        function removeNotification(notification) {
            notification.style.animation = 'slide-out 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    };
    
    // Progress tracking system
    window.markLessonComplete = function(moduleId, lessonId) {
        // This function will be overridden by the progress tracking system
        // If it's loaded as a separate module
        if (typeof window.userProgress === 'undefined') {
            // Initialize basic progress structure
            window.userProgress = {
                modules: {},
                userName: '',
                overallProgress: 0
            };
        }
        
        // Ensure modules object is initialized
        if (!window.userProgress.modules[moduleId]) {
            window.userProgress.modules[moduleId] = {
                completed: false,
                lessons: {}
            };
        }
        
        // Mark lesson as complete
        window.userProgress.modules[moduleId].lessons[lessonId] = true;
        
        // Update UI
        const lessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (lessonHeader) {
            const statusElement = lessonHeader.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Completed';
                statusElement.className = 'status completed';
            }
        }
        
        // Save progress
        if (typeof window.saveProgress === 'function') {
            window.saveProgress();
        } else {
            // Basic progress saving
            try {
                localStorage.setItem('plainidCourseProgress', JSON.stringify(window.userProgress));
            } catch (e) {
                console.error('Error saving progress:', e);
            }
        }
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('lesson-completed', {
            detail: { moduleId, lessonId }
        }));
    };
}

/**
 * Initialize default behavior for core functionality
 * when components aren't loaded as separate modules
 */
function initializeDefaultBehavior() {
    // Initialize accordions
    initializeAccordions();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize quiz system
    initializeQuizzes();
    
    // Initialize progress system
    initializeProgressSystem();
}

/**
 * Initialize accordion functionality
 */
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Check if the lesson is locked
            const status = this.querySelector('.status').textContent;
            if (status === 'Locked') {
                if (window.showNotification) {
                    window.showNotification('Please complete the previous lessons first.', 'warning');
                } else {
                    alert('Please complete the previous lessons first.');
                }
                return;
            }
            
            const content = this.nextElementSibling;
            
            // Close all other accordions
            accordionHeaders.forEach(h => {
                if (h !== this && h.classList.contains('active')) {
                    h.classList.remove('active');
                    h.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current accordion
            this.classList.toggle('active');
            content.classList.toggle('active');
            
            // Scroll into view if opened
            if (this.classList.contains('active')) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });
}

/**
 * Initialize tab functionality
 */
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Deactivate all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Deactivate all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Activate selected tab and content
            this.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

/**
 * Initialize quiz functionality
 */
function initializeQuizzes() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionContainer = this.closest('.quiz-question');
            
            // Skip if already answered
            if (questionContainer.classList.contains('answered')) return;
            
            const options = questionContainer.querySelectorAll('.quiz-option');
            const feedback = questionContainer.querySelector('.quiz-feedback');
            
            // Clear previous selections
            options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Select this option
            this.classList.add('selected');
            
            // Check if correct
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                this.classList.add('correct');
                feedback.textContent = 'Correct! Well done.';
                feedback.className = 'quiz-feedback correct';
                questionContainer.classList.add('answered');
                
                // Mark lesson complete
                const moduleId = questionContainer.getAttribute('data-module');
                const lessonId = questionContainer.getAttribute('data-lesson');
                
                if (typeof window.markLessonComplete === 'function') {
                    window.markLessonComplete(moduleId, lessonId);
                }
                
                // Show success notification
                if (window.showNotification) {
                    window.showNotification('Great job! You answered correctly.', 'success');
                }
            } else {
                this.classList.add('incorrect');
                feedback.textContent = 'Incorrect. Please try again.';
                feedback.className = 'quiz-feedback incorrect';
            }
        });
    });
}

/**
 * Initialize progress tracking system
 */
function initializeProgressSystem() {
    // Initialize user progress structure
    window.userProgress = {
        modules: {
            1: { completed: false, lessons: {} },
            2: { completed: false, lessons: {} },
            3: { completed: false, lessons: {} },
            4: { completed: false, lessons: {} },
            5: { completed: false, lessons: {} },
            6: { completed: false, lessons: {} }
        },
        userName: '',
        overallProgress: 0
    };
    
    // Load saved progress
    try {
        const savedProgress = localStorage.getItem('plainidCourseProgress');
        if (savedProgress) {
            const loadedProgress = JSON.parse(savedProgress);
            
            // Merge with default structure
            window.userProgress = {
                ...window.userProgress,
                ...loadedProgress
            };
            
            // Update UI based on loaded progress
            updateProgressUI();
        }
    } catch (e) {
        console.error('Error loading progress:', e);
    }
    
    // Save progress function
    window.saveProgress = function() {
        try {
            localStorage.setItem('plainidCourseProgress', JSON.stringify(window.userProgress));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    };
    
    // Setup autosave
    window.addEventListener('beforeunload', window.saveProgress);
}

/**
 * Update UI elements based on loaded progress
 */
function updateProgressUI() {
    // Update lesson statuses
    for (const moduleId in window.userProgress.modules) {
        const module = window.userProgress.modules[moduleId];
        
        for (const lessonId in module.lessons) {
            if (module.lessons[lessonId]) {
                // Find and update lesson status
                const lessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                if (lessonHeader) {
                    const statusElement = lessonHeader.querySelector('.status');
                    if (statusElement) {
                        statusElement.textContent = 'Completed';
                        statusElement.className = 'status completed';
                    }
                }
            }
        }
    }
}
