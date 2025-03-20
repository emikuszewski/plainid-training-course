document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for course cards
    animateCourseCards();
    
    // Initialize accordions with improved functionality
    initializeAccordions();
    
    // Initialize tabs with better transitions
    initializeTabs();
    
    // Initialize quiz system with enhanced feedback
    initializeQuizzes();
    
    // Initialize progress system
    initializeProgressSystem();
    
    // Handle module and lesson navigation
    initializeNavigation();
    
    // Add custom animations to various elements
    addCustomAnimations();
    
    // Enable certificate personalization
    enableCertificatePersonalization();
});

/**
 * Initialize accordion functionality with smooth animations
 */
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Check if the lesson is locked
            const status = this.querySelector('.status').textContent;
            if (status === 'Locked') {
                showNotification('Please complete the previous lessons first.', 'warning');
                return;
            }
            
            const content = this.nextElementSibling;
            
            // Close all other accordion items
            if (!this.classList.contains('active')) {
                document.querySelectorAll('.accordion-header').forEach(h => {
                    if (h !== this && h.classList.contains('active')) {
                        h.classList.remove('active');
                        h.nextElementSibling.classList.remove('active');
                    }
                });
            }
            
            // Toggle current accordion item
            this.classList.toggle('active');
            content.classList.toggle('active');
            
            // Scroll into view if needed
            if (this.classList.contains('active')) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });
}

/**
 * Initialize tab functionality with smooth transitions
 */
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Deactivate all tabs and content
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.opacity = '0';
                setTimeout(() => {
                    content.classList.remove('active');
                }, 300);
            });
            
            // Activate selected tab
            this.classList.add('active');
            
            // Activate selected content with fade-in animation
            const selectedContent = document.getElementById(`${tabId}-content`);
            setTimeout(() => {
                selectedContent.classList.add('active');
                setTimeout(() => {
                    selectedContent.style.opacity = '1';
                }, 50);
            }, 300);
        });
    });
    
    // Reset opacity for all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.opacity = content.classList.contains('active') ? '1' : '0';
    });
}

/**
 * Initialize quiz functionality with enhanced feedback
 */
