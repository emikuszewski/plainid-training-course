/**
 * Certificate Generator
 * 
 * Creates personalized certificates for course completion:
 * - User name customization
 * - Download as PDF/image
 * - Social sharing
 * - Animated effects
 */
class CertificateGenerator {
    constructor() {
        this.certificateElement = document.querySelector('.certificate');
        if (!this.certificateElement) return;
        
        this.nameElement = this.certificateElement.querySelector('.certificate-name');
        this.dateElement = this.certificateElement.querySelector('.certificate-date');
        
        this.init();
    }

    init() {
        this.enhanceCertificateDesign();
        this.makeNameEditable();
        this.addDownloadButton();
        this.addSharingOptions();
    }

    enhanceCertificateDesign() {
        // Add certificate animation effects
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .certificate {
                position: relative;
                animation: certificate-glow 3s infinite alternate;
                transition: transform 0.5s ease;
            }
            
            .certificate:hover {
                transform: scale(1.02);
            }
            
            @keyframes certificate-glow {
                0% {
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                100% {
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 215, 0, 0.1);
                }
            }
            
            .certificate::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 2px dashed goldenrod;
                border-radius: var(--border-radius);
                opacity: 0.2;
                pointer-events: none;
                animation: rotate 120s linear infinite;
            }
            
            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            
            .certificate-download-btn {
                margin-top: 20px;
                background-color: #8b0000;
                border: none;
                color: white;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .certificate-download-btn:hover {
                background-color: #6d0000;
            }
            
            .certificate-share {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 15px;
            }
            
                    `
        
        document.head.appendChild(styleElement);
        
        // Add ribbon
        const ribbon = document.createElement('div');
        ribbon.className = 'certificate-ribbon';
        ribbon.innerHTML = `
            <svg width="120" height="120" viewBox="0 0 120 120">
                <path d="M0,0 L120,0 L120,120 Z" fill="goldenrod"></path>
                <text x="30" y="30" transform="rotate(45, 60, 0)" fill="white" font-weight="bold" font-size="12">CERTIFIED</text>
            </svg>
        `;
        
        this.certificateElement.style.position = 'relative';
        this.certificateElement.style.overflow = 'hidden';
        this.certificateElement.appendChild(ribbon);
        
        // Add ribbon styles
        const ribbonStyle = document.createElement('style');
        ribbonStyle.textContent = `
            .certificate-ribbon {
                position: absolute;
                top: 0;
                right: 0;
                width: 120px;
                height: 120px;
                overflow: hidden;
                pointer-events: none;
            }
        `;
        document.head.appendChild(ribbonStyle);
        
        // Update date to current date
        if (this.dateElement) {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            this.dateElement.textContent = `Date: ${formattedDate}`;
        }
    }

    makeNameEditable() {
        if (!this.nameElement) return;
        
        // Add editable indicator
        this.nameElement.setAttribute('data-tooltip', 'Click to edit your name');
        this.nameElement.style.cursor = 'pointer';
        
        // Add edit icon
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-icon';
        editIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87L20.71,7.04Z"></path>
                <path fill="currentColor" d="M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path>
            </svg>
        `;
        editIcon.style.cssText = `
            margin-left: 10px;
            opacity: 0.5;
            transition: opacity 0.3s;
        `;
        
        this.nameElement.appendChild(editIcon);
        
        // Show icon on hover
        this.nameElement.addEventListener('mouseenter', () => {
            editIcon.style.opacity = '1';
        });
        
        this.nameElement.addEventListener('mouseleave', () => {
            if (!this.nameElement.hasAttribute('contenteditable') || this.nameElement.getAttribute('contenteditable') !== 'true') {
                editIcon.style.opacity = '0.5';
            }
        });
        
        // Make name editable on click
        this.nameElement.addEventListener('click', () => {
            // If already editing, return
            if (this.nameElement.getAttribute('contenteditable') === 'true') {
                return;
            }
            
            // Store original text
            const originalText = this.nameElement.textContent;
            
            // Remove edit icon temporarily
            if (editIcon.parentNode) {
                editIcon.parentNode.removeChild(editIcon);
            }
            
            // Make editable
            this.nameElement.setAttribute('contenteditable', 'true');
            this.nameElement.focus();
            
            // Select all text
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(this.nameElement);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Add styling
            this.nameElement.style.border = '2px dashed var(--primary)';
            this.nameElement.style.padding = '5px 10px';
            this.nameElement.style.background = 'rgba(0, 115, 230, 0.05)';
            
            // Handle save on blur
            const saveName = () => {
                this.nameElement.removeAttribute('contenteditable');
                this.nameElement.style.border = 'none';
                this.nameElement.style.borderBottom = '2px dotted goldenrod';
                this.nameElement.style.padding = '0 20px 5px';
                this.nameElement.style.background = 'transparent';
                
                // Add edit icon back
                this.nameElement.appendChild(editIcon);
                editIcon.style.opacity = '0.5';
                
                // Save name if changed and not empty
                if (this.nameElement.textContent.trim() !== originalText && this.nameElement.textContent.trim() !== '') {
                    if (window.userProgress) {
                        window.userProgress.userName = this.nameElement.textContent.trim();
                        if (window.saveProgress) {
                            window.saveProgress();
                        }
                    }
                    
                    if (window.showNotification) {
                        window.showNotification('Your name has been saved on the certificate!', 'success');
                    }
                } else if (this.nameElement.textContent.trim() === '') {
                    // Restore original if empty
                    this.nameElement.textContent = originalText;
                    this.nameElement.appendChild(editIcon);
                }
                
                // Remove event listener
                this.nameElement.removeEventListener('blur', saveName);
            };
            
            this.nameElement.addEventListener('blur', saveName);
            
            // Also save on Enter key
            this.nameElement.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
        });
    }

