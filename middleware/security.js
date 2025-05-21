import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Security middleware functions
const securityHeaders = helmet();
const xssProtection = xss();
const mongoSanitization = mongoSanitize();
const hppProtection = hpp();

// Apply all security middleware
export const applySecurityMiddleware = (app) => {
    // Basic security headers
    app.use(securityHeaders);
    
    // CORS
    app.use(cors(corsOptions));
    
    // Rate limiting
    app.use('/api/', limiter);
    
    // Data sanitization against NoSQL query injection
    app.use(mongoSanitization);
    
    // Data sanitization against XSS
    app.use(xssProtection);
    
    // Prevent parameter pollution
    app.use(hppProtection);
};

// Export individual middleware for specific routes
export const securityMiddleware = {
    limiter,
    cors: cors(corsOptions),
    mongoSanitize: mongoSanitization,
    xss: xssProtection,
    hpp: hppProtection,
    securityHeaders
};

// Export all security middleware as a single object
export const security = {
    securityHeaders,
    xss: xssProtection,
    mongoSanitize: mongoSanitization,
    hpp: hppProtection
}; 