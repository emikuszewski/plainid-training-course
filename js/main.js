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
            // Check if the lesson is locked
            const status = this.querySelector('.status')?.textContent;
            if (status === 'Locked') {
                alert('Please complete the previous lessons first.');
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
                
                // Unlock next module
                unlockNextModule(parseInt(moduleId));
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
 * Unlock the next module after completing a module
 * @param {number} completedModuleId - The ID of the completed module
 */
function unlockNextModule(completedModuleId) {
    const nextModuleId = completedModuleId + 1;
    const nextModule = document.getElementById(`module${nextModuleId}`);
    
    if (nextModule) {
        const moduleStatus = nextModule.querySelector('.module-status');
        if (moduleStatus && moduleStatus.textContent === 'Locked') {
            // Change status to Not Started
            moduleStatus.textContent = 'Not Started';
            moduleStatus.className = 'module-status';
            
            // Unlock first lesson
            const firstLesson = nextModule.querySelector('.accordion-header');
            if (firstLesson) {
                const statusElement = firstLesson.querySelector('.status');
                if (statusElement) {
                    statusElement.textContent = 'Start';
                    statusElement.className = 'status';
                }
            }
            
            // Show alert
            alert(`New module unlocked: ${nextModule.querySelector('.module-header h3')?.textContent || `Module ${nextModuleId}`}`);
        }
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
        
        // Check if it's locked
        const status = nextHeader.querySelector('.status')?.textContent;
        if (status === 'Locked') {
            alert('Next lesson is locked. Complete lessons in order.');
            return;
        }
        
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
        // Last lesson in module, try to go to next module
        const nextModuleId = parseInt(moduleId) + 1;
        const nextModule = document.getElementById(`module${nextModuleId}`);
        
        if (nextModule) {
            // Check if next module is locked
            const moduleStatus = nextModule.querySelector('.module-status')?.textContent;
            if (moduleStatus === 'Locked') {
                alert('The next module is still locked. Complete all lessons in this module first.');
                return;
            }
            
            // Close current lesson
            currentHeader.classList.remove('active');
            const currentContent = currentHeader.nextElementSibling;
            if (currentContent) {
                currentContent.classList.remove('active');
            }
            
            // Scroll to next module
            nextModule.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Open first lesson if available
            const firstHeader = nextModule.querySelector('.accordion-header');
            if (firstHeader) {
                firstHeader.classList.add('active');
                const firstContent = firstHeader.nextElementSibling;
                if (firstContent) {
                    firstContent.classList.add('active');
                }
            }
        } else {
            // No more modules
            alert('Congratulations! You have completed all available modules.');
            
            // Scroll to certification section
            const certSection = document.getElementById('certification');
            if (certSection) {
                certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

/**
 * Initialize module progression based on saved progress
 */
function initializeModuleProgression() {
    try {
        // Load progress data
        const storedProgress = localStorage.getItem('plainidCourseProgress');
        if (!storedProgress) return;
        
        const progress = JSON.parse(storedProgress);
        if (!progress.modules) return;
        
        // Update UI based on progress
        for (const moduleId in progress.modules) {
            const moduleData = progress.modules[moduleId];
            const moduleElement = document.getElementById(`module${moduleId}`);
            
            if (!moduleElement) continue;
            
            // Update module status
            const moduleStatus = moduleElement.querySelector('.module-status');
            if (moduleStatus) {
                if (moduleData.completed) {
                    moduleStatus.textContent = 'Completed';
                    moduleStatus.className = 'module-status completed';
                } else if (Object.keys(moduleData.lessons || {}).length > 0) {
                    moduleStatus.textContent = 'In Progress';
                    moduleStatus.className = 'module-status ready';
                }
            }
            
            // Update lesson statuses
            for (const lessonId in moduleData.lessons) {
                if (moduleData.lessons[lessonId]) {
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
        
        // Unlock modules based on progress
        let lastCompletedModule = 0;
        for (let i = 1; i <= 6; i++) {
            if (progress.modules[i]?.completed) {
                lastCompletedModule = i;
            }
        }
        
        // Unlock the module after the last completed one
        if (lastCompletedModule > 0) {
            const nextModuleId = lastCompletedModule + 1;
            const nextModule = document.getElementById(`module${nextModuleId}`);
            
            if (nextModule) {
                const moduleStatus = nextModule.querySelector('.module-status');
                if (moduleStatus && moduleStatus.textContent === 'Locked') {
                    moduleStatus.textContent = 'Not Started';
                    moduleStatus.className = 'module-status';
                    
                    // Unlock first lesson
                    const firstHeader = nextModule.querySelector('.accordion-header');
                    if (firstHeader) {
                        const statusElement = firstHeader.querySelector('.status');
                        if (statusElement) {
                            statusElement.textContent = 'Start';
                            statusElement.className = 'status';
                        }
                    }
                }
            }
        }
        
        // Make sure Module 1 is always unlocked
        const module1 = document.getElementById('module1');
        if (module1) {
            const moduleStatus = module1.querySelector('.module-status');
            if (moduleStatus && moduleStatus.textContent === 'Locked') {
                moduleStatus.textContent = 'Not Started';
                moduleStatus.className = 'module-status';
                
                // Unlock first lesson
                const firstHeader = module1.querySelector('.accordion-header');
                if (firstHeader) {
                    const statusElement = firstHeader.querySelector('.status');
                    if (statusElement) {
                        statusElement.textContent = 'Start';
                        statusElement.className = 'status';
                    }
                }
            }
        }
        
    } catch (e) {
        console.error('Error initializing module progression:', e);
    }
}

/**
 * Add progress monitor to detect and fix module progression issues
 */
function addProgressMonitor() {
    // Check progress every 5 seconds
    setInterval(() => {
        try {
            // Load progress data
            const storedProgress = localStorage.getItem('plainidCourseProgress');
            if (!storedProgress) return;
            
            const progress = JSON.parse(storedProgress);
            if (!progress.modules) return;
            
            // Find modules that should be unlocked but aren't
            let lastCompletedModule = 0;
            for (let i = 1; i <= 6; i++) {
                if (progress.modules[i]?.completed) {
                    lastCompletedModule = i;
                }
            }
            
            if (lastCompletedModule > 0) {
                const nextModuleId = lastCompletedModule + 1;
                const nextModule = document.getElementById(`module${nextModuleId}`);
                
                if (nextModule) {
                    const moduleStatus = nextModule.querySelector('.module-status');
                    if (moduleStatus && moduleStatus.textContent === 'Locked') {
                        console.log(`[Progress Monitor] Fixing locked module ${nextModuleId} that should be unlocked`);
                        
                        // Fix module status
                        moduleStatus.textContent = 'Not Started';
                        moduleStatus.className = 'module-status';
                        
                        // Fix first lesson
                        const firstHeader = nextModule.querySelector('.accordion-header');
                        if (firstHeader) {
                            const statusElement = firstHeader.querySelector('.status');
                            if (statusElement) {
                                statusElement.textContent = 'Start';
                                statusElement.className = 'status';
                            }
                        }
                    }
                }
            }
            
            // Always make sure module 1 is unlocked
            const module1 = document.getElementById('module1');
            if (module1) {
                const moduleStatus = module1.querySelector('.module-status');
                if (moduleStatus && moduleStatus.textContent === 'Locked') {
                    console.log('[Progress Monitor] Fixing locked Module 1');
                    
                    moduleStatus.textContent = 'Not Started';
                    moduleStatus.className = 'module-status';
                    
                    // Unlock first lesson
                    const firstHeader = module1.querySelector('.accordion-header');
                    if (firstHeader) {
                        const statusElement = firstHeader.querySelector('.status');
                        if (statusElement) {
                            statusElement.textContent = 'Start';
                            statusElement.className = 'status';
                        }
                    }
                }
            }
            
        } catch (e) {
            console.error('Error in progress monitor:', e);
        }
    }, 5000);
}
