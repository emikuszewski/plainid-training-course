/**
 * Interactive Content Manager
 * 
 * Enhances course content with interactive elements:
 * - Code syntax highlighting
 * - Interactive diagrams
 * - Tooltips
 * - Image lightboxes
 */
class InteractiveContentManager {
    constructor() {
        this.init();
    }

    init() {
        this.initCodeHighlighting();
        this.initImageLightbox();
        this.addTooltips();
        this.initDiagrams();
    }

    initCodeHighlighting() {
        // Find all code examples
        const codeBlocks = document.querySelectorAll('.code-example');
        
        if (codeBlocks.length === 0) return;
        
        // Add highlight.js if not already loaded
        if (!document.getElementById('highlight-js')) {
            // Add highlight.js CSS
            const highlightCSS = document.createElement('link');
            highlightCSS.id = 'highlight-css';
            highlightCSS.rel = 'stylesheet';
            highlightCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/vs2015.min.css';
            document.head.appendChild(highlightCSS);
            
            // Add highlight.js script
            const highlightJS = document.createElement('script');
            highlightJS.id = 'highlight-js';
            highlightJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js';
            document.head.appendChild(highlightJS);
            
            // Initialize when loaded
            highlightJS.onload = () => {
                this.highlightCodeBlocks();
            };
        } else {
            // Highlight.js already loaded
            this.highlightCodeBlocks();
        }
    }

    highlightCodeBlocks() {
        if (window.hljs) {
            const codeBlocks = document.querySelectorAll('.code-example pre');
            codeBlocks.forEach(block => {
                window.hljs.highlightElement(block);
            });
            
            // Add copy button to code blocks
            document.querySelectorAll('.code-example').forEach(container => {
                if (!container.querySelector('.copy-button')) {
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.innerHTML = `
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path>
                        </svg>
                    `;
                    
                    copyButton.addEventListener('click', () => {
                        const code = container.querySelector('pre').textContent;
                        navigator.clipboard.writeText(code).then(() => {
                            copyButton.innerHTML = `
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                                </svg>
                            `;
                            
                            setTimeout(() => {
                                copyButton.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path>
                                    </svg>
                                `;
                            }, 2000);
                        });
                    });
                    
                    container.appendChild(copyButton);
                }
            });
            
            // Add copy button styles
            if (!document.getElementById('copy-button-styles')) {
                const style = document.createElement('style');
                style.id = 'copy-button-styles';
                style.textContent = `
                    .code-example {
                        position: relative;
                    }
                    
                    .copy-button {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background-color: rgba(255, 255, 255, 0.1);
                        border: none;
                        border-radius: 4px;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #999;
                        transition: var(--transition);
                    }
                    
                    .copy-button:hover {
                        background-color: rgba(255, 255, 255, 0.2);
                        color: white;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    initImageLightbox() {
        // Find all diagram images
        const diagramImages = document.querySelectorAll('.diagram img');
        
        if (diagramImages.length === 0) return;
        
        // Add lightbox container if not exists
        let lightbox = document.getElementById('image-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'image-lightbox';
            lightbox.className = 'image-lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="" alt="Lightbox Image">
                </div>
                <div class="lightbox-close">&times;</div>
            `;
            document.body.appendChild(lightbox);
            
            // Add lightbox styles
            const style = document.createElement('style');
            style.textContent = `
                .image-lightbox {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                
                .image-lightbox.active {
                    opacity: 1;
                    pointer-events: auto;
                }
                
                .lightbox-content {
                    max-width: 90%;
                    max-height: 90%;
                    position: relative;
                    animation: lightboxIn 0.3s ease;
                }
                
                @keyframes lightboxIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .lightbox-content img {
                    max-width: 100%;
                    max-height: 90vh;
                    display: block;
                    border-radius: 4px;
                    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
                }
                
                .lightbox-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    font-size: 30px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: rgba(0, 0, 0, 0.5);
                    transition: var(--transition);
                }
                
                .lightbox-close:hover {
                    background-color: rgba(0, 0, 0, 0.8);
                    transform: rotate(90deg);
                }
            `;
            document.head.appendChild(style);
            
            // Close lightbox on click
            lightbox.addEventListener('click', (e) => {
                if (e.target !== lightbox.querySelector('img')) {
                    lightbox.classList.remove('active');
                }
            });
        }
        
        // Add click event to each image
        diagramImages.forEach(img => {
            // Add zoom cursor and indication
            img.style.cursor = 'zoom-in';
            
            // Add click event
            img.addEventListener('click', () => {
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
            });
        });
    }

    addTooltips() {
        // Find all elements with title attribute
        const elementsWithTitle = document.querySelectorAll('[title]');
        
        if (elementsWithTitle.length === 0) return;
        
        // Add tooltip container if not exists
        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
            
            // Add tooltip styles
            const style = document.createElement('style');
            style.textContent = `
                .custom-tooltip {
                    position: absolute;
                    background-color: #333;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    z-index: 1000;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s;
                    max-width: 250px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }
                
                .custom-tooltip::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #333;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add events to elements with title
        elementsWithTitle.forEach(element => {
            // Store title value and remove it to prevent default tooltip
            const title = element.getAttribute('title');
            element.removeAttribute('title');
            element.setAttribute('data-tooltip', title);
            
            // Show tooltip on mouseenter
            element.addEventListener('mouseenter', (e) => {
                tooltip.textContent = title;
                tooltip.style.opacity = '1';
                
                // Position tooltip
                const rect = element.getBoundingClientRect();
                const tooltipWidth = tooltip.offsetWidth;
                const left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                const top = rect.top - tooltip.offsetHeight - 10;
                
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });
            
            // Hide tooltip on mouseleave
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        });
    }

    initDiagrams() {
        // Find all diagrams
        const diagrams = document.querySelectorAll('.diagram');
        
        if (diagrams.length === 0) return;
        
        // Add zoom effect to diagrams
        diagrams.forEach(diagram => {
            diagram.addEventListener('mouseenter', () => {
                const img = diagram.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.02)';
                    img.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                }
            });
            
            diagram.addEventListener('mouseleave', () => {
                const img = diagram.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                    img.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
            });
        });
    }
}

// Initialize the interactive content manager when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveContent = new InteractiveContentManager();
});
