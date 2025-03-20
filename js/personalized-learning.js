/**
 * Personalized Learning Path System for PlainID Training Course
 * 
 * This module customizes the learning experience based on user role, 
 * industry, and learning progress to provide tailored pathways.
 */

class PersonalizedLearningPath {
    constructor() {
        this.userProfile = {
            role: '',
            industry: '',
            experience: '',
            learningGoals: [],
            learningStyle: '',
            completedModules: [],
            skillLevels: {}
        };
        
        this.pathOptions = {
            roles: [
                'Developer', 
                'Security Professional', 
                'System Administrator',
                'Solution Architect',
                'Business Analyst',
                'Executive'
            ],
            industries: [
                'Financial Services',
                'Healthcare',
                'Government',
                'Retail',
                'Manufacturing',
                'Technology',
                'Telecommunications',
                'Energy'
            ],
            experienceLevels: [
                'Beginner',
                'Intermediate',
                'Advanced'
            ],
            learningGoals: [
                'Implement PlainID',
                'Integrate with existing systems',
                'Design authorization policies',
                'Understand basic concepts',
                'Prepare for certification',
                'Evaluate for business needs'
            ],
            learningStyles: [
                'Visual',
                'Reading/Writing',
                'Interactive',
                'Practical'
            ]
        };
        
        this.pathSequences = {
            'Developer': [1, 2, 4, 3, 5, 6],
            'Security Professional': [1, 3, 2, 5, 4, 6],
            'System Administrator': [1, 2, 4, 5, 3, 6],
            'Solution Architect': [1, 2, 3, 4, 5, 6],
            'Business Analyst': [1, 3, 6, 2, 4, 5],
            'Executive': [1, 6, 3, 5, 2, 4]
        };
        
        this.industrySpecificContent = {
            'Financial Services': {
                examples: 'banking-examples',
                caseStudies: 'financial-case-studies',
                regulations: ['PCI-DSS', 'GLBA', 'SOX']
            },
            'Healthcare': {
                examples: 'healthcare-examples',
                caseStudies: 'healthcare-case-studies',
                regulations: ['HIPAA', 'HITECH']
            },
            'Government': {
                examples: 'government-examples',
                caseStudies: 'government-case-studies',
                regulations: ['FISMA', 'FedRAMP']
            },
            'Retail': {
                examples: 'retail-examples',
                caseStudies: 'retail-case-studies',
                regulations: ['PCI-DSS', 'CCPA', 'GDPR']
            },
            'Manufacturing': {
                examples: 'manufacturing-examples',
                caseStudies: 'manufacturing-case-studies',
                regulations: ['ISO 27001', 'NIST']
            },
            'Technology': {
                examples: 'technology-examples',
                caseStudies: 'technology-case-studies',
                regulations: ['SOC 2', 'ISO 27001', 'GDPR']
            },
            'Telecommunications': {
                examples: 'telecom-examples',
                caseStudies: 'telecom-case-studies',
                regulations: ['CPNI', 'GDPR']
            },
            'Energy': {
                examples: 'energy-examples',
                caseStudies: 'energy-case-studies',
                regulations: ['NERC CIP', 'ISO 27001']
            }
        };
        
        // Module importance weights by role (0-10 scale)
        this.moduleImportance = {
            'Developer': {
                1: 7, // Core Concepts
                2: 9, // Architecture
                3: 6, // Policy Modeling
                4: 10, // Implementation
                5: 8, // Advanced Features
                6: 5  // Best Practices
            },
            'Security Professional': {
                1: 8,
                2: 7,
                3: 9,
                4: 6,
                5: 8,
                6: 9
            },
            'System Administrator': {
                1: 7,
                2: 9,
                3: 6,
                4: 8,
                5: 9,
                6: 7
            },
            'Solution Architect': {
                1: 8,
                2: 10,
                3: 9,
                4: 7,
                5: 8,
                6: 8
            },
            'Business Analyst': {
                1: 9,
                2: 6,
                3: 8,
                4: 5,
                5: 7,
                6: 10
            },
            'Executive': {
                1: 9,
                2: 5,
                3: 7,
                4: 3,
                5: 6,
                6: 10
            }
        };
        
        this.skillCategories = {
            'core-concepts': {
                name: 'Core Authorization Concepts',
                modules: [1],
                description: 'Understanding of fundamental authorization principles'
            },
            'architecture': {
                name: 'PlainID Architecture',
                modules: [2],
                description: 'Knowledge of PlainID platform components and design'
            },
            'policy-design': {
                name: 'Policy Modeling & Design',
                modules: [3],
                description: 'Ability to design effective authorization policies'
            },
            'implementation': {
                name: 'Implementation Skills',
                modules: [4],
                description: 'Hands-on implementation and integration capabilities'
            },
            'advanced-features': {
                name: 'Advanced Features',
                modules: [5],
                description: 'Expertise in advanced PlainID capabilities'
            },
            'best-practices': {
                name: 'Best Practices',
                modules: [6],
                description: 'Knowledge of governance and optimization techniques'
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize the personalized learning path system
     */
    init() {
        // Load user profile if it exists
        this.loadUserProfile();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // If no profile exists, prompt for profile creation
        if (!this.userProfileExists()) {
            this.promptProfileCreation();
        } else {
            // Apply personalization based on existing profile
            this.applyPersonalization();
        }
    }
    
    /**
     * Load user profile from local storage
     */
    loadUserProfile() {
        try {
            const storedProfile = localStorage.getItem('plainidUserProfile');
            if (storedProfile) {
                this.userProfile = JSON.parse(storedProfile);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }
    
    /**
     * Setup event listeners for the learning path system
     */
    setupEventListeners() {
        // Listen for profile form submission
        document.addEventListener('submit-profile', (event) => {
            this.saveUserProfile(event.detail);
        });
        
        // Listen for module completion to update skill levels
        document.addEventListener('module-completed', (event) => {
            this.updateSkillLevels(event.detail.moduleId);
        });
        
        // Listen for lesson completion to track progress
        document.addEventListener('lesson-completed', (event) => {
            this.trackLessonProgress(event.detail.moduleId, event.detail.lessonId);
        });
        
        // Listen for profile update requests
        document.addEventListener('update-profile', () => {
            this.promptProfileCreation(true);
        });
    }
    
    /**
     * Check if user profile exists
     * @returns {boolean} Whether a user profile exists
     */
    userProfileExists() {
        return this.userProfile.role !== '' && this.userProfile.industry !== '';
    }
    
    /**
     * Prompt user to create a profile
     * @param {boolean} isUpdate - Whether this is an update to an existing profile
     */
    promptProfileCreation(isUpdate = false) {
        // Create profile form overlay
        const overlay = document.createElement('div');
        overlay.className = 'profile-overlay';
        overlay.id = 'profile-overlay';
        
        const formTitle = isUpdate ? 'Update Your Learning Profile' : 'Personalize Your Learning Experience';
        const formDescription = isUpdate ? 
            'Update your profile to get a more tailored learning experience.' : 
            'Tell us about yourself so we can customize your learning path.';
        const submitButtonText = isUpdate ? 'Update Profile' : 'Start Learning';
        
        // Build form HTML
        let html = `
            <div class="profile-modal">
                <div class="profile-modal-header">
                    <h3>${formTitle}</h3>
                    ${isUpdate ? '<button class="close-btn" id="close-profile-form">&times;</button>' : ''}
                </div>
                <div class="profile-modal-body">
                    <p class="form-description">${formDescription}</p>
                    <form id="profile-form" class="profile-form">
                        <div class="form-group">
                            <label for="user-role">Your Role</label>
                            <select id="user-role" name="role" required>
                                <option value="" disabled selected>Select your role</option>
        `;
        
        // Add role options
        this.pathOptions.roles.forEach(role => {
            const selected = this.userProfile.role === role ? 'selected' : '';
            html += `<option value="${role}" ${selected}>${role}</option>`;
        });
        
        html += `
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="user-industry">Your Industry</label>
                            <select id="user-industry" name="industry" required>
                                <option value="" disabled selected>Select your industry</option>
        `;
        
        // Add industry options
        this.pathOptions.industries.forEach(industry => {
            const selected = this.userProfile.industry === industry ? 'selected' : '';
            html += `<option value="${industry}" ${selected}>${industry}</option>`;
        });
        
        html += `
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="user-experience">Experience with Access Control</label>
                            <select id="user-experience" name="experience" required>
                                <option value="" disabled selected>Select your experience level</option>
        `;
        
        // Add experience options
        this.pathOptions.experienceLevels.forEach(level => {
            const selected = this.userProfile.experience === level ? 'selected' : '';
            html += `<option value="${level}" ${selected}>${level}</option>`;
        });
        
        html += `
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Your Learning Goals (select up to 3)</label>
                            <div class="checkbox-group">
        `;
        
        // Add learning goals checkboxes
        this.pathOptions.learningGoals.forEach(goal => {
            const checked = this.userProfile.learningGoals && this.userProfile.learningGoals.includes(goal) ? 'checked' : '';
            html += `
                <div class="checkbox-item">
                    <input type="checkbox" id="goal-${goal.replace(/\s+/g, '-').toLowerCase()}" name="learningGoals" value="${goal}" ${checked}>
                    <label for="goal-${goal.replace(/\s+/g, '-').toLowerCase()}">${goal}</label>
                </div>
            `;
        });
        
        html += `
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Your Preferred Learning Style</label>
                            <div class="radio-group">
        `;
        
        // Add learning style radio buttons
        this.pathOptions.learningStyles.forEach(style => {
            const checked = this.userProfile.learningStyle === style ? 'checked' : '';
            html += `
                <div class="radio-item">
                    <input type="radio" id="style-${style.replace(/\s+/g, '-').toLowerCase()}" name="learningStyle" value="${style}" ${checked}>
                    <label for="style-${style.replace(/\s+/g, '-').toLowerCase()}">${style}</label>
                </div>
            `;
        });
        
        html += `
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">${submitButtonText}</button>
                            ${isUpdate ? '<button type="button" class="btn btn-secondary" id="cancel-profile-update">Cancel</button>' : ''}
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        // Add necessary styles
        this.addProfileStyles();
        
        // Add form event listeners
        this.setupProfileFormListeners(isUpdate);
    }
    
    /**
     * Set up event listeners for the profile form
     * @param {boolean} isUpdate - Whether this is an update to an existing profile
     */
    setupProfileFormListeners(isUpdate) {
        const form = document.getElementById('profile-form');
        if (!form) return;
        
        // Form submission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const profileData = {
                role: formData.get('role'),
                industry: formData.get('industry'),
                experience: formData.get('experience'),
                learningGoals: formData.getAll('learningGoals'),
                learningStyle: formData.get('learningStyle')
            };
            
            // Save profile
            this.saveUserProfile(profileData);
            
            // Close overlay
            this.closeProfileForm();
            
            // Provide feedback to user
            this.showProfileFeedback(isUpdate);
        });
        
        // Close button for update mode
        const closeButton = document.getElementById('close-profile-form');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeProfileForm();
            });
        }
        
        // Cancel button for update mode
        const cancelButton = document.getElementById('cancel-profile-update');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.closeProfileForm();
            });
        }
        
        // Limit learning goals selection to 3
        const goalCheckboxes = document.querySelectorAll('input[name="learningGoals"]');
        goalCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedGoals = document.querySelectorAll('input[name="learningGoals"]:checked');
                if (checkedGoals.length > 3) {
                    checkbox.checked = false;
                    alert('Please select up to 3 learning goals.');
                }
            });
        });
    }
    
    /**
     * Close the profile form overlay
     */
    closeProfileForm() {
        const overlay = document.getElementById('profile-overlay');
        if (overlay) {
            // Add closing animation
            overlay.classList.add('closing');
            
            // Remove after animation completes
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }
    
    /**
     * Show feedback after profile submission
     * @param {boolean} isUpdate - Whether this is an update to an existing profile
     */
    showProfileFeedback(isUpdate) {
        // Create notification
        const message = isUpdate ? 
            'Your learning profile has been updated. Your path has been personalized.' : 
            'Your learning path has been personalized based on your profile.';
        
        // Show notification using the notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, 'success', 5000);
        } else {
            alert(message);
        }
        
        // Highlight the personalized elements
        this.highlightPersonalizedElements();
    }
    
    /**
     * Highlight personalized elements with a brief animation
     */
    highlightPersonalizedElements() {
        // Find personalized elements
        const personalizedElements = document.querySelectorAll('.personalized-content');
        
        // Add highlight animation class
        personalizedElements.forEach(element => {
            element.classList.add('highlight-personalized');
            
            // Remove class after animation completes
            setTimeout(() => {
                element.classList.remove('highlight-personalized');
            }, 2000);
        });
    }
    
    /**
     * Save user profile to local storage and update in-memory profile
     * @param {Object} profileData - The user profile data to save
     */
    saveUserProfile(profileData) {
        // Merge with existing profile (keeping progress data)
        this.userProfile = {
            ...this.userProfile,
            ...profileData
        };
        
        // Initialize skill levels if not set
        if (!this.userProfile.skillLevels || Object.keys(this.userProfile.skillLevels).length === 0) {
            this.userProfile.skillLevels = {
                'core-concepts': 0,
                'architecture': 0,
                'policy-design': 0,
                'implementation': 0,
                'advanced-features': 0,
                'best-practices': 0
            };
        }
        
        // Save to localStorage
        localStorage.setItem('plainidUserProfile', JSON.stringify(this.userProfile));
        
        // Apply personalization based on new profile
        this.applyPersonalization();
    }
    
    /**
     * Apply personalization based on user profile
     */
    applyPersonalization() {
        if (!this.userProfileExists()) return;
        
        // Reorder modules based on role
        this.reorderModules();
        
        // Inject industry-specific content
        this.injectIndustryContent();
        
        // Adjust content depth based on experience level
        this.adjustContentDepth();
        
        // Highlight content based on learning goals
        this.highlightRelevantContent();
        
        // Adapt content based on learning style
        this.adaptToLearningStyle();
        
        // Update learning path visualization
        this.updateLearningPathDisplay();
        
        // Show recommended modules based on current progress
        this.showRecommendations();
    }
    
    /**
     * Reorder modules based on user role
     */
    reorderModules() {
        const { role } = this.userProfile;
        if (!role || !this.pathSequences[role]) return;
        
        const moduleSequence = this.pathSequences[role];
        const modulesContainer = document.getElementById('modules');
        if (!modulesContainer) return;
        
        // Get all module containers
        const moduleElements = modulesContainer.querySelectorAll('.module-container');
        if (moduleElements.length === 0) return;
        
        // Create a document fragment for reordering
        const fragment = document.createDocumentFragment();
        
        // Add modules in the custom sequence
        moduleSequence.forEach(moduleId => {
            const moduleElement = modulesContainer.querySelector(`#module${moduleId}`);
            if (moduleElement) {
                // Clone the module element
                const clonedModule = moduleElement.cloneNode(true);
                
                // Add personalized marker
                clonedModule.classList.add('personalized-content');
                clonedModule.setAttribute('data-original-order', moduleId);
                
                // Add to fragment
                fragment.appendChild(clonedModule);
                
                // Remove original
                moduleElement.remove();
            }
        });
        
        // Append all modules in new order
        modulesContainer.appendChild(fragment);
        
        // Re-attach event listeners
        this.reattachEventListeners();
        
        // Add priority indicators to modules based on importance
        if (this.moduleImportance[role]) {
            Object.entries(this.moduleImportance[role]).forEach(([moduleId, importance]) => {
                const moduleElement = modulesContainer.querySelector(`#module${moduleId}`);
                if (moduleElement) {
                    // Add importance indicator
                    const header = moduleElement.querySelector('.module-header');
                    if (header) {
                        // Remove any existing indicator
                        const existingIndicator = header.querySelector('.importance-indicator');
                        if (existingIndicator) {
                            existingIndicator.remove();
                        }
                        
                        // Create new indicator based on importance
                        let indicatorClass = '';
                        let indicatorText = '';
                        
                        if (importance >= 9) {
                            indicatorClass = 'high-priority';
                            indicatorText = 'High Priority';
                        } else if (importance >= 7) {
                            indicatorClass = 'medium-priority';
                            indicatorText = 'Recommended';
                        } else if (importance >= 5) {
                            indicatorClass = 'low-priority';
                            indicatorText = 'Optional';
                        }
                        
                        if (indicatorClass) {
                            const indicator = document.createElement('span');
                            indicator.className = `importance-indicator ${indicatorClass}`;
                            indicator.textContent = indicatorText;
                            header.appendChild(indicator);
                        }
                    }
                }
            });
        }
    }
    
    /**
     * Reattach event listeners after DOM manipulation
     */
    reattachEventListeners() {
        // Reinitialize accordions
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        if (typeof initializeAccordions === 'function') {
            initializeAccordions(accordionHeaders);
        } else {
            // Basic accordion functionality
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    this.classList.toggle('active');
                    content.classList.toggle('active');
                });
            });
        }
        