function initializeQuizzes() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionContainer = this.closest('.quiz-question');
            const options = questionContainer.querySelectorAll('.quiz-option');
            const feedback = questionContainer.querySelector('.quiz-feedback');
            
            // If quiz already answered, don't allow changing
            if (questionContainer.classList.contains('answered')) {
                return;
            }
            
            // Remove previous selections
            options.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Mark this option as selected
            this.classList.add('selected');
            
            // Check if answer is correct
            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            if (isCorrect) {
                this.classList.add('correct');
                feedback.textContent = 'Correct! Well done.';
                feedback.className = 'quiz-feedback correct';
                questionContainer.classList.add('answered');
                
                // Add success animation
                this.classList.add('success-animation');
                
                // Play success sound
                playSound('success');
                
                // Mark lesson as complete
                const moduleId = questionContainer.getAttribute('data-module');
                const lessonId = questionContainer.getAttribute('data-lesson');
                markLessonComplete(moduleId, lessonId);
                
                // Show congratulations message
                showNotification('Great job! You answered correctly.', 'success');
            } else {
                this.classList.add('incorrect');
                feedback.textContent = 'Incorrect. Please try again.';
                feedback.className = 'quiz-feedback incorrect';
                
                // Add shake animation
                this.classList.add('shake-animation');
                setTimeout(() => {
                    this.classList.remove('shake-animation');
                }, 500);
                
                // Play error sound
                playSound('error');
            }
        });
    });
    
    // Add animation classes if not present
    if (!document.getElementById('animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'animation-styles';
        styleSheet.textContent = `
            @keyframes success-animation {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            .success-animation {
                animation: success-animation 0.5s ease;
            }
            @keyframes shake-animation {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
            .shake-animation {
                animation: shake-animation 0.5s ease;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

/**
 * Initialize progress tracking system with localStorage persistence
 */
function initializeProgressSystem() {
    // Define user progress structure
    window.userProgress = {
        modules: {
            1: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false } },
            2: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false } },
            3: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false } },
            4: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false } },
            5: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false } },
            6: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false } }
        },
        userName: '',
        overallProgress: 0
    };
    
    // Initialize the first module and lesson
    const firstLessonHeader = document.querySelector('[data-module="1"][data-lesson="1"]');
    if (firstLessonHeader) {
        const statusElement = firstLessonHeader.querySelector('.status');
        if (statusElement) {
            statusElement.textContent = 'Start';
            statusElement.classList.add('ready');
        }
    }
    
    // Load saved progress
    loadProgress();
    
    // Setup autosave
    window.addEventListener('beforeunload', saveProgress);
}

/**
 * Mark a lesson as complete and update progress indicators
 * @param {string} moduleId - The module ID
 * @param {string} lessonId - The lesson ID
 */
function markLessonComplete(moduleId, lessonId) {
    // Update progress data
    window.userProgress.modules[moduleId].lessons[lessonId] = true;
    
    // Update lesson status in UI
    const lessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
    if (lessonHeader) {
        const statusElement = lessonHeader.querySelector('.status');
        if (statusElement) {
            statusElement.textContent = 'Completed';
            statusElement.className = 'status completed';
        }
    }
    
    // Calculate module progress
    const module = window.userProgress.modules[moduleId];
    const totalLessons = Object.keys(module.lessons).length;
    let completedLessons = 0;
    
    for (const lesson in module.lessons) {
        if (module.lessons[lesson]) {
            completedLessons++;
        }
    }
    
    const moduleProgress = Math.round((completedLessons / totalLessons) * 100);
    
    // Update module progress bar with animation
    const progressBar = document.querySelector(`.module-progress[data-module="${moduleId}"]`);
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = `${moduleProgress}%`;
        }, 300);
        
        // Update module progress text
        const progressText = progressBar.closest('.progress-container').querySelector('.progress-text');
        if (progressText) {
            progressText.innerHTML = `
                <span>${moduleProgress}% Complete</span>
                <span>${completedLessons}/${totalLessons} Lessons</span>
            `;
        }
    }
    
    // Check if module is complete
    if (completedLessons === totalLessons) {
        module.completed = true;
        
        // Update module status
        const moduleHeader = document.querySelector(`#module${moduleId} .module-header .module-status`);
        if (moduleHeader) {
            moduleHeader.textContent = 'Completed';
            moduleHeader.className = 'module-status completed';
        }
        
        // Show completion message
        showNotification(`Congratulations! You've completed Module ${moduleId}!`, 'success');
        
        // Unlock next module
        unlockNextModule(moduleId);
    } else {
        // Unlock next lesson
        unlockNextLesson(moduleId, lessonId);
    }
    
    // Update overall progress
    updateOverallProgress();
    
    // Save progress
    saveProgress();
}

/**
 * Unlock the next lesson after completing current one
 * @param {string} moduleId - The current module ID
 * @param {string} lessonId - The current lesson ID
 */
function unlockNextLesson(moduleId, lessonId) {
    const nextLessonId = parseInt(lessonId) + 1;
    const nextLessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${nextLessonId}"]`);
    
    if (nextLessonHeader) {
        const statusElement = nextLessonHeader.querySelector('.status');
        if (statusElement) {
            statusElement.textContent = 'Start';
            statusElement.className = 'status ready';
        }
    }
}

/**
 * Unlock the next module after completing current one
 * @param {string} moduleId - The completed module ID
 */
