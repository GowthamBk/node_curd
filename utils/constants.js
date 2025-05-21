export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    REQUEST_TIMEOUT: 408,
    INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
    SERVER_ERROR: 'Something went wrong on the server',
    VALIDATION_ERROR: 'Validation error occurred',
    DUPLICATE_EMAIL: 'Email already exists',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_INPUT: 'Invalid input provided',
    STUDENT_NOT_FOUND: 'Student not found',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid or expired token',
    DATABASE_ERROR: 'Database operation failed',
    TIMEOUT_ERROR: 'Request timed out'
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

export const JWT = {
    EXPIRES_IN: '24h'
}; 