document.addEventListener('DOMContentLoaded', function() {
    // The main initialization is now handled by PlainIDCourse.init()
    // This file just provides a fallback in case integration.js fails
    
    // Check if PlainIDCourse has been initialized
    if (!window.PlainIDCourse || !window.PlainIDCourse.state || !window.PlainIDCourse.state.initialized) {
        console.log('PlainIDCourse not initialized, falling back to basic initialization');
        initializeComponents();
    }
    
    // Add progress tracking module progression indicator to detect and fix issues
    addProgressMonitor();
    
    // Ensure all modules and lessons are unlocked and visible
    unlockAllModulesAndLessons();
    ensureModulesVisible();
});

/**
 * Initialize all course components
 */
function initializeComponents() {
    // Basic initialization for accordion functionality
    initializeAccordions();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize quiz functionality
    initializeQuizzes();
    
    // Initialize module progression
    initializeModuleProgression();
    
    // Ensure all modules and lessons are unlocked
    unlockAllModulesAndLessons();
    
    // Ensure all modules are visible
    ensureModulesVisible();
}

/**
 * Initialize accordion functionality (critical component)
 */
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        // Avoid adding duplicate event listeners
        if (header.hasAttribute('data-has-listener')) return;
        
        // Mark as having listener
        header.setAttribute('data-has-listener', 'true');
        
        header.addEventListener('click', function() {
            // No check for locked status anymore - all lessons are accessible
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
        });
    });
}

/**
 * Initialize tab functionality
 */
function initializeTabs() {
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
}

/**
 * Initialize quiz functionality
 */
