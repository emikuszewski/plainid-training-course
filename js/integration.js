/**
 * PlainID Training Course - Integration Script
 * 
 * This script ensures all components work together properly by:
 * 1. Centralizing initialization
 * 2. Establishing consistent data structures 
 * 3. Creating proper event communication
 * 4. Resolving DOM manipulation conflicts
 */

// Main namespace for the application
const PlainIDCourse = {
    // Core state management
    state: {
        initialized: false,
        userProgress: {
            modules: {},
            quizResults: [],
            timeSpent: {},
            userName: ''
        },
        userProfile: {
            role: '',
            industry: '',
            experience: '',
            learningGoals: [],
            learningStyle: ''
        },
        achievements: [],
        currentModule: null,
        currentLesson: null
    },

    // Component references
    components: {
        quizManager: null,
        moduleNavigator: null,
        certificateGenerator: null,
        interactiveContent: null,
        courseAnalytics: null,
        personalizedLearningPath: null,
        accessibilityManager: null,
        interactiveDiagrams: null,
        achievementSystem: null
    },

    // Initialize the application
    init: function() {
        if (this.state.initialized) return;
        
        console.log('Initializing PlainID Training Course...');
        
        // Load saved state from localStorage
        this.loadState();
        
        // Setup shared methods
        this.setupSharedMethods();
        
        // Initialize default behaviors first (ensure core functionality)
        this.initializeDefaultBehaviors();
        
        // Then initialize components in the correct order to manage dependencies
        this.initializeComponents();
        
        // Set up event listeners for cross-component communication
        this.setupEventListeners();
        
        // Mark as initialized
        this.state.initialized = true;
        console.log('PlainID Training Course initialized');
        
        // Unlock all modules and lessons for open access
        this.unlockAllModules();
        
        // Make sure all modules are visible
        this.ensureModulesVisible();
