import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { applySecurityMiddleware } from './middleware/security.js';
import { timeout } from './middleware/timeout.js';

dotenv.config();

const PORT = process.env.PORT || 10000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://node-curd-api.onrender.com', 'http://localhost:10000']  // Add your production URLs
        : '*',  // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Apply security middleware
applySecurityMiddleware(app);

// Apply timeout middleware globally
app.use(timeout(30000)); // 30 seconds timeout

// Middleware
app.use(express.json());

// MongoDB connection options
const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true
};

// MongoDB connection with detailed logging
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_db', mongoOptions)
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Connection state:', mongoose.connection.readyState);
        console.log('Database name:', mongoose.connection.name);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Management API',
            version: '1.0.0',
            description: 'A RESTful API for managing student records',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://node-curd-api.onrender.com'
                    : `http://localhost:${PORT}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showCommonExtensions: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://${HOST}:${PORT}/api-docs`);
    console.log('==> Your service is live 🎉');
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
}); 