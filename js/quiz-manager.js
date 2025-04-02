/**
 * Enhanced Quiz System for PlainID Training Course
 * 
 * This module provides advanced quiz functionality with:
 * - Real-time feedback
 * - Animation effects
 * - Progress tracking
 * - Retry capabilities
 * - Analytics
 */

class QuizManager {
    constructor() {
        this.quizElements = document.querySelectorAll('.quiz-container');
        this.results = {};
        this.initialized = false;
        this.init();
    }

    init() {
        // Prevent duplicate initialization
        if (this.initialized) {
            console.log('QuizManager already initialized');
            return;
        }
        
        // Only initialize if quiz elements exist
        if (this.quizElements.length > 0) {
            console.log(`Initializing QuizManager with ${this.quizElements.length} quizzes found`);
            this.setupQuizzes();
            this.bindEvents();
            this.initialized = true;
        } else {
            console.log('No quiz elements found to initialize');
        }
    }

    setupQuizzes() {
        this.quizElements.forEach(quizContainer => {
            // Find all questions in this quiz
            const questions = quizContainer.querySelectorAll('.quiz-question');
            
            if (questions.length === 0) return;
            
            const moduleId = questions[0].getAttribute('data-module');
            const lessonId = questions[0].getAttribute('data-lesson');
            
            if (!moduleId || !lessonId) return;
            
            // Initialize result tracking for this quiz
            if (!this.results[moduleId]) {
                this.results[moduleId] = {};
            }
            
            if (!this.results[moduleId][lessonId]) {
                this.results[moduleId][lessonId] = {
                    total: questions.length,
                    correct: 0,
                    attempts: 0,
                    completed: false
                };
            }
            
            // Add progress indicator to the quiz if there's more than one question
            if (questions.length > 1) {
                let progressContainer = quizContainer.querySelector('.quiz-progress');
                
                // Create progress indicator if it doesn't exist
                if (!progressContainer) {
                    progressContainer = document.createElement('div');
                    progressContainer.className = 'quiz-progress';
                    progressContainer.innerHTML = `
                        <div class="quiz-progress-text">Question <span class="current-question">1</span>/<span class="total-questions">${questions.length}</span></div>
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width: ${(1 / questions.length) * 100}%"></div>
                        </div>
                    `;
                    
                    // Insert progress at the beginning of the quiz
                    quizContainer.insertBefore(progressContainer, quizContainer.firstChild);
                }
                
                // Hide all questions except the first one
                questions.forEach((question, index) => {
                    if (index > 0) {
                        question.style.display = 'none';
                    }
                });
            }
            
            // Add quiz completion status container if it doesn't exist
            let completionStatus = quizContainer.querySelector('.quiz-completion-status');
            if (!completionStatus) {
                completionStatus = document.createElement('div');
                completionStatus.className = 'quiz-completion-status';
                completionStatus.style.display = 'none';
                quizContainer.appendChild(completionStatus);
            }
        });
    }

