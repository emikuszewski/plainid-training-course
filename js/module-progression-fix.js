/**
 * MODULE PROGRESSION FIX
 * 
 * This script fixes issues with module progression and content visibility in the PlainID Training Course.
 * 
 * INSTRUCTIONS:
 * 1. Include this script BEFORE all other course scripts in index.html
 * 2. This script will patch the existing functionality without replacing core files
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Module Progression Fix: Initializing...');
    
    // Fix module initialization and progression after a short delay to ensure DOM is fully loaded
    setTimeout(initModuleProgressionFix, 500);
    
    // Add observer for dynamic content changes
    setupMutationObserver();
});

/**
 * Initialize all module progression fixes
 */
function initModuleProgressionFix() {
    console.log('Module Progression Fix: Starting fixes...');
    
    // Fix accordion functionality
    fixAccordionBehavior();
    
    // Fix module status display
    fixModuleStatusDisplay();
    
    // Ensure first module is always unlocked
    ensureModuleOneUnlocked();
    
    // Fix module navigation
    fixModuleNavigation();
    
    // Fix lesson completion logic
    fixLessonCompletionLogic();
    
    // Add periodic check for progression issues
    setupProgressionChecks();
    
    console.log('Module Progression Fix: Initial fixes applied.');
}

/**
 * Fix accordion behavior for showing/hiding content
 */
function fixAccordionBehavior() {
    // Get all accordion headers
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Re-attach event listeners with fixed behavior
    accordionHeaders.forEach(header => {
        // Remove existing click listeners
        const headerClone = header.cloneNode(true);
        header.parentNode.replaceChild(headerClone, header);
        
        // Add new event listener with fixed behavior
        headerClone.addEventListener('click', function(e) {
            // Prevent default if this is a link
            e.preventDefault();
            
            // Check if the lesson is locked
            const status = this.querySelector('.status')?.textContent;
            if (status === 'Locked') {
                if (window.showNotification) {
                    window.showNotification('Please complete the previous lessons first.', 'warning');
                } else {
                    alert('Please complete the previous lessons first.');
                }
                return;
            }
            
            const content = this.nextElementSibling;
            if (!content) return;
            
            // Close all other accordions
            accordionHeaders.forEach(h => {
                const headerElement = h.cloneNode(false);
                if (headerElement !== this && headerElement.classList.contains('active')) {
                    headerElement.classList.remove('active');
                    if (headerElement.nextElementSibling) {
                        headerElement.nextElementSibling.classList.remove('active');
                    }
                }
            });
            
            // Toggle current accordion with animation
            const isActive = this.classList.contains('active');
            
            if (!isActive) {
                // Opening this accordion
                this.classList.add('active');
                content.classList.add('active');
                
                // Force repaint for transition
                content.style.display = 'block';
                content.style.maxHeight = content.scrollHeight + 'px';
                
                // Set currentModule and currentLesson in state
                const moduleId = this.getAttribute('data-module');
                const lessonId = this.getAttribute('data-lesson');
                
                if (window.PlainIDCourse && window.PlainIDCourse.state) {
                    window.PlainIDCourse.state.currentModule = moduleId;
                    window.PlainIDCourse.state.currentLesson = lessonId;
                }
                
                // Scroll into view with slight delay for animation
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                // Closing this accordion
                this.classList.remove('active');
                content.classList.remove('active');
                content.style.maxHeight = '0';
            }
        });
        
        // Mark as fixed
        headerClone.setAttribute('data-fixed', 'true');
    });
    
    console.log('Module Progression Fix: Accordion behavior fixed');
}

/**
 * Fix module status display
 */
function fixModuleStatusDisplay() {
    // Load progress data
    let progress = {};
    try {
        const storedProgress = localStorage.getItem('plainidCourseProgress');
        if (storedProgress) {
            progress = JSON.parse(storedProgress);
        }
    } catch (e) {
        console.error('Error loading progress data:', e);
        return;
    }
    
    // Update UI based on stored progress
    if (progress.modules) {
        // Fix module status displays
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
            if (moduleData.lessons) {
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
        }
    }
    
    console.log('Module Progression Fix: Module status displays updated');
}

/**
 * Ensure Module 1 is always unlocked
 */
