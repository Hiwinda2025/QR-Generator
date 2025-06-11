const QRCode = require('qrcode');

// Utility function to validate input data
function validateInput(type, data) {
    if (!type || typeof type !== 'string') {
        throw new Error('Invalid type parameter');
    }
    
    if (!data || typeof data !== 'string') {
        throw new Error('Invalid data parameter');
    }
    
    // Validate specific types
    switch (type) {
        case 'url':
            // Basic URL validation
            try {
                new URL(data);
            } catch {
                // If not a valid URL, treat as plain text
            }
            break;
        case 'email':
            if (!data.startsWith('mailto:')) {
                throw new Error('Email data must start with mailto:');
            }
            break;
        case 'phone':
            if (!data.startsWith('tel:')) {
                throw new Error('Phone data must start with tel:');
            }
            break;
        case 'sms':
            if (!data.startsWith('sms:')) {
                throw new Error('SMS data must start with sms:');
            }
            break;
        case 'wifi':
            if (!data.startsWith('WIFI:')) {
                throw new Error('WiFi data must start with WIFI:');
            }
            break;
        case 'vcard':
            if (!data.includes('BEGIN:VCARD')) {
                throw new Error('vCard data must contain BEGIN:VCARD');
            }
            break;
    }
    
    return true;
}

// Generate different types of QR code data
function processQRData(type, data) {
    // Validate input first
    validateInput(type, data);
    
    switch (type) {
        case 'url':
            // Ensure URL has protocol
            if (!data.match(/^https?:\/\//)) {
                return `https://${data}`;
            }
            return data;
            
        case 'text':
            return data;
            
        case 'email':
        case 'phone':
        case 'sms':
        case 'wifi':
        case 'vcard':
        case 'whatsapp':
            return data;
            
        default:
            return data;
    }
}

function setCorsHeaders(response) {
    response.headers['Access-Control-Allow-Origin'] = '*';
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type';
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    return response;
}

exports.handler = async (event, context) => {
    // Set CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    // Only handle POST requests
    if (event.httpMethod !== 'POST') {
        return setCorsHeaders({
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ 
                success: false, 
                error: 'Method not allowed. Use POST.' 
            })
        });
    }

    try {
        // Parse request body
        const requestBody = JSON.parse(event.body || '{}');
        const { type = 'text', data = '', options = {} } = requestBody;
        
        // Set default options
        const qrOptions = {
            type: options.format === 'svg' ? 'svg' : 'png',
            width: parseInt(options.size) || 256,
            margin: parseInt(options.margin) || 1,
            color: {
                dark: options.foregroundColor || '#000000',
                light: options.backgroundColor || '#ffffff'
            },
            errorCorrectionLevel: options.errorCorrectionLevel || 'M'
        };

        console.log('Received request:', { type, data, options });

        // Process QR code data
        const processedData = processQRData(type, data);
        
        if (!processedData) {
            throw new Error('No data to encode');
        }

        // QR code generation options
        const finalOptions = {
            ...qrOptions,
            type: options.format === 'svg' ? 'svg' : undefined
        };

        if (options.format === 'svg') {
            // Generate SVG format
            const svgString = await QRCode.toString(processedData, {
                ...finalOptions,
                type: 'svg',
                width: qrOptions.width
            });
            
            return {
                statusCode: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'image/svg+xml'
                },
                body: svgString
            };
        } else {
            // Generate PNG format, return base64 encoded
            const qrCodeDataURL = await QRCode.toDataURL(processedData, finalOptions);
            
            return {
                statusCode: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    qrCode: qrCodeDataURL,
                    filename: `qrcode-${Date.now()}.png`
                })
            };
        }

    } catch (error) {
        console.error('QR generation error:', error);
        
        return setCorsHeaders({
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                error: error.message || 'QR code generation failed'
            })
        });
    }
}; 