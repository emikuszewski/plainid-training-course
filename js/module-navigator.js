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
            const moduleTitle = container.querySelector('.module-header h3').textContent;
            
            // Create navigation data attribute
            container.setAttribute('data-nav-module', moduleId);
            
            // Add breadcrumb for module lessons
            const lessonHeaders = container.querySelectorAll('.accordion-header');
            
            if (lessonHeaders.length > 0) {
                const breadcrumbList = document.createElement('div');
                breadcrumbList.className = 'breadcrumb-list';
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
                lessonHeaders.forEach(header => {
                    header.addEventListener('click', () => {
                        if (header.classList.contains('active')) {
                            const lessonTitle = header.textContent.split('\n')[0].trim();
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
        });
        
        // Insert breadcrumbs after header
        const header = document.querySelector('header');
        if (header && header.nextElementSibling) {
            header.parentNode.insertBefore(breadcrumbContainer, header.nextElementSibling);
        }
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
        const moduleElement = document.getElementById(`module${moduleId}`);
        if (!moduleElement) return;
        
        // Check if module is locked
        const moduleStatus = moduleElement.querySelector('.module-status').textContent;
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
                firstAccessibleLesson.classList.add('active');
                firstAccessibleLesson.nextElementSibling.classList.add('active');
                
                // Trigger click event to update breadcrumbs
                firstAccessibleLesson.click();
            }
        }, 600);
        
        // Update current module
        this.currentModule = moduleId;
    }

    navigateToLesson(moduleId, lessonId) {
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
                if (window.showNotification) {
                    window.showNotification('Please complete the previous lessons first.', 'warning');
                } else {
                    alert('Please complete the previous lessons first.');
                }
                return;
            }
            
            const targetContent = targetHeader.nextElementSibling;
            
            targetHeader.classList.add('active');
            targetContent.classList.add('active');
            
            // Scroll to the lesson with smooth animation
            setTimeout(() => {
                targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            // Trigger click event to update breadcrumbs
            targetHeader.click();
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
            const moduleStatus = container.querySelector('.module-status').textContent;
            
            const navItem = document.createElement('div');
            navItem.className = 'quick-nav-item';
            navItem.setAttribute('data-module', moduleId);
            navItem.innerHTML = `
                <span class="module-number">${moduleId}</span>
                <span class="module-status-indicator ${moduleStatus.toLowerCase()}"></span>
            `;
            
            // Add tooltip with module title
            const moduleTitle = container.querySelector('.module-header h3').textContent;
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
}

// Initialize the module navigator when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.moduleNavigator = new ModuleNavigator();
});