function ensureModuleOneUnlocked() {
    const module1 = document.getElementById('module1');
    if (!module1) return;
    
    const moduleStatus = module1.querySelector('.module-status');
    if (moduleStatus && moduleStatus.textContent === 'Locked') {
        moduleStatus.textContent = 'Not Started';
        moduleStatus.className = 'module-status';
        
        // Also unlock first lesson
        const firstLesson = module1.querySelector('.accordion-header');
        if (firstLesson) {
            const statusElement = firstLesson.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Start';
                statusElement.className = 'status';
            }
        }
        
        console.log('Module Progression Fix: Module 1 unlocked');
    }
}

/**
 * Fix module navigation
 */
function fixModuleNavigation() {
    // Fix "Next Lesson" buttons
    const nextLessonButtons = document.querySelectorAll('.next-lesson');
    nextLessonButtons.forEach(button => {
        // Remove existing click listeners
        const buttonClone = button.cloneNode(true);
        button.parentNode.replaceChild(buttonClone, button);
        
        // Add new event listener with fixed behavior
        buttonClone.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            const lessonId = this.getAttribute('data-lesson');
            
            if (!moduleId || !lessonId) return;
            
            navigateToLessonFixed(moduleId, lessonId);
        });
    });
    
    // Fix module links
    const moduleLinks = document.querySelectorAll('.module-link');
    moduleLinks.forEach(link => {
        // Remove existing click listeners
        const linkClone = link.cloneNode(true);
        link.parentNode.replaceChild(linkClone, link);
        
        // Add new event listener with fixed behavior
        linkClone.addEventListener('click', function(e) {
            e.preventDefault();
            
            const moduleId = this.getAttribute('data-module');
            if (!moduleId) return;
            
            navigateToModuleFixed(moduleId);
        });
    });
    
    console.log('Module Progression Fix: Module navigation fixed');
}

/**
 * Fixed navigation to a specific module
 */
function navigateToModuleFixed(moduleId) {
    console.log(`Module Progression Fix: Navigating to module ${moduleId}`);
    
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
        const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
        for (const header of lessonHeaders) {
            const status = header.querySelector('.status')?.textContent;
            if (status !== 'Locked') {
                firstAccessibleLesson = header;
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
                firstAccessibleLesson.nextElementSibling.style.display = 'block';
                firstAccessibleLesson.nextElementSibling.style.maxHeight = 
                    firstAccessibleLesson.nextElementSibling.scrollHeight + 'px';
            }
        }
    }, 600);
}

/**
 * Fixed navigation to a specific lesson
 */
function navigateToLessonFixed(moduleId, lessonId) {
    console.log(`Module Progression Fix: Navigating to lesson ${lessonId} in module ${moduleId}`);
    
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
            targetContent.style.display = 'block';
            targetContent.style.maxHeight = targetContent.scrollHeight + 'px';
        }
        
        // Scroll to the lesson with smooth animation
        setTimeout(() => {
            targetHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
        
        // Update current module and lesson in state
        if (window.PlainIDCourse && window.PlainIDCourse.state) {
            window.PlainIDCourse.state.currentModule = moduleId;
            window.PlainIDCourse.state.currentLesson = lessonId;
        }
    } else {
        console.warn(`Target lesson header for module ${moduleId}, lesson ${lessonId} not found`);
    }
}

/**
 * Fix lesson completion logic
 */
function fixLessonCompletionLogic() {
    // Override the global markLessonComplete function
    window.markLessonComplete = function(moduleId, lessonId) {
        console.log(`Module Progression Fix: Marking lesson ${lessonId} in module ${moduleId} as complete`);
        
        // Ensure moduleId and lessonId are strings for consistency
        moduleId = moduleId.toString();
        lessonId = lessonId.toString();
        
        // Update progress state
        let progress = {};
        try {
            const storedProgress = localStorage.getItem('plainidCourseProgress');
            if (storedProgress) {
                progress = JSON.parse(storedProgress);
            }
        } catch (e) {
            console.error('Error loading progress data:', e);
        }
        
        // Ensure modules structure exists
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
        
        // Update UI elements
        const lessonHeader = document.querySelector(`.accordion-header[data-module="${moduleId}"][data-lesson="${lessonId}"]`);
        if (lessonHeader) {
            const statusElement = lessonHeader.querySelector('.status');
            if (statusElement) {
                statusElement.textContent = 'Completed';
                statusElement.className = 'status completed';
            }
        }
        
        // Unlock the next lesson
        unlockNextLessonFixed(moduleId, lessonId);
        
        // Check if module is complete
        checkModuleCompletionFixed(moduleId, progress);
        
        // Save updated progress
        try {
            localStorage.setItem('plainidCourseProgress', JSON.stringify(progress));
        } catch (e) {
            console.error('Error saving progress data:', e);
        }
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('lesson-completed', {
            detail: { moduleId, lessonId }
        }));
    };
    
    console.log('Module Progression Fix: Lesson completion logic fixed');
}