function unlockNextModule(moduleId) {
    const nextModuleId = parseInt(moduleId) + 1;
    const nextModuleHeader = document.querySelector(`#module${nextModuleId} .module-header .module-status`);
    
    if (nextModuleHeader) {
        nextModuleHeader.textContent = 'Ready';
        nextModuleHeader.className = 'module-status ready';
        
        // Unlock first lesson of next module
        const firstLessonHeader = document.querySelector(`[data-module="${nextModuleId}"][data-lesson="1"]`);
        if (firstLessonHeader) {
            const statusElement = firstLessonHeader.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Start';
                statusElement.className = 'status ready';
            }
        }
    }
}

/**
 * Update the overall course progress
 */
function updateOverallProgress() {
    let totalLessons = 0;
    let completedLessons = 0;
    
    for (const moduleId in window.userProgress.modules) {
        const module = window.userProgress.modules[moduleId];
        
        for (const lessonId in module.lessons) {
            totalLessons++;
            
            if (module.lessons[lessonId]) {
                completedLessons++;
            }
        }
    }
    
    const overallProgress = Math.round((completedLessons / totalLessons) * 100);
    window.userProgress.overallProgress = overallProgress;
    
    // Update overall progress bar with animation
    const overallProgressBar = document.getElementById('overall-progress');
    if (overallProgressBar) {
        setTimeout(() => {
            overallProgressBar.style.width = `${overallProgress}%`;
        }, 300);
        
        // Update overall progress text
        const overallProgressText = overallProgressBar.closest('.progress-container').querySelector('.progress-text');
        if (overallProgressText) {
            const completedModules = Object.values(window.userProgress.modules).filter(module => module.completed).length;
            const totalModules = Object.keys(window.userProgress.modules).length;
            
            overallProgressText.innerHTML = `
                <span>${overallProgress}% Complete</span>
                <span>${completedModules}/${totalModules} Modules</span>
            `;
        }
    }
    
    // Check if course is complete
    if (overallProgress === 100) {
        // Show completion message
        showNotification('Congratulations! You\'ve completed the entire course!', 'success', 10000);
        
        // Scroll to certificate section
        setTimeout(() => {
            document.getElementById('certification').scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }
}

/**
 * Initialize navigation between modules and lessons
 */
function initializeNavigation() {
    // Next lesson button functionality
    const nextLessonButtons = document.querySelectorAll('.next-lesson');
    nextLessonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            const lessonId = this.getAttribute('data-lesson');
            
            navigateToLesson(moduleId, lessonId);
        });
    });
    
    // Previous lesson button functionality
    const prevLessonButtons = document.querySelectorAll('.prev-lesson');
    prevLessonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            const lessonId = this.getAttribute('data-lesson');
            
            navigateToLesson(moduleId, lessonId);
        });
    });
    
    // Module link functionality
    const moduleLinks = document.querySelectorAll('.module-link');
    moduleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const moduleId = this.getAttribute('data-module');
            navigateToModule(moduleId);
        });
    });
}

/**
 * Navigate to a specific lesson
 * @param {string} moduleId - The module ID
 * @param {string} lessonId - The lesson ID
 */