    bindEvents() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        
        quizOptions.forEach(option => {
            // Skip if already has event listener
            if (option.getAttribute('data-has-listener') === 'true') return;
            
            // Mark as having listener
            option.setAttribute('data-has-listener', 'true');
            
            option.addEventListener('click', (e) => this.handleOptionClick(e));
        });
    }

    handleOptionClick(event) {
        const option = event.currentTarget;
        const questionContainer = option.closest('.quiz-question');
        const quizContainer = option.closest('.quiz-container');
        
        // Skip if question already answered
        if (!questionContainer || questionContainer.classList.contains('answered')) return;
        
        const moduleId = questionContainer.getAttribute('data-module');
        const lessonId = questionContainer.getAttribute('data-lesson');
        
        // Only proceed if we have valid module and lesson IDs
        if (!moduleId || !lessonId) return;
        
        const options = questionContainer.querySelectorAll('.quiz-option');
        const feedback = questionContainer.querySelector('.quiz-feedback');
        
        // Remove previous selections
        options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Mark this option as selected
        option.classList.add('selected');
        
        // Check if answer is correct
        const isCorrect = option.getAttribute('data-correct') === 'true';
        
        if (isCorrect) {
            option.classList.add('correct');
            if (feedback) {
                feedback.textContent = 'Correct! Well done.';
                feedback.className = 'quiz-feedback correct';
            }
            questionContainer.classList.add('answered');
            
            // Update result tracking
            if (this.results[moduleId] && this.results[moduleId][lessonId]) {
                this.results[moduleId][lessonId].correct++;
            }
            
            // Show the correct answer highlight with animation
            option.classList.add('success-animation');
            
            // Play success sound
            this.playSound('success');
            
            // Check if this was the last question
            const questions = quizContainer.querySelectorAll('.quiz-question');
            const currentIndex = Array.from(questions).findIndex(q => q === questionContainer);
            const nextQuestion = questions[currentIndex + 1];
            
            if (nextQuestion) {
                // Add next button if not the last question
                let nextButton = questionContainer.querySelector('.quiz-next-btn');
                if (!nextButton) {
                    nextButton = document.createElement('button');
                    nextButton.className = 'btn quiz-next-btn';
                    nextButton.textContent = 'Next Question';
                    
                    // Add button to question container
                    questionContainer.appendChild(nextButton);
                }
                
                // Add/update event listener for the next button
                nextButton.onclick = () => {
                    // Remove previous click handler to prevent duplicate bindings
                    nextButton.onclick = null;
                    
                    // Hide current question
                    questionContainer.style.display = 'none';
                    
                    // Show next question
                    nextQuestion.style.display = 'block';
                    
                    // Update progress indicator
                    const progressText = quizContainer.querySelector('.current-question');
                    if (progressText) {
                        progressText.textContent = (currentIndex + 2).toString(); // +2 because 0-indexed + 1 for next
                    }
                    
                    // Update progress bar
                    const progressFill = quizContainer.querySelector('.quiz-progress-fill');
                    if (progressFill) {
                        const totalQuestions = questions.length;
                        progressFill.style.width = `${((currentIndex + 2) / totalQuestions) * 100}%`;
                    }
                };
            } else {
                // This was the last question - quiz is complete
                if (this.results[moduleId] && this.results[moduleId][lessonId]) {
                    this.results[moduleId][lessonId].completed = true;
                }
                
                // Get correct lesson ID from the parent quiz question
                const correctLessonId = questionContainer.getAttribute('data-lesson');
                
                // Show completion message
                const completionStatus = quizContainer.querySelector('.quiz-completion-status');
                if (completionStatus) {
                    const correctCount = this.results[moduleId]?.[lessonId]?.correct || 0;
                    const totalCount = questions.length;
                    const percentage = Math.round((correctCount / totalCount) * 100);
                    
                    completionStatus.innerHTML = `
                        <div class="quiz-result">
                            <h4>Quiz Completed!</h4>
                            <div class="quiz-score">Your Score: ${correctCount}/${totalCount} (${percentage}%)</div>
                            <div class="quiz-certificate">
                                <svg viewBox="0 0 24 24" width="48" height="48">
                                    <path fill="#28a745" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,8H13V14H11V8M11,16H13V18H11V16Z"></path>
                                </svg>
                                <span>Lesson Complete</span>
                            </div>
                        </div>
                    `;
                    completionStatus.style.display = 'block';
                    
                    // Add continue button
                    const continueButton = document.createElement('button');
                    continueButton.className = 'btn continue-button';
                    continueButton.textContent = 'Continue to Next Lesson';
                    continueButton.addEventListener('click', () => this.navigateToNextLesson(moduleId, correctLessonId));
                    completionStatus.appendChild(continueButton);
                    
                    // Animate completion
                    completionStatus.classList.add('slide-in-animation');
                    
                    // Mark lesson as complete - make sure we use the correct lessonId from the question
                    this.markLessonComplete(moduleId, correctLessonId);
                }
            }
        } else {
            // Wrong answer
            option.classList.add('incorrect');
            if (feedback) {
                feedback.textContent = 'Incorrect. Please try again.';
                feedback.className = 'quiz-feedback incorrect';
            }
            
            // Increment attempts
            if (this.results[moduleId] && this.results[moduleId][lessonId]) {
                this.results[moduleId][lessonId].attempts++;
            }
            
            // Show the incorrect answer highlight with animation
            option.classList.add('shake-animation');
            setTimeout(() => {
                option.classList.remove('shake-animation');
            }, 500);
            
            // Play error sound
            this.playSound('error');
            
            // Show hint after multiple wrong attempts
            if (this.results[moduleId]?.[lessonId]?.attempts >= 2) {
                // Highlight the correct answer
                options.forEach(opt => {
                    if (opt.getAttribute('data-correct') === 'true') {
                        opt.classList.add('hint-animation');
                        setTimeout(() => {
                            opt.classList.remove('hint-animation');
                        }, 1000);
                    }
                });
                
                if (feedback) {
                    feedback.textContent = 'Hint: Look for the highlighted option.';
                }
            }
        }
    }

    navigateToNextLesson(moduleId, lessonId) {
        console.log(`Navigating to next lesson after completing module ${moduleId}, lesson ${lessonId}`);
        
        // First ensure all modules are visible
        this.ensureModulesVisible();
        
        // Try to use ModuleNavigator first
        if (window.moduleNavigator && typeof window.moduleNavigator.navigateToLesson === 'function') {
            // Find the next lesson in the same module
            const moduleElement = document.getElementById(`module${moduleId}`);
            if (moduleElement) {
                const headers = Array.from(moduleElement.querySelectorAll('.accordion-header'));
                const currentHeader = moduleElement.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                
                if (currentHeader) {
                    const currentIndex = headers.indexOf(currentHeader);
                    
                    if (currentIndex >= 0 && currentIndex < headers.length - 1) {
                        // Navigate to the next lesson in the same module
                        const nextHeader = headers[currentIndex + 1];
                        const nextLessonId = nextHeader.getAttribute('data-lesson');
                        window.moduleNavigator.navigateToLesson(moduleId, nextLessonId);
                        return;
                    }
                }
                
                // If we're at the last lesson, go to the next module
                const nextModuleId = parseInt(moduleId) + 1;
                const nextModule = document.getElementById(`module${nextModuleId}`);
                if (nextModule) {
                    const firstLessonHeader = nextModule.querySelector('.accordion-header');
                    const firstLessonId = firstLessonHeader?.getAttribute('data-lesson');
                    if (firstLessonId) {
                        window.moduleNavigator.navigateToLesson(nextModuleId, firstLessonId);
                        return;
                    }
                } else {
                    // No more modules - go to certification
                    const certSection = document.getElementById('certification');
                    if (certSection) {
                        certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    // Show completion notification
                    this.showNotification('Congratulations! You have completed all modules.', 'success');
                    return;
                }
            }
        }
        
        // Use the centralized function if available
        if (window.PlainIDCourse && typeof window.PlainIDCourse.navigateToModule === 'function') {
            // First try to find the next lesson in the same module
            const moduleElement = document.getElementById(`module${moduleId}`);
            if (moduleElement) {
                const headers = Array.from(moduleElement.querySelectorAll('.accordion-header'));
                const currentHeader = moduleElement.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                
                if (currentHeader) {
                    const currentIndex = headers.indexOf(currentHeader);
                    
                    if (currentIndex >= 0 && currentIndex < headers.length - 1) {
                        // Navigate to the next lesson in the same module
                        const nextHeader = headers[currentIndex + 1];
                        const nextLessonId = nextHeader.getAttribute('data-lesson');
                        
                        // Close current accordion
                        currentHeader.classList.remove('active');
                        if (currentHeader.nextElementSibling) {
                            currentHeader.nextElementSibling.classList.remove('active');
                        }
                        
                        // Open next accordion
                        nextHeader.classList.add('active');
                        if (nextHeader.nextElementSibling) {
                            nextHeader.nextElementSibling.classList.add('active');
                        }
                        
                        // Scroll to new position
                        nextHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                    }
                }
                
                // If we're at the last lesson, go to the next module
                const nextModuleId = parseInt(moduleId) + 1;
                window.PlainIDCourse.navigateToModule(nextModuleId);
                return;
            }
        }
        
        // Fallback implementation
        const currentHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (!currentHeader) {
            console.warn(`Could not find header for module ${moduleId}, lesson ${lessonId}`);
            return;
        }
        
        // Get all headers in this module
        const module = document.getElementById(`module${moduleId}`);
        if (!module) {
            console.warn(`Could not find module element for module ${moduleId}`);
            return;
        }
        
        const headers = Array.from(module.querySelectorAll('.accordion-header'));
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
            
            // Open next lesson (all lessons are accessible)
            nextHeader.classList.add('active');
            const nextContent = nextHeader.nextElementSibling;
            if (nextContent) {
                nextContent.classList.add('active');
            }
            
            // Scroll to next lesson
            nextHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // This was the last lesson in the module
            // Try to navigate to next module
            const nextModuleId = parseInt(moduleId) + 1;
            const nextModule = document.getElementById(`module${nextModuleId}`);
            
            if (nextModule) {
                console.log(`Moving to next module ${nextModuleId}`);
                
                // Close current lesson
                currentHeader.classList.remove('active');
                const currentContent = currentHeader.nextElementSibling;
                if (currentContent) {
                    currentContent.classList.remove('active');
                }
                
                // Scroll to next module
                nextModule.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Open first lesson in next module
                const firstHeader = nextModule.querySelector('.accordion-header');
                if (firstHeader) {
                    // Open the lesson
                    firstHeader.classList.add('active');
                    const firstContent = firstHeader.nextElementSibling;
                    if (firstContent) {
                        firstContent.classList.add('active');
                    }
                }
                
                // Notification
                this.showNotification(`Moving to next module: ${this.getModuleTitle(nextModuleId)}`, 'info');
            } else {
                // No more modules
                console.log("No more modules available - course complete!");
                
                this.showNotification('Congratulations! You have completed all the modules.', 'success');
                
                // Scroll to certification section, if available
                const certSection = document.getElementById('certification');
                if (certSection) {
                    certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }

    markLessonComplete(moduleId, lessonId) {
        console.log(`Quiz marking lesson ${lessonId} in module ${moduleId} as complete`);
        
        // Call the global lesson completion function if available
        if (typeof window.markLessonComplete === 'function') {
            window.markLessonComplete(moduleId, lessonId);
            return;
        }
        
        // Use PlainIDCourse if available
        if (window.PlainIDCourse && typeof window.PlainIDCourse.markLessonComplete === 'function') {
            window.PlainIDCourse.markLessonComplete(moduleId, lessonId);
            return;
        }
        
        // Fallback implementation if the global function isn't available
        console.log(`Fallback: Marking lesson ${lessonId} in module ${moduleId} as complete`);
        
        // Update UI elements directly
        const lessonHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (lessonHeader) {
            const statusElement = lessonHeader.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Completed';
                statusElement.className = 'status completed';
            } else {
                console.warn(`Status element not found for module ${moduleId}, lesson ${lessonId}`);
            }
        } else {
            console.warn(`Lesson header not found for module ${moduleId}, lesson ${lessonId}`);
        }
        
        // Try to save progress to localStorage as fallback
        try {
            // Check if progress data exists
            let progress = {};
            const storedProgress = localStorage.getItem('plainidCourseProgress');
            if (storedProgress) {
                progress = JSON.parse(storedProgress);
            }
            
            // Ensure the necessary structure exists
            if (!progress.modules) {
                progress.modules = {};
            }
            
            if (!progress.modules[moduleId]) {
                progress.modules[moduleId] = {
                    completed: false,
                    lessons: {}
                };
            }
            
            // Mark lesson as complete
            progress.modules[moduleId].lessons[lessonId] = true;
            
            // Check if all lessons in the module are complete
            const moduleElement = document.getElementById(`module${moduleId}`);
            if (moduleElement) {
                const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
                let allCompleted = true;
                let totalLessons = 0;
                
                lessonHeaders.forEach(header => {
                    const lId = header.getAttribute('data-lesson');
                    if (lId) {
                        totalLessons++;
                        if (!progress.modules[moduleId].lessons[lId]) {
                            allCompleted = false;
                        }
                    }
                });
                
                console.log(`Module ${moduleId} completion check: ${Object.keys(progress.modules[moduleId].lessons).length}/${totalLessons} lessons completed`);
                
                if (allCompleted && totalLessons > 0) {
                    console.log(`All lessons in module ${moduleId} are complete - marking module as complete`);
                    
                    progress.modules[moduleId].completed = true;
                    
                    // Update module status in UI
                    const moduleStatus = moduleElement.querySelector('.module-status');
                    if (moduleStatus) {
                        moduleStatus.textContent = 'Completed';
                        moduleStatus.className = 'module-status completed';
                    }
                    
                    // Dispatch module completion event
                    document.dispatchEvent(new CustomEvent('module-completed', {
                        detail: { moduleId }
                    }));
                }
            }
            
            // Save progress
            localStorage.setItem('plainidCourseProgress', JSON.stringify(progress));
            
            // Dispatch lesson completion event
            document.dispatchEvent(new CustomEvent('lesson-completed', {
                detail: { moduleId, lessonId }
            }));
        } catch (e) {
            console.error('Error saving lesson completion:', e);
        }
    }

    playSound(type) {
        // Check if audio is supported
        if (typeof Audio === 'undefined') return;
        
        try {
            let sound;
            if (type === 'success') {
                sound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAYIAICAgICAgICAgICAgICAgICAgQEBAQEBAQEBAQEBAQEBAQGBgYGBgYGBgYGBgYGBgYGBg/////////////////////////////////////////////////8AAAA5MYXZjNTguMTM0LjEwMAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
            } else {
                sound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAabIyMjIyMjIyMjIyMjIyMjIyMjI5ubm5ubm5ubm5ubm5ubm5ubm////////////////////////////////////////8AAAA5MYXZjNTguMTM0LjEwMAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
            }
            
            // Set lower volume
            sound.volume = 0.2;
            
            // Play with error handling (browsers may block autoplay)
            sound.play().catch(e => {
                console.log('Audio playback was prevented by the browser');
            });
        } catch (e) {
            console.log('Error playing sound', e);
        }
    }
    
    getModuleTitle(moduleId) {
        // Try to get from DOM
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (moduleElement) {
            const headerText = moduleElement.querySelector('.module-header h3')?.textContent;
            if (headerText) {
                return headerText;
            }
        }
        
        // Fallback to predefined titles
        const moduleTitles = {
            1: 'Core Concepts of Authorization',
            2: 'PlainID Architecture & Components',
            3: 'Policy Modeling & Design',
            4: 'Implementation & Integration',
            5: 'Advanced Features',
            6: 'Best Practices & Case Studies'
        };
        
        return moduleTitles[moduleId] || `Module ${moduleId}`;
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        // Use global notification function if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type, duration);
            return;
        }
        
        // Fallback implementation
        // Remove existing notification
        const existingNotification = document.querySelector('.quiz-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `quiz-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('visible');
        }, 10);
        
        // Add close button handler
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('visible');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Auto hide after duration
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
        
        // Add styles if they don't exist already
        this.addNotificationStyles();
    }
    
    addNotificationStyles() {
        // Skip if styles already exist
        if (document.getElementById('quiz-notification-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'quiz-notification-styles';
        style.textContent = `
            .quiz-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                max-width: 350px;
                transform: translateX(120%);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                z-index: 9999;
            }
            
            .quiz-notification.visible {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-content {
                flex: 1;
                margin-right: 10px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #333;
            }
            
            .quiz-notification.success {
                background-color: #d4edda;
                border-left: 4px solid #28a745;
            }
            
            .quiz-notification.error {
                background-color: #f8d7da;
                border-left: 4px solid #dc3545;
            }
            
            .quiz-notification.warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
            }
            
            .quiz-notification.info {
                background-color: #d1ecf1;
                border-left: 4px solid #17a2b8;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    ensureModulesVisible() {
        console.log('Ensuring all modules are visible from QuizManager');
        
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
        if (!document.getElementById('module-visibility-fixes')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'module-visibility-fixes';
            styleElement.textContent = `
                .module-container {
                    display: block !important;
                    visibility: visible !important;
                    margin-bottom: 40px !important;
                }
                
                .module-content {
                    display: block !important;
                    visibility: visible !important;
                }
                
                .accordion-content.active {
                    display: block !important;
                    max-height: 2000px !important;
                    padding: 25px !important;
                    visibility: visible !important;
                }
            `;
            document.head.appendChild(styleElement);
        }
    }
}

// Initialize the Quiz Manager when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure other components have initialized
    setTimeout(() => {
        if (!window.quizManager) {
            window.quizManager = new QuizManager();
        }
    }, 300);
});
