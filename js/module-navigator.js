/**
 * Module Navigation System
 * 
 * Provides an enhanced navigation experience with:
 * - Smooth transitions between modules and lessons
 * - Progress tracking
 * - Breadcrumb navigation
 * - Module completion indicators
 */
class ModuleNavigator {
    constructor() {
        this.currentModule = null;
        this.currentLesson = null;
        this.init();
    }

    init() {
        this.addBreadcrumbs();
        this.bindNavigationEvents();
        this.initModuleScroller();
        this.addProgressIndicators();
        this.addNextLessonButtons();
    }

    addBreadcrumbs() {
        // Create breadcrumb container
        const breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.className = 'breadcrumbs';
        
        // Find all module containers
        const moduleContainers = document.querySelectorAll('.module-container');
        
        moduleContainers.forEach(container => {
            // Get module information
            const moduleId = container.id.replace('module', '');
            const moduleTitle = container.querySelector('.module-header h3')?.textContent || `Module ${moduleId}`;
            
            // Create navigation data attribute
            container.setAttribute('data-nav-module', moduleId);
            
            // Add breadcrumb for module lessons
            const lessonHeaders = container.querySelectorAll('.accordion-header');
            
            if (lessonHeaders.length > 0) {
                const breadcrumbList = document.createElement('div');
                breadcrumbList.className = 'breadcrumb-list';
                breadcrumbList.id = `breadcrumb-module-${moduleId}`;
                breadcrumbList.style.display = 'none';
                
                // Add module title to breadcrumb
                const moduleItem = document.createElement('span');
                moduleItem.className = 'breadcrumb-module';
                moduleItem.textContent = moduleTitle;
                breadcrumbList.appendChild(moduleItem);
                
                // Add separator
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>';
                breadcrumbList.appendChild(separator);
                
                // Add lesson placeholder
                const lessonItem = document.createElement('span');
                lessonItem.className = 'breadcrumb-lesson';
                lessonItem.textContent = 'Current Lesson';
                breadcrumbList.appendChild(lessonItem);
                
                breadcrumbContainer.appendChild(breadcrumbList);
                
                // Store reference to breadcrumb list in module container
                container.setAttribute('data-breadcrumb-id', breadcrumbList.id);
                
                // Update lesson titles in breadcrumb when accordion is clicked
                this.setupLessonTitleUpdates(lessonHeaders, lessonItem, breadcrumbList, moduleId);
            }
        });
        
        // Insert breadcrumbs after header
        const header = document.querySelector('header');
        if (header && header.nextElementSibling) {
            header.parentNode.insertBefore(breadcrumbContainer, header.nextElementSibling);
        }
    }

    setupLessonTitleUpdates(lessonHeaders, lessonItem, breadcrumbList, moduleId) {
        lessonHeaders.forEach(header => {
            // Add event handler to update breadcrumb when lesson is opened
            header.addEventListener('click', () => {
                if (header.classList.contains('active')) {
                    const lessonTitle = this.getLessonTitle(header);
                    lessonItem.textContent = lessonTitle;
                    
                    // Show this module's breadcrumb
                    document.querySelectorAll('.breadcrumb-list').forEach(list => {
                        list.style.display = 'none';
                    });
                    breadcrumbList.style.display = 'flex';
                    
                    // Update current module and lesson
                    this.currentModule = moduleId;
                    this.currentLesson = header.getAttribute('data-lesson');
                }
            });
        });
    }

    getLessonTitle(header) {
        // Extract title text from the header, ignoring the status element
        const headerText = header.textContent || '';
        const status = header.querySelector('.status')?.textContent || '';
        return headerText.replace(status, '').trim();
    }

