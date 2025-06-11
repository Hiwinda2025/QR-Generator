// QR Code Generator Application Main File
class QRGenerator {
    constructor() {
        // Currently selected QR code type
        this.currentType = 'url';
        
        // Current QR code configuration
        this.currentConfig = {
            type: 'url',
            data: '',
            options: {
                size: 256,
                foregroundColor: '#000000',
                backgroundColor: '#ffffff',
                errorCorrectionLevel: 'M',
                margin: 1
            }
        };
        
        // Initialize application
        this.init();
    }
    
    init() {
        // Wait for DOM to fully load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            this.setupApp();
        }
    }
    
    setupApp() {
        console.log('Setting up QR Generator App...');
        
        try {
            // Bind event listeners
            this.bindEvents();
            
            // Set default values
            this.setDefaults();
            
            // Generate default preview
            this.generatePreview();
            
            console.log('QR Generator App setup complete!');
        } catch (error) {
            console.error('Setup error:', error);
        }
    }
    
    bindEvents() {
        // QR type selection buttons
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                if (type) {
                    this.switchType(type);
                }
            });
        });

        // Form input listeners
        this.bindFormEvents();
        
        // Customization option listeners
        this.bindCustomizationEvents();
        
        // Download buttons
        const downloadPngBtn = document.getElementById('download-png');
        const downloadSvgBtn = document.getElementById('download-svg');
        
        if (downloadPngBtn) {
            downloadPngBtn.addEventListener('click', () => {
                this.downloadQR('png');
            });
        }
        
        if (downloadSvgBtn) {
            downloadSvgBtn.addEventListener('click', () => {
                this.downloadQR('svg');
            });
        }
        
        // Global function bindings
        window.scrollToGenerator = () => {
            document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
        };
        
        window.scrollToDemo = () => {
            document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
        };
        
        window.generatePreview = () => {
            if (this.currentConfig.data) {
                this.generatePreview();
            }
        };
    }

    bindFormEvents() {
        // URL input
        const urlInput = document.getElementById('url-input');
        if (urlInput) {
            urlInput.addEventListener('input', this.debounce(() => {
                this.currentConfig.data = urlInput.value;
                if (this.currentConfig.data) {
                    this.generatePreview();
                }
            }, 500));
        }

        // Text input
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.addEventListener('input', this.debounce(() => {
                this.currentConfig.data = textInput.value;
                if (this.currentConfig.data) {
                    this.generatePreview();
                }
            }, 500));
        }

        // Email inputs
        const emailInput = document.getElementById('email-input');
        const emailSubject = document.getElementById('email-subject');
        const emailBody = document.getElementById('email-body');
        
        [emailInput, emailSubject, emailBody].forEach(input => {
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.updateEmailData();
                }, 500));
            }
        });

        // Phone input
        const phoneInput = document.getElementById('phone-input');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.debounce(() => {
                this.currentConfig.data = `tel:${phoneInput.value}`;
                if (phoneInput.value) {
                    this.generatePreview();
                }
            }, 500));
        }

        // SMS inputs
        const smsNumber = document.getElementById('sms-number');
        const smsMessage = document.getElementById('sms-message');
        
        [smsNumber, smsMessage].forEach(input => {
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.updateSMSData();
                }, 500));
            }
        });

        // WiFi form
        const wifiInputs = ['wifi-ssid', 'wifi-password', 'wifi-security', 'wifi-hidden'];
        wifiInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.updateWifiData();
                }, 500));
            }
        });

        // vCard form
        const vcardInputs = ['vcard-name', 'vcard-org', 'vcard-phone', 'vcard-email', 'vcard-url'];
        vcardInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.updateVCardData();
                }, 500));
            }
        });

        // WhatsApp form
        const whatsappNumber = document.getElementById('whatsapp-number');
        const whatsappMessage = document.getElementById('whatsapp-message');
        
        [whatsappNumber, whatsappMessage].forEach(input => {
            if (input) {
                input.addEventListener('input', this.debounce(() => {
                    this.updateWhatsAppData();
                }, 500));
            }
        });
    }

    bindCustomizationEvents() {
        // Color selectors
        const fgColorInput = document.getElementById('fg-color');
        const bgColorInput = document.getElementById('bg-color');
        
        if (fgColorInput) {
            fgColorInput.addEventListener('change', () => {
                this.currentConfig.options.foregroundColor = fgColorInput.value;
                this.generatePreview();
            });
        }
        
        if (bgColorInput) {
            bgColorInput.addEventListener('change', () => {
                this.currentConfig.options.backgroundColor = bgColorInput.value;
                this.generatePreview();
            });
        }

        // Size selector
        const sizeSelect = document.getElementById('size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', () => {
                this.currentConfig.options.size = parseInt(sizeSelect.value);
                this.generatePreview();
            });
        }

        // Error correction level
        const errorCorrectionSelect = document.getElementById('error-correction');
        if (errorCorrectionSelect) {
            errorCorrectionSelect.addEventListener('change', () => {
                this.currentConfig.options.errorCorrectionLevel = errorCorrectionSelect.value;
                this.generatePreview();
            });
        }

        // Margin slider
        const marginRange = document.getElementById('margin-range');
        const marginValue = document.getElementById('margin-value');
        
        if (marginRange && marginValue) {
            marginRange.addEventListener('input', () => {
                const value = parseInt(marginRange.value);
                this.currentConfig.options.margin = value;
                marginValue.textContent = value;
                this.generatePreview();
            });
        }
    }

    setDefaults() {
        // Set URL default values
        const urlInput = document.getElementById('url-input');
        if (urlInput && !urlInput.value) {
            urlInput.value = 'https://example.com';
            this.currentConfig.data = 'https://example.com';
        }

        // Set text default values
        const textInput = document.getElementById('text-input');
        if (textInput && !textInput.value) {
            textInput.value = 'Hello World!';
        }

        // Set other type default values
        this.setTypeDefaults(this.currentType);
    }

    switchType(type) {
        console.log('Switching to type:', type);
        
        // Update current type
        this.currentType = type;
        this.currentConfig.type = type;
        
        // Update UI
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === type) {
                btn.classList.add('active');
            }
        });

        // Show corresponding form
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('active');
        });
        
        const targetForm = document.getElementById(`form-${type}`);
        if (targetForm) {
            targetForm.classList.add('active');
        }

        // Set type default values
        this.setTypeDefaults(type);
        
        // Generate preview
        this.generatePreview();
    }

    setTypeDefaults(type) {
        switch (type) {
            case 'url':
                const urlInput = document.getElementById('url-input');
                if (urlInput) {
                    if (!urlInput.value) {
                        urlInput.value = 'https://example.com';
                    }
                    this.currentConfig.data = urlInput.value;
                }
                break;
            case 'text':
                const textInput = document.getElementById('text-input');
                if (textInput) {
                    if (!textInput.value) {
                        textInput.value = 'Hello World!';
                    }
                    this.currentConfig.data = textInput.value;
                }
                break;
            case 'email':
                this.updateEmailData();
                break;
            case 'phone':
                const phoneInput = document.getElementById('phone-input');
                if (phoneInput) {
                    if (!phoneInput.value) {
                        phoneInput.value = '+1234567890';
                    }
                    this.currentConfig.data = `tel:${phoneInput.value}`;
                }
                break;
            case 'sms':
                this.updateSMSData();
                break;
            case 'wifi':
                this.updateWifiData();
                break;
            case 'vcard':
                this.updateVCardData();
                break;
            case 'whatsapp':
                this.updateWhatsAppData();
                break;
        }
    }

    updateEmailData() {
        const emailInput = document.getElementById('email-input');
        const subjectInput = document.getElementById('email-subject');
        const bodyInput = document.getElementById('email-body');
        
        if (emailInput) {
            const email = emailInput.value || 'contact@example.com';
            const subject = subjectInput?.value || '';
            const body = bodyInput?.value || '';
            
            let mailto = `mailto:${email}`;
            const params = [];
            
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            
            if (params.length > 0) {
                mailto += '?' + params.join('&');
            }
            
            this.currentConfig.data = mailto;
            if (email) {
                this.generatePreview();
            }
        }
    }

    updateSMSData() {
        const numberInput = document.getElementById('sms-number');
        const messageInput = document.getElementById('sms-message');
        
        if (numberInput) {
            const number = numberInput.value || '+1234567890';
            const message = messageInput?.value || '';
            
            this.currentConfig.data = `sms:${number}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
            if (number) {
                this.generatePreview();
            }
        }
    }

    updateWifiData() {
        const ssidInput = document.getElementById('wifi-ssid');
        const passwordInput = document.getElementById('wifi-password');
        const securitySelect = document.getElementById('wifi-security');
        const hiddenCheckbox = document.getElementById('wifi-hidden');
        
        if (ssidInput) {
            const ssid = ssidInput.value || 'MyWiFi';
            const password = passwordInput?.value || '';
            const security = securitySelect?.value || 'WPA';
            const hidden = hiddenCheckbox?.checked ? 'true' : 'false';
            
            this.currentConfig.data = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
            if (ssid) {
                this.generatePreview();
            }
        }
    }

    updateVCardData() {
        const nameInput = document.getElementById('vcard-name');
        const orgInput = document.getElementById('vcard-org');
        const phoneInput = document.getElementById('vcard-phone');
        const emailInput = document.getElementById('vcard-email');
        const urlInput = document.getElementById('vcard-url');
        
        if (nameInput) {
            const name = nameInput.value || 'John Doe';
            const org = orgInput?.value || '';
            const phone = phoneInput?.value || '';
            const email = emailInput?.value || '';
            const url = urlInput?.value || '';
            
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            vcard += `FN:${name}\n`;
            if (org) vcard += `ORG:${org}\n`;
            if (phone) vcard += `TEL:${phone}\n`;
            if (email) vcard += `EMAIL:${email}\n`;
            if (url) vcard += `URL:${url}\n`;
            vcard += 'END:VCARD';
            
            this.currentConfig.data = vcard;
            if (name) {
                this.generatePreview();
            }
        }
    }

    updateWhatsAppData() {
        const numberInput = document.getElementById('whatsapp-number');
        const messageInput = document.getElementById('whatsapp-message');
        
        if (numberInput) {
            const number = numberInput.value || '+1234567890';
            const message = messageInput?.value || '';
            
            this.currentConfig.data = `https://wa.me/${number.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
            if (number) {
                this.generatePreview();
            }
        }
    }

    async generatePreview() {
        console.log('Generating preview for:', this.currentConfig);
        
        try {
            // Show loading state
            const previewContainer = document.getElementById('qr-preview');
            const loadingEl = document.getElementById('qr-loading');
            
            if (loadingEl) {
                loadingEl.style.display = 'flex';
            }
            
            // Clear container
            if (previewContainer) {
                previewContainer.innerHTML = '';
            }
            
            // Validate data
            if (!this.currentConfig.data || this.currentConfig.data.trim() === '') {
                throw new Error('No data to encode');
            }
            
            // Use Netlify Functions API to generate preview
            const requestData = {
                type: this.currentConfig.type,
                data: this.currentConfig.data,
                options: {
                    ...this.currentConfig.options,
                    format: 'png' // Preview uses PNG format
                }
            };
            
            const response = await fetch('/.netlify/functions/qr-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success && result.qrCode) {
                // Create image element
                const img = document.createElement('img');
                img.src = result.qrCode;
                img.alt = 'QR Code Preview';
                img.className = 'qr-canvas';
                
                // Add to preview container
                if (previewContainer) {
                    previewContainer.appendChild(img);
                }
                
                // Hide loading state
                if (loadingEl) {
                    loadingEl.style.display = 'none';
                }
                
                // Show success notification (only first time)
                if (!this.hasShownSuccessNotification) {
                    this.showNotification('QR Code preview generated', 'success');
                    this.hasShownSuccessNotification = true;
                }
                
            } else {
                throw new Error(result.error || 'QR code generation failed');
            }
            
        } catch (error) {
            console.error('Preview generation error:', error);
            
            // If API fails, try using frontend library as fallback
            try {
                await this.generatePreviewWithFrontendLibrary();
            } catch (fallbackError) {
                console.error('Frontend library fallback failed:', fallbackError);
                
                if (previewContainer) {
                    previewContainer.innerHTML = `
                        <div class="error-message">
                            <div class="error-icon">⚠️</div>
                            <div class="error-text">Preview generation failed: ${error.message}</div>
                        </div>
                    `;
                }
                
                if (loadingEl) {
                    loadingEl.style.display = 'none';
                }
                
                this.showNotification('Preview generation failed', 'error');
            }
        }
    }

    async generatePreviewWithFrontendLibrary() {
        const previewContainer = document.getElementById('qr-preview');
        const loadingEl = document.getElementById('qr-loading');
        
        // Check if QRCode library is available
        if (typeof QRCode === 'undefined') {
            throw new Error('QRCode library not loaded');
        }
        
        return new Promise((resolve, reject) => {
            try {
                // Create temporary div
                const tempDiv = document.createElement('div');
                
                // Use QRCodejs library to generate QR code
                const qrcode = new QRCode(tempDiv, {
                    text: this.currentConfig.data,
                    width: this.currentConfig.options.size,
                    height: this.currentConfig.options.size,
                    colorDark: this.currentConfig.options.foregroundColor,
                    colorLight: this.currentConfig.options.backgroundColor,
                    correctLevel: QRCode.CorrectLevel[this.currentConfig.options.errorCorrectionLevel] || QRCode.CorrectLevel.M
                });
                
                // Wait for generation to complete then display
                setTimeout(() => {
                    const qrImg = tempDiv.querySelector('img');
                    const qrCanvas = tempDiv.querySelector('canvas');
                    
                    if (qrCanvas) {
                        previewContainer.appendChild(qrCanvas);
                        resolve();
                    } else if (qrImg) {
                        previewContainer.appendChild(qrImg);
                        resolve();
                    } else {
                        reject(new Error('QR code generation failed'));
                    }
                    
                    // Hide loading state
                    if (loadingEl) {
                        loadingEl.style.display = 'none';
                    }
                }, 100);
                
            } catch (error) {
                reject(error);
            }
        });
    }
}

