/**
 * Interactive Diagrams for PlainID Training
 * 
 * This module creates interactive SVG-based diagrams for the training course
 * with hover effects, clickable regions, and animations to enhance learning.
 */

class InteractiveDiagrams {
    constructor() {
        this.diagrams = [];
        this.initialized = false;
        this.init();
    }

    init() {
        // Check if we have the necessary SVG elements
        if (document.querySelectorAll('.interactive-diagram').length === 0) {
            // Create placeholder diagrams if needed
            this.createDiagrams();
        }

        // Initialize existing diagrams
        this.initializeDiagrams();
        this.initialized = true;

        // Add window resize handler for responsive diagrams
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    createDiagrams() {
        // This would be called if diagrams don't exist in the HTML yet
        // For this demo, we'll create and inject the diagrams into specified containers

        // Authentication vs Authorization Diagram
        this.createAuthDiagram();
        
        // Access Control Models Evolution Diagram
        this.createAccessControlModelsDiagram();
        
        // PlainID Architecture Diagram
        this.createArchitectureDiagram();
        
        // Policy Modeling Diagram
        this.createPolicyModelingDiagram();
    }

    createAuthDiagram() {
        // Find container or create one if needed
        let container = document.querySelector('#auth-diagram-container');
        if (!container) {
            // Look for first diagram container in Module 1, Lesson 1
            container = document.querySelector('#module1-lesson1 .diagram');
            if (!container) return; // No suitable container found
        }

        // Create the SVG content
        const svgContent = `
        <div class="interactive-diagram" id="auth-vs-authn-diagram">
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect x="0" y="0" width="800" height="400" fill="#f8f9fa" rx="10" ry="10" />
                
                <!-- Title -->
                <text x="400" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#2a3b4c">Authentication vs. Authorization</text>
                
                <!-- Authentication Section -->
                <g class="section authentication" data-section="authentication">
                    <rect x="50" y="80" width="300" height="280" fill="#e3f2fd" stroke="#90caf9" stroke-width="2" rx="10" ry="10" />
                    <text x="200" y="110" text-anchor="middle" font-size="20" font-weight="bold" fill="#1565c0">Authentication (AuthN)</text>
                    <text x="200" y="140" text-anchor="middle" font-size="16" fill="#333">Verifies WHO you are</text>
                    
                    <!-- User Icon -->
                    <circle cx="200" cy="190" r="40" fill="#bbdefb" stroke="#1976d2" stroke-width="2" />
                    <circle cx="200" cy="175" r="15" fill="#1976d2" />
                    <path d="M165 220 Q200 260 235 220" stroke="#1976d2" stroke-width="2" fill="none" />
                    
                    <!-- Authentication Methods -->
                    <g class="auth-method" data-item="password">
                        <rect x="80" y="250" width="100" height="30" rx="15" ry="15" fill="#90caf9" class="hoverable" />
                        <text x="130" y="270" text-anchor="middle" font-size="12" fill="#333">Password</text>
                    </g>
                    <g class="auth-method" data-item="mfa">
                        <rect x="190" y="250" width="100" height="30" rx="15" ry="15" fill="#90caf9" class="hoverable" />
                        <text x="240" y="270" text-anchor="middle" font-size="12" fill="#333">MFA</text>
                    </g>
                    <g class="auth-method" data-item="biometrics">
                        <rect x="80" y="290" width="100" height="30" rx="15" ry="15" fill="#90caf9" class="hoverable" />
                        <text x="130" y="310" text-anchor="middle" font-size="12" fill="#333">Biometrics</text>
                    </g>
                    <g class="auth-method" data-item="certificates">
                        <rect x="190" y="290" width="100" height="30" rx="15" ry="15" fill="#90caf9" class="hoverable" />
                        <text x="240" y="310" text-anchor="middle" font-size="12" fill="#333">Certificates</text>
                    </g>
                </g>
                
                <!-- Authorization Section -->
                <g class="section authorization" data-section="authorization">
                    <rect x="450" y="80" width="300" height="280" fill="#e8f5e9" stroke="#a5d6a7" stroke-width="2" rx="10" ry="10" />
                    <text x="600" y="110" text-anchor="middle" font-size="20" font-weight="bold" fill="#2e7d32">Authorization (AuthZ)</text>
                    <text x="600" y="140" text-anchor="middle" font-size="16" fill="#333">Determines WHAT you can do</text>
                    
                    <!-- Access Control Icon -->
                    <rect x="550" y="170" width="100" height="60" fill="#c8e6c9" stroke="#388e3c" stroke-width="2" rx="5" ry="5" />
                    <path d="M550 170 L650 170 L650 230 L550 230 Z" fill="none" stroke="#388e3c" stroke-width="2" />
                    <circle cx="600" cy="200" r="15" fill="#c8e6c9" stroke="#388e3c" stroke-width="2" />
                    <rect x="595" y="185" width="10" height="30" fill="#388e3c" />
                    
                    <!-- Authorization Types -->
                    <g class="auth-type" data-item="rbac">
                        <rect x="480" y="250" width="100" height="30" rx="15" ry="15" fill="#a5d6a7" class="hoverable" />
                        <text x="530" y="270" text-anchor="middle" font-size="12" fill="#333">RBAC</text>
                    </g>
                    <g class="auth-type" data-item="abac">
                        <rect x="590" y="250" width="100" height="30" rx="15" ry="15" fill="#a5d6a7" class="hoverable" />
                        <text x="640" y="270" text-anchor="middle" font-size="12" fill="#333">ABAC</text>
                    </g>
                    <g class="auth-type" data-item="pbac">
                        <rect x="480" y="290" width="100" height="30" rx="15" ry="15" fill="#a5d6a7" class="hoverable" />
                        <text x="530" y="310" text-anchor="middle" font-size="12" fill="#333">PBAC</text>
                    </g>
                    <g class="auth-type" data-item="mac">
                        <rect x="590" y="290" width="100" height="30" rx="15" ry="15" fill="#a5d6a7" class="hoverable" />
                        <text x="640" y="310" text-anchor="middle" font-size="12" fill="#333">MAC</text>
                    </g>
                </g>
                
                <!-- Flow Arrow -->
                <path d="M370 200 L430 200" stroke="#666" stroke-width="3" />
                <polygon points="425,195 440,200 425,205" fill="#666" />
                
                <!-- Tooltips container -->
                <g class="tooltips" style="opacity: 0; pointer-events: none;">
                    <g class="tooltip" id="tooltip-password">
                        <rect x="50" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="60" y="360" font-size="12" fill="#333">Password authentication relies on</text>
                        <text x="60" y="380" font-size="12" fill="#333">something the user knows.</text>
                    </g>
                    <g class="tooltip" id="tooltip-mfa">
                        <rect x="50" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="60" y="360" font-size="12" fill="#333">Multi-Factor Authentication requires</text>
                        <text x="60" y="380" font-size="12" fill="#333">multiple verification methods.</text>
                    </g>
                    <g class="tooltip" id="tooltip-biometrics">
                        <rect x="50" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="60" y="360" font-size="12" fill="#333">Biometric authentication uses</text>
                        <text x="60" y="380" font-size="12" fill="#333">physical characteristics (fingerprint, face).</text>
                    </g>
                    <g class="tooltip" id="tooltip-certificates">
                        <rect x="50" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="60" y="360" font-size="12" fill="#333">Certificates authenticate using</text>
                        <text x="60" y="380" font-size="12" fill="#333">cryptographic methods.</text>
                    </g>
                    <g class="tooltip" id="tooltip-rbac">
                        <rect x="550" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="560" y="360" font-size="12" fill="#333">Role-Based Access Control assigns</text>
                        <text x="560" y="380" font-size="12" fill="#333">permissions based on user roles.</text>
                    </g>
                    <g class="tooltip" id="tooltip-abac">
                        <rect x="550" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="560" y="360" font-size="12" fill="#333">Attribute-Based Access Control uses</text>
                        <text x="560" y="380" font-size="12" fill="#333">user, resource, and environment attributes.</text>
                    </g>
                    <g class="tooltip" id="tooltip-pbac">
                        <rect x="550" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="560" y="360" font-size="12" fill="#333">Policy-Based Access Control centralizes</text>
                        <text x="560" y="380" font-size="12" fill="#333">authorization logic in policies.</text>
                    </g>
                    <g class="tooltip" id="tooltip-mac">
                        <rect x="550" y="340" width="200" height="50" fill="white" stroke="#333" stroke-width="1" rx="5" ry="5" />
                        <text x="560" y="360" font-size="12" fill="#333">Mandatory Access Control enforces</text>
                        <text x="560" y="380" font-size="12" fill="#333">access based on security classifications.</text>
                    </g>
                </g>
            </svg>
        </div>
        `;
        
        // Insert into container
        container.innerHTML = svgContent;
        
        // Add to diagrams collection
        this.diagrams.push({
            id: 'auth-vs-authn-diagram',
            element: container.querySelector('#auth-vs-authn-diagram'),
            type: 'authentication-authorization'
        });
    }

    createAccessControlModelsDiagram() {
        // Find container in Module 1, Lesson 2
        let container = document.querySelector('#module1-lesson2 .diagram');
        if (!container) return; // No suitable container found
        
        // Create the SVG content
        const svgContent = `
        <div class="interactive-diagram" id="access-control-models-diagram">
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" rx="10" ry="10" />
                
                <!-- Title -->
                <text x="400" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#2a3b4c">Evolution of Access Control Models</text>
                
                <!-- Timeline -->
                <line x1="100" y1="450" x2="700" y2="450" stroke="#999" stroke-width="4" />
                <text x="100" y="480" text-anchor="middle" font-size="14" fill="#666">Early 1970s</text>
                <text x="250" y="480" text-anchor="middle" font-size="14" fill="#666">Late 1970s</text>
                <text x="400" y="480" text-anchor="middle" font-size="14" fill="#666">1990s</text>
                <text x="550" y="480" text-anchor="middle" font-size="14" fill="#666">2000s</text>
                <text x="700" y="480" text-anchor="middle" font-size="14" fill="#666">Present</text>
                
                <!-- Timeline points -->
                <circle cx="100" cy="450" r="10" fill="#999" />
                <circle cx="250" cy="450" r="10" fill="#999" />
                <circle cx="400" cy="450" r="10" fill="#999" />
                <circle cx="550" cy="450" r="10" fill="#999" />
                <circle cx="700" cy="450" r="10" fill="#999" />
                
                <!-- DAC Box -->
                <g class="model-box" data-model="dac">
                    <rect x="50" y="300" width="100" height="120" fill="#ffecb3" stroke="#ffc107" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="100" y="330" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">DAC</text>
                    <line x1="70" y1="340" x2="130" y2="340" stroke="#333" stroke-width="1" />
                    <text x="100" y="365" text-anchor="middle" font-size="12" fill="#333">Discretionary</text>
                    <text x="100" y="385" text-anchor="middle" font-size="12" fill="#333">Access</text>
                    <text x="100" y="405" text-anchor="middle" font-size="12" fill="#333">Control</text>
                </g>
                
                <!-- MAC Box -->
                <g class="model-box" data-model="mac">
                    <rect x="200" y="300" width="100" height="120" fill="#ffecb3" stroke="#ffc107" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="250" y="330" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">MAC</text>
                    <line x1="220" y1="340" x2="280" y2="340" stroke="#333" stroke-width="1" />
                    <text x="250" y="365" text-anchor="middle" font-size="12" fill="#333">Mandatory</text>
                    <text x="250" y="385" text-anchor="middle" font-size="12" fill="#333">Access</text>
                    <text x="250" y="405" text-anchor="middle" font-size="12" fill="#333">Control</text>
                </g>
                
                <!-- RBAC Box -->
                <g class="model-box" data-model="rbac">
                    <rect x="350" y="300" width="100" height="120" fill="#c8e6c9" stroke="#4caf50" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="400" y="330" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">RBAC</text>
                    <line x1="370" y1="340" x2="430" y2="340" stroke="#333" stroke-width="1" />
                    <text x="400" y="365" text-anchor="middle" font-size="12" fill="#333">Role-Based</text>
                    <text x="400" y="385" text-anchor="middle" font-size="12" fill="#333">Access</text>
                    <text x="400" y="405" text-anchor="middle" font-size="12" fill="#333">Control</text>
                </g>
                
                <!-- ABAC Box -->
                <g class="model-box" data-model="abac">
                    <rect x="500" y="300" width="100" height="120" fill="#bbdefb" stroke="#2196f3" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="550" y="330" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">ABAC</text>
                    <line x1="520" y1="340" x2="580" y2="340" stroke="#333" stroke-width="1" />
                    <text x="550" y="365" text-anchor="middle" font-size="12" fill="#333">Attribute-Based</text>
                    <text x="550" y="385" text-anchor="middle" font-size="12" fill="#333">Access</text>
                    <text x="550" y="405" text-anchor="middle" font-size="12" fill="#333">Control</text>
                </g>
                
                <!-- PBAC Box -->
                <g class="model-box" data-model="pbac">
                    <rect x="650" y="300" width="100" height="120" fill="#d1c4e9" stroke="#673ab7" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="700" y="330" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">PBAC</text>
                    <line x1="670" y1="340" x2="730" y2="340" stroke="#333" stroke-width="1" />
                    <text x="700" y="365" text-anchor="middle" font-size="12" fill="#333">Policy-Based</text>
                    <text x="700" y="385" text-anchor="middle" font-size="12" fill="#333">Access</text>
                    <text x="700" y="405" text-anchor="middle" font-size="12" fill="#333">Control</text>
                </g>
                
                <!-- Lines connecting to timeline -->
                <line x1="100" y1="420" x2="100" y2="450" stroke="#999" stroke-width="2" />
                <line x1="250" y1="420" x2="250" y2="450" stroke="#999" stroke-width="2" />
                <line x1="400" y1="420" x2="400" y2="450" stroke="#999" stroke-width="2" />
                <line x1="550" y1="420" x2="550" y2="450" stroke="#999" stroke-width="2" />
                <line x1="700" y1="420" x2="700" y2="450" stroke="#999" stroke-width="2" />
                
                <!-- Evolution curve showing flexibility and complexity -->
                <path d="M100 250 Q250 270 400 200 T700 100" stroke="#ff7043" stroke-width="3" fill="none" />
                <text x="120" y="230" font-size="14" fill="#ff7043">Flexibility</text>
                <text x="120" y="250" font-size="14" fill="#ff7043">& Complexity</text>
                <polygon points="695,95 710,95 700,85" fill="#ff7043" />
                
                <!-- PlainID Focus Area -->
                <rect x="600" y="80" width="150" height="60" fill="rgba(103, 58, 183, 0.1)" stroke="#673ab7" stroke-width="2" rx="10" ry="10" stroke-dasharray="5,5" />
                <text x="675" y="115" text-anchor="middle" font-size="14" font-weight="bold" fill="#673ab7">PlainID Focus</text>
                
                <!-- Detail Panels -->
                <g class="panel-container" style="opacity: 0; pointer-events: none;">
                    <g class="detail-panel" id="panel-dac">
                        <rect x="150" y="100" width="500" height="180" fill="white" stroke="#ffc107" stroke-width="2" rx="10" ry="10" />
                        <text x="400" y="130" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Discretionary Access Control (DAC)</text>
                        <text x="170" y="160" font-size="14" fill="#333">• Object owner determines who can access resources</text>
                        <text x="170" y="190" font-size="14" fill="#333">• Common in early OS file permissions</text>
                        <text x="170" y="220" font-size="14" fill="#333">• Simple but lacks central administration</text>
                        <text x="170" y="250" font-size="14" fill="#333">• Vulnerable to Trojan horse attacks</text>
                    </g>
                    <g class="detail-panel" id="panel-mac">
                        <rect x="150" y="100" width="500" height="180" fill="white" stroke="#ffc107" stroke-width="2" rx="10" ry="10" />
                        <text x="400" y="130" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Mandatory Access Control (MAC)</text>
                        <text x="170" y="160" font-size="14" fill="#333">• System-enforced access based on security classifications</text>
                        <text x="170" y="190" font-size="14" fill="#333">• Used in military and high-security environments</text>
                        <text x="170" y="220" font-size="14" fill="#333">• Rigid and centrally administered</text>
                        <text x="170" y="250" font-size="14" fill="#333">• Examples: SELinux, MLS</text>
                    </g>
                    <g class="detail-panel" id="panel-rbac">
                        <rect x="150" y="100" width="500" height="180" fill="white" stroke="#4caf50" stroke-width="2" rx="10" ry="10" />
                        <text x="400" y="130" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Role-Based Access Control (RBAC)</text>
                        <text x="170" y="160" font-size="14" fill="#333">• Permissions assigned to roles, roles assigned to users</text>
                        <text x="170" y="190" font-size="14" fill="#333">• Simplifies access management</text>
                        <text x="170" y="220" font-size="14" fill="#333">• Widely adopted in enterprise applications</text>
                        <text x="170" y="250" font-size="14" fill="#333">• Limited in handling context-specific permissions</text>
                    </g>
                    <g class="detail-panel" id="panel-abac">
                        <rect x="150" y="100" width="500" height="180" fill="white" stroke="#2196f3" stroke-width="2" rx="10" ry="10" />
                        <text x="400" y="130" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Attribute-Based Access Control (ABAC)</text>
                        <text x="170" y="160" font-size="14" fill="#333">• Uses attributes about user, resource, and environment</text>
                        <text x="170" y="190" font-size="14" fill="#333">• Highly flexible for complex scenarios</text>
                        <text x="170" y="220" font-size="14" fill="#333">• Can be computationally intensive</text>
                        <text x="170" y="250" font-size="14" fill="#333">• Implementation complexity can be challenging</text>
                    </g>
                    <g class="detail-panel" id="panel-pbac">
                        <rect x="150" y="100" width="500" height="180" fill="white" stroke="#673ab7" stroke-width="2" rx="10" ry="10" />
                        <text x="400" y="130" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">Policy-Based Access Control (PBAC)</text>
                        <text x="170" y="160" font-size="14" fill="#333">• Centralizes authorization logic in policies</text>
                        <text x="170" y="190" font-size="14" fill="#333">• Combines elements of RBAC and ABAC</text>
                        <text x="170" y="220" font-size="14" fill="#333">• Policies are externalized from application code</text>
                        <text x="170" y="250" font-size="14" fill="#333">• PlainID's approach for enterprise authorization</text>
                    </g>
                </g>
            </svg>
        </div>
        `;
        
        // Insert into container
        container.innerHTML = svgContent;
        
        // Add to diagrams collection
        this.diagrams.push({
            id: 'access-control-models-diagram',
            element: container.querySelector('#access-control-models-diagram'),
            type: 'access-control-models'
        });
    }

    createArchitectureDiagram() {
        // Find container in Module 2, Lesson 1
        let container = document.querySelector('#module2-lesson1 .diagram');
        if (!container) return; // No suitable container found
        
        // Create the SVG content
        const svgContent = `
        <div class="interactive-diagram" id="plainid-architecture-diagram">
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" rx="10" ry="10" />
                
                <!-- Title -->
                <text x="400" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#2a3b4c">PlainID Platform Architecture</text>
                
                <!-- Applications Layer -->
                <g class="layer" data-layer="applications">
                    <rect x="50" y="80" width="700" height="80" fill="#e3f2fd" stroke="#90caf9" stroke-width="2" rx="5" ry="5" />
                    <text x="400" y="110" text-anchor="middle" font-size="18" font-weight="bold" fill="#1565c0">Applications</text>
                    
                    <g class="component" data-component="web-app">
                        <rect x="100" y="90" width="120" height="60" fill="#bbdefb" stroke="#1976d2" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="160" y="125" text-anchor="middle" font-size="14" fill="#333">Web Apps</text>
                    </g>
                    
                    <g class="component" data-component="mobile-app">
                        <rect x="240" y="90" width="120" height="60" fill="#bbdefb" stroke="#1976d2" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="300" y="125" text-anchor="middle" font-size="14" fill="#333">Mobile Apps</text>
                    </g>
                    
                    <g class="component" data-component="api">
                        <rect x="380" y="90" width="120" height="60" fill="#bbdefb" stroke="#1976d2" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="440" y="125" text-anchor="middle" font-size="14" fill="#333">APIs</text>
                    </g>
                    
                    <g class="component" data-component="microservices">
                        <rect x="520" y="90" width="120" height="60" fill="#bbdefb" stroke="#1976d2" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="580" y="125" text-anchor="middle" font-size="14" fill="#333">Microservices</text>
                    </g>
                </g>
                
                <!-- Policy Enforcement Layer -->
                <g class="layer" data-layer="enforcement">
                    <rect x="50" y="180" width="700" height="80" fill="#e8f5e9" stroke="#a5d6a7" stroke-width="2" rx="5" ry="5" />
                    <text x="400" y="210" text-anchor="middle" font-size="18" font-weight="bold" fill="#2e7d32">Policy Enforcement Layer</text>
                    
                    <g class="component" data-component="api-gateway">
                        <rect x="100" y="190" width="160" height="60" fill="#c8e6c9" stroke="#388e3c" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="180" y="225" text-anchor="middle" font-size="14" fill="#333">API Gateway</text>
                    </g>
                    
                    <g class="component" data-component="service-mesh">
                        <rect x="280" y="190" width="160" height="60" fill="#c8e6c9" stroke="#388e3c" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="360" y="225" text-anchor="middle" font-size="14" fill="#333">Service Mesh</text>
                    </g>
                    
                    <g class="component" data-component="pdp-agent">
                        <rect x="460" y="190" width="160" height="60" fill="#c8e6c9" stroke="#388e3c" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="540" y="225" text-anchor="middle" font-size="14" fill="#333">PDP Agents</text>
                    </g>
                </g>
                
                <!-- Authorization Service Layer -->
                <g class="layer" data-layer="authorization">
                    <rect x="50" y="280" width="700" height="100" fill="#d1c4e9" stroke="#9575cd" stroke-width="2" rx="5" ry="5" />
                    <text x="400" y="310" text-anchor="middle" font-size="18" font-weight="bold" fill="#4527a0">Authorization Services</text>
                    
                    <g class="component" data-component="pdp">
                        <rect x="100" y="320" width="200" height="50" fill="#b39ddb" stroke="#673ab7" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="200" y="350" text-anchor="middle" font-size="14" fill="#333">Policy Decision Point (PDP)</text>
                    </g>
                    
                    <g class="component" data-component="pip">
                        <rect x="320" y="320" width="200" height="50" fill="#b39ddb" stroke="#673ab7" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="420" y="350" text-anchor="middle" font-size="14" fill="#333">Policy Information Point (PIP)</text>
                    </g>
                    
                    <g class="component" data-component="pap">
                        <rect x="540" y="320" width="160" height="50" fill="#b39ddb" stroke="#673ab7" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="620" y="350" text-anchor="middle" font-size="14" fill="#333">Policy Admin Point</text>
                    </g>
                </g>
                
                <!-- Management Layer -->
                <g class="layer" data-layer="management">
                    <rect x="50" y="400" width="700" height="80" fill="#ffecb3" stroke="#ffca28" stroke-width="2" rx="5" ry="5" />
                    <text x="400" y="430" text-anchor="middle" font-size="18" font-weight="bold" fill="#f57f17">Management Plane</text>
                    
                    <g class="component" data-component="policy-manager">
                        <rect x="100" y="410" width="160" height="60" fill="#ffe082" stroke="#ffa000" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="180" y="445" text-anchor="middle" font-size="14" fill="#333">Policy Manager</text>
                    </g>
                    
                    <g class="component" data-component="admin-console">
                        <rect x="280" y="410" width="160" height="60" fill="#ffe082" stroke="#ffa000" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="360" y="445" text-anchor="middle" font-size="14" fill="#333">Admin Console</text>
                    </g>
                    
                    <g class="component" data-component="analytics">
                        <rect x="460" y="410" width="160" height="60" fill="#ffe082" stroke="#ffa000" stroke-width="1" rx="5" ry="5" class="hoverable" />
                        <text x="540" y="445" text-anchor="middle" font-size="14" fill="#333">Analytics & Audit</text>
                    </g>
                </g>
                
                <!-- Connection Lines -->
                <g class="connections">
                    <path d="M160 150 L160 190" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M300 150 L300 190" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M440 150 L440 190" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M580 150 L580 190" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    
                    <path d="M180 250 L200 320" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M360 250 L420 320" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M540 250 L620 320" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    
                    <path d="M200 370 L180 410" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M420 370 L360 410" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                    <path d="M620 370 L540 410" stroke="#666" stroke-width="1.5" stroke-dasharray="5,3" />
                </g>
                
                <!-- Component Details -->
                <g class="component-details" style="opacity: 0; pointer-events: none;">
                    <g class="detail-box" id="detail-pdp">
                        <rect x="550" y="100" width="220" height="160" fill="white" stroke="#673ab7" stroke-width="2" rx="10" ry="10" />
                        <text x="660" y="125" text-anchor="middle" font-size="16" font-weight="bold" fill="#673ab7">Policy Decision Point</text>
                        <line x1="570" y1="135" x2="750" y2="135" stroke="#673ab7" stroke-width="1" />
                        <text x="570" y="160" font-size="13" fill="#333">• Evaluates authorization</text>
                        <text x="570" y="185" font-size="13" fill="#333">• Applies policy rules</text>
                        <text x="570" y="210" font-size="13" fill="#333">• Returns permit/deny</text>
                        <text x="570" y="235" font-size="13" fill="#333">• High performance</text>
                    </g>
                    
                    <g class="detail-box" id="detail-pip">
                        <rect x="550" y="100" width="220" height="160" fill="white" stroke="#673ab7" stroke-width="2" rx="10" ry="10" />
                        <text x="660" y="125" text-anchor="middle" font-size="16" font-weight="bold" fill="#673ab7">Policy Information Point</text>
                        <line x1="570" y1="135" x2="750" y2="135" stroke="#673ab7" stroke-width="1" />
                        <text x="570" y="160" font-size="13" fill="#333">• Provides context data</text>
                        <text x="570" y="185" font-size="13" fill="#333">• Connects to data sources</text>
                        <text x="570" y="210" font-size="13" fill="#333">• Retrieves attributes</text>
                        <text x="570" y="235" font-size="13" fill="#333">• Caches information</text>
                    </g>
                    
                    <g class="detail-box" id="detail-pap">
                        <rect x="550" y="100" width="220" height="160" fill="white" stroke="#673ab7" stroke-width="2" rx="10" ry="10" />
                        <text x="660" y="125" text-anchor="middle" font-size="16" font-weight="bold" fill="#673ab7">Policy Admin Point</text>
                        <line x1="570" y1="135" x2="750" y2="135" stroke="#673ab7" stroke-width="1" />
                        <text x="570" y="160" font-size="13" fill="#333">• Manages policies</text>
                        <text x="570" y="185" font-size="13" fill="#333">• Policy versioning</text>
                        <text x="570" y="210" font-size="13" fill="#333">• Policy distribution</text>
                        <text x="570" y="235" font-size="13" fill="#333">• Policy lifecycle</text>
                    </g>
                    
                    <!-- Additional component details would go here -->
                </g>
                
                <!-- Layer Information Box -->
                <g class="layer-info" style="opacity: 0; pointer-events: none;">
                    <g class="info-box" id="info-applications">
                        <rect x="30" y="180" width="220" height="100" fill="white" stroke="#1565c0" stroke-width="2" rx="10" ry="10" />
                        <text x="140" y="205" text-anchor="middle" font-size="16" font-weight="bold" fill="#1565c0">Applications Layer</text>
                        <line x1="50" y1="215" x2="230" y2="215" stroke="#1565c0" stroke-width="1" />
                        <text x="50" y="240" font-size="13" fill="#333">Client applications that need</text>
                        <text x="50" y="260" font-size="13" fill="#333">authorization decisions to</text>
                        <text x="50" y="280" font-size="13" fill="#333">control user access.</text>
                    </g>
                    
                    <g class="info-box" id="info-enforcement">
                        <rect x="30" y="280" width="220" height="100" fill="white" stroke="#2e7d32" stroke-width="2" rx="10" ry="10" />
                        <text x="140" y="305" text-anchor="middle" font-size="16" font-weight="bold" fill="#2e7d32">Enforcement Layer</text>
                        <line x1="50" y1="315" x2="230" y2="315" stroke="#2e7d32" stroke-width="1" />
                        <text x="50" y="340" font-size="13" fill="#333">Components that intercept</text>
                        <text x="50" y="360" font-size="13" fill="#333">requests and enforce the</text>
                        <text x="50" y="380" font-size="13" fill="#333">authorization decisions.</text>
                    </g>
                    
                    <g class="info-box" id="info-authorization">
                        <rect x="30" y="390" width="220" height="100" fill="white" stroke="#4527a0" stroke-width="2" rx="10" ry="10" />
                        <text x="140" y="410" text-anchor="middle" font-size="15" font-weight="bold" fill="#4527a0">Authorization Services</text>
                        <line x1="50" y1="420" x2="230" y2="420" stroke="#4527a0" stroke-width="1" />
                        <text x="50" y="445" font-size="13" fill="#333">Core PlainID services that</text>
                        <text x="50" y="465" font-size="13" fill="#333">evaluate policies and make</text>
                        <text x="50" y="485" font-size="13" fill="#333">authorization decisions.</text>
                    </g>
                    
                    <g class="info-box" id="info-management">
                        <rect x="550" y="360" width="220" height="100" fill="white" stroke="#f57f17" stroke-width="2" rx="10" ry="10" />
                        <text x="660" y="385" text-anchor="middle" font-size="16" font-weight="bold" fill="#f57f17">Management Plane</text>
                        <line x1="570" y1="395" x2="750" y2="395" stroke="#f57f17" stroke-width="1" />
                        <text x="570" y="420" font-size="13" fill="#333">Tools for creating, managing,</text>
                        <text x="570" y="440" font-size="13" fill="#333">and monitoring policies and</text>
                        <text x="570" y="460" font-size="13" fill="#333">the authorization system.</text>
                    </g>
                </g>
            </svg>
        </div>
        `;
        
        // Insert into container
        container.innerHTML = svgContent;
        
        // Add to diagrams collection
        this.diagrams.push({
            id: 'plainid-architecture-diagram',
            element: container.querySelector('#plainid-architecture-diagram'),
            type: 'architecture'
        });
    }

    createPolicyModelingDiagram() {
        // Find container in Module 3, Lesson 1
        let container = document.querySelector('#module3-lesson1 .diagram');
        if (!container) return; // No suitable container found
        
        // Create the SVG content
        const svgContent = `
        <div class="interactive-diagram" id="policy-modeling-diagram">
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" rx="10" ry="10" />
                
                <!-- Title -->
                <text x="400" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#2a3b4c">Policy Modeling in PlainID</text>
                
                <!-- Policy Structure -->
                <rect x="50" y="80" width="700" height="380" fill="#e3f2fd" stroke="#90caf9" stroke-width="2" rx="10" ry="10" />
                
                <!-- Policy Box -->
                <g class="policy-component" data-component="policy">
                    <rect x="100" y="100" width="600" height="80" fill="#bbdefb" stroke="#1976d2" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="400" y="140" text-anchor="middle" font-size="20" font-weight="bold" fill="#1565c0">Policy</text>
                    <text x="400" y="170" text-anchor="middle" font-size="14" fill="#333">The container for all authorization rules and logic</text>
                </g>
                
                <!-- Rule Sets -->
                <g class="policy-component" data-component="rulesets">
                    <rect x="150" y="200" width="500" height="60" fill="#c8e6c9" stroke="#4caf50" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="400" y="235" text-anchor="middle" font-size="18" font-weight="bold" fill="#2e7d32">Rule Sets</text>
                </g>
                
                <!-- Individual Rules -->
                <g class="policy-component" data-component="rules">
                    <rect x="200" y="280" width="120" height="160" fill="#d1c4e9" stroke="#673ab7" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="260" y="305" text-anchor="middle" font-size="16" font-weight="bold" fill="#4527a0">Rules</text>
                    
                    <rect x="210" y="320" width="100" height="30" fill="#b39ddb" stroke="#673ab7" stroke-width="1" rx="3" ry="3" />
                    <text x="260" y="340" text-anchor="middle" font-size="12" fill="#333">Rule 1</text>
                    
                    <rect x="210" y="360" width="100" height="30" fill="#b39ddb" stroke="#673ab7" stroke-width="1" rx="3" ry="3" />
                    <text x="260" y="380" text-anchor="middle" font-size="12" fill="#333">Rule 2</text>
                    
                    <rect x="210" y="400" width="100" height="30" fill="#b39ddb" stroke="#673ab7" stroke-width="1" rx="3" ry="3" />
                    <text x="260" y="420" text-anchor="middle" font-size="12" fill="#333">Rule 3</text>
                </g>
                
                <!-- Conditions -->
                <g class="policy-component" data-component="conditions">
                    <rect x="340" y="280" width="120" height="160" fill="#ffecb3" stroke="#ffc107" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="400" y="305" text-anchor="middle" font-size="16" font-weight="bold" fill="#ff8f00">Conditions</text>
                    
                    <rect x="350" y="320" width="100" height="30" fill="#ffe082" stroke="#ffc107" stroke-width="1" rx="3" ry="3" />
                    <text x="400" y="340" text-anchor="middle" font-size="12" fill="#333">User Attribute</text>
                    
                    <rect x="350" y="360" width="100" height="30" fill="#ffe082" stroke="#ffc107" stroke-width="1" rx="3" ry="3" />
                    <text x="400" y="380" text-anchor="middle" font-size="12" fill="#333">Resource Attr</text>
                    
                    <rect x="350" y="400" width="100" height="30" fill="#ffe082" stroke="#ffc107" stroke-width="1" rx="3" ry="3" />
                    <text x="400" y="420" text-anchor="middle" font-size="12" fill="#333">Environment</text>
                </g>
                
                <!-- Actions -->
                <g class="policy-component" data-component="actions">
                    <rect x="480" y="280" width="120" height="160" fill="#f8bbd0" stroke="#e91e63" stroke-width="2" rx="5" ry="5" class="hoverable" />
                    <text x="540" y="305" text-anchor="middle" font-size="16" font-weight="bold" fill="#c2185b">Actions</text>
                    
                    <rect x="490" y="320" width="100" height="30" fill="#f48fb1" stroke="#e91e63" stroke-width="1" rx="3" ry="3" />
                    <text x="540" y="340" text-anchor="middle" font-size="12" fill="#333">Read</text>
                    
                    <rect x="490" y="360" width="100" height="30" fill="#f48fb1" stroke="#e91e63" stroke-width="1" rx="3" ry="3" />
                    <text x="540" y="380" text-anchor="middle" font-size="12" fill="#333">Write</text>
                    
                    <rect x="490" y="400" width="100" height="30" fill="#f48fb1" stroke="#e91e63" stroke-width="1" rx="3" ry="3" />
                    <text x="540" y="420" text-anchor="middle" font-size="12" fill="#333">Execute</text>
                </g>
                
                <!-- Effect -->
                <g class="policy-component" data-component="effect">
                    <rect x="340" y="150" width="300" height="40" fill="white" stroke="#333" stroke-width="1" rx="3" ry="3" style="opacity: 0; pointer-events: none;" id="effect-tooltip" />
                    <text x="490" y="175" text-anchor="middle" font-size="14" fill="#333" style="opacity: 0; pointer-events: none;" id="effect-text">The result of policy evaluation: Permit or Deny</text>
                </g>
                
                <!-- Component Details Box -->
                <g class="details-box" style="opacity: 0; pointer-events: none;" id="component-details">
                    <rect x="100" y="100" width="600" height="300" fill="white" stroke="#333" stroke-width="2" rx="10" ry="10" />
                    <text x="400" y="130" text-anchor="middle" font-size="20" font-weight="bold" fill="#2a3b4c" id="details-title">Component Details</text>
                    <text x="130" y="170" font-size="16" fill="#333" id="details-description">Description goes here</text>
                    <text x="130" y="200" font-size="14" fill="#333" id="details-point1">• Point 1</text>
                    <text x="130" y="230" font-size="14" fill="#333" id="details-point2">• Point 2</text>
                    <text x="130" y="260" font-size="14" fill="#333" id="details-point3">• Point 3</text>
                    <text x="130" y="290" font-size="14" fill="#333" id="details-point4">• Point 4</text>
                    
                    <!-- Example code -->
                    <rect x="130" y="310" width="540" height="70" fill="#f5f5f5" stroke="#ccc" stroke-width="1" rx="5" ry="5" id="details-code-box" />
                    <text x="150" y="330" font-family="monospace" font-size="12" fill="#333" id="details-code-line1">// Example code</text>
                    <text x="150" y="350" font-family="monospace" font-size="12" fill="#333" id="details-code-line2">// will appear here</text>
                    <text x="150" y="370" font-family="monospace" font-size="12" fill="#333" id="details-code-line3"></text>
                </g>
                
                <!-- Connection lines -->
                <path d="M400 180 L400 200" stroke="#333" stroke-width="1.5" />
                <path d="M400 260 L260 280" stroke="#333" stroke-width="1.5" />
                <path d="M400 260 L400 280" stroke="#333" stroke-width="1.5" />
                <path d="M400 260 L540 280" stroke="#333" stroke-width="1.5" />
            </svg>
        </div>
        `;
        
        // Insert into container
        container.innerHTML = svgContent;
        
        // Add to diagrams collection
        this.diagrams.push({
            id: 'policy-modeling-diagram',
            element: container.querySelector('#policy-modeling-diagram'),
            type: 'policy-modeling'
        });
    }

    initializeDiagrams() {
        document.querySelectorAll('.interactive-diagram').forEach(diagram => {
            // Store reference to the SVG element
            const svg = diagram.querySelector('svg');
            if (!svg) return;
            
            // Add interaction for hoverable elements
            const hoverableElements = svg.querySelectorAll('.hoverable');
            hoverableElements.forEach(element => {
                element.addEventListener('mouseenter', this.handleElementHover.bind(this));
                element.addEventListener('mouseleave', this.handleElementLeave.bind(this));
                element.addEventListener('click', this.handleElementClick.bind(this));
            });
            
            // Add interaction for layers (in architecture diagram)
            const layers = svg.querySelectorAll('.layer');
            layers.forEach(layer => {
                layer.addEventListener('mouseenter', this.handleLayerHover.bind(this));
                layer.addEventListener('mouseleave', this.handleLayerLeave.bind(this));
            });
            
            // Add interaction for model boxes (in access control models diagram)
            const modelBoxes = svg.querySelectorAll('.model-box');
            modelBoxes.forEach(box => {
                box.addEventListener('click', this.handleModelBoxClick.bind(this));
            });
            
            // Add interaction for policy components (in policy modeling diagram)
            const policyComponents = svg.querySelectorAll('.policy-component');
            policyComponents.forEach(component => {
                component.addEventListener('click', this.handlePolicyComponentClick.bind(this));
            });
        });
    }

    handleElementHover(event) {
        const element = event.currentTarget;
        
        // Apply hover effect
        element.style.opacity = '0.8';
        element.style.cursor = 'pointer';
        
        // Get parent diagram type
        const diagram = element.closest('.interactive-diagram');
        if (!diagram) return;
        
        // Special handling based on diagram type
        const diagramType = this.getDiagramType(diagram);
        
        if (diagramType === 'authentication-authorization') {
            // For auth diagram, show tooltips
            const authMethod = element.closest('[data-item]');
            if (authMethod) {
                const itemType = authMethod.getAttribute('data-item');
                const tooltip = diagram.querySelector(`#tooltip-${itemType}`);
                if (tooltip) {
                    const tooltipsContainer = diagram.querySelector('.tooltips');
                    if (tooltipsContainer) {
                        tooltipsContainer.style.opacity = '1';
                        
                        // Hide all tooltips first
                        diagram.querySelectorAll('.tooltip').forEach(tip => {
                            tip.style.opacity = '0';
                        });
                        
                        // Show this tooltip
                        tooltip.style.opacity = '1';
                    }
                }
            }
        } else if (diagramType === 'architecture') {
            // For architecture diagram, show component details
            const component = element.closest('[data-component]');
            if (component) {
                const componentType = component.getAttribute('data-component');
                const detailBox = diagram.querySelector(`#detail-${componentType}`);
                if (detailBox) {
                    const detailsContainer = diagram.querySelector('.component-details');
                    if (detailsContainer) {
                        detailsContainer.style.opacity = '1';
                        
                        // Hide all detail boxes first
                        diagram.querySelectorAll('.detail-box').forEach(box => {
                            box.style.opacity = '0';
                        });
                        
                        // Show this detail box
                        detailBox.style.opacity = '1';
                    }
                }
            }
        }
    }

    handleElementLeave(event) {
        const element = event.currentTarget;
        
        // Remove hover effect
        element.style.opacity = '1';
        
        // Get parent diagram
        const diagram = element.closest('.interactive-diagram');
        if (!diagram) return;
        
        // Special handling based on diagram type
        const diagramType = this.getDiagramType(diagram);
        
        if (diagramType === 'authentication-authorization') {
            // Hide tooltips with a small delay
            setTimeout(() => {
                const tooltipsContainer = diagram.querySelector('.tooltips');
                if (tooltipsContainer) {
                    tooltipsContainer.style.opacity = '0';
                }
            }, 300);
        } else if (diagramType === 'architecture') {
            // Hide component details with a small delay
            setTimeout(() => {
                const detailsContainer = diagram.querySelector('.component-details');
                if (detailsContainer) {
                    detailsContainer.style.opacity = '0';
                }
            }, 300);
        }
    }

    handleElementClick(event) {
        const element = event.currentTarget;
        
        // Get parent diagram
        const diagram = element.closest('.interactive-diagram');
        if (!diagram) return;
        
        // Prevent default behavior
        event.preventDefault();
        event.stopPropagation();
        
        // Apply click effect
        this.applyClickEffect(element);
        
        // Trigger any diagram-specific click behavior
        const diagramType = this.getDiagramType(diagram);
        
        // Additional click behaviors could be added here
    }

    handleLayerHover(event) {
        const layer = event.currentTarget;
        
        // Apply hover effect
        layer.style.opacity = '0.9';
        layer.style.cursor = 'pointer';
        
        // Get layer info for architecture diagram
        const diagram = layer.closest('.interactive-diagram');
        if (!diagram) return;
        
        const layerType = layer.getAttribute('data-layer');
        if (!layerType) return;
        
        const infoBox = diagram.querySelector(`#info-${layerType}`);
        if (infoBox) {
            const infoContainer = diagram.querySelector('.layer-info');
            if (infoContainer) {
                infoContainer.style.opacity = '1';
                
                // Hide all info boxes first
                diagram.querySelectorAll('.info-box').forEach(box => {
                    box.style.opacity = '0';
                });
                
                // Show this info box
                infoBox.style.opacity = '1';
            }
        }
    }

    handleLayerLeave(event) {
        const layer = event.currentTarget;
        
        // Remove hover effect
        layer.style.opacity = '1';
        
        // Get parent diagram
        const diagram = layer.closest('.interactive-diagram');
        if (!diagram) return;
        
        // Hide layer info with a small delay
        setTimeout(() => {
            const infoContainer = diagram.querySelector('.layer-info');
            if (infoContainer) {
                infoContainer.style.opacity = '0';
            }
        }, 300);
    }

    handleModelBoxClick(event) {
        const modelBox = event.currentTarget;
        
        // Get parent diagram
        const diagram = modelBox.closest('.interactive-diagram');
        if (!diagram) return;
        
        // Apply click effect
        this.applyClickEffect(modelBox);
        
        // Get model type
        const modelType = modelBox.getAttribute('data-model');
        if (!modelType) return;
        
        // Show detailed panel for this model
        const panelContainer = diagram.querySelector('.panel-container');
        if (panelContainer) {
            panelContainer.style.opacity = '1';
            panelContainer.style.pointerEvents = 'auto';
            
            // Hide all panels first
            diagram.querySelectorAll('.detail-panel').forEach(panel => {
                panel.style.opacity = '0';
                panel.style.pointerEvents = 'none';
            });
            
            // Show the panel for this model
            const panel = diagram.querySelector(`#panel-${modelType}`);
            if (panel) {
                panel.style.opacity = '1';
                panel.style.pointerEvents = 'auto';
                
                // Add close behavior to panel
                const closePanel = (e) => {
                    if (!panel.contains(e.target) || e.target === panel) {
                        panel.style.opacity = '0';
                        panel.style.pointerEvents = 'none';
                        panelContainer.style.opacity = '0';
                        panelContainer.style.pointerEvents = 'none';
                        document.removeEventListener('click', closePanel);
                    }
                };
                
                // Add click listener to close panel when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', closePanel);
                }, 100);
            }
        }
    }

    handlePolicyComponentClick(event) {
        const component = event.currentTarget;
        
        // Get parent diagram
        const diagram = component.closest('.interactive-diagram');
        if (!diagram) return;
        
        // Apply click effect
        this.applyClickEffect(component);
        
        // Get component type
        const componentType = component.getAttribute('data-component');
        if (!componentType) return;
        
        // Show details box for this component
        const detailsBox = diagram.querySelector('#component-details');
        if (!detailsBox) return;
        
        detailsBox.style.opacity = '1';
        detailsBox.style.pointerEvents = 'auto';
        
        // Update details content based on component type
        const titleElement = detailsBox.querySelector('#details-title');
        const descriptionElement = detailsBox.querySelector('#details-description');
        const point1Element = detailsBox.querySelector('#details-point1');
        const point2Element = detailsBox.querySelector('#details-point2');
        const point3Element = detailsBox.querySelector('#details-point3');
        const point4Element = detailsBox.querySelector('#details-point4');
        const codeBox = detailsBox.querySelector('#details-code-box');
        const codeLine1 = detailsBox.querySelector('#details-code-line1');
        const codeLine2 = detailsBox.querySelector('#details-code-line2');
        const codeLine3 = detailsBox.querySelector('#details-code-line3');
        
        // Set content based on component type
        switch (componentType) {
            case 'policy':
                titleElement.textContent = 'Policy';
                descriptionElement.textContent = 'A policy is the main container for authorization rules.';
                point1Element.textContent = '• Defines who can access what resources under what conditions';
                point2Element.textContent = '• Contains multiple rule sets for different scenarios';
                point3Element.textContent = '• Has a definite effect (permit or deny)';
                point4Element.textContent = '• Can be versioned and deployed to different environments';
                
                codeBox.style.display = 'block';
                codeLine1.textContent = '// Example Policy Definition';
                codeLine2.textContent = 'policy: "Finance_Access_Policy",';
                codeLine3.textContent = 'effect: PERMIT_OVERRIDES';
                break;
                
            case 'rulesets':
                titleElement.textContent = 'Rule Sets';
                descriptionElement.textContent = 'Rule Sets group related rules together.';
                point1Element.textContent = '• Logical grouping of related rules';
                point2Element.textContent = '• Can have their own evaluation logic';
                point3Element.textContent = '• Simplifies policy management';
                point4Element.textContent = '• Improves policy readability';
                
                codeBox.style.display = 'block';
                codeLine1.textContent = '// Example Rule Set';
                codeLine2.textContent = 'ruleSet: "Finance_Department_Rules",';
                codeLine3.textContent = 'combiningAlgorithm: "first-applicable"';
                break;
                
            case 'rules':
                titleElement.textContent = 'Rules';
                descriptionElement.textContent = 'Rules define specific authorization decisions.';
                point1Element.textContent = '• Basic building blocks of policies';
                point2Element.textContent = '• Contains conditions, targets, and effects';
                point3Element.textContent = '• Can be reused across policies';
                point4Element.textContent = '• Should be atomic and specific';
                
                codeBox.style.display = 'block';
                codeLine1.textContent = '// Example Rule';
                codeLine2.textContent = 'rule: "Allow_Finance_Managers",';
                codeLine3.textContent = 'effect: "PERMIT"';
                break;
                
            case 'conditions':
                titleElement.textContent = 'Conditions';
                descriptionElement.textContent = 'Conditions define when rules should be applied.';
                point1Element.textContent = '• Based on attributes of user, resource, or environment';
                point2Element.textContent = '• Can use complex boolean logic';
                point3Element.textContent = '• Support comparison operators';
                point4Element.textContent = '• Can reference external data sources';
                
                codeBox.style.display = 'block';
                codeLine1.textContent = '// Example Condition';
                codeLine2.textContent = 'condition: "user.department == \"Finance\" &&';
                codeLine3.textContent = '          user.role == \"Manager\""';
                break;
                
            case 'actions':
                titleElement.textContent = 'Actions';
                descriptionElement.textContent = 'Actions define what operations are being authorized.';
                point1Element.textContent = '• Represent operations on resources';
                point2Element.textContent = '• Common actions: read, write, delete, execute';
                point3Element.textContent = '• Can be custom-defined for specific applications';
                point4Element.textContent = '• Often mapped to API operations or UI functions';
                
                codeBox.style.display = 'block';
                codeLine1.textContent = '// Example Actions';
                codeLine2.textContent = 'actions: ["view", "edit", "approve",';
                codeLine3.textContent = '          "reject"]';
                break;
                
            case 'effect':
                titleElement.textContent = 'Effect';
                descriptionElement.textContent = 'The result of policy evaluation.';
                point1Element.textContent = '• Typically PERMIT or DENY';
                point2Element.textContent = '• May include INDETERMINATE for error cases';
                point3Element.textContent = '• NOT_APPLICABLE for non-matching policies';
                point4Element.textContent = '• Determines the final access decision';
                
                codeBox.style.display = 'block';
                codeLine1.textContent = '// Example Effect';
                codeLine2.textContent = 'if (matches) {';
                codeLine3.textContent = '  return PERMIT; // or DENY';
                break;
                
            default:
                // Hide details box if component type is unknown
                detailsBox.style.opacity = '0';
                detailsBox.style.pointerEvents = 'none';
                return;
        }
        
        // Add close behavior to details box
        const closeDetails = (e) => {
            if (!detailsBox.contains(e.target) || e.target === detailsBox) {
                detailsBox.style.opacity = '0';
                detailsBox.style.pointerEvents = 'none';
                document.removeEventListener('click', closeDetails);
            }
        };
        
        // Add click listener to close details when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeDetails);
        }, 100);
    }

    // Apply a visual effect when an element is clicked
    applyClickEffect(element) {
        // Save original styles
        const originalFill = element.querySelector('rect')?.getAttribute('fill');
        const originalStroke = element.querySelector('rect')?.getAttribute('stroke');
        
        // Apply highlight effect
        if (element.querySelector('rect')) {
            element.querySelector('rect').setAttribute('stroke-width', '3');
            element.querySelector('rect').setAttribute('stroke', '#333');
        }
        
        // Revert to original styles after a short delay
        setTimeout(() => {
            if (element.querySelector('rect')) {
                element.querySelector('rect').setAttribute('stroke-width', '2');
                if (originalStroke) {
                    element.querySelector('rect').setAttribute('stroke', originalStroke);
                }
            }
        }, 300);
    }

    // Get the type of diagram based on its ID or content
    getDiagramType(diagram) {
        if (!diagram) return null;
        
        const id = diagram.id;
        
        if (id === 'auth-vs-authn-diagram') {
            return 'authentication-authorization';
        } else if (id === 'access-control-models-diagram') {
            return 'access-control-models';
        } else if (id === 'plainid-architecture-diagram') {
            return 'architecture';
        } else if (id === 'policy-modeling-diagram') {
            return 'policy-modeling';
        }
        
        return null;
    }

    // Handle window resize for responsive diagrams
    handleResize() {
        // Adjust SVG viewBox or element positions if needed
        // This would be implemented based on specific responsive requirements
    }
}

// Initialize the interactive diagrams when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const interactiveDiagrams = new InteractiveDiagrams();
});
