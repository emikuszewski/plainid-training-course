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
        this.setupQuizzes();
        this.bindEvents();
    }

    setupQuizzes() {
        this.quizElements.forEach(quizContainer => {
            // Find all questions in this quiz
            const questions = quizContainer.querySelectorAll('.quiz-question');
            const moduleId = questions.length > 0 ? questions[0].getAttribute('data-module') : null;
            const lessonId = questions.length > 0 ? questions[0].getAttribute('data-lesson') : null;
            
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
            
            // Add progress indicator to the quiz
            const progressContainer = document.createElement('div');
            progressContainer.className = 'quiz-progress';
            progressContainer.innerHTML = `
                <div class="quiz-progress-text">Question <span class="current-question">1</span>/<span class="total-questions">${questions.length}</span></div>
                <div class="quiz-progress-bar">
                    <div class="quiz-progress-fill" style="width: ${(1 / questions.length) * 100}%"></div>
                </div>
            `;
            
            // Insert progress at the beginning of the quiz
            if (questions.length > 1) {
                quizContainer.insertBefore(progressContainer, quizContainer.firstChild);
                
                // Hide all questions except the first one
                questions.forEach((question, index) => {
                    if (index > 0) {
                        question.style.display = 'none';
                    }
                });
            }
            
            // Add quiz completion status
            const completionStatus = document.createElement('div');
            completionStatus.className = 'quiz-completion-status';
            completionStatus.style.display = 'none';
            quizContainer.appendChild(completionStatus);
        });
    }

    bindEvents() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        
        quizOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleOptionClick(e));
        });
    }

    handleOptionClick(event) {
        const option = event.currentTarget;
        const questionContainer = option.closest('.quiz-question');
        const quizContainer = option.closest('.quiz-container');
        
        if (questionContainer.classList.contains('answered')) return;
        
        const moduleId = questionContainer.getAttribute('data-module');
        const lessonId = questionContainer.getAttribute('data-lesson');
        const questionId = questionContainer.getAttribute('data-question');
        
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
            feedback.textContent = 'Correct! Well done.';
            feedback.className = 'quiz-feedback correct';
            questionContainer.classList.add('answered');
            
            // Update result tracking
            this.results[moduleId][lessonId].correct++;
            
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
                const nextButton = document.createElement('button');
                nextButton.className = 'btn quiz-next-btn';
                nextButton.textContent = 'Next Question';
                
                // Add event listener to next button
                nextButton.addEventListener('click', () => {
                    // Hide current question
                    questionContainer.style.display = 'none';
                    
                    // Show next question
                    nextQuestion.style.display = 'block';
                    
                    // Update progress indicator
                    const progressText = quizContainer.querySelector('.current-question');
                    if (progressText) {
                        progressText.textContent = currentIndex + 2; // +2 because 0-indexed + 1 for next
                    }
                    
                    // Update progress bar
                    const progressFill = quizContainer.querySelector('.quiz-progress-fill');
                    if (progressFill) {
                        const totalQuestions = questions.length;
                        progressFill.style.width = `${((currentIndex + 2) / totalQuestions) * 100}%`;
                    }
                });
                
                if (feedback.nextElementSibling && feedback.nextElementSibling.classList.contains('quiz-next-btn')) {
                    feedback.nextElementSibling.remove();
                }
                
                feedback.parentNode.insertBefore(nextButton, feedback.nextElementSibling);
            } else {
                // This was the last question - quiz is complete
                this.results[moduleId][lessonId].completed = true;
                
                // Show completion message
                const completionStatus = quizContainer.querySelector('.quiz-completion-status');
                if (completionStatus) {
                    const correctCount = this.results[moduleId][lessonId].correct;
                    const totalCount = this.results[moduleId][lessonId].total;
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
                    
                    // Animate completion
                    completionStatus.classList.add('slide-in-animation');
                    
                    // Mark lesson as complete
                    this.markLessonComplete(moduleId, lessonId);
                }
            }
        } else {
            // Wrong answer
            option.classList.add('incorrect');
            feedback.textContent = 'Incorrect. Please try again.';
            feedback.className = 'quiz-feedback incorrect';
            
            // Increment attempts
            this.results[moduleId][lessonId].attempts++;
            
            // Show the incorrect answer highlight with animation
            option.classList.add('shake-animation');
            setTimeout(() => {
                option.classList.remove('shake-animation');
            }, 500);
            
            // Play error sound
            this.playSound('error');
            
            // Show the correct answer after 2 wrong attempts
            if (this.results[moduleId][lessonId].attempts >= 2) {
                // Highlight the correct answer
                options.forEach(opt => {
                    if (opt.getAttribute('data-correct') === 'true') {
                        opt.classList.add('hint-animation');
                        setTimeout(() => {
                            opt.classList.remove('hint-animation');
                        }, 1000);
                    }
                });
                
                feedback.textContent = 'Hint: Look for the highlighted option.';
            }
        }
    }

    markLessonComplete(moduleId, lessonId) {
        // This is a simplified version - in the full implementation
        // this would call the progress tracking system
        if (window.markLessonComplete) {
            window.markLessonComplete(moduleId, lessonId);
        } else {
            console.log(`Lesson ${lessonId} in Module ${moduleId} completed`);
            
            // Update UI elements directly
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
            
            sound.volume = 0.2;
            sound.play().catch(e => {
                // Silent error - browser might block autoplay
                console.log('Audio playback was prevented by the browser');
            });
        } catch (e) {
            console.log('Error playing sound', e);
        }
    }
}

// Initialize the Quiz Manager when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quizManager = new QuizManager();
});