function navigateToLesson(moduleId, lessonId) {
    // Close all accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.classList.remove('active');
        header.nextElementSibling.classList.remove('active');
    });
    
    // Open target lesson
    const targetHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
    if (targetHeader) {
        // Check if lesson is accessible
        const status = targetHeader.querySelector('.status').textContent;
        if (status === 'Locked') {
            showNotification('Please complete the previous lessons first.', 'warning');
            return;
        }
        
        const targetContent = targetHeader.nextElementSibling;
        
        targetHeader.classList.add('active');
        targetContent.classList.add('active');
        
        // Scroll to the lesson with smooth animation
        setTimeout(() => {
            targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

/**
 * Navigate to a specific module
 * @param {string} moduleId - The module ID
 */
function navigateToModule(moduleId) {
    const moduleElement = document.querySelector(`#module${moduleId}`);
    if (!moduleElement) return;
    
    // Check if module is locked
    const moduleStatus = moduleElement.querySelector('.module-status').textContent;
    if (moduleStatus === 'Locked') {
        showNotification('Please complete the previous modules first.', 'warning');
        return;
    }
    
    // Scroll to module with smooth animation
    moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Open first accessible lesson if not already open
    let firstAccessibleLesson = null;
    
    // Find first lesson that's not locked
    for (let i = 1; i <= 10; i++) {
        const lessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${i}"]`);
        if (!lessonHeader) break;
        
        const status = lessonHeader.querySelector('.status').textContent;
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
        setTimeout(() => {
            firstAccessibleLesson.classList.add('active');
            firstAccessibleLesson.nextElementSibling.classList.add('active');
        }, 600);
    }
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
    try {
        localStorage.setItem('plainidCourseProgress', JSON.stringify(window.userProgress));
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

/**
 * Load progress from localStorage and update UI
 */
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('plainidCourseProgress');
        if (savedProgress) {
            const loadedProgress = JSON.parse(savedProgress);
            
            // Merge saved progress with default structure to handle new fields
            window.userProgress = {
                ...window.userProgress,
                ...loadedProgress,
                modules: { ...window.userProgress.modules }
            };
            
            for (const moduleId in loadedProgress.modules) {
                if (window.userProgress.modules[moduleId]) {
                    window.userProgress.modules[moduleId] = {
                        ...window.userProgress.modules[moduleId],
                        ...loadedProgress.modules[moduleId]
                    };
                }
            }
            
            // Update UI based on loaded progress
            updateUIFromProgress();
            
            // Update certificate if name exists
            if (window.userProgress.userName) {
                updateCertificateName(window.userProgress.userName);
            }
        }
    } catch (e) {
        console.error('Error loading progress:', e);
        // If there's an error, reset progress
        window.userProgress = {
            modules: {
                1: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false } },
                2: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false } },
                3: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false } },
                4: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false } },
                5: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false } },
                6: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false } }
            },
            userName: '',
            overallProgress: 0
        };
    }
}

/**
 * Update UI elements based on loaded progress
 */
