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
        this.init();
    }

    init() {
        // Only initialize if quiz elements exist
        if (this.quizElements.length > 0) {
            this.setupQuizzes();
            this.bindEvents();
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
        const questionId = questionContainer.getAttribute('data-question');
        
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
                    continueButton.addEventListener('click', () => this.navigateToNextLesson(moduleId, lessonId));
                    completionStatus.appendChild(continueButton);
                    
                    // Animate completion
                    completionStatus.classList.add('slide-in-animation');
                    
                    // Mark lesson as complete
                    this.markLessonComplete(moduleId, lessonId);
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
        // Get the current lesson header
        const currentHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (!currentHeader) return;
        
        // Get all headers in this module
        const module = document.getElementById(`module${moduleId}`);
        if (!module) return;
        
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
            
            // Open next lesson
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
                // Check if the next module is locked
                const moduleStatus = nextModule.querySelector('.module-status')?.textContent;
                if (moduleStatus === 'Locked') {
                    if (window.showNotification) {
                        window.showNotification('Next module is locked. Complete the current module first.', 'warning');
                    } else {
                        alert('Next module is locked. Complete the current module first.');
                    }
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
                
                // Open first lesson in next module, if available
                const firstHeader = nextModule.querySelector('.accordion-header');
                if (firstHeader) {
                    firstHeader.classList.add('active');
                    const firstContent = firstHeader.nextElementSibling;
                    if (firstContent) {
                        firstContent.classList.add('active');
                    }
                }
                
                // Notification
                if (window.showNotification) {
                    const moduleName = nextModule.querySelector('.module-header h3')?.textContent || `Module ${nextModuleId}`;
                    window.showNotification(`Moving to ${moduleName}`, 'info');
                }
            } else {
                // No more modules
                if (window.showNotification) {
                    window.showNotification('Congratulations! You have completed all the modules.', 'success');
                } else {
                    alert('Congratulations! You have completed all the modules.');
                }
                
                // Scroll to certification section, if available
                const certSection = document.getElementById('certification');
                if (certSection) {
                    certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }

    markLessonComplete(moduleId, lessonId) {
        // Call the global lesson completion function if available
        if (typeof window.markLessonComplete === 'function') {
            window.markLessonComplete(moduleId, lessonId);
            return;
        }
        
        // Fallback implementation if the global function isn't available
        console.log(`Lesson ${lessonId} in Module ${moduleId} completed`);
        
        // Update UI elements directly
        const lessonHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (lessonHeader) {
            const statusElement = lessonHeader.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Completed';
                statusElement.className = 'status completed';
            }
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
                
                lessonHeaders.forEach(header => {
                    const lId = header.getAttribute('data-lesson');
                    if (lId && !progress.modules[moduleId].lessons[lId]) {
                        allCompleted = false;
                    }
                });
                
                if (allCompleted && lessonHeaders.length > 0) {
                    progress.modules[moduleId].completed = true;
                    
                    // Update module status in UI
                    const moduleStatus = moduleElement.querySelector('.module-status');
                    if (moduleStatus) {
                        moduleStatus.textContent = 'Completed';
                        moduleStatus.className = 'module-status completed';
                    }
                    
                    // Unlock next module
                    this.unlockNextModule(parseInt(moduleId));
                }
            }
            
            // Save progress
            localStorage.setItem('plainidCourseProgress', JSON.stringify(progress));
        } catch (e) {
            console.error('Error saving lesson completion:', e);
        }
    }
    
    unlockNextModule(completedModuleId) {
        const nextModuleId = completedModuleId + 1;
        const nextModuleElement = document.getElementById(`module${nextModuleId}`);
        
        if (nextModuleElement) {
            const moduleStatus = nextModuleElement.querySelector('.module-status');
            if (moduleStatus && moduleStatus.textContent === 'Locked') {
                moduleStatus.textContent = 'Not Started';
                moduleStatus.className = 'module-status';
                
                // Unlock first lesson
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
                    window.showNotification(`New module available: ${moduleTitle}`, 'info');
                }
            }
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