        // Reinitialize module links
        const moduleLinks = document.querySelectorAll('.module-link');
        moduleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleId = link.getAttribute('data-module');
                const moduleElement = document.getElementById(`module${moduleId}`);
                if (moduleElement) {
                    moduleElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    /**
     * Inject industry-specific content
     */
    injectIndustryContent() {
        const { industry } = this.userProfile;
        if (!industry || !this.industrySpecificContent[industry]) return;
        
        const industryData = this.industrySpecificContent[industry];
        
        // Find content containers that should be industry-specific
        const exampleContainers = document.querySelectorAll('.industry-example');
        const caseStudyContainers = document.querySelectorAll('.industry-case-study');
        const regulationContainers = document.querySelectorAll('.industry-regulations');
        
        // Update example containers
        exampleContainers.forEach(container => {
            // Add industry label
            container.innerHTML = `
                <div class="industry-label personalized-content">
                    <span class="industry-icon"></span>
                    <span class="industry-name">${industry} Example</span>
                </div>
                ${container.innerHTML}
            `;
            
            // Add industry-specific class
            container.classList.add(industryData.examples);
            container.classList.add('personalized-content');
        });
        
        // Update case study containers
        caseStudyContainers.forEach(container => {
            // Add industry label
            container.innerHTML = `
                <div class="industry-label personalized-content">
                    <span class="industry-icon"></span>
                    <span class="industry-name">${industry} Case Study</span>
                </div>
                ${container.innerHTML}
            `;
            
            // Add industry-specific class
            container.classList.add(industryData.caseStudies);
            container.classList.add('personalized-content');
        });
        
        // Update regulation containers
        regulationContainers.forEach(container => {
            // Create regulation list
            let regulationsList = `
                <div class="industry-label personalized-content">
                    <span class="industry-icon"></span>
                    <span class="industry-name">Relevant ${industry} Regulations</span>
                </div>
                <ul class="regulations-list personalized-content">
            `;
            
            // Add regulations
            industryData.regulations.forEach(regulation => {
                regulationsList += `<li>${regulation}</li>`;
            });
            
            regulationsList += '</ul>';
            
            // Update container
            container.innerHTML = regulationsList;
            container.classList.add('personalized-content');
        });
    }
    
    /**
     * Adjust content depth based on experience level
     */
    adjustContentDepth() {
        const { experience } = this.userProfile;
        if (!experience) return;
        
        // Find expandable content sections
        const advancedSections = document.querySelectorAll('.advanced-content');
        const beginnerSections = document.querySelectorAll('.beginner-content');
        const intermediateSections = document.querySelectorAll('.intermediate-content');
        
        // Show/hide content based on experience level
        switch (experience) {
            case 'Beginner':
                // Show beginner content, hide advanced
                beginnerSections.forEach(section => {
                    section.style.display = 'block';
                    section.classList.add('personalized-content');
                });
                advancedSections.forEach(section => {
                    section.style.display = 'none';
                });
                break;
                
            case 'Intermediate':
                // Show intermediate content
                intermediateSections.forEach(section => {
                    section.style.display = 'block';
                    section.classList.add('personalized-content');
                });
                break;
                
            case 'Advanced':
                // Show all content
                advancedSections.forEach(section => {
                    section.style.display = 'block';
                    section.classList.add('personalized-content');
                });
                break;
        }
        
        // Add expandable toggles for content outside the user's level
        if (experience !== 'Advanced') {
            advancedSections.forEach((section, index) => {
                // Check if toggle already exists
                if (!section.previousElementSibling || !section.previousElementSibling.classList.contains('content-toggle')) {
                    // Create toggle button
                    const toggle = document.createElement('div');
                    toggle.className = 'content-toggle personalized-content';
                    toggle.innerHTML = `
                        <button class="toggle-btn" data-target="advanced-${index}">
                            <span class="toggle-icon">+</span>
                            <span class="toggle-text">Show Advanced Content</span>
                        </button>
                    `;
                    
                    // Insert before the advanced section
                    section.parentNode.insertBefore(toggle, section);
                    
                    // Add click handler
                    toggle.querySelector('.toggle-btn').addEventListener('click', function() {
                        const target = this.getAttribute('data-target');
                        const targetSection = document.querySelector(`.advanced-content[id="${target}"]`) || section;
                        const isVisible = targetSection.style.display !== 'none';
                        
                        // Toggle visibility
                        targetSection.style.display = isVisible ? 'none' : 'block';
                        
                        // Update button text
                        this.querySelector('.toggle-icon').textContent = isVisible ? '+' : '-';
                        this.querySelector('.toggle-text').textContent = isVisible ? 'Show Advanced Content' : 'Hide Advanced Content';
                    });
                    
                    // Add ID to section for targeting
                    section.id = `advanced-${index}`;
                }
            });
        }
    }
    
    /**
     * Highlight content based on learning goals
     */
    highlightRelevantContent() {
        const { learningGoals } = this.userProfile;
        if (!learningGoals || learningGoals.length === 0) return;
        
        // Define content tags related to each learning goal
        const goalContentMap = {
            'Implement PlainID': ['implementation', 'integration', 'deployment'],
            'Integrate with existing systems': ['integration', 'api', 'connector'],
            'Design authorization policies': ['policy', 'modeling', 'design'],
            'Understand basic concepts': ['basics', 'concepts', 'fundamental'],
            'Prepare for certification': ['certification', 'exam', 'assessment'],
            'Evaluate for business needs': ['business', 'evaluation', 'use-case']
        };
        
        // Collect tags for selected goals
        const relevantTags = [];
        learningGoals.forEach(goal => {
            if (goalContentMap[goal]) {
                relevantTags.push(...goalContentMap[goal]);
            }
        });
        
        // Highlight content with matching tags
        relevantTags.forEach(tag => {
            const taggedElements = document.querySelectorAll(`.content-tag-${tag}`);
            taggedElements.forEach(element => {
                element.classList.add('goal-relevant');
                element.classList.add('personalized-content');
                
                // Add visual indicator
                if (!element.querySelector('.relevance-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'relevance-badge';
                    badge.innerHTML = `
                        <span class="badge-icon">★</span>
                        <span class="badge-text">Relevant to your goals</span>
                    `;
                    element.appendChild(badge);
                }
            });
        });
    }
    
    /**
     * Adapt content based on learning style
     */
    adaptToLearningStyle() {
        const { learningStyle } = this.userProfile;
        if (!learningStyle) return;
        
        // Show/hide content based on learning style
        const visualContent = document.querySelectorAll('.visual-learning');
        const readingContent = document.querySelectorAll('.reading-learning');
        const interactiveContent = document.querySelectorAll('.interactive-learning');
        const practicalContent = document.querySelectorAll('.practical-learning');
        
        // Reset all content visibility
        [visualContent, readingContent, interactiveContent, practicalContent].forEach(collection => {
            collection.forEach(element => {
                element.classList.remove('style-emphasized');
            });
        });
        
        // Emphasize preferred style
        switch (learningStyle) {
            case 'Visual':
                visualContent.forEach(element => {
                    element.classList.add('style-emphasized');
                    element.classList.add('personalized-content');
                });
                break;
                
            case 'Reading/Writing':
                readingContent.forEach(element => {
                    element.classList.add('style-emphasized');
                    element.classList.add('personalized-content');
                });
                break;
                
            case 'Interactive':
                interactiveContent.forEach(element => {
                    element.classList.add('style-emphasized');
                    element.classList.add('personalized-content');
                });
                break;
                
            case 'Practical':
                practicalContent.forEach(element => {
                    element.classList.add('style-emphasized');
                    element.classList.add('personalized-content');
                });
                break;
        }
        
        // Add style preference indicator to the page
        this.addStylePreferenceIndicator();
    }
    
    /**
     * Add learning style preference indicator
     */
    addStylePreferenceIndicator() {
        const { learningStyle } = this.userProfile;
        
        // Remove any existing indicator
        const existingIndicator = document.getElementById('learning-style-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.id = 'learning-style-indicator';
        indicator.className = 'learning-style-indicator personalized-content';
        
        let styleIcon = '';
        switch (learningStyle) {
            case 'Visual':
                styleIcon = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"></path></svg>';
                break;
                
            case 'Reading/Writing':
                styleIcon = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"></path></svg>';
                break;
                
            case 'Interactive':
                styleIcon = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z"></path></svg>';
                break;
                
            case 'Practical':
                styleIcon = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>';
                break;
        }
        
        indicator.innerHTML = `
            <div class="style-icon">${styleIcon}</div>
            <div class="style-info">
                <div class="style-name">${learningStyle} Learner</div>
                <div class="style-description">Content optimized for your learning style</div>
            </div>
            <button class="style-toggle" id="toggle-style-optimization">Toggle</button>
        `;
        
        // Add to page
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.appendChild(indicator);
            
            // Add event listener to toggle button
            const toggleButton = document.getElementById('toggle-style-optimization');
            if (toggleButton) {
                toggleButton.addEventListener('click', () => {
                    this.toggleStyleOptimization();
                });
            }
        }
    }
    
    /**
     * Toggle learning style optimization
     */
    toggleStyleOptimization() {
        // Get all style-specific content
        const styleContent = document.querySelectorAll('.visual-learning, .reading-learning, .interactive-learning, .practical-learning');
        
        // Check if optimization is currently on
        const isOptimized = styleContent.length > 0 && styleContent[0].classList.contains('style-emphasized');
        
        // Toggle optimization
        if (isOptimized) {
            // Remove emphasis
            styleContent.forEach(element => {
                element.classList.remove('style-emphasized');
            });
            
            // Update indicator
            const toggleButton = document.getElementById('toggle-style-optimization');
            if (toggleButton) {
                toggleButton.textContent = 'Enable';
            }
            
            const indicator = document.getElementById('learning-style-indicator');
            if (indicator) {
                indicator.classList.add('disabled');
            }
        } else {
            // Re-apply emphasis based on learning style
            this.adaptToLearningStyle();
            
            // Update indicator
            const toggleButton = document.getElementById('toggle-style-optimization');
            if (toggleButton) {
                toggleButton.textContent = 'Disable';
            }
            
            const indicator = document.getElementById('learning-style-indicator');
            if (indicator) {
                indicator.classList.remove('disabled');
            }
        }
    }
    
    /**
     * Update learning path visualization
     */
    updateLearningPathDisplay() {
        // Check if learning path container exists
        let pathContainer = document.getElementById('learning-path-display');
        
        // Create if it doesn't exist
        if (!pathContainer) {
            pathContainer = document.createElement('div');
            pathContainer.id = 'learning-path-display';
            pathContainer.className = 'learning-path-display personalized-content';
            
            // Find a place to add it
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                // Insert after progress container
                const progressContainer = aboutSection.querySelector('.progress-container');
                if (progressContainer) {
                    progressContainer.parentNode.insertBefore(pathContainer, progressContainer.nextSibling);
                } else {
                    // Fallback: insert at the beginning of the section
                    aboutSection.insertBefore(pathContainer, aboutSection.firstChild);
                }
            }
        }
        
        // Get personalized module order
        const { role } = this.userProfile;
        let moduleSequence = [1, 2, 3, 4, 5, 6]; // Default order
        
        if (role && this.pathSequences[role]) {
            moduleSequence = this.pathSequences[role];
        }
        
        // Create path visualization
        let pathHtml = `
            <h3>Your Personalized Learning Path</h3>
            <p>Based on your profile, we've created a customized learning journey:</p>
            <div class="learning-path">
        `;
        
        // Add modules to path
        moduleSequence.forEach((moduleId, index) => {
            // Get module details
            const moduleTitle = this.getModuleTitle(moduleId);
            const moduleCompleted = this.isModuleCompleted(moduleId);
            const moduleStatus = moduleCompleted ? 'completed' : 'pending';
            const isCurrentModule = this.isCurrentModule(moduleId);
            
            pathHtml += `
                <div class="path-step ${moduleStatus} ${isCurrentModule ? 'current' : ''}">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <div class="step-title">${moduleTitle}</div>
                        <div class="step-status">${moduleCompleted ? 'Completed' : (isCurrentModule ? 'In Progress' : 'Upcoming')}</div>
                    </div>
                    ${isCurrentModule ? '<div class="current-marker">Currently Here</div>' : ''}
                </div>
                ${index < moduleSequence.length - 1 ? '<div class="path-connector"></div>' : ''}
            `;
        });
        
        pathHtml += `
            </div>
            <div class="path-actions">
                <button class="btn btn-primary" id="continue-path">Continue Learning</button>
                <button class="btn btn-secondary" id="update-profile">Update Profile</button>
            </div>
        `;
        
        // Update container
        pathContainer.innerHTML = pathHtml;
        
        // Add event listeners to buttons
        const continueButton = document.getElementById('continue-path');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.navigateToNextModule();
            });
        }
        
        const updateButton = document.getElementById('update-profile');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('update-profile'));
            });
        }
    }
    
    /**
     * Get module title by ID
     * @param {number} moduleId - Module ID
     * @returns {string} Module title
     */
    getModuleTitle(moduleId) {
        // Try to get title from DOM
        const moduleElement = document.querySelector(`#module${moduleId} .module-header h3`);
        if (moduleElement) {
            return moduleElement.textContent;
        }
        
        // Fallback titles
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
    
    /**
     * Check if a module is completed
     * @param {number} moduleId - Module ID
     * @returns {boolean} Whether the module is completed
     */
    isModuleCompleted(moduleId) {
        // Check completedModules array
        if (this.userProfile.completedModules && this.userProfile.completedModules.includes(moduleId)) {
            return true;
        }
        
        // Check progress data in localStorage
        try {
            const progress = JSON.parse(localStorage.getItem('plainidCourseProgress')) || {};
            return progress.modules && 
                   progress.modules[moduleId] && 
                   progress.modules[moduleId].completed === true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Check if a module is the current one in progress
     * @param {number} moduleId - Module ID
     * @returns {boolean} Whether the module is current
     */
    isCurrentModule(moduleId) {
        // For now, find the first incomplete module
        const { role } = this.userProfile;
        let moduleSequence = [1, 2, 3, 4, 5, 6]; // Default order
        
        if (role && this.pathSequences[role]) {
            moduleSequence = this.pathSequences[role];
        }
        
        for (const id of moduleSequence) {
            if (!this.isModuleCompleted(id)) {
                return id === moduleId;
            }
        }
        
        // If all completed, consider the last one current
        return moduleId === moduleSequence[moduleSequence.length - 1];
    }
    
    /**
     * Navigate to the next incomplete module
     */
    navigateToNextModule() {
        // Find the first incomplete module
        const { role } = this.userProfile;
        let moduleSequence = [1, 2, 3, 4, 5, 6]; // Default order
        
        if (role && this.pathSequences[role]) {
            moduleSequence = this.pathSequences[role];
        }
        
        for (const moduleId of moduleSequence) {
            if (!this.isModuleCompleted(moduleId)) {
                // Navigate to this module
                const moduleElement = document.getElementById(`module${moduleId}`);
                if (moduleElement) {
                    moduleElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Expand module if collapsed
                    const firstLessonHeader = moduleElement.querySelector('.accordion-header');
                    if (firstLessonHeader && !firstLessonHeader.classList.contains('active')) {
                        firstLessonHeader.click();
                    }
                }
                return;
            }
        }
        
        // If all modules completed, go to certification section
        const certificationSection = document.getElementById('certification');
        if (certificationSection) {
            certificationSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Show recommended modules based on current progress
     */
    showRecommendations() {
        // Create recommendations container if it doesn't exist
        let recommendationsContainer = document.getElementById('learning-recommendations');
        
        if (!recommendationsContainer) {
            recommendationsContainer = document.createElement('div');
            recommendationsContainer.id = 'learning-recommendations';
            recommendationsContainer.className = 'learning-recommendations personalized-content';
            
            // Add to page
            const modulesSection = document.getElementById('modules');
            if (modulesSection) {
                modulesSection.insertBefore(recommendationsContainer, modulesSection.firstChild);
            }
        }
        
        // Generate recommendations
        const recommendations = this.generateRecommendations();
        
        // Create recommendations HTML
        let recommendationsHtml = `
            <h3>Recommended Next Steps</h3>
            <div class="recommendations-list">
        `;
        
        // Add each recommendation
        recommendations.forEach(recommendation => {
            recommendationsHtml += `
                <div class="recommendation-card">
                    <div class="recommendation-icon">
                        ${recommendation.icon}
                    </div>
                    <div class="recommendation-content">
                        <h4>${recommendation.title}</h4>
                        <p>${recommendation.description}</p>
                    </div>
                    <a href="${recommendation.link}" class="btn btn-primary recommendation-action">
                        ${recommendation.actionText}
                    </a>
                </div>
            `;
        });
        
        recommendationsHtml += `</div>`;
        
        // Update container
        recommendationsContainer.innerHTML = recommendationsHtml;
    }
    
    /**
     * Generate personalized recommendations
     * @returns {Array} Array of recommendation objects
     */
    generateRecommendations() {
        const recommendations = [];
        
        // Check for incomplete modules
        const incompleteModules = this.getIncompleteModules();
        
        if (incompleteModules.length > 0) {
            // Recommend next module to complete
            const nextModule = incompleteModules[0];
            recommendations.push({
                title: `Continue Module ${nextModule}`,
                description: `Complete ${this.getModuleTitle(nextModule)} to advance your knowledge.`,
                icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#0073e6" d="M8,5.14V19.14L19,12.14L8,5.14Z"></path></svg>',
                link: `#module${nextModule}`,
                actionText: 'Continue'
            });
        }
        
        // Recommend based on learning goals
        const { learningGoals } = this.userProfile;
        if (learningGoals && learningGoals.length > 0) {
            // Get a goal-based recommendation
            if (learningGoals.includes('Implement PlainID')) {
                recommendations.push({
                    title: 'Practical Implementation',
                    description: 'Try the hands-on implementation exercises to solidify your knowledge.',
                    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#4caf50" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>',
                    link: '#module4',
                    actionText: 'Try Exercises'
                });
            } else if (learningGoals.includes('Design authorization policies')) {
                recommendations.push({
                    title: 'Policy Design Workshop',
                    description: 'Practice designing effective authorization policies with our interactive tools.',
                    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#9c27b0" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"></path></svg>',
                    link: '#module3',
                    actionText: 'Start Workshop'
                });
            }
        }
        
        // Recommend assessment if modules are completed
        if (incompleteModules.length === 0) {
            recommendations.push({
                title: 'Take Certification Assessment',
                description: 'You\'ve completed all modules! Test your knowledge with the certification assessment.',
                icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#ffc107" d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"></path></svg>',
                link: '#certification',
                actionText: 'Get Certified'
            });
        }
        
        // Add skill-based recommendation
        const weakestSkill = this.getWeakestSkill();
        if (weakestSkill) {
            recommendations.push({
                title: `Improve ${this.skillCategories[weakestSkill].name}`,
                description: `Focus on strengthening your ${this.skillCategories[weakestSkill].name.toLowerCase()} to become a well-rounded professional.`,
                icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#ff5722" d="M19,3H14V5H19V18L14,12V21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,18H5L10,12M10,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H10V18Z"></path></svg>',
                link: `#module${this.skillCategories[weakestSkill].modules[0]}`,
                actionText: 'Strengthen Skills'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Get incomplete modules in order of the learning path
     * @returns {Array} Array of incomplete module IDs
     */
    getIncompleteModules() {
        const { role } = this.userProfile;
        let moduleSequence = [1, 2, 3, 4, 5, 6]; // Default order
        
        if (role && this.pathSequences[role]) {
            moduleSequence = this.pathSequences[role];
        }
        
        return moduleSequence.filter(moduleId => !this.isModuleCompleted(moduleId));
    }
    
    /**
     * Get weakest skill category
     * @returns {string} Skill category ID
     */
    getWeakestSkill() {
        const { skillLevels } = this.userProfile;
        if (!skillLevels || Object.keys(skillLevels).length === 0) {
            return 'core-concepts'; // Default to core concepts
        }
        
        // Find skill with lowest level
        let weakestSkill = null;
        let lowestLevel = Infinity;
        
        Object.entries(skillLevels).forEach(([skill, level]) => {
            if (level < lowestLevel) {
                weakestSkill = skill;
                lowestLevel = level;
            }
        });
        
        return weakestSkill;
    }
    
    /**
     * Track lesson progress
     * @param {number} moduleId - Module ID
     * @param {number} lessonId - Lesson ID
     */
    trackLessonProgress(moduleId, lessonId) {
        // Update relevant skill levels when completing lessons
        this.updateSkillLevels(moduleId);
    }
    
    /**
     * Update skill levels based on module progress
     * @param {number} moduleId - Module ID
     */
    updateSkillLevels(moduleId) {
        // Find skill categories related to this module
        const relatedSkills = [];
        
        Object.entries(this.skillCategories).forEach(([skillId, skillData]) => {
            if (skillData.modules.includes(parseInt(moduleId))) {
                relatedSkills.push(skillId);
            }
        });
        
        // Increase skill levels
        relatedSkills.forEach(skillId => {
            if (!this.userProfile.skillLevels[skillId]) {
                this.userProfile.skillLevels[skillId] = 0;
            }
            
            // Increase by 1 point (max 10)
            this.userProfile.skillLevels[skillId] = Math.min(10, this.userProfile.skillLevels[skillId] + 1);
        });
        
        // Check if module is completed
        const isModuleCompleted = this.isModuleCompleted(moduleId);
        
        if (isModuleCompleted && !this.userProfile.completedModules.includes(parseInt(moduleId))) {
            // Add to completed modules
            this.userProfile.completedModules.push(parseInt(moduleId));
            
            // Increase relevant skills by additional 2 points
            relatedSkills.forEach(skillId => {
                this.userProfile.skillLevels[skillId] = Math.min(10, this.userProfile.skillLevels[skillId] + 2);
            });
        }
        
        // Save updated profile
        localStorage.setItem('plainidUserProfile', JSON.stringify(this.userProfile));
        
        // Update recommendations
        this.showRecommendations();
        
        // Update learning path display
        this.updateLearningPathDisplay();
    }
    
    /**
     * Add profile styles to the document
     */
    addProfileStyles() {
        if (document.getElementById('personalized-learning-styles')) {
            return;
        }
        
        const styleEl = document.createElement('style');
        styleEl.id = 'personalized-learning-styles';
        styleEl.textContent = `
            /* Profile Form Styles */
            .profile-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            .profile-overlay.closing {
                animation: fadeOut 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .profile-modal {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                width: 100%;
                max-width: 600px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                animation: slideUp 0.4s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .profile-modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .profile-modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
                color: #333;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: #999;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .close-btn:hover {
                color: #333;
            }
            
            .profile-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            
            .form-description {
                margin-bottom: 20px;
                color: #666;
            }
            
            .profile-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .form-group label {
                font-weight: 600;
                color: #333;
            }
            
            .form-group select {
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
                color: #333;
            }
            
            .checkbox-group, .radio-group {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 5px;
            }
            
            .checkbox-item, .radio-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .checkbox-item input, .radio-item input {
                margin: 0;
            }
            
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                margin-top: 10px;
            }
            
            /* Personalized Content Styles */
            .highlight-personalized {
                animation: highlightPulse 2s ease;
            }
            
            @keyframes highlightPulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 115, 230, 0.4); }
                50% { box-shadow: 0 0 0 10px rgba(0, 115, 230, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 115, 230, 0); }
            }
            
            /* Learning Path Styles */
            .learning-path-display {
                margin: 30px 0;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 10px;
                border: 1px solid #e9ecef;
            }
            
            .learning-path {
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin: 20px 0;
            }
            
            .path-step {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background-color: white;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                position: relative;
                z-index: 1;
            }
            
            .path-step.completed {
                border-left: 4px solid #28a745;
            }
            
            .path-step.current {
                border-left: 4px solid #0073e6;
                background-color: #f0f7ff;
            }
            
            .step-number {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #e9ecef;
                color: #495057;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 1.1rem;
            }
            
            .path-step.completed .step-number {
                background-color: #28a745;
                color: white;
            }
            
            .path-step.current .step-number {
                background-color: #0073e6;
                color: white;
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }
            
            .step-status {
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            .path-step.completed .step-status {
                color: #28a745;
            }
            
            .path-step.current .step-status {
                color: #0073e6;
                font-weight: 600;
            }
            
            .current-marker {
                position: absolute;
                top: -8px;
                right: 15px;
                background-color: #0073e6;
                color: white;
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .path-connector {
                width: 2px;
                height: 20px;
                background-color: #dee2e6;
                margin-left: 32px;
                z-index: 0;
            }
            
            .path-actions {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            }
            
            /* Style prioritization */
            .style-emphasized {
                box-shadow: 0 0 0 2px rgba(0, 115, 230, 0.3);
                border-radius: 8px;
                position: relative;
            }
            
            .style-emphasized::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 115, 230, 0.05);
                border-radius: 8px;
                pointer-events: none;
            }
            
            /* Learning Style Indicator */
            .learning-style-indicator {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 12px 20px;
                background-color: #f0f7ff;
                border-radius: 8px;
                border-left: 4px solid #0073e6;
                margin: 20px 0;
            }
            
            .learning-style-indicator.disabled {
                opacity: 0.7;
                border-left-color: #6c757d;
            }
            
            .style-icon {
                width: 40px;
                height: 40px;
                background-color: #e6f0fd;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0073e6;
            }
            
            .style-info {
                flex: 1;
            }
            
            .style-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 2px;
            }
            
            .style-description {
                font-size: 0.9rem;
                color: #666;
            }
            
            .style-toggle {
                padding: 4px 12px;
                background-color: white;
                border: 1px solid #0073e6;
                color: #0073e6;
                border-radius: 20px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .style-toggle:hover {
                background-color: #0073e6;
                color: white;
            }
            
            /* Industry Content Styling */
            .industry-label {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background-color: #f8f9fa;
                border-radius: 20px;
                margin-bottom: 15px;
                display: inline-flex;
            }
            
            .industry-icon {
                width: 20px;
                height: 20px;
                background-color: #e9ecef;
                border-radius: 50%;
            }
            
            .industry-name {
                font-size: 0.9rem;
                font-weight: 600;
                color: #495057;
            }
            
            /* Content toggles */
            .content-toggle {
                margin: 15px 0;
            }
            
            .toggle-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background-color: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 20px;
                font-size: 0.9rem;
                color: #0073e6;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .toggle-btn:hover {
                background-color: #e9ecef;
            }
            
            .toggle-icon {
                font-weight: bold;
            }
            
            /* Relevance badges */
            .relevance-badge {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 3px 8px;
                background-color: #fff8e1;
                border-radius: 20px;
                font-size: 0.8rem;
                color: #ff8f00;
                margin-top: 10px;
            }
            
            .badge-icon {
                font-size: 0.9rem;
            }
            
            /* Importance indicators */
            .importance-indicator {
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-left: 10px;
            }
            
            .high-priority {
                background-color: #ffebee;
                color: #f44336;
            }
            
            .medium-priority {
                background-color: #e8f5e9;
                color: #4caf50;
            }
            
            .low-priority {
                background-color: #e3f2fd;
                color: #2196f3;
            }
            
            /* Recommendations */
            .learning-recommendations {
                margin-bottom: 30px;
            }
            
            .recommendations-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 20px;
            }
            
            .recommendation-card {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background-color: white;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
            }
            
            .recommendation-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .recommendation-icon {
                width: 50px;
                height: 50px;
                background-color: #f8f9fa;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .recommendation-content {
                flex: 1;
            }
            
            .recommendation-content h4 {
                margin: 0 0 8px 0;
                color: #333;
            }
            
            .recommendation-content p {
                margin: 0;
                color: #666;
                font-size: 0.9rem;
            }
            
            .recommendation-action {
                white-space: nowrap;
            }
            
            /* Goal relevant content */
            .goal-relevant {
                position: relative;
            }
            
            /* Media queries for responsive design */
            @media (max-width: 768px) {
                .profile-modal {
                    max-width: 100%;
                    max-height: 100vh;
                    border-radius: 0;
                }
                
                .learning-path {
                    margin-left: 0;
                }
                
                .recommendation-card {
                    flex-direction: column;
                    text-align: center;
                }
                
                .recommendation-content {
                    margin-bottom: 15px;
                }
                
                .learning-style-indicator {
                    flex-direction: column;
                    text-align: center;
                    padding: 15px;
                }
                
                .path-actions {
                    flex-direction: column;
                }
            }
            
            /* Dark mode support */
            .dark-mode .profile-modal {
                background-color: #2a2a2a;
                color: #e0e0e0;
            }
            
            .dark-mode .profile-modal-header {
                border-color: #444;
            }
            
            .dark-mode .profile-form label {
                color: #e0e0e0;
            }
            
            .dark-mode .form-group select,
            .dark-mode .toggle-btn {
                background-color: #333;
                border-color: #555;
                color: #e0e0e0;
            }
            
            .dark-mode .learning-path-display,
            .dark-mode .path-step {
                background-color: #2a2a2a;
                border-color: #444;
            }
            
            .dark-mode .step-title {
                color: #e0e0e0;
            }
            
            .dark-mode .learning-style-indicator {
                background-color: #2a2a2a;
            }
        `;
        
        document.head.appendChild(styleEl);
    }
}

// Initialize the personalized learning path system
document.addEventListener('DOMContentLoaded', () => {
    window.personalizedLearningPath = new PersonalizedLearningPath();
});