// Add missing methods
QRGenerator.prototype.downloadQR = async function(format) {
    console.log('Downloading QR code in format:', format);
    
    try {
        this.showLoading(true);
        
        const requestData = {
            type: this.currentConfig.type,
            data: this.currentConfig.data,
            options: {
                ...this.currentConfig.options,
                format: format
            }
        };
        
        const response = await fetch('/.netlify/functions/qr-generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        if (format === 'svg') {
            // SVG format returns text directly
            const svgContent = await response.text();
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            // PNG format returns JSON with base64
            const result = await response.json();
            if (result.success && result.qrCode) {
                const a = document.createElement('a');
                a.href = result.qrCode;
                a.download = result.filename || `qrcode.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                throw new Error(result.error || 'Download failed');
            }
        }
        
        this.showNotification(`QR Code ${format.toUpperCase()} downloaded successfully!`, 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        this.showNotification(`Download failed: ${error.message}`, 'error');
    } finally {
        this.showLoading(false);
    }
};

QRGenerator.prototype.showLoading = function(show) {
    const loadingEls = document.querySelectorAll('.loading');
    loadingEls.forEach(el => {
        el.style.display = show ? 'block' : 'none';
    });
    
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        if (show) {
            if (!btn.dataset.originalText) {
                btn.dataset.originalText = btn.textContent;
            }
            btn.disabled = true;
            btn.textContent = 'Downloading...';
        } else {
            btn.disabled = false;
            btn.textContent = btn.dataset.originalText || btn.textContent;
        }
    });
};

QRGenerator.prototype.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
};

QRGenerator.prototype.getNotificationIcon = function(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons.info;
};

QRGenerator.prototype.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Initialize application
let qrGenerator;

// Wait for page load completion then initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing QR Generator...');
    qrGenerator = new QRGenerator();
});

// If page is already loaded, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM already loaded, initializing QR Generator...');
    qrGenerator = new QRGenerator();
}

// Global export for debugging
window.QRGenerator = QRGenerator;