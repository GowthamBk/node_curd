import { HTTP_STATUS } from '../utils/constants.js';

// Default timeout of 30 seconds
const DEFAULT_TIMEOUT = 30000;

export const timeout = (timeoutMs = DEFAULT_TIMEOUT) => {
    return (req, res, next) => {
        // Set timeout for the request
        res.setTimeout(timeoutMs, () => {
            console.error(`Request timeout after ${timeoutMs}ms:`, {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip
            });
            
            // If headers haven't been sent yet, send timeout response
            if (!res.headersSent) {
                res.status(HTTP_STATUS.REQUEST_TIMEOUT).json({
                    success: false,
                    message: 'Request timeout - server took too long to respond'
                });
            }
        });

        // Handle timeout errors
        req.on('timeout', () => {
            console.error('Request timeout event triggered');
        });

        next();
    };
}; 