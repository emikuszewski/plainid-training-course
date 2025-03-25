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
        
        // Add automatic module progression monitor (new)
        this.setupModuleProgressionMonitor();
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
            
            // Unlock next module
            this.updateModuleAvailability();
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
        
        // Make sure the next lesson is unlocked
        this.unlockNextLesson(moduleId, lessonId);
    },
    
    // Unlock the next lesson after completing the current one
    unlockNextLesson: function(moduleId, lessonId) {
        moduleId = moduleId.toString();
        lessonId = lessonId.toString();
        
        // Find the current lesson
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) return;
        
        // Get all lesson headers in this module
        const lessonHeaders = Array.from(moduleElement.querySelectorAll('.accordion-header'));
        
        // Find the index of the current lesson
        const currentIndex = lessonHeaders.findIndex(header => 
            header.getAttribute('data-module') === moduleId && 
            header.getAttribute('data-lesson') === lessonId
        );
        
        // If found and not the last lesson in the module
        if (currentIndex !== -1 && currentIndex < lessonHeaders.length - 1) {
            // Get the next lesson
            const nextHeader = lessonHeaders[currentIndex + 1];
            const nextLessonId = nextHeader.getAttribute('data-lesson');
            
            // Check if it's locked and unlock it
            const statusElement = nextHeader.querySelector('.status');
            if (statusElement && statusElement.textContent === 'Locked') {
                console.log(`Unlocking next lesson ${nextLessonId} in module ${moduleId}`);
                statusElement.textContent = 'Start';
                statusElement.className = 'status';
            }
        } else if (currentIndex !== -1 && currentIndex === lessonHeaders.length - 1) {
            // This was the last lesson in the module, try to unlock next module
            this.unlockNextModule(parseInt(moduleId));
        }
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
            
            // Unlock next module
            this.unlockNextModule(parseInt(moduleId));
            
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
    
    // Unlock the next module after completing the current one
    unlockNextModule: function(completedModuleId) {
        const nextModuleId = completedModuleId + 1;
        console.log(`Attempting to unlock module ${nextModuleId}`);
        
        const nextModuleElement = document.getElementById(`module${nextModuleId}`);
        if (!nextModuleElement) {
            console.log(`Module ${nextModuleId} not found, cannot unlock`);
            return;
        }
        
        // Get the module status
        const moduleStatus = nextModuleElement.querySelector('.module-status');
        if (!moduleStatus) {
            console.log(`Module status element not found for module ${nextModuleId}`);
            return;
        }
        
        // Only unlock if it's currently locked
        if (moduleStatus.textContent === 'Locked' || moduleStatus.textContent === 'Not Started') {
            console.log(`Unlocking module ${nextModuleId}`);
            
            // Update status
            moduleStatus.textContent = 'Not Started';
            moduleStatus.className = 'module-status';
            
            // Also unlock the first lesson
            const firstLessonHeader = nextModuleElement.querySelector('.accordion-header');
            if (firstLessonHeader) {
                const statusElement = firstLessonHeader.querySelector('.status');
                if (statusElement) {
                    statusElement.textContent = 'Start';
                    statusElement.className = 'status';
                }
            }
            
            // Show notification
            if (window.showNotification) {
                const moduleTitle = nextModuleElement.querySelector('.module-header h3')?.textContent || `Module ${nextModuleId}`;
                window.showNotification(`New module unlocked: ${moduleTitle}`, 'success');
            }
            
            // Update module availability in state
            this.updateModuleAvailability();
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
                // Check if the lesson is locked
                const status = this.querySelector('.status')?.textContent;
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
        }
        
        // Update progress bars
        this.updateProgressBars();
        
        // Unlock modules based on prerequisites
        this.updateModuleAvailability();
        
        // Update certificate name if user has set one
        if (this.state.userProgress.userName) {
            const certificateNameElement = document.querySelector('.certificate-name');
            if (certificateNameElement) {
                certificateNameElement.textContent = this.state.userProgress.userName;
            }
        }
    },
    
    // Update module availability based on prerequisites
    updateModuleAvailability: function() {
        console.log("Updating module availability");
        
        // First pass: count completed modules and identify last completed
        let completedModules = [];
        let lastCompletedModuleId = 0;
        
        // Find the highest completed module ID
        for (let moduleId in this.state.userProgress.modules) {
            const moduleData = this.state.userProgress.modules[moduleId];
            const parsedModuleId = parseInt(moduleId);
            
            if (moduleData.completed) {
                completedModules.push(parsedModuleId);
                if (parsedModuleId > lastCompletedModuleId) {
                    lastCompletedModuleId = parsedModuleId;
                }
            }
        }
        
        console.log(`Found ${completedModules.length} completed modules. Last completed: ${lastCompletedModuleId}`);
        
        // Make sure Module 1 is always unlocked
        const module1 = document.getElementById('module1');
        if (module1) {
            const moduleStatus = module1.querySelector('.module-status');
            if (moduleStatus && (moduleStatus.textContent === 'Locked' || moduleStatus.textContent === 'Not Started')) {
                moduleStatus.textContent = 'Not Started';
                moduleStatus.className = 'module-status';
                this.unlockFirstLesson('1');
            }
        }
        
        // Second pass: unlock modules based on completion
        if (lastCompletedModuleId > 0) {
            // Fixed: Look for the next module to unlock
            const nextModuleId = lastCompletedModuleId + 1;
            const nextModuleElement = document.getElementById(`module${nextModuleId}`);
            
            if (nextModuleElement) {
                console.log(`Checking next module ${nextModuleId} for unlocking`);
                
                const moduleStatus = nextModuleElement.querySelector('.module-status');
                if (moduleStatus && moduleStatus.textContent === 'Locked') {
                    console.log(`Unlocking module ${nextModuleId}`);
                    
                    // Unlock the module
                    moduleStatus.textContent = 'Not Started';
                    moduleStatus.className = 'module-status';
                    
                    // Unlock its first lesson
                    this.unlockFirstLesson(nextModuleId);
                    
                    // Show notification
                    if (typeof window.showNotification === 'function') {
                        const moduleTitle = nextModuleElement.querySelector('.module-header h3')?.textContent || `Module ${nextModuleId}`;
                        window.showNotification(`New module available: ${moduleTitle}`, 'info');
                    }
                }
            }
            
            // Also handle the case where the next module already has In Progress status but first lesson is locked
            if (nextModuleElement) {
                const moduleStatus = nextModuleElement.querySelector('.module-status');
                if (moduleStatus && 
                   (moduleStatus.textContent === 'Not Started' || moduleStatus.textContent === 'In Progress')) {
                    this.unlockFirstLesson(nextModuleId);
                }
            }
        }
        
        // Save state after updates
        this.saveState();
    },
    
    // Unlock the first lesson in a module
    unlockFirstLesson: function(moduleId) {
        console.log(`Unlocking first lesson in module ${moduleId}`);
        
        // Get module element
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) {
            console.warn(`Module element for module ${moduleId} not found`);
            return;
        }
        
        // Find first lesson header
        const firstLessonHeader = moduleElement.querySelector('.accordion-header');
        if (!firstLessonHeader) {
            console.warn(`No lesson headers found for module ${moduleId}`);
            return;
        }
        
        // Update status
        const statusElement = firstLessonHeader.querySelector('.status');
        if (statusElement) {
            // Only change status if it's locked
            if (statusElement.textContent === 'Locked') {
                console.log(`Unlocking first lesson in module ${moduleId}`);
                statusElement.textContent = 'Start';
                statusElement.className = 'status';
            }
        } else {
            console.warn(`Status element not found for first lesson in module ${moduleId}`);
        }
    },
    
    // Calculate the completion percentage of a module
    calculateModuleProgress: function(moduleId) {
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) return 0;
        
        const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
        if (lessonHeaders.length === 0) return 0;
        
        let totalLessons = 0;
        let completedLessons = 0;
        
        lessonHeaders.forEach(header => {
            const lessonId = header.getAttribute('data-lesson');
            if (lessonId) {
                totalLessons++;
                if (this.state.userProgress.modules[moduleId]?.lessons[lessonId]) {
                    completedLessons++;
                }
            }
        });
        
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    },
    
    // Set up a monitor to automatically fix module progression issues
    setupModuleProgressionMonitor: function() {
        console.log("Setting up module progression monitor");
        
        // Check every 2 seconds for module progression issues
        setInterval(() => {
            this.checkAndFixModuleProgression();
        }, 2000);
    },
    
    // Scan for and fix module progression issues
    checkAndFixModuleProgression: function() {
        // Make sure Module 1 is always unlocked
        this.ensureModuleOneUnlocked();
        
        // Make sure completed modules are properly marked
        this.ensureModulesCorrectlyMarked();
        
        // Make sure next modules after completed ones are unlocked
        this.ensureNextModulesUnlocked();
        
        // Make sure first lessons in unlocked modules are accessible
        this.ensureFirstLessonsUnlocked();
        
        // Make sure completed lessons have correct UI state
        this.ensureCompletedLessonsMarked();
        
        // Make sure next lessons after completed ones are unlocked
        this.ensureNextLessonsUnlocked();
    },
    
    // Ensure Module 1 is always unlocked
    ensureModuleOneUnlocked: function() {
        const module1 = document.getElementById('module1');
        if (!module1) return;
        
        const moduleStatus = module1.querySelector('.module-status');
        if (moduleStatus && moduleStatus.textContent === 'Locked') {
            console.log("Monitor: Fixing locked Module 1");
            
            moduleStatus.textContent = 'Not Started';
            moduleStatus.className = 'module-status';
            
            // Also unlock first lesson
            this.unlockFirstLesson('1');
            
            // Update state
            if (!this.state.userProgress.modules[1]) {
                this.state.userProgress.modules[1] = {
                    completed: false,
                    lessons: {}
                };
            }
            
            this.saveState();
        }
    },
    
    // Ensure all modules are correctly marked as completed or in-progress
    ensureModulesCorrectlyMarked: function() {
        for (let moduleId in this.state.userProgress.modules) {
            const moduleData = this.state.userProgress.modules[moduleId];
            const moduleElement = document.getElementById(`module${moduleId}`);
            
            if (!moduleElement) continue;
            
            const moduleStatus = moduleElement.querySelector('.module-status');
            if (!moduleStatus) continue;
            
            // Check for completed modules
            if (moduleData.completed) {
                if (moduleStatus.textContent !== 'Completed') {
                    console.log(`Monitor: Fixing status for completed module ${moduleId}`);
                    moduleStatus.textContent = 'Completed';
                    moduleStatus.className = 'module-status completed';
                }
            } 
            // Check for in-progress modules
            else if (Object.keys(moduleData.lessons || {}).length > 0) {
                if (moduleStatus.textContent === 'Locked') {
                    console.log(`Monitor: Fixing status for in-progress module ${moduleId}`);
                    moduleStatus.textContent = 'In Progress';
                    moduleStatus.className = 'module-status ready';
                }
            }
        }
    },
    
    // Ensure modules after completed ones are unlocked
    ensureNextModulesUnlocked: function() {
        // Find highest completed module
        let highestCompleted = 0;
        
        for (let moduleId in this.state.userProgress.modules) {
            if (this.state.userProgress.modules[moduleId].completed) {
                const parsedId = parseInt(moduleId);
                if (parsedId > highestCompleted) {
                    highestCompleted = parsedId;
                }
            }
        }
        
        // If we found a completed module, ensure the next one is unlocked
        if (highestCompleted > 0) {
            const nextModuleId = highestCompleted + 1;
            const nextModule = document.getElementById(`module${nextModuleId}`);
            
            if (nextModule) {
                const moduleStatus = nextModule.querySelector('.module-status');
                if (moduleStatus && moduleStatus.textContent === 'Locked') {
                    console.log(`Monitor: Unlocking module ${nextModuleId} after completed module ${highestCompleted}`);
                    
                    moduleStatus.textContent = 'Not Started';
                    moduleStatus.className = 'module-status';
                    
                    // Unlock first lesson
                    this.unlockFirstLesson(nextModuleId);
                }
            }
        }
    },
    
    // Ensure first lessons in unlocked modules are accessible
    ensureFirstLessonsUnlocked: function() {
        for (let i = 1; i <= 6; i++) {
            const moduleElement = document.getElementById(`module${i}`);
            if (!moduleElement) continue;
            
            const moduleStatus = moduleElement.querySelector('.module-status');
            if (!moduleStatus) continue;
            
            // If module is not locked, ensure first lesson is accessible
            if (moduleStatus.textContent !== 'Locked') {
                const firstLessonHeader = moduleElement.querySelector('.accordion-header');
                if (!firstLessonHeader) continue;
                
                const statusElement = firstLessonHeader.querySelector('.status');
                if (statusElement && statusElement.textContent === 'Locked') {
                    console.log(`Monitor: Unlocking first lesson in accessible module ${i}`);
                    statusElement.textContent = 'Start';
                    statusElement.className = 'status';
                }
            }
        }
    },
    
    // Ensure completed lessons have correct UI state
    ensureCompletedLessonsMarked: function() {
        for (let moduleId in this.state.userProgress.modules) {
            const moduleData = this.state.userProgress.modules[moduleId];
            const moduleElement = document.getElementById(`module${moduleId}`);
            
            if (!moduleElement) continue;
            
            // Check each completed lesson
            for (let lessonId in moduleData.lessons) {
                if (!moduleData.lessons[lessonId]) continue;
                
                const lessonHeader = moduleElement.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                if (!lessonHeader) continue;
                
                const statusElement = lessonHeader.querySelector('.status');
                if (statusElement && statusElement.textContent !== 'Completed') {
                    console.log(`Monitor: Fixing status for completed lesson ${lessonId} in module ${moduleId}`);
                    statusElement.textContent = 'Completed';
                    statusElement.className = 'status completed';
                }
            }
        }
    },
    
    // Ensure next lessons after completed ones are unlocked
    ensureNextLessonsUnlocked: function() {
        for (let moduleId in this.state.userProgress.modules) {
            const moduleData = this.state.userProgress.modules[moduleId];
            const moduleElement = document.getElementById(`module${moduleId}`);
            
            if (!moduleElement) continue;
            
            // Get all lesson headers
            const lessonHeaders = Array.from(moduleElement.querySelectorAll('.accordion-header'));
            
            // Check each lesson
            for (let i = 0; i < lessonHeaders.length - 1; i++) {
                const currentHeader = lessonHeaders[i];
                const nextHeader = lessonHeaders[i + 1];
                
                const currentLessonId = currentHeader.getAttribute('data-lesson');
                
                // If current lesson is completed but next is locked, unlock next
                if (moduleData.lessons[currentLessonId]) {
                    const nextStatusElement = nextHeader.querySelector('.status');
                    if (nextStatusElement && nextStatusElement.textContent === 'Locked') {
                        const nextLessonId = nextHeader.getAttribute('data-lesson');
                        console.log(`Monitor: Unlocking lesson ${nextLessonId} after completed lesson ${currentLessonId} in module ${moduleId}`);
                        
                        nextStatusElement.textContent = 'Start';
                        nextStatusElement.className = 'status';
                    }
                }
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
            
        // Check if module is locked - specifically check for 'Locked' text
        const moduleStatus = moduleElement.querySelector('.module-status')?.textContent;
        if (moduleStatus === 'Locked') {
            if (window.showNotification) {
                window.showNotification('Please complete the previous modules first.', 'warning');
            } else {
                alert('Please complete the previous modules first.');
            }
            return;
        }
            
        // Smooth scroll to module
        moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        // Open first accessible lesson if not already open
        setTimeout(() => {
            let firstAccessibleLesson = null;
                
            // Find first lesson that's not locked
            for (let i = 1; i <= 10; i++) {
                const lessonHeader = moduleElement.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${i}"]`);
                if (!lessonHeader) break;
                    
                const status = lessonHeader.querySelector('.status')?.textContent;
                if (status !== 'Locked') {
                    firstAccessibleLesson = lessonHeader;
                    break;
                }
            }
                
            if (firstAccessibleLesson && !firstAccessibleLesson.classList.contains('active')) {
                // Close all accordion contents
                document.querySelectorAll('.accordion-content').forEach(content => {
                    content.classList.remove('active');
                });
                    
                document.querySelectorAll('.accordion-header').forEach(header => {
                    header.classList.remove('active');
                });
                    
                // Open first accessible lesson
                firstAccessibleLesson.classList.add('active');
                if (firstAccessibleLesson.nextElementSibling) {
                    firstAccessibleLesson.nextElementSibling.classList.add('active');
                }
                    
                // Trigger click event to update breadcrumbs (via bubbling)
                firstAccessibleLesson.click();
            }
        }, 600);
    }
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    PlainIDCourse.init();
});

// Re-export the utility functions for use by other scripts
window.PlainIDCourse = PlainIDCourse;