function updateUIFromProgress() {
    // Update module statuses
    for (const moduleId in window.userProgress.modules) {
        const module = window.userProgress.modules[moduleId];
        const moduleStatusElement = document.querySelector(`#module${moduleId} .module-header .module-status`);
        
        if (moduleStatusElement) {
            if (module.completed) {
                moduleStatusElement.textContent = 'Completed';
                moduleStatusElement.className = 'module-status completed';
            } else if (moduleId === '1' || window.userProgress.modules[parseInt(moduleId) - 1]?.completed) {
                moduleStatusElement.textContent = 'Ready';
                moduleStatusElement.className = 'module-status ready';
            } else {
                moduleStatusElement.textContent = 'Locked';
                moduleStatusElement.className = 'module-status locked';
            }
        }
        
        // Update lesson statuses
        for (const lessonId in module.lessons) {
            const lessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
            if (!lessonHeader) continue;
            
            const statusElement = lessonHeader.querySelector('.status');
            if (!statusElement) continue;
            
            if (module.lessons[lessonId]) {
                statusElement.textContent = 'Completed';
                statusElement.className = 'status completed';
            } else if (lessonId === '1' && (moduleId === '1' || window.userProgress.modules[parseInt(moduleId) - 1]?.completed)) {
                statusElement.textContent = 'Start';
                statusElement.className = 'status ready';
            } else if (parseInt(lessonId) > 1 && module.lessons[parseInt(lessonId) - 1]) {
                statusElement.textContent = 'Start';
                statusElement.className = 'status ready';
            } else {
                statusElement.textContent = 'Locked';
                statusElement.className = 'status locked';
            }
            
            // Mark questions as answered if lesson is completed
            if (module.lessons[lessonId]) {
                const questions = document.querySelectorAll(`.quiz-question[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                questions.forEach(question => {
                    question.classList.add('answered');
                    
                    // Mark correct answer
                    const correctOption = question.querySelector('.quiz-option[data-correct="true"]');
                    if (correctOption) {
                        correctOption.classList.add('selected', 'correct');
                    }
                    
                    // Show feedback
                    const feedback = question.querySelector('.quiz-feedback');
                    if (feedback) {
                        feedback.textContent = 'Correct! Well done.';
                        feedback.className = 'quiz-feedback correct';
                    }
                });
            }
        }
        
        // Update module progress bars
        updateModuleProgressBar(moduleId);
    }
    
    // Update overall progress
    updateOverallProgress();
}

/**
 * Update module progress bar based on completed lessons
 * @param {string} moduleId - The module ID
 */
function updateModuleProgressBar(moduleId) {
    const module = window.userProgress.modules[moduleId];
    const totalLessons = Object.keys(module.lessons).length;
    let completedLessons = 0;
    
    for (const lesson in module.lessons) {
        if (module.lessons[lesson]) {
            completedLessons++;
        }
    }
    
    const moduleProgress = Math.round((completedLessons / totalLessons) * 100);
    
    // Update module progress bar
    const progressBar = document.querySelector(`.module-progress[data-module="${moduleId}"]`);
    if (progressBar) {
        progressBar.style.width = `${moduleProgress}%`;
        
        // Update module progress text
        const progressText = progressBar.closest('.progress-container').querySelector('.progress-text');
        if (progressText) {
            progressText.innerHTML = `
                <span>${moduleProgress}% Complete</span>
                <span>${completedLessons}/${totalLessons} Lessons</span>
            `;
        }
    }
}

/**
 * Add custom animations to various elements
 */
function addCustomAnimations() {
    // Add hover effects to diagram images
    const diagramImages = document.querySelectorAll('.diagram img');
    diagramImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add scroll animations
    addScrollAnimations();
}

/**
 * Add animations that trigger on scroll
 */
function addScrollAnimations() {
    // Add animation class if not present
    if (!document.getElementById('scroll-animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-animation-styles';
        styleSheet.textContent = `
            .scroll-animate {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            .scroll-animate.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add scroll animation class to elements
    const elementsToAnimate = document.querySelectorAll('h2, .module-container, .certificate');
    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('scroll-animate')) {
            el.classList.add('scroll-animate');
        }
    });
    
    // Check for elements in viewport on scroll
    function checkInView() {
        const elements = document.querySelectorAll('.scroll-animate');
        const windowHeight = window.innerHeight;
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkInView);
}

/**
 * Animate course cards on load
 */
function animateCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 * (index + 1));
    });
}

/**
 * Enable certificate personalization
 */
function enableCertificatePersonalization() {
    const certificateName = document.querySelector('.certificate-name');
    if (!certificateName) return;
    
    // Make certificate name editable on click
    certificateName.addEventListener('click', function() {
        // Check if we're already editing
        if (this.getAttribute('contenteditable') === 'true') return;
        
        // Store original text
        const originalText = this.textContent;
        
        // Make editable
        this.setAttribute('contenteditable', 'true');
        this.focus();
        
        // Add styling
        this.style.border = '2px dashed var(--primary)';
        this.style.padding = '5px 10px';
        this.style.background = 'rgba(0, 115, 230, 0.05)';
        
        // Show instruction
        showNotification('Click to edit your name on the certificate, then click outside to save.', 'info', 5000);
        
        // Handle save on blur
        this.addEventListener('blur', function saveName() {
            this.removeAttribute('contenteditable');
            this.style.border = 'none';
            this.style.borderBottom = '2px dotted goldenrod';
            this.style.padding = '0 20px 5px';
            this.style.background = 'transparent';
            
            // Save name if changed and not empty
            if (this.textContent.trim() !== originalText && this.textContent.trim() !== '') {
                window.userProgress.userName = this.textContent.trim();
                saveProgress();
                showNotification('Your name has been saved on the certificate!', 'success');
            } else if (this.textContent.trim() === '') {
                // Restore original if empty
                this.textContent = originalText;
            }
            
            // Remove event listener
            this.removeEventListener('blur', saveName);
        });
    });
    
    // Add hover effect
    certificateName.addEventListener('mouseenter', function() {
        if (this.getAttribute('contenteditable') !== 'true') {
            this.style.cursor = 'pointer';
            this.style.background = 'rgba(0, 115, 230, 0.05)';
        }
    });
    
    certificateName.addEventListener('mouseleave', function() {
        if (this.getAttribute('contenteditable') !== 'true') {
            this.style.background = 'transparent';
        }
    });
    
    // Set hint
    if (certificateName.textContent === 'Your Name') {
        certificateName.setAttribute('data-tooltip', 'Click to edit');
    }
}