    addDownloadButton() {
        if (!this.certificateElement) return;
        
        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn certificate-download-btn';
        downloadBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"></path>
            </svg>
            Download Certificate
        `;
        
        // Add click event
        downloadBtn.addEventListener('click', () => {
            // Show notification that this is just a demo
            if (window.showNotification) {
                window.showNotification('This is a demo feature. In a real implementation, this would generate a downloadable PDF.', 'info', 5000);
            } else {
                alert('This is a demo feature. In a real implementation, this would generate a downloadable PDF.');
            }
        });
        
        this.certificateElement.appendChild(downloadBtn);
        
        // Add sharing options
        const shareContainer = document.createElement('div');
        shareContainer.className = 'certificate-share';
        shareContainer.innerHTML = `
            <div class="share-icon linkedin" title="Share on LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"></path>
                </svg>
            </div>
            <div class="share-icon twitter" title="Share on Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"></path>
                </svg>
            </div>
            <div class="share-icon facebook" title="Share on Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"></path>
                </svg>
            </div>
        `;
        
        // Add click events for share icons
        shareContainer.querySelectorAll('.share-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                if (window.showNotification) {
                    window.showNotification('This is a demo feature. In a real implementation, this would open a share dialog.', 'info', 5000);
                } else {
                    alert('This is a demo feature. In a real implementation, this would open a share dialog.');
                }
            });
        });
        
        this.certificateElement.appendChild(shareContainer);
    }

    addSharingOptions() {
        // Already implemented in addDownloadButton
    }
}

// Initialize the certificate generator when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.certificateGenerator = new CertificateGenerator();
});.facebook {
                background-color: #4267B2;
                color: white;
            }
            
            .share-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .share-icon:hover {
                transform: translateY(-3px);
            }
            
            .share-icon.linkedin {
                background-color: #0077b5;
                color: white;
            }
            
            .share-icon.twitter {
                background-color: #1da1f2;
                color: white;
            }
            
            .share-icon
