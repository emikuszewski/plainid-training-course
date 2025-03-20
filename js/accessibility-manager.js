/**
 * Accessibility and Internationalization Enhancements for PlainID Training Course
 * 
 * Features:
 * - WCAG 2.1 AA compliance improvements
 * - Screen reader support
 * - Keyboard navigation
 * - High contrast mode
 * - Font size controls
 * - Multi-language support
 */

class AccessibilityManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            'en': {}, // Default English translations
            'es': {}, // Spanish translations
            'fr': {}, // French translations
            'de': {}, // German translations
            'ja': {}  // Japanese translations
        };
        
        this.settings = {
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            screenReader: false
        };
        
        this.init();
    }
    
    /**
     * Initialize accessibility features
     */
    init() {
        // Load user settings
        this.loadSettings();
        
        // Load translations
        this.loadTranslations();
        
        // Add accessibility controls to the page
        this.addAccessibilityControls();
        
        // Apply initial settings
        this.applySettings();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Improve existing UI elements for accessibility
        this.improveExistingElements();
        
        // Run ARIA enhancement
        this.enhanceARIA();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }
    
    /**
     * Load user accessibility settings from localStorage
     */
    loadSettings() {
        try {
            const storedSettings = localStorage.getItem('plainidAccessibilitySettings');
            if (storedSettings) {
                this.settings = JSON.parse(storedSettings);
            }
            
            // Load language preference
            const storedLanguage = localStorage.getItem('plainidLanguage');
            if (storedLanguage) {
                this.currentLanguage = storedLanguage;
            } else {
                // Try to detect browser language
                const browserLang = navigator.language.split('-')[0];
                if (this.translations[browserLang]) {
                    this.currentLanguage = browserLang;
                }
            }
        } catch (error) {
            console.error('Error loading accessibility settings:', error);
        }
    }
    
    /**
     * Load language translations
     */
    loadTranslations() {
        // In a real implementation, these would be loaded from JSON files
        // For the demo, we'll use a subset of translations
        
        this.translations['es'] = {
            'Start Learning': 'Comenzar a Aprender',
            'About This Course': 'Acerca de este Curso',
            'What You\'ll Learn': 'Lo que Aprenderás',
            'Course Modules': 'Módulos del Curso',
            'Additional Resources': 'Recursos Adicionales',
            'Certification': 'Certificación',
            'Home': 'Inicio',
            'Modules': 'Módulos',
            'Resources': 'Recursos',
            'Next Lesson': 'Siguiente Lección',
            'Previous': 'Anterior',
            'Your Progress': 'Tu Progreso',
            'Complete': 'Completo',
            'Start Module': 'Iniciar Módulo',
            'Not Started': 'No Comenzado',
            'Locked': 'Bloqueado',
            'Ready': 'Listo',
            'Completed': 'Completado'
        };
        
        this.translations['fr'] = {
            'Start Learning': 'Commencer à Apprendre',
            'About This Course': 'À Propos de ce Cours',
            'What You\'ll Learn': 'Ce que Vous Apprendrez',
            'Course Modules': 'Modules de Cours',
            'Additional Resources': 'Ressources Supplémentaires',
            'Certification': 'Certification',
            'Home': 'Accueil',
            'Modules': 'Modules',
            'Resources': 'Ressources',
            'Next Lesson': 'Leçon Suivante',
            'Previous': 'Précédent',
            'Your Progress': 'Votre Progression',
            'Complete': 'Terminé',
            'Start Module': 'Démarrer le Module',
            'Not Started': 'Non Commencé',
            'Locked': 'Verrouillé',
            'Ready': 'Prêt',
            'Completed': 'Terminé'
        };
        
        this.translations['de'] = {
            'Start Learning': 'Beginnen Sie mit dem Lernen',
            'About This Course': 'Über diesen Kurs',
            'What You\'ll Learn': 'Was Sie lernen werden',
            'Course Modules': 'Kursmodule',
            'Additional Resources': 'Zusätzliche Ressourcen',
            'Certification': 'Zertifizierung',
            'Home': 'Startseite',
            'Modules': 'Module',
            'Resources': 'Ressourcen',
            'Next Lesson': 'Nächste Lektion',
            'Previous': 'Zurück',
            'Your Progress': 'Ihr Fortschritt',
            'Complete': 'Abgeschlossen',
            'Start Module': 'Modul starten',
            'Not Started': 'Nicht gestartet',
            'Locked': 'Gesperrt',
            'Ready': 'Bereit',
            'Completed': 'Abgeschlossen'
        };
        
        this.translations['ja'] = {
            'Start Learning': '学習を始める',
            'About This Course': 'このコースについて',
            'What You\'ll Learn': '学ぶ内容',
            'Course Modules': 'コースモジュール',
            'Additional Resources': '追加リソース',
            'Certification': '認定',
            'Home': 'ホーム',
            'Modules': 'モジュール',
            'Resources': 'リソース',
            'Next Lesson': '次のレッスン',
            'Previous': '前へ',
            'Your Progress': 'あなたの進捗',
            'Complete': '完了',
            'Start Module': 'モジュールを開始',
            'Not Started': '未開始',
            'Locked': 'ロック済み',
            'Ready': '準備完了',
            'Completed': '完了'
        };
    }
    
    /**
     * Add accessibility controls to the page
     */
    addAccessibilityControls() {
        // Create accessibility menu
        const accessibilityMenu = document.createElement('div');
        accessibilityMenu.id = 'accessibility-menu';
        accessibilityMenu.className = 'accessibility-menu';
        accessibilityMenu.setAttribute('aria-label', 'Accessibility Options');
        
        // Add skip link first (for keyboard users)
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Create accessibility menu toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'accessibility-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle Accessibility Menu');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', 'accessibility-panel');
        toggleButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"></path>
            </svg>
        `;
        
        // Create accessibility panel
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel';
        panel.setAttribute('aria-hidden', 'true');
        
        // Build panel content
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Accessibility Options</h3>
                <button class="close-panel" aria-label="Close Accessibility Panel">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                    </svg>
                </button>
            </div>
            
            <div class="panel-content">
                <div class="option-group">
                    <h4>Text Size</h4>
                    <div class="text-size-controls">
                        <button class="text-size-btn" data-size="small" aria-label="Small Text Size">A<span class="sr-only"> (Small)</span></button>
                        <button class="text-size-btn" data-size="medium" aria-label="Medium Text Size">A<span class="sr-only"> (Medium)</span></button>
                        <button class="text-size-btn" data-size="large" aria-label="Large Text Size">A<span class="sr-only"> (Large)</span></button>
                    </div>
                </div>
                
                <div class="option-group">
                    <h4>Display</h4>
                    <label class="toggle-switch">
                        <input type="checkbox" id="high-contrast-toggle" aria-label="High Contrast Mode">
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">High Contrast</span>
                    </label>
                    
                    <label class="toggle-switch">
                        <input type="checkbox" id="reduced-motion-toggle" aria-label="Reduced Motion">
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">Reduced Motion</span>
                    </label>
                    
                    <label class="toggle-switch">
                        <input type="checkbox" id="screen-reader-toggle" aria-label="Screen Reader Optimizations">
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">Screen Reader Optimizations</span>
                    </label>
                </div>
                
                <div class="option-group">
                    <h4>Language</h4>
                    <select id="language-selector" aria-label="Select Language">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>
            </div>
        `;
        
        // Add accessibility menu to the page
        accessibilityMenu.appendChild(toggleButton);
        accessibilityMenu.appendChild(panel);
        document.body.appendChild(accessibilityMenu);
        
        // Add necessary styles
        this.addAccessibilityStyles();
    }
    
    /**
     * Setup event listeners for accessibility controls
     */
    setupEventListeners() {
        // Toggle button
        const toggleButton = document.querySelector('.accessibility-toggle');
        const panel = document.getElementById('accessibility-panel');
        
        if (toggleButton && panel) {
            toggleButton.addEventListener('click', () => {
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                toggleButton.setAttribute('aria-expanded', !isExpanded);
                panel.setAttribute('aria-hidden', isExpanded);
                
                if (!isExpanded) {
                    panel.classList.add('open');
                    setTimeout(() => {
                        // Focus the first interactive element in the panel
                        const firstControl = panel.querySelector('button, [href], select, textarea, input:not([type="hidden"])');
                        if (firstControl) {
                            firstControl.focus();
                        }
                    }, 100);
                } else {
                    panel.classList.remove('open');
                }
            });
        }
        
        // Close panel button
        const closeButton = document.querySelector('.close-panel');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                toggleButton.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.classList.remove('open');
                toggleButton.focus(); // Return focus to toggle button
            });
        }
        
        // Text size buttons
        const textSizeButtons = document.querySelectorAll('.text-size-btn');
        textSizeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const size = button.getAttribute('data-size');
                this.setFontSize(size);
                
                // Update active state
                textSizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Set initial active state for text size
        const activeTextSize = document.querySelector(`.text-size-btn[data-size="${this.settings.fontSize}"]`);
        if (activeTextSize) {
            activeTextSize.classList.add('active');
        }
        
        // High contrast toggle
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        if (highContrastToggle) {
            highContrastToggle.checked = this.settings.highContrast;
            highContrastToggle.addEventListener('change', () => {
                this.settings.highContrast = highContrastToggle.checked;
                this.applySettings();
                this.saveSettings();
            });
        }
        
        // Reduced motion toggle
        const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
        if (reducedMotionToggle) {
            reducedMotionToggle.checked = this.settings.reducedMotion;
            reducedMotionToggle.addEventListener('change', () => {
                this.settings.reducedMotion = reducedMotionToggle.checked;
                this.applySettings();
                this.saveSettings();
            });
        }
        
        // Screen reader toggle
        const screenReaderToggle = document.getElementById('screen-reader-toggle');
        if (screenReaderToggle) {
            screenReaderToggle.checked = this.settings.screenReader;
            screenReaderToggle.addEventListener('change', () => {
                this.settings.screenReader = screenReaderToggle.checked;
                this.applySettings();
                this.saveSettings();
            });
        }
        
        // Language selector
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = this.currentLanguage;
            languageSelector.addEventListener('change', () => {
                this.currentLanguage = languageSelector.value;
                this.applyTranslation();
                localStorage.setItem('plainidLanguage', this.currentLanguage);
            });
        }
        
        // Escape key to close panel
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && panel.classList.contains('open')) {
                toggleButton.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.classList.remove('open');
                toggleButton.focus(); // Return focus to toggle button
            }
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (event) => {
            if (panel.classList.contains('open') && 
                !panel.contains(event.target) && 
                event.target !== toggleButton) {
                toggleButton.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');
                panel.classList.remove('open');
            }
        });
    }
    
    /**
     * Apply accessibility settings
     */
    applySettings() {
        // Apply font size
        this.setFontSize(this.settings.fontSize);
        
        // Apply high contrast
        if (this.settings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
        
        // Apply reduced motion
        if (this.settings.reducedMotion) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
        
        // Apply screen reader optimizations
        if (this.settings.screenReader) {
            document.documentElement.classList.add('screen-reader-mode');
        } else {
            document.documentElement.classList.remove('screen-reader-mode');
        }
        
        // Apply language
        this.applyTranslation();
    }
    
    /**
     * Set font size
     * @param {string} size - Font size (small, medium, large)
     */
    setFontSize(size) {
        // Remove existing font size classes
        document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
        
        // Add new font size class
        document.documentElement.classList.add(`text-${size}`);
        
        // Update settings
        this.settings.fontSize = size;
        this.saveSettings();
    }
    
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('plainidAccessibilitySettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving accessibility settings:', error);
        }
    }
    
    /**
     * Apply translation based on selected language
     */
    applyTranslation() {
        if (this.currentLanguage === 'en') {
            // Reset to original text
            this.removeTranslations();
            return;
        }
        
        const translations = this.translations[this.currentLanguage];
        if (!translations) return;
        
        // Translate text elements
        this.translateElements(translations);
        
        // Update lang attribute
        document.documentElement.lang = this.currentLanguage;
    }
    
    /**
     * Remove translations and restore original text
     */
    removeTranslations() {
        const translatedElements = document.querySelectorAll('[data-original-text]');
        translatedElements.forEach(element => {
            element.textContent = element.getAttribute('data-original-text');
        });
        
        // Reset lang attribute
        document.documentElement.lang = 'en';
    }
    
    /**
     * Translate elements based on translation map
     * @param {Object} translations - Translation dictionary
     */
    translateElements(translations) {
        // For each key in translations, find and translate elements
        Object.entries(translations).forEach(([originalText, translatedText]) => {
            // Find elements containing this text
            const textNodes = this.findTextNodesWithText(document.body, originalText);
            
            textNodes.forEach(node => {
                const element = node.parentElement;
                
                // Store original text if not already stored
                if (!element.hasAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', element.textContent);
                }
                
                // Apply translation
                element.textContent = element.textContent.replace(originalText, translatedText);
            });
        });
    }
    
    /**
     * Find text nodes containing specific text
     * @param {Node} rootNode - Root node to search from
     * @param {string} searchText - Text to search for
     * @returns {Array} Array of text nodes
     */
    findTextNodesWithText(rootNode, searchText) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            rootNode, 
            NodeFilter.SHOW_TEXT, 
            { 
                acceptNode: function(node) { 
                    return node.nodeValue.includes(searchText) ? 
                        NodeFilter.FILTER_ACCEPT : 
                        NodeFilter.FILTER_REJECT; 
                } 
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        return textNodes;
    }
    
    /**
     * Improve existing elements for accessibility
     */
    improveExistingElements() {
        // Add main landmark
        const mainContent = document.querySelector('.container');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }
        
        // Add appropriate role attributes
        const nav = document.querySelector('nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main Navigation');
        }
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.setAttribute('role', 'banner');
        }
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
        }
        
        const searchField = document.querySelector('input[type="search"]');
        if (searchField) {
            searchField.setAttribute('aria-label', 'Search course content');
        }
        
        // Improve image accessibility
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            // Set alt text based on context
            if (img.closest('.diagram')) {
                const diagramTitle = img.closest('.diagram').querySelector('figcaption')?.textContent;
                img.alt = diagramTitle || 'Diagram illustration';
            } else if (img.src.includes('logo')) {
                img.alt = 'PlainID Logo';
            } else {
                // For decorative images
                img.alt = '';
                img.setAttribute('role', 'presentation');
            }
        });
        
        // Improve form controls
        const formControls = document.querySelectorAll('button, input, select, textarea');
        formControls.forEach(control => {
            if (!control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
                // Add labels if missing
                if (control.id && document.querySelector(`label[for="${control.id}"]`)) {
                    // Already has associated label
                    return;
                }
                
                if (control.type === 'button' || control.tagName === 'BUTTON') {
                    // Use button text as label
                    if (control.textContent.trim()) {
                        return;
                    }
                    
                    // Use title or set generic label
                    control.setAttribute('aria-label', control.title || 'Button');
                }
            }
        });
        
        // Improve tab panels
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, index) => {
            const id = `tab-${index}`;
            const contentId = `tab-content-${index}`;
            
            tab.setAttribute('role', 'tab');
            tab.setAttribute('id', id);
            tab.setAttribute('aria-controls', contentId);
            tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
            tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
            
            if (tabContents[index]) {
                tabContents[index].setAttribute('role', 'tabpanel');
                tabContents[index].setAttribute('id', contentId);
                tabContents[index].setAttribute('aria-labelledby', id);
                tabContents[index].setAttribute('tabindex', '0');
            }
        });
        
        // Add role for tabs container
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            tabsContainer.setAttribute('role', 'tablist');
        }
        
        // Improve quiz accessibility
        const quizOptions = document.querySelectorAll('.quiz-option');
        quizOptions.forEach((option, index) => {
            option.setAttribute('role', 'button');
            option.setAttribute('tabindex', '0');
            option.setAttribute('aria-pressed', option.classList.contains('selected') ? 'true' : 'false');
        });
    }
    
    /**
     * Enhance ARIA attributes and relationships
     */
    enhanceARIA() {
        // Progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const progressFill = bar.querySelector('.progress-fill');
            
            if (progressFill) {
                const width = progressFill.style.width;
                const percentage = width ? parseInt(width) : 0;
                
                bar.setAttribute('role', 'progressbar');
                bar.setAttribute('aria-valuemin', '0');
                bar.setAttribute('aria-valuemax', '100');
                bar.setAttribute('aria-valuenow', percentage);
                
                // Find related text
                const progressText = bar.closest('.progress-container')?.querySelector('.progress-text');
                if (progressText) {
                    const textId = `progress-text-${Math.random().toString(36).substr(2, 9)}`;
                    progressText.id = textId;
                    bar.setAttribute('aria-describedby', textId);
                }
            }
        });
        
        // Module status indicators
        const moduleStatuses = document.querySelectorAll('.module-status');
        moduleStatuses.forEach(status => {
            const moduleHeader = status.closest('.module-header');
            if (moduleHeader) {
                const moduleTitle = moduleHeader.querySelector('h3');
                
                if (moduleTitle) {
                    const titleId = `module-title-${Math.random().toString(36).substr(2, 9)}`;
                    moduleTitle.id = titleId;
                    status.setAttribute('aria-labelledby', titleId);
                }
            }
        });
        
        // Accordion headers
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach((header, index) => {
            const content = header.nextElementSibling;
            const headerId = `accordion-header-${index}`;
            const contentId = `accordion-content-${index}`;
            
            header.setAttribute('id', headerId);
            header.setAttribute('aria-controls', contentId);
            header.setAttribute('aria-expanded', header.classList.contains('active') ? 'true' : 'false');
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            
            if (content) {
                content.setAttribute('id', contentId);
                content.setAttribute('aria-labelledby', headerId);
                content.setAttribute('role', 'region');
            }
        });
        
        // Course cards
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            const title = card.querySelector('h3');
            const link = card.querySelector('a');
            
            if (title && link) {
                const titleId = `card-title-${Math.random().toString(36).substr(2, 9)}`;
                title.id = titleId;
                link.setAttribute('aria-labelledby', titleId);
            }
        });
    }
    
    /**
     * Setup keyboard navigation for interactive elements
     */
    setupKeyboardNavigation() {
        // Accordion keyboard support
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    header.click();
                }
            });
        });
        
        // Tab panel keyboard support
        const tabs = document.querySelectorAll('.tab');
        if (tabs.length > 0) {
            tabs.forEach((tab, index) => {
                tab.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        tab.click();
                    } else if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        const nextTab = tabs[index + 1] || tabs[0];
                        nextTab.click();
                        nextTab.focus();
                    } else if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
                        prevTab.click();
                        prevTab.focus();
                    } else if (event.key === 'Home') {
                        event.preventDefault();
                        tabs[0].click();
                        tabs[0].focus();
                    } else if (event.key === 'End') {
                        event.preventDefault();
                        tabs[tabs.length - 1].click();
                        tabs[tabs.length - 1].focus();
                    }
                });
            });
        }
        
        // Quiz options keyboard support
        const quizOptions = document.querySelectorAll('.quiz-option');
        quizOptions.forEach(option => {
            option.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    option.click();
                }
            });
        });
    }
    
    /**
     * Add accessibility styles
     */
    addAccessibilityStyles() {
        if (document.getElementById('accessibility-styles')) {
            return;
        }
        
        const styleEl = document.createElement('style');
        styleEl.id = 'accessibility-styles';
        styleEl.textContent = `
            /* Skip Link */
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background-color: #0073e6;
                color: white;
                padding: 8px 15px;
                z-index: 1001;
                transition: top 0.3s ease;
            }
            
            .skip-link:focus {
                top: 0;
            }
            
            /* Accessibility Menu */
            .accessibility-menu {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .accessibility-toggle {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background-color: #0073e6;
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s ease;
            }
            
            .accessibility-toggle:hover {
                background-color: #0055a4;
            }
            
            .accessibility-toggle:focus {
                outline: 3px solid rgba(0, 115, 230, 0.5);
                outline-offset: 2px;
            }
            
            .accessibility-panel {
                position: absolute;
                bottom: 60px;
                right: 0;
                width: 300px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                transform: scale(0.95);
                transform-origin: bottom right;
                opacity: 0;
                visibility: hidden;
                transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s;
            }
            
            .accessibility-panel.open {
                transform: scale(1);
                opacity: 1;
                visibility: visible;
            }
            
            .panel-header {
                padding: 15px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .panel-header h3 {
                margin: 0;
                font-size: 1.2rem;
                color: #333;
            }
            
            .close-panel {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 5px;
            }
            
            .close-panel:hover {
                color: #333;
            }
            
            .panel-content {
                padding: 15px;
            }
            
            .option-group {
                margin-bottom: 20px;
            }
            
            .option-group h4 {
                margin: 0 0 10px 0;
                font-size: 1rem;
                color: #666;
            }
            
            .text-size-controls {
                display: flex;
                gap: 10px;
            }
            
            .text-size-btn {
                width: 36px;
                height: 36px;
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            
            .text-size-btn:hover {
                background-color: #e9e9e9;
            }
            
            .text-size-btn.active {
                background-color: #0073e6;
                border-color: #0073e6;
                color: white;
            }
            
            .text-size-btn:nth-child(1) {
                font-size: 0.9rem;
            }
            
            .text-size-btn:nth-child(2) {
                font-size: 1.1rem;
            }
            
            .text-size-btn:nth-child(3) {
                font-size: 1.3rem;
            }
            
            .toggle-switch {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                cursor: pointer;
            }
            
            .toggle-slider {
                position: relative;
                width: 40px;
                height: 20px;
                background-color: #ccc;
                border-radius: 20px;
                margin-right: 10px;
                transition: background-color 0.3s ease;
            }
            
            .toggle-slider:before {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: transform 0.3s ease;
            }
            
            input:checked + .toggle-slider {
                background-color: #0073e6;
            }
            
            input:checked + .toggle-slider:before {
                transform: translateX(20px);
            }
            
            input:focus + .toggle-slider {
                box-shadow: 0 0 0 2px rgba(0, 115, 230, 0.3);
            }
            
            .toggle-label {
                font-size: 0.9rem;
                color: #666;
            }
            
            #language-selector {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 0.9rem;
            }
            
            /* Font Size Classes */
            .text-small {
                --base-font-size: 0.9em;
            }
            
            .text-medium {
                --base-font-size: 1em;
            }
            
            .text-large {
                --base-font-size: 1.2em;
            }
            
            /* Apply font sizes */
            .text-small body {
                font-size: var(--base-font-size);
            }
            
            .text-medium body {
                font-size: var(--base-font-size);
            }
            
            .text-large body {
                font-size: var(--base-font-size);
            }
            
            /* Scale text for different elements */
            .text-small h1, .text-medium h1, .text-large h1 { font-size: calc(var(--base-font-size) * 2.5); }
            .text-small h2, .text-medium h2, .text-large h2 { font-size: calc(var(--base-font-size) * 2); }
            .text-small h3, .text-medium h3, .text-large h3 { font-size: calc(var(--base-font-size) * 1.7); }
            .text-small h4, .text-medium h4, .text-large h4 { font-size: calc(var(--base-font-size) * 1.4); }
            .text-small p, .text-medium p, .text-large p { font-size: var(--base-font-size); }
            .text-small .btn, .text-medium .btn, .text-large .btn { font-size: var(--base-font-size); }
            
            /* High Contrast Mode */
            .high-contrast {
                --primary: #0073e6;
                --secondary: #0055a4;
                --dark: #000000;
                --light: #ffffff;
                --success: #00aa00;
                --warning: #ffaa00;
                --danger: #dd0000;
                --text: #000000;
            }
            
            .high-contrast body {
                background-color: var(--light);
                color: var(--text);
            }
            
            .high-contrast a {
                color: #0000ff;
                text-decoration: underline;
            }
            
            .high-contrast .btn {
                border: 2px solid currentColor;
            }
            
            .high-contrast .btn-primary {
                background-color: var(--primary);
                color: var(--light);
                border-color: var(--text);
            }
            
            .high-contrast .btn-secondary {
                background-color: var(--light);
                color: var(--text);
                border-color: var(--text);
            }
            
            .high-contrast .progress-bar {
                border: 1px solid var(--text);
            }
            
            .high-contrast .progress-fill {
                background-color: var(--success);
            }
            
            .high-contrast .module-container,
            .high-contrast .course-card,
            .high-contrast .accordion-item {
                border: 2px solid var(--text);
            }
            
            .high-contrast .accordion-header.active {
                background-color: var(--primary);
                color: var(--light);
            }
            
            .high-contrast .status {
                border: 1px solid currentColor;
            }
            
            /* Reduced Motion */
            .reduce-motion * {
                animation-duration: 0.001s !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001s !important;
                scroll-behavior: auto !important;
            }
            
            /* Screen Reader Utilities */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .screen-reader-mode:focus {
                outline: 3px solid #0073e6 !important;
                outline-offset: 2px !important;
            }
            
            /* Add focus indicators for keyboard navigation */
            button:focus,
            a:focus,
            input:focus,
            select:focus,
            [tabindex]:focus {
                outline: 3px solid rgba(0, 115, 230, 0.5);
                outline-offset: 2px;
            }
            
            /* Add focus-visible polyfill for better keyboard-only focus */
            *:focus:not(:focus-visible) {
                outline: none;
            }
            
            *:focus-visible {
                outline: 3px solid rgba(0, 115, 230, 0.5);
                outline-offset: 2px;
            }
            
            /* Visible focus for accordion headers */
            .accordion-header:focus {
                box-shadow: 0 0 0 3px rgba(0, 115, 230, 0.5);
            }
            
            /* Responsive Fixes */
            @media (max-width: 768px) {
                .accessibility-panel {
                    width: 280px;
                }
                
                .toggle-switch {
                    flex-wrap: wrap;
                }
            }
            
            /* Print styles for accessibility */
            @media print {
                .accessibility-menu,
                .skip-link {
                    display: none !important;
                }
                
                body {
                    font-size: 12pt !important;
                    line-height: 1.5 !important;
                    color: #000 !important;
                    background: #fff !important;
                }
                
                a {
                    color: #000 !important;
                    text-decoration: underline !important;
                }
                
                .accordion-content {
                    display: block !important;
                    height: auto !important;
                    max-height: none !important;
                }
            }
        `;
        
        document.head.appendChild(styleEl);
    }
}

// Initialize the accessibility features
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
});