/**
 * Update certificate name
 * @param {string} name - The name to display on certificate
 */
function updateCertificateName(name) {
    const certificateName = document.querySelector('.certificate-name');
    if (certificateName && name) {
        certificateName.textContent = name;
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (success, warning, info)
 * @param {number} duration - How long to show the notification (ms)
 */
function showNotification(message, type = 'info', duration = 3000) {
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
}

/**
 * Remove notification with animation
 * @param {HTMLElement} notification - The notification element to remove
 */
function removeNotification(notification) {
    notification.style.animation = 'slide-out 0.3s ease forwards';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Play a sound effect
 * @param {string} type - The type of sound (success, error)
 */
function playSound(type) {
    // Check if audio is supported
    if (typeof Audio === 'undefined') return;
    
    let sound;
    if (type === 'success') {
        sound = new Audio('data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMATlRQRQAAABcAAABDcmVhdGVkIHdpdGggU291bmRKYXkuY29tVElUMgAAABsAAABTb3VuZEpheS5jb20gU291bmQgRWZmZWN0c1RTTFQAAAAWAAAAQ3JlYXRlZCBieSBTb3VuZEpheS5jb21UU1NFAAAADAAAAFN5c3RlbXMgRGVzay9YWVgAAABiAAAAaHR0cHM6Ly93d3cuc291bmRqYXkuY29tL2ZyZWUtc291bmQtZWZmZWN0cy9zeXN0ZW1zLWRlc2stc291bmRzLzEwMy9kb3dubG9hZC8=');
    } else {
        sound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAXwAAAAAAAAAbDR1qyjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANkAKwUAhEANvbW27u7u7u7u7u7u7uQAIAgCAIAmD4Pg+D4IBAEAQdMHwfB8EAQBAIAgD4Pg+D4Ph8Hw+D4IA+D4IA+CBwQ+D4Pg+D5//8Hz//BAIAgCBQMYIwi3MEQTBBjYD4Pg+D4+D5//8EAfB8EAQBuWbQ0/5icKFD45MiMDPBEBwU9CzH//////////////+MYxBIPED68QBhGgf///////////wQCgZ4kAoBQIL0PAiOb////////////RAWZyAoGkJQphVf///////////JBmciBQNASicVb////////////9RA0xIFAohQIrZCIT////////////8hWzk/+MYxCIRM060ABiGvQCB6wQFhcxLjwSTH///////////4JpickFBchQT0J///////////+CaYnJBQXQpJuA0f//////////+E9MUk4oKo0BFdCIn//////////+WdYlJBQVQoJyA0f///////////+MYxCkOOF7AABBGvZfcuJxUUMTExMTExMODg4ODg4ODTs7Ozs7OzsGBgYGBgYGEeHh4eHh4eb///////////////////////////////////////////////8AAAAAAAAAAAAAAAAA');
    }
    
    sound.volume = 0.3;
    sound.play().catch(e => {
        // Silent error - browser might block autoplay
        console.log('Audio playback was prevented by the browser');
    });
}