/**
 * Unlock the next lesson after completing the current one
 */
function unlockNextLessonFixed(moduleId, lessonId) {
    moduleId = moduleId.toString();
    lessonId = lessonId.toString();
    
    // Find the current lesson
    const moduleElement = document.getElementById(`module${moduleId}`);
    if (!moduleElement) return;
    
    // Get all lesson headers in this module
    const lessonHeaders = Array.from(moduleElement.querySelectorAll('.accordion-header'));
    
    // Find the index of the current lesson
    const currentIndex = lessonHeaders.findIndex(header => 
        header.getAttribute('data-module') === moduleId && 
        header.getAttribute('data-lesson') === lessonId
    );
    
    // If found and not the last lesson in the module
    if (currentIndex !== -1 && currentIndex < lessonHeaders.length - 1) {
        // Get the next lesson
        const nextHeader = lessonHeaders[currentIndex + 1];
        if (!nextHeader) return;
        
        const nextLessonId = nextHeader.getAttribute('data-lesson');
        
        // Check if it's locked and unlock it
        const statusElement = nextHeader.querySelector('.status');
        if (statusElement && statusElement.textContent === 'Locked') {
            console.log(`Module Progression Fix: Unlocking next lesson ${nextLessonId} in module ${moduleId}`);
            statusElement.textContent = 'Start';
            statusElement.className = 'status';
        }
    } else if (currentIndex !== -1 && currentIndex === lessonHeaders.length - 1) {
        // This was the last lesson in the module, try to unlock next module
        unlockNextModuleFixed(parseInt(moduleId));
    }
}

/**
 * Check if a module is complete
 */
function checkModuleCompletionFixed(moduleId, progress) {
    console.log(`Module Progression Fix: Checking if module ${moduleId} is complete`);
    
    // Get module element
    const moduleElement = document.getElementById(`module${moduleId}`);
    if (!moduleElement) {
        console.warn(`Module element for module ${moduleId} not found`);
        return;
    }
    
    // Get all lessons for this module
    const lessonHeaders = moduleElement.querySelectorAll('.accordion-header');
    if (lessonHeaders.length === 0) {
        console.warn(`No lesson headers found for module ${moduleId}`);
        return;
    }
    
    // Check if all lessons are completed
    let allCompleted = true;
    let completedCount = 0;
    let totalLessons = lessonHeaders.length;
    
    lessonHeaders.forEach(header => {
        const lessonId = header.getAttribute('data-lesson');
        if (lessonId) {
            // Check if this lesson is completed in progress data
            const isCompleted = progress.modules[moduleId]?.lessons[lessonId] === true;
            
            if (isCompleted) {
                completedCount++;
            } else {
                // Also check the UI status as a fallback
                const statusElement = header.querySelector('.status');
                if (statusElement && statusElement.textContent === 'Completed') {
                    // Update progress data to match UI
                    if (!progress.modules[moduleId]) {
                        progress.modules[moduleId] = {
                            completed: false,
                            lessons: {}
                        };
                    }
                    progress.modules[moduleId].lessons[lessonId] = true;
                    completedCount++;
                } else {
                    allCompleted = false;
                }
            }
        }
    });
    
    console.log(`Module Progression Fix: Module ${moduleId}: ${completedCount}/${totalLessons} lessons completed`);
    
    // Update module status if all lessons are complete
    if (allCompleted && totalLessons > 0) {
        console.log(`Module Progression Fix: All lessons in module ${moduleId} are complete!`);
        
        // Mark module as complete in progress data
        progress.modules[moduleId].completed = true;
        
        // Update module status in UI
        const moduleStatus = moduleElement.querySelector('.module-status');
        if (moduleStatus) {
            moduleStatus.textContent = 'Completed';
            moduleStatus.className = 'module-status completed';
        }
        
        // Unlock next module
        unlockNextModuleFixed(parseInt(moduleId));
        
        // Dispatch event for module completion
        document.dispatchEvent(new CustomEvent('module-completed', {
            detail: { moduleId }
        }));
    } else if (completedCount > 0) {
        // Module is partially complete
        const moduleStatus = moduleElement.querySelector('.module-status');
        if (moduleStatus && moduleStatus.textContent !== 'Completed') {
            moduleStatus.textContent = 'In Progress';
            moduleStatus.className = 'module-status ready';
        }
    }
}

/**
 * Unlock the next module after completing the current one
 */
