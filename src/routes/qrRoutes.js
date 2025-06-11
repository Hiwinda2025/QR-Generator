const express = require('express');
const QRCode = require('qrcode');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for logo upload handling
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    // Only allow image files
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// 验证输入数据的工具函数
const validateQRData = (type, data) => {
    switch (type) {
        case 'url':
            if (!data.url) throw new Error('URL is required');
            // 简单URL验证
            try {
                new URL(data.url);
            } catch {
                throw new Error('Invalid URL format');
            }
            break;
        case 'text':
            if (!data.text) throw new Error('Text is required');
            if (data.text.length > 2000) throw new Error('Text too long (max 2000 characters)');
            break;
        case 'email':
            if (!data.email) throw new Error('Email is required');
            if (!data.email.includes('@')) throw new Error('Invalid email format');
            break;
        case 'phone':
            if (!data.phone) throw new Error('Phone number is required');
            break;
        case 'sms':
            if (!data.phone) throw new Error('Phone number is required');
            break;
        case 'wifi':
            if (!data.ssid) throw new Error('WiFi SSID is required');
            break;
        case 'vcard':
            if (!data.firstName && !data.lastName) throw new Error('Name is required');
            break;
        default:
            throw new Error('Invalid QR code type');
    }
};

// 生成不同类型的QR码数据
const generateQRData = (type, data) => {
    switch (type) {
        case 'url':
            return data.url;
        case 'text':
            return data.text;
        case 'email':
            const subject = data.subject ? `?subject=${encodeURIComponent(data.subject)}` : '';
            const body = data.body ? `${subject ? '&' : '?'}body=${encodeURIComponent(data.body)}` : '';
            return `mailto:${data.email}${subject}${body}`;
        case 'phone':
            return `tel:${data.phone}`;
        case 'sms':
            const message = data.message ? `?body=${encodeURIComponent(data.message)}` : '';
            return `sms:${data.phone}${message}`;
        case 'wifi':
            const security = data.security || 'WPA';
            const hidden = data.hidden ? 'true' : 'false';
            return `WIFI:T:${security};S:${data.ssid};P:${data.password || ''};H:${hidden};;`;
        case 'vcard':
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            if (data.firstName || data.lastName) {
                vcard += `FN:${data.firstName || ''} ${data.lastName || ''}\n`;
                vcard += `N:${data.lastName || ''};${data.firstName || ''};;;\n`;
            }
            if (data.organization) vcard += `ORG:${data.organization}\n`;
            if (data.title) vcard += `TITLE:${data.title}\n`;
            if (data.phone) vcard += `TEL:${data.phone}\n`;
            if (data.email) vcard += `EMAIL:${data.email}\n`;
            if (data.url) vcard += `URL:${data.url}\n`;
            if (data.address) vcard += `ADR:;;${data.address};;;;\n`;
            vcard += 'END:VCARD';
            return vcard;
        case 'whatsapp':
            const whatsappMessage = data.message ? `?text=${encodeURIComponent(data.message)}` : '';
            return `https://wa.me/${data.phone}${whatsappMessage}`;
        default:
            throw new Error('Unsupported QR code type');
    }
};

