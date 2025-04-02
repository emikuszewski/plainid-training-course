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
        this.initialized = false;
        this.init();
    }

    init() {
        // Check if already initialized to prevent duplicate initializations
        if (this.initialized) {
            console.log('ModuleNavigator already initialized');
            return;
        }
        
        console.log('Initializing ModuleNavigator');
        this.initialized = true;
        
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            this.addBreadcrumbs();
            this.bindNavigationEvents();
            this.initModuleScroller();
            this.addProgressIndicators();
            this.addNextLessonButtons();
            this.ensureAllModulesVisible();
        }, 500);
    }

    addBreadcrumbs() {
        // Create breadcrumb container if it doesn't exist
        let breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (breadcrumbContainer) {
            // Already exists, don't duplicate
            return;
        }
        
        breadcrumbContainer = document.createElement('div');
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
        
        // Add breadcrumb styles if not already added
        this.addBreadcrumbStyles();
    }

    setupLessonTitleUpdates(lessonHeaders, lessonItem, breadcrumbList, moduleId) {
        lessonHeaders.forEach(header => {
            // Skip if already has event listener
            if (header.getAttribute('data-breadcrumb-listener') === 'true') {
                return;
            }
            
            // Mark as having listener
            header.setAttribute('data-breadcrumb-listener', 'true');
            
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
        const titleElement = header.querySelector('.lesson-title');
        if (titleElement) {
            return titleElement.textContent;
        }
        
        // Fallback to header text and strip status
        const headerText = header.textContent || '';
        const status = header.querySelector('.status')?.textContent || '';
        return headerText.replace(status, '').trim();
    }

    bindNavigationEvents() {
        // Module link functionality
        const moduleLinks = document.querySelectorAll('.module-link');
        moduleLinks.forEach(link => {
            // Skip if already has event listener
            if (link.getAttribute('data-nav-listener') === 'true') {
                return;
            }
            
            // Mark as having listener
            link.setAttribute('data-nav-listener', 'true');
            
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const moduleId = link.getAttribute('data-module');
                this.navigateToModule(moduleId);
            });
        });
        
        // Next/Previous button functionality
        const navigationButtons = document.querySelectorAll('.next-lesson, .prev-lesson');
        navigationButtons.forEach(button => {
            // Skip if already has event listener
            if (button.getAttribute('data-nav-listener') === 'true') {
                return;
            }
            
            // Mark as having listener
            button.setAttribute('data-nav-listener', 'true');
            
            button.addEventListener('click', () => {
                const moduleId = button.getAttribute('data-module');
                const lessonId = button.getAttribute('data-lesson');
                this.navigateToLesson(moduleId, lessonId);
            });
        });
    }

    navigateToModule(moduleId) {
        console.log(`Navigating to module ${moduleId}`);
        
        // First ensure all modules are visible
        this.ensureAllModulesVisible();
        
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) {
            console.warn(`Module element for module ${moduleId} not found`);
            return;
        }
        
        // Make sure this specific module is visible
        moduleElement.style.display = 'block';
        
        // Smooth scroll to module
        moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Open first accessible lesson if not already open
        setTimeout(() => {
            // Find first lesson
            const firstLessonHeader = moduleElement.querySelector('.accordion-header');
            if (firstLessonHeader && !firstLessonHeader.classList.contains('active')) {
                // Close all accordion contents
                document.querySelectorAll('.accordion-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.querySelectorAll('.accordion-header').forEach(header => {
                    header.classList.remove('active');
                });
                
                // Open first lesson
                firstLessonHeader.classList.add('active');
                if (firstLessonHeader.nextElementSibling) {
                    firstLessonHeader.nextElementSibling.classList.add('active');
                }
                
                // Trigger click event to update breadcrumbs
                firstLessonHeader.dispatchEvent(new Event('click'));
            }
        }, 600);
        
        // Update current module
        this.currentModule = moduleId;
    }

    navigateToLesson(moduleId, lessonId) {
        console.log(`Navigating to lesson ${lessonId} in module ${moduleId}`);
        
        // Ensure all modules are visible
        this.ensureAllModulesVisible();
        
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
            const targetContent = targetHeader.nextElementSibling;
            
            targetHeader.classList.add('active');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Scroll to the lesson with smooth animation
            setTimeout(() => {
                targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            // Trigger click event to update breadcrumbs
            targetHeader.dispatchEvent(new Event('click'));
        } else {
            console.warn(`Target lesson header for module ${moduleId}, lesson ${lessonId} not found`);
        }
    }

    initModuleScroller() {
        // Check if quick nav already exists
        if (document.querySelector('.module-quick-nav')) {
            return;
        }
        
        // Create module quick navigation
        const nav = document.createElement('div');
        nav.className = 'module-quick-nav';
        
        // Create items for each module
        const moduleContainers = document.querySelectorAll('.module-container');
        
        if (moduleContainers.length === 0) {
            console.warn('No module containers found for quick navigation');
            return;
        }
        
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
        
        // Add scroller styles if not already added
        this.addScrollerStyles();
    }
    
    addProgressIndicators() {
        // Add progress indicator to each module header
        document.querySelectorAll('.module-container').forEach(moduleElement => {
            const moduleId = moduleElement.id.replace('module', '');
            const moduleHeader = moduleElement.querySelector('.module-header');
            
            if (!moduleHeader) {
                console.warn(`Module header not found for module ${moduleId}`);
                return;
            }
            
            // Skip if progress indicator already exists
            if (moduleHeader.querySelector('.module-progress-indicator')) {
                return;
            }
            
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
        });
        
        // Add progress styles if not already added
        this.addProgressStyles();
        
        // Update progress indicators
        this.updateProgressIndicators();
    }
    
    addNextLessonButtons() {
        // Add next/previous buttons to each lesson
        document.querySelectorAll('.module-container').forEach(moduleElement => {
            const moduleId = moduleElement.id.replace('module', '');
            const lessonContents = moduleElement.querySelectorAll('.accordion-content');
            
            lessonContents.forEach((content, index) => {
                // Skip if navigation already exists
                if (content.querySelector('.module-navigation')) {
                    return;
                }
                
                const header = content.previousElementSibling;
                if (!header || !header.classList.contains('accordion-header')) {
                    return;
                }
                
                const lessonId = header.getAttribute('data-lesson');
                if (!lessonId) {
                    return;
                }
                
                // Create navigation container
                const navigationContainer = document.createElement('div');
                navigationContainer.className = 'module-navigation';
                
                // Add previous button if not the first lesson
                const prevButton = document.createElement('button');
                if (index > 0) {
                    const prevHeader = lessonContents[index - 1].previousElementSibling;
                    const prevLessonId = prevHeader?.getAttribute('data-lesson');
                    
                    prevButton.className = 'btn btn-secondary prev-lesson';
                    prevButton.textContent = 'Previous Lesson';
                    prevButton.setAttribute('data-module', moduleId);
                    prevButton.setAttribute('data-lesson', prevLessonId);
                } else {
                    // Disabled previous button for first lesson
                    prevButton.className = 'btn btn-secondary';
                    prevButton.textContent = 'Previous Lesson';
                    prevButton.disabled = true;
                }
                
                // Add next button
                const nextButton = document.createElement('button');
                if (index < lessonContents.length - 1) {
                    const nextHeader = lessonContents[index + 1].previousElementSibling;
                    const nextLessonId = nextHeader?.getAttribute('data-lesson');
                    
                    nextButton.className = 'btn next-lesson';
                    nextButton.textContent = 'Next Lesson';
                    nextButton.setAttribute('data-module', moduleId);
                    nextButton.setAttribute('data-lesson', nextLessonId);
                } else {
                    // For last lesson in module, go to next module
                    const nextModuleId = parseInt(moduleId) + 1;
                    const nextModule = document.getElementById(`module${nextModuleId}`);
                    
                    if (nextModule) {
                        // Next module exists
                        const firstLessonHeader = nextModule.querySelector('.accordion-header');
                        const firstLessonId = firstLessonHeader?.getAttribute('data-lesson');
                        
                        nextButton.className = 'btn next-module';
                        nextButton.textContent = 'Next Module';
                        nextButton.setAttribute('data-module', nextModuleId);
                        nextButton.setAttribute('data-lesson', firstLessonId);
                    } else {
                        // No next module, show completion button
                        nextButton.className = 'btn next-lesson';
                        nextButton.textContent = 'Complete Course';
                        nextButton.setAttribute('data-action', 'complete');
                    }
                }
                
                // Add buttons to container
                navigationContainer.appendChild(prevButton);
                navigationContainer.appendChild(nextButton);
                
                // Add to lesson content
                content.appendChild(navigationContainer);
                
                // Add click events for navigation buttons
                navigationContainer.querySelectorAll('button:not([disabled])').forEach(button => {
                    // Skip if already has event listener
                    if (button.getAttribute('data-nav-listener') === 'true') {
                        return;
                    }
                    
                    // Mark as having listener
                    button.setAttribute('data-nav-listener', 'true');
                    
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        
                        const action = button.getAttribute('data-action');
                        if (action === 'complete') {
                            // Handle course completion
                            const certificationSection = document.getElementById('certification');
                            if (certificationSection) {
                                certificationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            
                            // Show completion notification
                            if (typeof window.showNotification === 'function') {
                                window.showNotification('Congratulations! You have completed the course.', 'success');
                            }
                            
                            return;
                        }
                        
                        // Handle regular navigation
                        const targetModule = button.getAttribute('data-module');
                        const targetLesson = button.getAttribute('data-lesson');
                        
                        if (targetModule && targetLesson) {
                            this.navigateToLesson(targetModule, targetLesson);
                        }
                    });
                });
            });
        });
    }

    updateProgressIndicators() {
        // Update progress indicators based on completed lessons
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
    
    ensureAllModulesVisible() {
        // Make sure all module containers are visible
        const moduleContainers = document.querySelectorAll('.module-container');
        
        if (moduleContainers.length === 0) {
            console.warn('No module containers found to make visible');
            return;
        }
        
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
    
    addBreadcrumbStyles() {
        if (document.getElementById('breadcrumb-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'breadcrumb-styles';
        style.textContent = `
            .breadcrumbs {
                background-color: var(--icy-gray, #EEF1F4);
                padding: 10px 0;
                margin-bottom: 20px;
            }
            
            .breadcrumb-list {
                display: flex;
                align-items: center;
                padding: 0 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .breadcrumb-module {
                font-weight: 500;
                color: var(--primary-dark, #002A3A);
            }
            
            .breadcrumb-separator {
                margin: 0 10px;
                color: var(--cloudy-gray, #BFCED6);
                display: flex;
                align-items: center;
            }
            
            .breadcrumb-lesson {
                color: var(--primary, #00A7B5);
            }
        `;
        document.head.appendChild(style);
    }
    
    addScrollerStyles() {
        if (document.getElementById('module-scroller-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'module-scroller-styles';
        style.textContent = `
            .module-quick-nav {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: 15px;
                z-index: 100;
            }
            
            .quick-nav-item {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--white, #FFFFFF);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                cursor: pointer;
                transition: transform 0.3s ease, background-color 0.3s ease;
            }
            
            .quick-nav-item:hover {
                transform: scale(1.1);
                background-color: var(--misty-teal, #D1E4E5);
            }
            
            .module-number {
                font-weight: 600;
                color: var(--text-primary, #002A3A);
            }
            
            .module-status-indicator {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: var(--cloudy-gray, #BFCED6);
                top: 0;
                right: 0;
            }
            
            .module-status-indicator.completed {
                background-color: var(--neon-green, #BAF967);
            }
            
            .module-status-indicator.in-progress,
            .module-status-indicator.ready {
                background-color: var(--primary, #00A7B5);
            }
            
            @media (max-width: 768px) {
                .module-quick-nav {
                    right: 10px;
                }
                
                .quick-nav-item {
                    width: 30px;
                    height: 30px;
                    font-size: 0.8rem;
                }
                
                .module-status-indicator {
                    width: 8px;
                    height: 8px;
                }
            }
        `;
        document.head.appendChild(style);
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
                background-color: var(--icy-gray, #EEF1F4);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .module-progress-fill {
                height: 100%;
                background-color: var(--primary, #00A7B5);
                width: 0%;
                transition: width 0.5s ease;
            }
            
            .module-progress-text {
                font-size: 0.8rem;
                color: var(--slate, #515A6C);
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
            
            .module-navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid var(--icy-gray, #EEF1F4);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the module navigator when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for other components to initialize
    setTimeout(() => {
        if (!window.moduleNavigator) {
            window.moduleNavigator = new ModuleNavigator();
        }
    }, 300);
});
