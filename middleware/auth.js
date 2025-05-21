import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants.js';

export const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No Bearer token found or invalid format');
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERROR_MESSAGES.NO_TOKEN
            });
        }

        // Get token from Bearer token in header
        const token = authHeader.split(' ')[1];
        console.log('Extracted token:', token);

        if (!token) {
            console.log('No token found after Bearer');
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERROR_MESSAGES.NO_TOKEN
            });
        }

        try {
            // Verify token
            console.log('JWT_SECRET:', process.env.JWT_SECRET);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            
            // Get user from database
            const user = await User.findById(decoded.id);
            console.log('Found user:', user);

            if (!user) {
                console.log('No user found with id:', decoded.id);
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_TOKEN
                });
            }

            // Add user to request
            req.user = user;
            console.log('User attached to request:', {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            });
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERROR_MESSAGES.INVALID_TOKEN
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('User role:', req.user?.role);
        console.log('Required roles:', roles);
        
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: ERROR_MESSAGES.UNAUTHORIZED
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
}; 