// 生成QR码的主要API端点
router.post('/generate', upload.single('logo'), async (req, res) => {
    try {
        const { type, data, options = {} } = req.body;
        
        console.log('Received request:', { type, data, options });
        
        // 如果data是字符串，直接使用
        let qrData = data;
        
        // 如果data是对象，需要处理不同类型
        if (typeof data === 'object') {
            qrData = generateQRData(type, data);
            validateQRData(type, data);
        } else {
            // data是字符串，直接使用
            qrData = data;
        }

        // QR码生成选项
        const qrOptions = {
            errorCorrectionLevel: options.errorCorrectionLevel || 'M',
            type: options.format === 'svg' ? 'svg' : 'png',
            quality: 0.92,
            margin: options.margin || 1,
            color: {
                dark: options.foregroundColor || '#000000',
                light: options.backgroundColor || '#FFFFFF'
            },
            width: options.size || 256
        };

        // 根据格式生成QR码
        if (options.format === 'svg') {
            // 生成SVG格式
            const svgString = await QRCode.toString(qrData, {
                ...qrOptions,
                type: 'svg'
            });

            res.set({
                'Content-Type': 'image/svg+xml',
                'Content-Disposition': `attachment; filename="qrcode-${Date.now()}.svg"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });

            res.send(svgString);
        } else {
            // 生成PNG格式
            let qrBuffer = await QRCode.toBuffer(qrData, qrOptions);

            // 如果有logo，将其添加到QR码中心
            if (req.file) {
                const logoBuffer = req.file.buffer;
                
                // 调整logo大小（QR码大小的20%）
                const logoSize = Math.floor(qrOptions.width * 0.2);
                const resizedLogo = await sharp(logoBuffer)
                    .resize(logoSize, logoSize, { 
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .png()
                    .toBuffer();

                // 将logo合成到QR码中心
                const qrImage = sharp(qrBuffer);
                const { width, height } = await qrImage.metadata();
                
                qrBuffer = await qrImage
                    .composite([{
                        input: resizedLogo,
                        top: Math.floor((height - logoSize) / 2),
                        left: Math.floor((width - logoSize) / 2)
                    }])
                    .png()
                    .toBuffer();
            }

            // 设置响应头
            res.set({
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="qrcode-${Date.now()}.png"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });

            res.send(qrBuffer);
        }

    } catch (error) {
        console.error('QR Generation Error:', error);
        res.status(400).json({ 
            error: error.message || 'Failed to generate QR code' 
        });
    }
});

// 生成SVG格式的QR码
router.post('/generate-svg', async (req, res) => {
    try {
        const { type, data, options = {} } = req.body;
        
        let parsedData = data;
        let parsedOptions = options;
        
        if (typeof data === 'string') {
            try {
                parsedData = JSON.parse(data);
            } catch {
                // 保持原始值
            }
        }
        
        if (typeof options === 'string') {
            try {
                parsedOptions = JSON.parse(options);
            } catch {
                parsedOptions = {};
            }
        }

        validateQRData(type, parsedData);
        const qrData = generateQRData(type, parsedData);

        const qrOptions = {
            errorCorrectionLevel: parsedOptions.errorCorrectionLevel || 'M',
            type: 'svg',
            margin: parsedOptions.margin || 1,
            color: {
                dark: parsedOptions.foregroundColor || '#000000',
                light: parsedOptions.backgroundColor || '#FFFFFF'
            },
            width: parsedOptions.size || 256
        };

        const svgString = await QRCode.toString(qrData, qrOptions);

        res.set({
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': `attachment; filename="qrcode-${Date.now()}.svg"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });

        res.send(svgString);

    } catch (error) {
        console.error('SVG Generation Error:', error);
        res.status(400).json({ 
            error: error.message || 'Failed to generate SVG QR code' 
        });
    }
});

// 批量生成QR码
router.post('/batch-generate', async (req, res) => {
    try {
        const { items, options = {} } = req.body;
        
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required' });
        }
        
        if (items.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 items allowed per batch' });
        }

        const results = [];
        
        for (let i = 0; i < items.length; i++) {
            try {
                const item = items[i];
                validateQRData(item.type, item.data);
                const qrData = generateQRData(item.type, item.data);
                
                const qrOptions = {
                    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
                    type: 'png',
                    margin: options.margin || 1,
                    color: {
                        dark: options.foregroundColor || '#000000',
                        light: options.backgroundColor || '#FFFFFF'
                    },
                    width: options.size || 256
                };

                const qrBuffer = await QRCode.toBuffer(qrData, qrOptions);
                const base64 = qrBuffer.toString('base64');
                
                results.push({
                    index: i,
                    success: true,
                    data: `data:image/png;base64,${base64}`,
                    filename: `qrcode-${i + 1}.png`
                });
                
            } catch (error) {
                results.push({
                    index: i,
                    success: false,
                    error: error.message
                });
            }
        }

        res.json({ results });

    } catch (error) {
        console.error('Batch Generation Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate batch QR codes' 
        });
    }
});

module.exports = router; 