function initializeQuizzes() {
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
                feedback.textContent = 'Correct! Well done.';
                feedback.className = 'quiz-feedback correct';
                questionContainer.classList.add('answered');
                
                // Mark lesson complete
                const moduleId = questionContainer.getAttribute('data-module');
                const lessonId = questionContainer.getAttribute('data-lesson');
                
                // Update status if available
                const lessonHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                if (lessonHeader) {
                    const statusElement = lessonHeader.querySelector('.status');
                    if (statusElement) {
                        statusElement.textContent = 'Completed';
                        statusElement.className = 'status completed';
                    }
                }
                
                // Mark lesson complete in local storage
                markLessonComplete(moduleId, lessonId);
                
                // Add continue button
                const continueButton = document.createElement('button');
                continueButton.className = 'btn continue-button';
                continueButton.textContent = 'Continue to Next Lesson';
                continueButton.addEventListener('click', () => {
                    navigateToNextLesson(moduleId, lessonId);
                });
                
                // Add button if not already there
                if (!questionContainer.querySelector('.continue-button')) {
                    questionContainer.appendChild(continueButton);
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
 * Mark a lesson as complete and handle module progression
 * @param {string} moduleId - Module ID
 * @param {string} lessonId - Lesson ID
 */
function markLessonComplete(moduleId, lessonId) {
    try {
        // If PlainIDCourse is available, use its method
        if (window.PlainIDCourse && typeof window.PlainIDCourse.markLessonComplete === 'function') {
            window.PlainIDCourse.markLessonComplete(moduleId, lessonId);
            return;
        }
        
        // Get progress data from localStorage
        let progress = {};
        const storedProgress = localStorage.getItem('plainidCourseProgress');
        if (storedProgress) {
            progress = JSON.parse(storedProgress);
        }
        
        // Ensure structure exists
        if (!progress.modules) {
            progress.modules = {};
        }
        
        if (!progress.modules[moduleId]) {
            progress.modules[moduleId] = {
                completed: false,
                lessons: {}
            };
        }
        
        // Mark lesson complete
        progress.modules[moduleId].lessons[lessonId] = true;
        
        // Check if module is complete
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (moduleElement) {
            const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
            let allLessonsComplete = true;
            let totalLessons = 0;
            
            lessonHeaders.forEach(header => {
                const lId = header.getAttribute('data-lesson');
                if (lId) {
                    totalLessons++;
                    if (!progress.modules[moduleId].lessons[lId]) {
                        allLessonsComplete = false;
                    }
                }
            });
            
            if (allLessonsComplete && totalLessons > 0) {
                // Mark module as complete
                progress.modules[moduleId].completed = true;
                
                // Update module status in UI
                const moduleStatus = moduleElement.querySelector('.module-status');
                if (moduleStatus) {
                    moduleStatus.textContent = 'Completed';
                    moduleStatus.className = 'module-status completed';
                }
            } else if (totalLessons > 0) {
                // Module is in progress
                const moduleStatus = moduleElement.querySelector('.module-status');
                if (moduleStatus && moduleStatus.textContent !== 'Completed') {
                    moduleStatus.textContent = 'In Progress';
                    moduleStatus.className = 'module-status ready';
                }
            }
        }
        
        // Save progress
        localStorage.setItem('plainidCourseProgress', JSON.stringify(progress));
    } catch (e) {
        console.error('Error saving lesson completion:', e);
    }
}

/**
 * Unlock all modules and lessons in the course
 */
function unlockAllModulesAndLessons() {
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
    
    console.log('All modules and lessons have been unlocked for open access');
}

/**
 * Ensure all modules are visible
 */
function ensureModulesVisible() {
    console.log('Ensuring all modules are visible');
    
    // Make sure all module containers are visible
    const moduleContainers = document.querySelectorAll('.module-container');
    
    moduleContainers.forEach(moduleContainer => {
        // Make sure the module container is visible
        moduleContainer.style.display = 'block';
        
        // Ensure the module content is properly displayed
        const moduleContent = moduleContainer.querySelector('.module-content');
        if (moduleContent) {
            moduleContent.style.display = 'block';
        }
    });
    
    // Add CSS fixes to ensure visibility
    let styleElement = document.getElementById('module-visibility-fixes');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'module-visibility-fixes';
        styleElement.textContent = `
            .module-container {
                display: block !important;
                margin-bottom: 40px !important;
            }
            
            .module-content {
                display: block !important;
            }
            
            .accordion-content.active {
                display: block !important;
                max-height: 2000px !important;
                padding: 25px !important;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * Navigate to the next lesson after completing the current one
 * @param {string} moduleId - Current module ID
 * @param {string} lessonId - Current lesson ID
 */
function navigateToNextLesson(moduleId, lessonId) {
    // Find current lesson header
    const currentHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
    if (!currentHeader) return;
    
    // Get all headers in this module
    const moduleElement = document.getElementById(`module${moduleId}`);
    if (!moduleElement) return;
    
    const headers = Array.from(moduleElement.querySelectorAll('.accordion-header'));
    const currentIndex = headers.indexOf(currentHeader);
    
    if (currentIndex >= 0 && currentIndex < headers.length - 1) {
        // There's another lesson in this module
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
    } else {
        // This is the last lesson in the module, try to go to the next module
        const nextModuleId = parseInt(moduleId) + 1;
        const nextModule = document.getElementById(`module${nextModuleId}`);
        
        if (nextModule) {
            // Close current module's last lesson
            currentHeader.classList.remove('active');
            const currentContent = currentHeader.nextElementSibling;
            if (currentContent) {
                currentContent.classList.remove('active');
            }
            
            // Navigate to the next module
            nextModule.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Open the first lesson of the next module
            const firstLessonHeader = nextModule.querySelector('.accordion-header');
            if (firstLessonHeader) {
                firstLessonHeader.classList.add('active');
                const firstLessonContent = firstLessonHeader.nextElementSibling;
                if (firstLessonContent) {
                    firstLessonContent.classList.add('active');
                }
            }
        } else {
            // No more modules - show completion message
            alert('Congratulations! You have completed all modules.');
            
            // Scroll to certification section if it exists
            const certificationSection = document.getElementById('certification');
            if (certificationSection) {
                certificationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

/**
 * Initialize module progression tracking
 */
function initializeModuleProgression() {
    // This function would be implemented to track progress
    // For now, it's a placeholder that just ensures modules are unlocked
    unlockAllModulesAndLessons();
    ensureModulesVisible();
}

/**
 * Add progress monitor to detect and fix issues with module progression
 */
function addProgressMonitor() {
    // Periodically check if all modules are visible
    setInterval(() => {
        const moduleContainers = document.querySelectorAll('.module-container');
        moduleContainers.forEach(moduleContainer => {
            // Make sure module container is visible
            if (moduleContainer.style.display === 'none' || 
                getComputedStyle(moduleContainer).display === 'none') {
                moduleContainer.style.display = 'block';
                console.log('Forced module visibility for', moduleContainer.id);
            }
            
            // Make sure module content is visible
            const moduleContent = moduleContainer.querySelector('.module-content');
            if (moduleContent && (moduleContent.style.display === 'none' || 
                getComputedStyle(moduleContent).display === 'none')) {
                moduleContent.style.display = 'block';
                console.log('Forced module content visibility for', moduleContainer.id);
            }
        });
    }, 2000); // Check every 2 seconds
}