    bindNavigationEvents() {
        // Module link functionality
        const moduleLinks = document.querySelectorAll('.module-link');
        moduleLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const moduleId = link.getAttribute('data-module');
                this.navigateToModule(moduleId);
            });
        });
        
        // Next/Previous button functionality
        const navigationButtons = document.querySelectorAll('.next-lesson, .prev-lesson');
        navigationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const moduleId = button.getAttribute('data-module');
                const lessonId = button.getAttribute('data-lesson');
                this.navigateToLesson(moduleId, lessonId);
            });
        });
    }

    navigateToModule(moduleId) {
        console.log(`Navigating to module ${moduleId}`);
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) {
            console.warn(`Module element for module ${moduleId} not found`);
            return;
        }
        
        // Check if module is locked
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
        
        // Update current module
        this.currentModule = moduleId;
    }

    navigateToLesson(moduleId, lessonId) {
        console.log(`Navigating to lesson ${lessonId} in module ${moduleId}`);
        
        // Close all accordions
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.classList.remove('active');
            if (header.nextElementSibling) {
                header.nextElementSibling.classList.remove('active');
            }
        });
        
        // Open target lesson
        const targetHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (targetHeader) {
            // Check if lesson is accessible
            const status = targetHeader.querySelector('.status')?.textContent;
            if (status === 'Locked') {
                if (window.showNotification) {
                    window.showNotification('Please complete the previous lessons first.', 'warning');
                } else {
                    alert('Please complete the previous lessons first.');
                }
                return;
            }
            
            const targetContent = targetHeader.nextElementSibling;
            
            targetHeader.classList.add('active');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Scroll to the lesson with smooth animation
            setTimeout(() => {
                targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            // Trigger click event to update breadcrumbs (via bubbling)
            targetHeader.click();
        } else {
            console.warn(`Target lesson header for module ${moduleId}, lesson ${lessonId} not found`);
        }
    }

    initModuleScroller() {
        // Create module quick navigation
        const nav = document.createElement('div');
        nav.className = 'module-quick-nav';
        
        // Create items for each module
        const moduleContainers = document.querySelectorAll('.module-container');
        moduleContainers.forEach((container, index) => {
            const moduleId = container.id.replace('module', '');
            const moduleStatus = container.querySelector('.module-status')?.textContent || 'Not Started';
            
            const navItem = document.createElement('div');
            navItem.className = 'quick-nav-item';
            navItem.setAttribute('data-module', moduleId);
            navItem.innerHTML = `
                <span class="module-number">${moduleId}</span>
                <span class="module-status-indicator ${moduleStatus.toLowerCase().replace(/\s+/g, '-')}"></span>
            `;
            
            // Add tooltip with module title
            const moduleTitle = container.querySelector('.module-header h3')?.textContent || `Module ${moduleId}`;
            navItem.setAttribute('title', moduleTitle);
            
            // Add click event
            navItem.addEventListener('click', () => {
                this.navigateToModule(moduleId);
            });
            
            nav.appendChild(navItem);
        });
        
        // Add to document
        document.body.appendChild(nav);
    }
    
    addProgressIndicators() {
        // Add progress indicator to each module header
        document.querySelectorAll('.module-container').forEach(moduleElement => {
            const moduleId = moduleElement.id.replace('module', '');
            const moduleHeader = moduleElement.querySelector('.module-header');
            
            if (moduleHeader && !moduleHeader.querySelector('.module-progress-indicator')) {
                // Create progress indicator
                const progressIndicator = document.createElement('div');
                progressIndicator.className = 'module-progress-indicator';
                progressIndicator.innerHTML = `
                    <div class="module-progress-bar">
                        <div class="module-progress-fill" data-module="${moduleId}" style="width: 0%"></div>
                    </div>
                    <span class="module-progress-text">0%</span>
                `;
                
                // Add to module header
                moduleHeader.appendChild(progressIndicator);
                
                // Add styles if needed
                this.addProgressStyles();
            }
        });
        
        // Update progress indicators
        this.updateProgressIndicators();
    }
    
    addProgressStyles() {
        if (document.getElementById('module-progress-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'module-progress-styles';
        style.textContent = `
            .module-progress-indicator {
                display: flex;
                align-items: center;
                margin-left: 15px;
                gap: 8px;
            }
            
            .module-progress-bar {
                width: 100px;
                height: 6px;
                background-color: #e0e0e0;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .module-progress-fill {
                height: 100%;
                background-color: var(--primary);
                width: 0%;
                transition: width 0.5s ease;
            }
            
            .module-progress-text {
                font-size: 0.8rem;
                color: #666;
                min-width: 32px;
            }
            
            .module-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .status {
                white-space: nowrap;
            }
            
            /* Add next module guidance */
            .next-module-guidance {
                margin: 20px 0;
                padding: 15px;
                background-color: #e8f5e9;
                border-left: 4px solid #4caf50;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .next-module-guidance p {
                margin: 0;
                flex: 1;
            }
            
            /* Continue button in completed lessons */
            .continue-button {
                margin-top: 20px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .continue-button::after {
                content: '';
                display: inline-block;
                width: 18px;
                height: 18px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12,4L10.59,5.41L16.17,11H4V13H16.17L10.59,18.59L12,20L20,12L12,4Z'/%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
                transition: transform 0.3s ease;
            }
            
            .continue-button:hover::after {
                transform: translateX(3px);
            }
        `;
        document.head.appendChild(style);
    }
    
    updateProgressIndicators() {
        document.querySelectorAll('.module-container').forEach(moduleElement => {
            const moduleId = moduleElement.id.replace('module', '');
            const progressFill = moduleElement.querySelector(`.module-progress-fill[data-module="${moduleId}"]`);
            const progressText = moduleElement.querySelector('.module-progress-text');
            
            if (!progressFill || !progressText) return;
            
            // Calculate progress for this module
            const progress = this.calculateModuleProgress(moduleId);
            
            // Update UI
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        });
    }
    
    calculateModuleProgress(moduleId) {
        // Try to get progress data from localStorage first
        try {
            const progress = JSON.parse(localStorage.getItem('plainidCourseProgress')) || {};
            if (progress.modules && progress.modules[moduleId]) {
                const moduleData = progress.modules[moduleId];
                
                // If module is marked as completed, return 100%
                if (moduleData.completed) {
                    return 100;
                }
                
                // Count completed lessons
                const completedLessons = Object.values(moduleData.lessons || {}).filter(Boolean).length;
                
                // Get total lessons from DOM
                const moduleElement = document.getElementById(`module${moduleId}`);
                if (moduleElement) {
                    const totalLessons = moduleElement.querySelectorAll('.accordion-header').length;
                    if (totalLessons > 0) {
                        return (completedLessons / totalLessons) * 100;
                    }
                }
            }
        } catch (e) {
            console.error('Error calculating module progress:', e);
        }
        
        // Fallback: Calculate directly from DOM
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
                
                // Check if lesson is completed by looking at the status
                const statusElement = header.querySelector('.status');
                if (statusElement && statusElement.textContent === 'Completed') {
                    completedLessons++;
                }
            }
        });
        
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    }
    
    addNextLessonButtons() {
        // Add "Continue to Next Lesson" buttons to all completed lessons
        document.querySelectorAll('.accordion-content').forEach(content => {
            // Skip if button already exists
            if (content.querySelector('.continue-button')) return;
            
            // Check if parent header has a status of "Completed"
            const header = content.previousElementSibling;
            if (!header || !header.classList.contains('accordion-header')) return;
            
            const status = header.querySelector('.status')?.textContent;
            if (status !== 'Completed') return;
            
            // Add continue button
            const continueButton = document.createElement('button');
            continueButton.className = 'btn continue-button';
            continueButton.textContent = 'Continue to Next Lesson';
            continueButton.addEventListener('click', () => this.navigateToNextContent(header));
            
            // Add at the end of the content
            content.appendChild(continueButton);
        });
        
        // Also add to quiz completion statuses
        document.querySelectorAll('.quiz-completion-status').forEach(statusElement => {
            if (!statusElement.querySelector('.continue-button')) {
                const continueButton = document.createElement('button');
                continueButton.className = 'btn continue-button';
                continueButton.textContent = 'Continue to Next Lesson';
                
                // Find the current lesson header
                const quizContainer = statusElement.closest('.quiz-container');
                if (!quizContainer) return;
                
                const content = quizContainer.closest('.accordion-content');
                if (!content) return;
                
                const header = content.previousElementSibling;
                if (!header || !header.classList.contains('accordion-header')) return;
                
                continueButton.addEventListener('click', () => this.navigateToNextContent(header));
                statusElement.appendChild(continueButton);
            }
        });
    }
    
    navigateToNextContent(currentHeader) {
        console.log("Navigating to next content from current header");
        
        if (!currentHeader) {
            console.warn("No current header provided for navigation");
            return;
        }
        
        const moduleId = currentHeader.getAttribute('data-module');
        const lessonId = currentHeader.getAttribute('data-lesson');
        
        if (!moduleId || !lessonId) {
            console.warn("Missing module or lesson ID on header");
            return;
        }
        
        console.log(`Navigating from module ${moduleId}, lesson ${lessonId}`);
        
        // Find all lesson headers in this module
        const module = document.getElementById(`module${moduleId}`);
        if (!module) {
            console.warn(`Module element for module ${moduleId} not found`);
            return;
        }
        
        const headers = Array.from(module.querySelectorAll('.accordion-header'));
        
        // Find current header index
        const currentIndex = headers.findIndex(h => h === currentHeader);
        console.log(`Current index: ${currentIndex}, Total headers: ${headers.length}`);
        
        if (currentIndex >= 0 && currentIndex < headers.length - 1) {
            // There's another lesson in this module
            const nextHeader = headers[currentIndex + 1];
            
            // Check if it's locked
            const nextStatus = nextHeader.querySelector('.status')?.textContent;
            if (nextStatus === 'Locked') {
                console.log("Next lesson is locked - unlocking it");
                
                // Unlock it since the previous lesson is complete
                const statusElement = nextHeader.querySelector('.status');
                if (statusElement) {
                    statusElement.textContent = 'Start';
                    statusElement.className = 'status';
                }
            }
            
            // Navigate to next lesson
            this.navigateToLesson(moduleId, nextHeader.getAttribute('data-lesson'));
        } else {
            // We're at the last lesson in the module
            // Try to navigate to the next module
            const nextModuleId = parseInt(moduleId) + 1;
            const nextModule = document.getElementById(`module${nextModuleId}`);
            
            if (!nextModule) {
                // No more modules, show completion message
                if (window.showNotification) {
                    window.showNotification('You have completed all available modules! Check out the certification section.', 'success');
                } else {
                    alert('You have completed all available modules! Check out the certification section.');
                }
                
                // Navigate to certification section
                const certSection = document.getElementById('certification');
                if (certSection) {
                    certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
            
            // Check if next module is locked
            const nextModuleStatus = nextModule.querySelector('.module-status')?.textContent;
            if (nextModuleStatus === 'Locked') {
                console.log(`Next module ${nextModuleId} is locked - unlocking it`);
                
                // Unlock it
                const moduleStatus = nextModule.querySelector('.module-status');
                if (moduleStatus) {
                    moduleStatus.textContent = 'Not Started';
                    moduleStatus.className = 'module-status';
                }
                
                // Also unlock first lesson
                const firstLesson = nextModule.querySelector('.accordion-header');
                if (firstLesson) {
                    const statusElement = firstLesson.querySelector('.status');
                    if (statusElement) {
                        statusElement.textContent = 'Start';
                        statusElement.className = 'status';
                    }
                }
                
                if (window.showNotification) {
                    window.showNotification(`Module ${nextModuleId} has been unlocked!`, 'success');
                }
            }
            
            // Navigate to the next module
            this.navigateToModule(nextModuleId);
        }
    }
}

// Initialize the module navigator when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure other components have initialized
    setTimeout(() => {
        if (!window.moduleNavigator) {
            window.moduleNavigator = new ModuleNavigator();
        }
    }, 300);
});