function unlockNextModuleFixed(completedModuleId) {
    const nextModuleId = completedModuleId + 1;
    console.log(`Module Progression Fix: Attempting to unlock module ${nextModuleId}`);
    
    const nextModuleElement = document.getElementById(`module${nextModuleId}`);
    if (!nextModuleElement) {
        console.log(`Module ${nextModuleId} not found, cannot unlock`);
        return;
    }
    
    // Get the module status
    const moduleStatus = nextModuleElement.querySelector('.module-status');
    if (!moduleStatus) {
        console.log(`Module status element not found for module ${nextModuleId}`);
        return;
    }
    
    // Only unlock if it's currently locked
    if (moduleStatus.textContent === 'Locked' || moduleStatus.textContent === 'Not Started') {
        console.log(`Module Progression Fix: Unlocking module ${nextModuleId}`);
        
        // Update status
        moduleStatus.textContent = 'Not Started';
        moduleStatus.className = 'module-status';
        
        // Also unlock the first lesson
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
            window.showNotification(`New module unlocked: ${moduleTitle}`, 'success');
        } else {
            alert(`New module unlocked: ${nextModuleElement.querySelector('.module-header h3')?.textContent || `Module ${nextModuleId}`}`);
        }
    }
}

/**
 * Set up periodic checks for progression issues
 */
function setupProgressionChecks() {
    // Check every 3 seconds for module progression issues
    setInterval(() => {
        // Ensure Module 1 is always unlocked
        ensureModuleOneUnlocked();
        
        // Check completed modules and unlock next ones
        checkCompletedModulesAndUnlockNext();
        
        // Check for orphaned lessons (completed previous but locked next)
        fixOrphanedLessons();
    }, 3000);
    
    console.log('Module Progression Fix: Progression checks scheduled');
}

/**
 * Check completed modules and unlock next ones
 */
function checkCompletedModulesAndUnlockNext() {
    let progress = {};
    try {
        const storedProgress = localStorage.getItem('plainidCourseProgress');
        if (storedProgress) {
            progress = JSON.parse(storedProgress);
        }
    } catch (e) {
        console.error('Error loading progress data:', e);
        return;
    }
    
    if (!progress.modules) return;
    
    // Find highest completed module
    let highestCompleted = 0;
    for (const moduleId in progress.modules) {
        if (progress.modules[moduleId].completed) {
            highestCompleted = Math.max(highestCompleted, parseInt(moduleId));
        }
    }
    
    // Unlock next module if one is completed
    if (highestCompleted > 0) {
        unlockNextModuleFixed(highestCompleted);
    }
}

/**
 * Fix orphaned lessons (previous lesson is completed but next is still locked)
 */
function fixOrphanedLessons() {
    // Get all module containers
    const moduleContainers = document.querySelectorAll('.module-container');
    
    moduleContainers.forEach(moduleElement => {
        const moduleId = moduleElement.id.replace('module', '');
        const lessonHeaders = Array.from(moduleElement.querySelectorAll('.accordion-header'));
        
        // Check sequential pairs of lessons
        for (let i = 0; i < lessonHeaders.length - 1; i++) {
            const currentHeader = lessonHeaders[i];
            const nextHeader = lessonHeaders[i + 1];
            
            // Check if current is completed but next is locked
            const currentStatus = currentHeader.querySelector('.status')?.textContent;
            const nextStatus = nextHeader.querySelector('.status')?.textContent;
            
            if (currentStatus === 'Completed' && nextStatus === 'Locked') {
                // Fix: Unlock the next lesson
                const nextStatusElement = nextHeader.querySelector('.status');
                if (nextStatusElement) {
                    console.log(`Module Progression Fix: Fixing orphaned lesson in module ${moduleId}`);
                    nextStatusElement.textContent = 'Start';
                    nextStatusElement.className = 'status';
                }
            }
        }
    });
}

/**
 * Set up a mutation observer to fix dynamically added content
 */
function setupMutationObserver() {
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        // Check if relevant elements have been added or modified
        let needsFix = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && 
                           (node.classList.contains('accordion-header') || 
                            node.classList.contains('accordion-content') ||
                            node.classList.contains('module-container'))) {
                            needsFix = true;
                        }
                    }
                });
            }
        });
        
        // Apply fixes if needed
        if (needsFix) {
            console.log('Module Progression Fix: DOM changes detected, reapplying fixes...');
            initModuleProgressionFix();
        }
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    console.log('Module Progression Fix: Mutation observer setup complete');
}
