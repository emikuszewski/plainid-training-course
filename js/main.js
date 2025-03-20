document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Check if the lesson is locked
            if (this.querySelector('.status').textContent === 'Locked') {
                alert('Please complete the previous lessons first.');
                return;
            }
            
            const content = this.nextElementSibling;
            this.classList.toggle('active');
            
            if (content.classList.contains('active')) {
                content.classList.remove('active');
            } else {
                document.querySelectorAll('.accordion-content').forEach(item => {
                    item.classList.remove('active');
                });
                content.classList.add('active');
            }
        });
    });
    
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Deactivate all tabs
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Activate selected tab and content
            this.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Quiz functionality
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const questionContainer = this.closest('.quiz-question');
            const options = questionContainer.querySelectorAll('.quiz-option');
            const feedback = questionContainer.querySelector('.quiz-feedback');
            
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
                
                // Mark lesson as complete
                const moduleId = questionContainer.getAttribute('data-module');
                const lessonId = questionContainer.getAttribute('data-lesson');
                markLessonComplete(moduleId, lessonId);
            } else {
                this.classList.add('incorrect');
                feedback.textContent = 'Incorrect. Please try again.';
                feedback.className = 'quiz-feedback incorrect';
            }
        });
    });
    
    // Module and lesson progression
    let userProgress = {
        modules: {
            1: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false } },
            2: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false } },
            3: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false } },
            4: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false } },
            5: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false, 5: false } },
            6: { completed: false, lessons: { 1: false, 2: false, 3: false, 4: false } }
        },
        overallProgress: 0
    };
    
    // Initialize the first module and lesson
    document.querySelector('[data-module="1"][data-lesson="1"]').querySelector('.status').textContent = 'Start';
    
    // Function to mark a lesson as complete
    function markLessonComplete(moduleId, lessonId) {
        userProgress.modules[moduleId].lessons[lessonId] = true;
        
        // Calculate module progress
        const module = userProgress.modules[moduleId];
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
        progressBar.style.width = `${moduleProgress}%`;
        
        // Update module progress text
        const progressText = progressBar.closest('.progress-container').querySelector('.progress-text');
        progressText.innerHTML = `<span>${moduleProgress}% Complete</span><span>${completedLessons}/${totalLessons} Lessons</span>`;
        
        // Unlock next lesson
        const nextLessonId = parseInt(lessonId) + 1;
        const nextLessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${nextLessonId}"]`);
        
        if (nextLessonHeader) {
            nextLessonHeader.querySelector('.status').textContent = 'Start';
        } else {
            // If no more lessons, mark module as complete
            module.completed = true;
            
            // Unlock next module
            const nextModuleId = parseInt(moduleId) + 1;
            const nextModuleHeader = document.querySelector(`.module-container[id="module${nextModuleId}"] .module-header`);
            
            if (nextModuleHeader) {
                nextModuleHeader.querySelector('.module-status').textContent = 'Ready';
                document.querySelector(`[data-module="${nextModuleId}"][data-lesson="1"]`).querySelector('.status').textContent = 'Start';
            }
        }
        
        // Update overall progress
        updateOverallProgress();
    }
    
    // Function to update overall progress
    function updateOverallProgress() {
        let totalLessons = 0;
        let completedLessons = 0;
        
        for (const moduleId in userProgress.modules) {
            const module = userProgress.modules[moduleId];
            
            for (const lessonId in module.lessons) {
                totalLessons++;
                
                if (module.lessons[lessonId]) {
                    completedLessons++;
                }
            }
        }
        
        const overallProgress = Math.round((completedLessons / totalLessons) * 100);
        userProgress.overallProgress = overallProgress;
        
        // Update overall progress bar
        const overallProgressBar = document.getElementById('overall-progress');
        overallProgressBar.style.width = `${overallProgress}%`;
        
        // Update overall progress text
        const overallProgressText = overallProgressBar.closest('.progress-container').querySelector('.progress-text');
        
        const completedModules = Object.values(userProgress.modules).filter(module => module.completed).length;
        const totalModules = Object.keys(userProgress.modules).length;
        
        overallProgressText.innerHTML = `<span>${overallProgress}% Complete</span><span>${completedModules}/${totalModules} Modules</span>`;
        
        // Update certificate name
        if (overallProgress === 100) {
            document.querySelector('.certificate-name').textContent = 'Your Name';
            document.querySelector('.certificate-date').textContent = 'Date: ' + new Date().toLocaleDateString();
        }
    }
    
    // Next lesson button functionality
    const nextLessonButtons = document.querySelectorAll('.next-lesson');
    nextLessonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            const lessonId = this.getAttribute('data-lesson');
            
            // Close current lesson
            const currentContent = this.closest('.accordion-content');
            const currentHeader = currentContent.previousElementSibling;
            
            currentContent.classList.remove('active');
            currentHeader.classList.remove('active');
            
            // Open next lesson
            const nextHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
            const nextContent = nextHeader.nextElementSibling;
            
            nextHeader.classList.add('active');
            nextContent.classList.add('active');
            
            // Scroll to the next lesson
            nextHeader.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Previous lesson button functionality
    const prevLessonButtons = document.querySelectorAll('.prev-lesson');
    prevLessonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            const lessonId = this.getAttribute('data-lesson');
            
            // Close current lesson
            const currentContent = this.closest('.accordion-content');
            const currentHeader = currentContent.previousElementSibling;
            
            currentContent.classList.remove('active');
            currentHeader.classList.remove('active');
            
            // Open previous lesson
            const prevHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
            const prevContent = prevHeader.nextElementSibling;
            
            prevHeader.classList.add('active');
            prevContent.classList.add('active');
            
            // Scroll to the previous lesson
            prevHeader.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Module link functionality
    const moduleLinks = document.querySelectorAll('.module-link');
    moduleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const moduleId = this.getAttribute('data-module');
            const moduleElement = document.querySelector(`#module${moduleId}`);
            
            // Check if module is locked
            const moduleStatus = moduleElement.querySelector('.module-status').textContent;
            
            if (moduleStatus === 'Locked') {
                alert('Please complete the previous modules first.');
                return;
            }
            
            // Scroll to module
            moduleElement.scrollIntoView({ behavior: 'smooth' });
            
            // Open first lesson if not already open
            const firstLessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="1"]`);
            const firstLessonContent = firstLessonHeader.nextElementSibling;
            
            if (!firstLessonHeader.classList.contains('active')) {
                // Close all accordion contents
                document.querySelectorAll('.accordion-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.querySelectorAll('.accordion-header').forEach(header => {
                    header.classList.remove('active');
                });
                
                // Open first lesson
                firstLessonHeader.classList.add('active');
                firstLessonContent.classList.add('active');
            }
        });
    });

    // Save progress to localStorage
    function saveProgress() {
        localStorage.setItem('plainidCourseProgress', JSON.stringify(userProgress));
    }

    // Load progress from localStorage
    function loadProgress() {
        const savedProgress = localStorage.getItem('plainidCourseProgress');
        if (savedProgress) {
            try {
                userProgress = JSON.parse(savedProgress);
                
                // Update UI based on loaded progress
                for (const moduleId in userProgress.modules) {
                    const module = userProgress.modules[moduleId];
                    
                    if (module.completed) {
                        document.querySelector(`#module${moduleId} .module-header .module-status`).textContent = 'Completed';
                    }
                    
                    // Update lessons
                    for (const lessonId in module.lessons) {
                        if (module.lessons[lessonId]) {
                            const lessonHeader = document.querySelector(`[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
                            if (lessonHeader) {
                                lessonHeader.querySelector('.status').textContent = 'Completed';
                            }
                        }
                    }
                }
                
                // Update progress bars
                updateOverallProgress();
                
                // Unlock appropriate modules and lessons
                for (let i = 1; i <= 6; i++) {
                    const module = userProgress.modules[i];
                    if (i === 1 || userProgress.modules[i-1].completed) {
                        document.querySelector(`#module${i} .module-header .module-status`).textContent = 'Ready';
                        
                        // Find the first incomplete lesson
                        let firstIncompleteLessonId = null;
                        for (const lessonId in module.lessons) {
                            if (!module.lessons[lessonId]) {
                                firstIncompleteLessonId = lessonId;
                                break;
                            }
                        }
                        
                        if (firstIncompleteLessonId) {
                            document.querySelector(`[data-module="${i}"][data-lesson="${firstIncompleteLessonId}"]`).querySelector('.status').textContent = 'Start';
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
    }

    // Setup autosave
    window.addEventListener('beforeunload', saveProgress);
    
    // Load saved progress when page loads
    loadProgress();
});
