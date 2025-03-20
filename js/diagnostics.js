/**
 * PlainID Training Course - Diagnostics Script
 * 
 * This script checks for issues in the course platform by:
 * 1. Verifying all required components are loaded
 * 2. Testing functionality of key features
 * 3. Checking for JavaScript errors
 * 4. Validating DOM structure integrity
 */

const PlainIDDiagnostics = {
    // Log container for diagnostic messages
    log: [],
    
    // Run all diagnostics
    runAll: function() {
        console.log('%c PlainID Course Diagnostics', 'background: #0073e6; color: white; padding: 5px 10px; font-size: 16px; font-weight: bold;');
        
        this.checkComponents();
        this.checkDOMStructure();
        this.testUserProgress();
        this.testEventSystem();
        this.checkLocalStorage();
        this.checkAccessibility();
        
        // Print summary
        this.printSummary();
    },
    
    // Log a diagnostic message
    logMessage: function(type, message, detail = '') {
        const logEntry = {
            type: type, // 'info', 'warning', 'error', 'success'
            message: message,
            detail: detail,
            timestamp: new Date().toISOString()
        };
        
        this.log.push(logEntry);
        
        // Also log to console with appropriate styling
        let style = '';
        switch(type) {
            case 'error':
                style = 'color: #dc3545; font-weight: bold;';
                console.error(`[DIAGNOSTIC ERROR] ${message}`, detail);
                break;
            case 'warning':
                style = 'color: #ffc107; font-weight: bold;';
                console.warn(`[DIAGNOSTIC WARNING] ${message}`, detail);
                break;
            case 'success':
                style = 'color: #28a745; font-weight: bold;';
                console.log(`%c[DIAGNOSTIC SUCCESS] ${message}`, style, detail);
                break;
            default:
                style = 'color: #0073e6;';
                console.log(`%c[DIAGNOSTIC INFO] ${message}`, style, detail);
                break;
        }
    },
    
    // Check if all components are available
    checkComponents: function() {
        this.logMessage('info', 'Checking components...');
        
        const requiredComponents = [
            { name: 'PlainIDCourse', global: 'PlainIDCourse' },
            { name: 'QuizManager', global: 'quizManager' }
        ];
        
        const optionalComponents = [
            { name: 'ModuleNavigator', global: 'moduleNavigator' },
            { name: 'CertificateGenerator', global: 'certificateGenerator' },
            { name: 'InteractiveContentManager', global: 'interactiveContent' },
            { name: 'CourseAnalytics', global: 'courseAnalytics' },
            { name: 'PersonalizedLearningPath', global: 'personalizedLearningPath' },
            { name: 'AccessibilityManager', global: 'accessibilityManager' },
            { name: 'InteractiveDiagrams', global: 'interactiveDiagrams' },
            { name: 'AchievementSystem', global: 'achievementSystem' }
        ];
        
        // Check required components
        let missingRequired = false;
        requiredComponents.forEach(component => {
            if (missingRequired) {
            this.logMessage('error', 'Missing required components. The course may not function correctly.');
        } else {
            this.logMessage('success', 'All required components are available.');
        }
        
        // Check optional components
        let availableOptional = 0;
        optionalComponents.forEach(component => {
            if (window[component.global] !== undefined) {
                this.logMessage('success', `Optional component available: ${component.name}`);
                availableOptional++;
            } else {
                this.logMessage('warning', `Optional component missing: ${component.name}`, 'This may limit some functionality but is not critical.');
            }
        });
        
        const optionalRatio = `${availableOptional}/${optionalComponents.length}`;
        this.logMessage('info', `Optional components available: ${optionalRatio}`);
    },
    
    // Check DOM structure integrity
    checkDOMStructure: function() {
        this.logMessage('info', 'Checking DOM structure...');
        
        // Check for critical elements
        const criticalElements = [
            { selector: '.module-container', name: 'Module containers' },
            { selector: '.accordion-header', name: 'Lesson headers' },
            { selector: '.quiz-container', name: 'Quiz containers' }
        ];
        
        criticalElements.forEach(element => {
            const elements = document.querySelectorAll(element.selector);
            if (elements.length === 0) {
                this.logMessage('error', `Missing critical DOM elements: ${element.name}`, 'These elements are required for course functionality.');
            } else {
                this.logMessage('success', `Found ${elements.length} ${element.name}`);
            }
        });
        
        // Check for broken links or images
        const links = document.querySelectorAll('a[href]');
        let brokenLinks = 0;
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' || href === 'javascript:void(0)') {
                // Skip placeholder links
                return;
            }
            
            if (href.startsWith('#')) {
                // Check internal link
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (!target) {
                    brokenLinks++;
                    this.logMessage('warning', `Broken internal link: ${href}`, `Link text: ${link.textContent.trim()}`);
                }
            }
        });
        
        if (brokenLinks > 0) {
            this.logMessage('warning', `Found ${brokenLinks} broken internal links.`);
        } else {
            this.logMessage('success', 'No broken internal links detected.');
        }
        
        // Check for broken images
        const images = document.querySelectorAll('img');
        let brokenImages = 0;
        
        images.forEach(img => {
            if (!img.complete || img.naturalHeight === 0) {
                brokenImages++;
                this.logMessage('warning', `Broken image: ${img.src}`, `Alt text: ${img.alt || 'No alt text'}`);
            }
        });
        
        if (brokenImages > 0) {
            this.logMessage('warning', `Found ${brokenImages} broken images.`);
        } else {
            this.logMessage('success', 'No broken images detected.');
        }
    },
    
    // Test user progress functionality
    testUserProgress: function() {
        this.logMessage('info', 'Testing user progress functionality...');
        
        // Check if progress tracking is available
        if (typeof window.markLessonComplete !== 'function') {
            this.logMessage('error', 'Progress tracking function (markLessonComplete) is missing.', 'Progress will not be properly saved.');
            return;
        }
        
        // Check if PlainIDCourse state has user progress
        if (!window.PlainIDCourse || !window.PlainIDCourse.state || !window.PlainIDCourse.state.userProgress) {
            this.logMessage('error', 'User progress state is missing.', 'Progress will not be properly tracked.');
            return;
        }
        
        // Check progress structure
        const progress = window.PlainIDCourse.state.userProgress;
        
        if (!progress.modules || typeof progress.modules !== 'object') {
            this.logMessage('error', 'User progress is missing modules object.', 'Module completion cannot be tracked.');
            return;
        }
        
        // Test saving and loading progress
        try {
            // Create a temporary test value
            const testKey = 'plainid_diagnostics_test';
            const testValue = { test: 'value', timestamp: Date.now() };
            
            // Save to localStorage
            localStorage.setItem(testKey, JSON.stringify(testValue));
            
            // Read back
            const readValue = JSON.parse(localStorage.getItem(testKey));
            
            // Clean up
            localStorage.removeItem(testKey);
            
            if (readValue.test === testValue.test) {
                this.logMessage('success', 'Progress persistence test passed.', 'LocalStorage is working correctly.');
            } else {
                this.logMessage('error', 'Progress persistence test failed.', 'Data was not correctly stored and retrieved.');
            }
        } catch (error) {
            this.logMessage('error', 'Progress persistence test failed with an exception.', error.message);
        }
    },
    
    // Test event system
    testEventSystem: function() {
        this.logMessage('info', 'Testing event system...');
        
        // Define test events
        const testEvents = [
            'lesson-completed',
            'module-completed',
            'profile-updated',
            'achievement-unlocked'
        ];
        
        // Flag to track if listeners were triggered
        let eventsTriggered = {};
        
        // Create test listeners for each event
        testEvents.forEach(eventName => {
            eventsTriggered[eventName] = false;
            
            const listener = function(event) {
                eventsTriggered[eventName] = true;
                document.removeEventListener(eventName, listener);
            };
            
            document.addEventListener(eventName, listener);
        });
        
        // Trigger test events
        testEvents.forEach(eventName => {
            // Create appropriate detail object based on event type
            let detail = {};
            
            switch(eventName) {
                case 'lesson-completed':
                    detail = { moduleId: 'test', lessonId: 'test' };
                    break;
                case 'module-completed':
                    detail = { moduleId: 'test' };
                    break;
                case 'profile-updated':
                    detail = { profile: { test: 'value' } };
                    break;
                case 'achievement-unlocked':
                    detail = { achievement: { id: 'test', title: 'Test Achievement' } };
                    break;
            }
            
            // Dispatch the event
            document.dispatchEvent(new CustomEvent(eventName, { detail }));
        });
        
        // Check if all events were triggered
        let allEventsWorking = true;
        
        testEvents.forEach(eventName => {
            if (eventsTriggered[eventName]) {
                this.logMessage('success', `Event system working for: ${eventName}`);
            } else {
                this.logMessage('error', `Event system not working for: ${eventName}`, 'Events are critical for component communication.');
                allEventsWorking = false;
            }
        });
        
        if (allEventsWorking) {
            this.logMessage('success', 'Event system is functioning correctly.');
        } else {
            this.logMessage('error', 'Event system has issues. Some components may not communicate properly.');
        }
    },
    
    // Check localStorage usage and capacity
    checkLocalStorage: function() {
        this.logMessage('info', 'Checking localStorage...');
        
        // Check if localStorage is available
        if (typeof localStorage === 'undefined') {
            this.logMessage('error', 'localStorage is not available. Progress cannot be saved.', 'This may be due to browser settings or private browsing mode.');
            return;
        }
        
        // Check existing course data
        const courseKeys = [
            'plainidCourseProgress',
            'plainidUserProfile',
            'plainidAchievements',
            'courseAnalytics'
        ];
        
        let dataFound = 0;
        
        courseKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                dataFound++;
                try {
                    const data = JSON.parse(value);
                    const size = new Blob([value]).size;
                    this.logMessage('success', `Found data for ${key} (${this.formatSize(size)})`);
                } catch (error) {
                    this.logMessage('warning', `Found data for ${key} but it's not valid JSON.`, error.message);
                }
            } else {
                this.logMessage('info', `No data found for ${key}.`);
            }
        });
        
        if (dataFound === 0) {
            this.logMessage('warning', 'No course data found in localStorage. This may be a new installation or data has been cleared.');
        }
        
        // Check localStorage capacity
        try {
            // Try to estimate available space
            const testKey = 'plainid_diagnostics_space_test';
            const chunk = 'X'.repeat(1024); // 1KB chunk
            let totalChunks = 0;
            
            try {
                // Keep adding chunks until we get an error
                for (let i = 0; i < 10000; i++) {
                    localStorage.setItem(testKey + i, chunk);
                    totalChunks++;
                }
            } catch (e) {
                // Storage is full
            } finally {
                // Clean up
                for (let i = 0; i < totalChunks; i++) {
                    localStorage.removeItem(testKey + i);
                }
            }
            
            const estimatedCapacity = totalChunks * 1024;
            this.logMessage('info', `Estimated localStorage capacity: ${this.formatSize(estimatedCapacity)}`);
            
            if (estimatedCapacity < 50 * 1024) {
                this.logMessage('warning', 'Available localStorage capacity is low.', 'This may cause issues with saving progress for lengthy courses.');
            } else {
                this.logMessage('success', 'Sufficient localStorage capacity available.');
            }
        } catch (error) {
            this.logMessage('warning', 'Unable to estimate localStorage capacity.', error.message);
        }
    },
    
    // Check accessibility features
    checkAccessibility: function() {
        this.logMessage('info', 'Checking accessibility features...');
        
        // Check for accessibility manager
        if (typeof window.accessibilityManager === 'undefined') {
            this.logMessage('warning', 'AccessibilityManager is not available.', 'Accessibility features may be limited.');
        } else {
            this.logMessage('success', 'AccessibilityManager is available.');
        }
        
        // Check basic accessibility attributes
        
        // Check images for alt text
        const images = document.querySelectorAll('img');
        let imagesWithoutAlt = 0;
        
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                imagesWithoutAlt++;
                this.logMessage('warning', `Image without alt text: ${img.src}`, 'Screen readers will not be able to describe this image.');
            }
        });
        
        if (imagesWithoutAlt > 0) {
            this.logMessage('warning', `Found ${imagesWithoutAlt} images without alt text.`);
        } else {
            this.logMessage('success', 'All images have alt text.');
        }
        
        // Check form inputs for labels
        const inputs = document.querySelectorAll('input, select, textarea');
        let inputsWithoutLabels = 0;
        
        inputs.forEach(input => {
            // Skip hidden or button inputs
            if (input.type === 'hidden' || input.type === 'button' || input.type === 'submit') {
                return;
            }
            
            // Check if input has a label
            const id = input.getAttribute('id');
            if (!id || !document.querySelector(`label[for="${id}"]`)) {
                // Check for aria-label or aria-labelledby
                if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                    inputsWithoutLabels++;
                    this.logMessage('warning', `Form input without label: ${input.name || 'unnamed input'}`, 'Screen readers will not be able to identify this input field.');
                }
            }
        });
        
        if (inputsWithoutLabels > 0) {
            this.logMessage('warning', `Found ${inputsWithoutLabels} inputs without accessible labels.`);
        } else {
            this.logMessage('success', 'All form inputs have accessible labels.');
        }
        
        // Check for skip links
        const skipLink = document.querySelector('.skip-link, [role="navigation"] a:first-child');
        if (!skipLink) {
            this.logMessage('warning', 'No skip navigation link found.', 'Keyboard users may have difficulty skipping to main content.');
        } else {
            this.logMessage('success', 'Skip navigation link found.');
        }
        
        // Check color contrast (simple check for CSS variables)
        const styles = getComputedStyle(document.documentElement);
        const backgroundColor = styles.getPropertyValue('--light').trim();
        const textColor = styles.getPropertyValue('--text').trim();
        
        if (!backgroundColor || !textColor) {
            this.logMessage('info', 'Unable to check color contrast - CSS variables not detected.');
        } else {
            this.logMessage('info', 'Color scheme variables detected. Manual verification of contrast ratios is recommended.');
        }
    },
    
    // Format file size in human-readable format
    formatSize: function(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    },
    
    // Print summary of diagnostics
    printSummary: function() {
        // Count issues by type
        let counts = {
            error: 0,
            warning: 0,
            info: 0,
            success: 0
        };
        
        this.log.forEach(entry => {
            counts[entry.type]++;
        });
        
        console.log('%c PlainID Course Diagnostics Summary', 'background: #0073e6; color: white; padding: 5px 10px; font-size: 16px; font-weight: bold;');
        console.log(`%c Errors: ${counts.error}`, 'color: #dc3545; font-weight: bold;');
        console.log(`%c Warnings: ${counts.warning}`, 'color: #ffc107; font-weight: bold;');
        console.log(`%c Info: ${counts.info}`, 'color: #0073e6;');
        console.log(`%c Success: ${counts.success}`, 'color: #28a745; font-weight: bold;');
        
        if (counts.error === 0 && counts.warning === 0) {
            console.log('%c ✅ No issues detected! The course should function correctly.', 'color: #28a745; font-weight: bold; font-size: 14px;');
        } else if (counts.error === 0) {
            console.log('%c ⚠️ Some warnings detected, but no critical errors. The course should function with minor issues.', 'color: #ffc107; font-weight: bold; font-size: 14px;');
        } else {
            console.log('%c ❌ Critical errors detected. The course may not function correctly.', 'color: #dc3545; font-weight: bold; font-size: 14px;');
        }
        
        // Create in-page report if possible
        this.createVisualReport();
    },
    
    // Create visual diagnostics report
    createVisualReport: function() {
        // Only create if we have errors or warnings
        const hasIssues = this.log.some(entry => entry.type === 'error' || entry.type === 'warning');
        
        if (!hasIssues) {
            return;
        }
        
        // Create report container
        const reportContainer = document.createElement('div');
        reportContainer.className = 'diagnostics-report';
        reportContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 20px;
            max-width: 400px;
            max-height: 500px;
            overflow-y: auto;
            z-index: 10000;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        
        // Count issues by type
        let counts = {
            error: 0,
            warning: 0,
            info: 0,
            success: 0
        };
        
        this.log.forEach(entry => {
            counts[entry.type]++;
        });
        
        // Create report content
        reportContainer.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #333;">Course Diagnostics Report</h3>
            <p style="margin-top: 0; margin-bottom: 15px; color: #666;">Issues detected that may affect course functionality</p>
            
            <div style="display: flex; margin-bottom: 15px;">
                <div style="flex: 1; text-align: center; padding: 8px; background-color: #ffe6e6; border-radius: 4px; margin-right: 5px;">
                    <div style="font-size: 20px; font-weight: bold; color: #dc3545;">${counts.error}</div>
                    <div style="font-size: 12px; color: #dc3545;">Errors</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 8px; background-color: #fff8e1; border-radius: 4px; margin-left: 5px;">
                    <div style="font-size: 20px; font-weight: bold; color: #ffc107;">${counts.warning}</div>
                    <div style="font-size: 12px; color: #ffc107;">Warnings</div>
                </div>
            </div>
            
            <div class="issues-list" style="border-top: 1px solid #eee; padding-top: 15px;">
                ${this.log
                    .filter(entry => entry.type === 'error' || entry.type === 'warning')
                    .map(entry => `
                        <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #eee;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                                <span style="
                                    display: inline-block; 
                                    width: 10px; 
                                    height: 10px; 
                                    border-radius: 50%; 
                                    margin-right: 8px;
                                    background-color: ${entry.type === 'error' ? '#dc3545' : '#ffc107'};
                                "></span>
                                <span style="
                                    font-weight: bold; 
                                    color: ${entry.type === 'error' ? '#dc3545' : '#ffc107'};
                                ">${entry.type.toUpperCase()}</span>
                            </div>
                            <div style="font-weight: 500; margin-bottom: 3px; color: #333;">${entry.message}</div>
                            ${entry.detail ? `<div style="font-size: 12px; color: #666;">${entry.detail}</div>` : ''}
                        </div>
                    `).join('')
                }
            </div>
            
            <button id="close-diagnostics-report" style="
                background-color: #f8f9fa;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 6px 12px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 14px;
                color: #333;
            ">Close Report</button>
        `;
        
        // Add to document
        document.body.appendChild(reportContainer);
        
        // Add close button functionality
        const closeButton = document.getElementById('close-diagnostics-report');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                reportContainer.remove();
            });
        }
    }
};

// Make diagnostics available globally
window.PlainIDDiagnostics = PlainIDDiagnostics;

// Auto-run diagnostics if the URL includes a diagnostic flag
if (location.search.includes('diagnostics=true') || location.hash.includes('diagnostics')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a bit for everything to initialize
        setTimeout(function() {
            PlainIDDiagnostics.runAll();
        }, 1000);
    });
}

/**
 * To run diagnostics, either:
 * 1. Add ?diagnostics=true to the URL
 * 2. Add #diagnostics to the URL
 * 3. Or call window.PlainIDDiagnostics.runAll() from the console
 */window[component.global] === undefined) {
                this.logMessage('error', `Required component missing: ${component.name}`, 'This component is needed for core functionality.');
                missingRequired = true;
            } else {
                this.logMessage('success', `Required component available: ${component.name}`);
            }
        });
        
        if (
