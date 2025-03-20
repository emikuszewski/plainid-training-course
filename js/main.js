document.addEventListener('DOMContentLoaded', function() {
    // The main initialization is now handled by PlainIDCourse.init()
    // This file just provides a fallback in case integration.js fails
    
    // Check if PlainIDCourse has been initialized
    if (!window.PlainIDCourse || !window.PlainIDCourse.state || !window.PlainIDCourse.state.initialized) {
        console.log('PlainIDCourse not initialized, falling back to basic initialization');
        initializeComponents();
    }
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
            } else {
                this.classList.add('incorrect');
                feedback.textContent = 'Incorrect. Please try again.';
                feedback.className = 'quiz-feedback incorrect';
            }
        });
    });
}
