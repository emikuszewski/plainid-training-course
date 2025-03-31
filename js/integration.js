/**
 * PlainID Training Course - Integration Script
 * 
 * This script ensures all components work together properly by:
 * 1. Centralizing initialization
 * 2. Establishing consistent data structures 
 * 3. Creating proper event communication
 * 4. Resolving DOM manipulation conflicts
 */

// Main namespace for the application
const PlainIDCourse = {
    // Core state management
    state: {
        initialized: false,
        userProgress: {
            modules: {},
            quizResults: [],
            timeSpent: {},
            userName: ''
        },
        userProfile: {
            role: '',
            industry: '',
            experience: '',
            learningGoals: [],
            learningStyle: ''
        },
        achievements: [],
        currentModule: null,
        currentLesson: null
    },

    // Component references
    components: {
        quizManager: null,
        moduleNavigator: null,
        certificateGenerator: null,
        interactiveContent: null,
        courseAnalytics: null,
        personalizedLearningPath: null,
        accessibilityManager: null,
        interactiveDiagrams: null,
        achievementSystem: null
    },

    // Initialize the application
    init: function() {
        if (this.state.initialized) return;
        
        console.log('Initializing PlainID Training Course...');
        
        // Load saved state from localStorage
        this.loadState();
        
        // Setup shared methods
        this.setupSharedMethods();
        
        // Initialize default behaviors first (ensure core functionality)
        this.initializeDefaultBehaviors();
        
        // Then initialize components in the correct order to manage dependencies
        this.initializeComponents();
        
        // Set up event listeners for cross-component communication
        this.setupEventListeners();
        
        // Mark as initialized
        this.state.initialized = true;
        console.log('PlainID Training Course initialized');
        
        // Unlock all modules and lessons for open access
        this.unlockAllModules();
    },
    
    // Load state from localStorage
    loadState: function() {
        try {
            // Load progress data
            const storedProgress = localStorage.getItem('plainidCourseProgress');
            if (storedProgress) {
                this.state.userProgress = {...this.state.userProgress, ...JSON.parse(storedProgress)};
            }
            
            // Load user profile
            const storedProfile = localStorage.getItem('plainidUserProfile');
            if (storedProfile) {
                this.state.userProfile = JSON.parse(storedProfile);
            }
            
            // Load achievements
            const storedAchievements = localStorage.getItem('plainidAchievements');
            if (storedAchievements) {
                this.state.achievements = JSON.parse(storedAchievements);
            }
            
            // Load analytics data
            const storedAnalytics = localStorage.getItem('courseAnalytics');
            if (storedAnalytics) {
                const analytics = JSON.parse(storedAnalytics);
                if (analytics.timeSpent) {
                    this.state.userProgress.timeSpent = analytics.timeSpent;
                }
            }
        } catch (error) {
            console.error('Error loading state from localStorage:', error);
        }
    },
    
    // Save state to localStorage
    saveState: function() {
        try {
            // Save progress data
            localStorage.setItem('plainidCourseProgress', JSON.stringify(this.state.userProgress));
            
            // Save user profile
            localStorage.setItem('plainidUserProfile', JSON.stringify(this.state.userProfile));
            
            // Save achievements
            localStorage.setItem('plainidAchievements', JSON.stringify(this.state.achievements));
        } catch (error) {
            console.error('Error saving state to localStorage:', error);
        }
    },
    
    // Set up shared methods that will be used by multiple components
    setupSharedMethods: function() {
        // Notification system
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
        window.markLessonComplete = (moduleId, lessonId) => {
            PlainIDCourse.markLessonComplete(moduleId, lessonId);
        };
        
        // Save progress
        window.saveProgress = () => {
            PlainIDCourse.saveState();
        };
    },
    
    // Initialize all components
    initializeComponents: function() {
        // 1. Initialize Accessibility Manager first (affects UI display)
        if (typeof AccessibilityManager !== 'undefined') {
            this.components.accessibilityManager = new AccessibilityManager();
            window.accessibilityManager = this.components.accessibilityManager;
        }
        
        // 2. Initialize analytics (tracks all other components)
        if (typeof CourseAnalytics !== 'undefined') {
            this.components.courseAnalytics = new CourseAnalytics();
            window.courseAnalytics = this.components.courseAnalytics;
        }
        
        // 3. Initialize interactive content manager
        if (typeof InteractiveContentManager !== 'undefined') {
            this.components.interactiveContent = new InteractiveContentManager();
            window.interactiveContent = this.components.interactiveContent;
        }
        
        // 4. Initialize interactive diagrams
        if (typeof InteractiveDiagrams !== 'undefined') {
            this.components.interactiveDiagrams = new InteractiveDiagrams();
            window.interactiveDiagrams = this.components.interactiveDiagrams;
        }
        
        // 5. Initialize module navigator
        if (typeof ModuleNavigator !== 'undefined') {
            this.components.moduleNavigator = new ModuleNavigator();
            window.moduleNavigator = this.components.moduleNavigator;
        }
        
        // 6. Initialize quiz manager
        if (typeof QuizManager !== 'undefined') {
            this.components.quizManager = new QuizManager();
            window.quizManager = this.components.quizManager;
        }
        
        // 7. Initialize achievement system
        if (typeof AchievementSystem !== 'undefined') {
            this.components.achievementSystem = new AchievementSystem();
            window.achievementSystem = this.components.achievementSystem;
        }
        
        // 8. Initialize certificate generator
        if (typeof CertificateGenerator !== 'undefined') {
            this.components.certificateGenerator = new CertificateGenerator();
            window.certificateGenerator = this.components.certificateGenerator;
        }
        
        // 9. Initialize personalized learning path (depends on user profile)
        if (typeof PersonalizedLearningPath !== 'undefined') {
            this.components.personalizedLearningPath = new PersonalizedLearningPath();
            window.personalizedLearningPath = this.components.personalizedLearningPath;
        }
    },
    
    // Set up event listeners for cross-component communication
    setupEventListeners: function() {
        // Listen for lesson completion
        document.addEventListener('lesson-completed', (event) => {
            const { moduleId, lessonId } = event.detail;
            
            // Update user progress
            if (!this.state.userProgress.modules[moduleId]) {
                this.state.userProgress.modules[moduleId] = {
                    completed: false,
                    lessons: {}
                };
            }
            
            this.state.userProgress.modules[moduleId].lessons[lessonId] = true;
            
            // Check if module is complete
            this.checkModuleCompletion(moduleId);
            
            // Save state
            this.saveState();
            
            // Show notification
            window.showNotification(`Lesson ${lessonId} completed!`, 'success');
        });
        
        // Listen for module completion
        document.addEventListener('module-completed', (event) => {
            const { moduleId } = event.detail;
            
            // Save state
            this.saveState();
            
            // Show notification
            window.showNotification(`Module ${moduleId} completed!`, 'success');
        });
        
        // Listen for profile updates
        document.addEventListener('profile-updated', (event) => {
            const { profile } = event.detail;
            
            // Update profile in state
            this.state.userProfile = {...this.state.userProfile, ...profile};
            
            // Save state
            this.saveState();
        });
        
        // Listen for achievement unlocked
        document.addEventListener('achievement-unlocked', (event) => {
            const { achievement } = event.detail;
            
            // Add to achievements list if not already present
            if (!this.state.achievements.some(a => a.id === achievement.id)) {
                this.state.achievements.push(achievement);
                
                // Save state
                this.saveState();
            }
        });
        
        // Add window beforeunload event to save state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    },
    
    // Mark a lesson as complete
    markLessonComplete: function(moduleId, lessonId) {
        console.log(`Marking lesson ${lessonId} in module ${moduleId} as complete`);
        
        // Ensure moduleId and lessonId are treated as strings consistently
        moduleId = moduleId.toString();
        lessonId = lessonId.toString();
        
        // Update progress state
        if (!this.state.userProgress.modules[moduleId]) {
            this.state.userProgress.modules[moduleId] = {
                completed: false,
                lessons: {}
            };
        }
        
        this.state.userProgress.modules[moduleId].lessons[lessonId] = true;
        
        // Update UI elements
        const lessonHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (lessonHeader) {
            const statusElement = lessonHeader.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Completed';
                statusElement.className = 'status completed';
            }
        } else {
            console.warn(`Could not find lesson header for module ${moduleId}, lesson ${lessonId}`);
        }
        
        // Check if module is complete
        this.checkModuleCompletion(moduleId);
        
        // Save state
        this.saveState();
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('lesson-completed', {
            detail: { moduleId, lessonId }
        }));
    },
    
    // Unlock all modules and lessons
    unlockAllModules: function() {
        console.log('Unlocking all modules and lessons for open access');
        
        // Get all module containers
        const moduleContainers = document.querySelectorAll('.module-container');
        
        moduleContainers.forEach(moduleContainer => {
            const moduleId = moduleContainer.id.replace('module', '');
            
            // Change module status to 'Not Started' if it's 'Locked'
            const moduleStatus = moduleContainer.querySelector('.module-status');
            if (moduleStatus && moduleStatus.textContent === 'Locked') {
                moduleStatus.textContent = 'Not Started';
                moduleStatus.className = 'module-status';
            }
            
            // Unlock all lessons in this module
            const lessonHeaders = moduleContainer.querySelectorAll('.accordion-header');
            lessonHeaders.forEach(header => {
                const statusElement = header.querySelector('.status');
                if (statusElement && statusElement.textContent === 'Locked') {
                    statusElement.textContent = 'Start';
                    statusElement.className = 'status';
                }
            });
        });
        
        // Show notification about open access
        if (typeof window.showNotification === 'function') {
            window.showNotification('All modules and lessons are now available for open access.', 'info', 5000);
        }
        
        // Update UI to reflect the changes
        this.updateProgressUI();
    },
    
    // Check if a module is complete
    checkModuleCompletion: function(moduleId) {
        console.log(`Checking if module ${moduleId} is complete`);
        
        // Get all lessons for this module
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) {
            console.warn(`Module element for module ${moduleId} not found`);
            return;
        }
        
        const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
        if (lessonHeaders.length === 0) {
            console.warn(`No lesson headers found for module ${moduleId}`);
            return;
        }
        
        // Check if all lessons are completed
        let allCompleted = true;
        let completedCount = 0;
        let totalLessons = lessonHeaders.length;
        
        lessonHeaders.forEach(header => {
            const lessonId = header.getAttribute('data-lesson');
            if (lessonId) {
                // Check if this lesson is completed in state
                const isCompleted = this.state.userProgress.modules[moduleId]?.lessons[lessonId] === true;
                
                if (isCompleted) {
                    completedCount++;
                } else {
                    // Also check the UI status as a fallback
                    const statusElement = header.querySelector('.status');
                    if (statusElement && statusElement.textContent === 'Completed') {
                        // Update state to match UI
                        if (!this.state.userProgress.modules[moduleId]) {
                            this.state.userProgress.modules[moduleId] = {
                                completed: false,
                                lessons: {}
                            };
                        }
                        this.state.userProgress.modules[moduleId].lessons[lessonId] = true;
                        completedCount++;
                    } else {
                        allCompleted = false;
                    }
                }
            }
        });
        
        console.log(`Module ${moduleId}: ${completedCount}/${totalLessons} lessons completed`);
        
        // Update module status
        if (allCompleted && totalLessons > 0) {
            console.log(`All lessons in module ${moduleId} are complete!`);
            
            // Mark module as complete in state
            this.state.userProgress.modules[moduleId].completed = true;
            
            // Update module status in UI
            const moduleStatus = moduleElement.querySelector('.module-status');
            if (moduleStatus) {
                moduleStatus.textContent = 'Completed';
                moduleStatus.className = 'module-status completed';
            }
            
            // Update progress bars
            this.updateProgressBars();
            
            // Dispatch event for module completion
            document.dispatchEvent(new CustomEvent('module-completed', {
                detail: { moduleId }
            }));
        } else if (completedCount > 0) {
            // Module is partially complete
            const moduleStatus = moduleElement.querySelector('.module-status');
            if (moduleStatus && moduleStatus.textContent !== 'Completed') {
                moduleStatus.textContent = 'In Progress';
                moduleStatus.className = 'module-status ready';
            }
            
            // Update progress bar
            this.updateProgressBars();
        }
    },
    
    // Update all progress bars
    updateProgressBars: function() {
        // Update overall progress
        const overallProgressBar = document.getElementById('overall-progress');
        if (overallProgressBar) {
            const totalModules = 6; // Hardcoded total number of modules
            let completedModules = 0;
            
            // Count completed modules
            for (let i = 1; i <= totalModules; i++) {
                if (this.state.userProgress.modules[i]?.completed) {
                    completedModules++;
                }
            }
            
            // Calculate percentage
            const completionPercentage = (completedModules / totalModules) * 100;
            
            // Update progress bar
            overallProgressBar.style.width = `${completionPercentage}%`;
            
            // Update text
            const progressText = document.querySelector('.progress-text span:first-child');
            if (progressText) {
                progressText.textContent = `${Math.round(completionPercentage)}% Complete`;
            }
            
            const progressModules = document.querySelector('.progress-text span:last-child');
            if (progressModules) {
                progressModules.textContent = `${completedModules}/${totalModules} Modules`;
            }
        }
        
        // Update individual module progress bars
        for (let moduleId in this.state.userProgress.modules) {
            const moduleProgressBar = document.querySelector(`.module-progress[data-module="${moduleId}"]`);
            if (moduleProgressBar) {
                const moduleElement = document.getElementById(`module${moduleId}`);
                if (!moduleElement) continue;
                
                const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
                if (lessonHeaders.length === 0) continue;
                
                // Count completed lessons
                let completedLessons = 0;
                lessonHeaders.forEach(header => {
                    const lessonId = header.getAttribute('data-lesson');
                    if (lessonId && this.state.userProgress.modules[moduleId]?.lessons[lessonId]) {
                        completedLessons++;
                    }
                });
                
                // Calculate percentage
                const completionPercentage = (completedLessons / lessonHeaders.length) * 100;
                
                // Update progress bar
                moduleProgressBar.style.width = `${completionPercentage}%`;
                
                // Update text
                const progressText = moduleElement.querySelector('.progress-text span:first-child');
                if (progressText) {
                    progressText.textContent = `${Math.round(completionPercentage)}% Complete`;
                }
                
                const progressLessons = moduleElement.querySelector('.progress-text span:last-child');
                if (progressLessons) {
                    progressLessons.textContent = `${completedLessons}/${lessonHeaders.length} Lessons`;
                }
            }
        }
    },
    
    // Initialize default behaviors for core functionality
    initializeDefaultBehaviors: function() {
        // These are the essential functions that must work even if component modules fail
        
        // Initialize accordions (critical functionality)
        this.initializeAccordions();
        
        // Initialize tabs
        this.initializeTabs();
        
        // Initialize quiz system
        this.initializeQuizzes();
        
        // Initialize progress system
        this.initializeProgressSystem();
        
        // Update UI based on current progress
        this.updateProgressUI();
    },
    
    // Initialize accordion functionality
    initializeAccordions: function() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            // Avoid adding duplicate event listeners
            if (header.hasAttribute('data-has-listener')) return;
            
            // Mark as having listener
            header.setAttribute('data-has-listener', 'true');
            
            header.addEventListener('click', function() {
                // No need to check for locked status anymore
                const content = this.nextElementSibling;
                
                // Close all other accordions
                accordionHeaders.forEach(h => {
                    if (h !== this && h.classList.contains('active')) {
                        h.classList.remove('active');
                        if (h.nextElementSibling) {
                            h.nextElementSibling.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current accordion
                this.classList.toggle('active');
                if (content) {
                    content.classList.toggle('active');
                }
                
                // Scroll into view if opened
                if (this.classList.contains('active')) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
                
                // Update current module and lesson in state
                if (this.classList.contains('active')) {
                    PlainIDCourse.state.currentModule = this.getAttribute('data-module');
                    PlainIDCourse.state.currentLesson = this.getAttribute('data-lesson');
                }
            });
        });
    },
    
    // Initialize tab functionality
    initializeTabs: function() {
        const tabs = document.querySelectorAll('.tab');
        
        tabs.forEach(tab => {
            // Avoid adding duplicate event listeners
            if (tab.hasAttribute('data-has-listener')) return;
            
            // Mark as having listener
            tab.setAttribute('data-has-listener', 'true');
            
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
                const targetContent = document.getElementById(`${tabId}-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    },
    
    // Initialize quiz functionality
    initializeQuizzes: function() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        
        quizOptions.forEach(option => {
            // Avoid adding duplicate event listeners
            if (option.hasAttribute('data-has-listener')) return;
            
            // Mark as having listener
            option.setAttribute('data-has-listener', 'true');
            
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
                    if (feedback) {
                        feedback.textContent = 'Correct! Well done.';
                        feedback.className = 'quiz-feedback correct';
                    }
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
                    
                    // Add continue button
                    const continueButton = document.createElement('button');
                    continueButton.className = 'btn continue-button';
                    continueButton.textContent = 'Continue to Next Lesson';
                    continueButton.addEventListener('click', () => {
                        // Get next lesson
                        const module = document.getElementById(`module${moduleId}`);
                        if (!module) return;
                        
                        const headers = Array.from(module.querySelectorAll('.accordion-header'));
                        const currentHeader = module.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                        
                        if (!currentHeader) return;
                        
                        const currentIndex = headers.indexOf(currentHeader);
                        if (currentIndex >= 0 && currentIndex < headers.length - 1) {
                            // Navigate to next lesson
                            const nextHeader = headers[currentIndex + 1];
                            
                            // Close current lesson
                            currentHeader.classList.remove('active');
                            const currentContent = currentHeader.nextElementSibling;
                            if (currentContent) {
                                currentContent.classList.remove('active');
                            }
                            
                            // Open next lesson
                            nextHeader.classList.add('active');
                            const nextContent = nextHeader.nextElementSibling;
                            if (nextContent) {
                                nextContent.classList.add('active');
                            }
                            
                            // Scroll to next lesson
                            nextHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    });
                    
                    // Add button if not already there
                    if (!questionContainer.querySelector('.continue-button')) {
                        questionContainer.appendChild(continueButton);
                    }
                } else {
                    this.classList.add('incorrect');
                    if (feedback) {
                        feedback.textContent = 'Incorrect. Please try again.';
                        feedback.className = 'quiz-feedback incorrect';
                    }
                }
            });
        });
    },
    
    // Initialize progress tracking system
    initializeProgressSystem: function() {
        // Load saved progress
        try {
            const savedProgress = localStorage.getItem('plainidCourseProgress');
            if (savedProgress) {
                const loadedProgress = JSON.parse(savedProgress);
                
                // Merge with default structure
                this.state.userProgress = {
                    ...this.state.userProgress,
                    ...loadedProgress
                };
            }
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    },
    
    // Update UI elements based on loaded progress
    updateProgressUI: function() {
        console.log("Updating UI based on progress:", this.state.userProgress);
        
        // Update lesson statuses
        for (const moduleId in this.state.userProgress.modules) {
            const module = this.state.userProgress.modules[moduleId];
            
            // Update module status
            const moduleElement = document.getElementById(`module${moduleId}`);
            if (!moduleElement) {
                console.warn(`Module element for module ${moduleId} not found`);
                continue;
            }
            
            const moduleStatus = moduleElement.querySelector('.module-status');
            if (moduleStatus) {
                if (module.completed) {
                    moduleStatus.textContent = 'Completed';
                    moduleStatus.className = 'module-status completed';
                } else if (Object.keys(module.lessons || {}).length > 0) {
                    moduleStatus.textContent = 'In Progress';
                    moduleStatus.className = 'module-status ready';
                } else {
                    // Ensure all modules are set to 'Not Started' instead of 'Locked'
                    if (moduleStatus.textContent === 'Locked') {
                        moduleStatus.textContent = 'Not Started';
                        moduleStatus.className = 'module-status';
                    }
                }
            }
            
            // Update lesson statuses
            for (const lessonId in module.lessons) {
                if (module.lessons[lessonId]) {
                    // Find and update lesson status
                    const lessonHeader = moduleElement.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                    if (lessonHeader) {
                        const statusElement = lessonHeader.querySelector('.status');
                        if (statusElement) {
                            statusElement.textContent = 'Completed';
                            statusElement.className = 'status completed';
                        }
                    }
                }
            }
            
            // Ensure all lessons in the module are unlocked
            const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
            lessonHeaders.forEach(header => {
                const statusElement = header.querySelector('.status');
                if (statusElement && statusElement.textContent === 'Locked') {
                    statusElement.textContent = 'Start';
                    statusElement.className = 'status';
                }
            });
        }
        
        // Update progress bars
        this.updateProgressBars();
        
        // Ensure all modules are unlocked
        for (let i = 1; i <= 6; i++) {
            const moduleElement = document.getElementById(`module${i}`);
            if (moduleElement) {
                const moduleStatus = moduleElement.querySelector('.module-status');
                if (moduleStatus && moduleStatus.textContent === 'Locked') {
                    moduleStatus.textContent = 'Not Started';
                    moduleStatus.className = 'module-status';
                }
                
                // Unlock all lessons in this module
                const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
                lessonHeaders.forEach(header => {
                    const statusElement = header.querySelector('.status');
                    if (statusElement && statusElement.textContent === 'Locked') {
                        statusElement.textContent = 'Start';
                        statusElement.className = 'status';
                    }
                });
            }
        }
        
        // Update certificate name if user has set one
        if (this.state.userProgress.userName) {
            const certificateNameElement = document.querySelector('.certificate-name');
            if (certificateNameElement) {
                certificateNameElement.textContent = this.state.userProgress.userName;
            }
        }
    },

    // Navigate to a specific module
    navigateToModule: function(moduleId) {
        console.log(`Navigating to module ${moduleId}`);
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) {
            console.warn(`Module element for module ${moduleId} not found`);
            return;
        }
            
        // Smooth scroll to module
        moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        //
