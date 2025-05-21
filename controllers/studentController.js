import Student from '../models/Student.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants.js';

// @desc    Get all students with pagination
// @route   GET /api/students
// @access  Private
export const getAllStudents = async (req, res, next) => {
    try {
        console.log('Fetching students with pagination...');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log(`Pagination params - page: ${page}, limit: ${limit}, skip: ${skip}`);

        const query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        console.log('Executing find query...');
        const [students, total] = await Promise.all([
            Student.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .maxTimeMS(5000), // 5 second timeout
            Student.countDocuments(query)
                .maxTimeMS(5000)
        ]);

        console.log(`Found ${students.length} students out of ${total} total`);

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: students,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        next(error);
    }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
export const getStudent = async (req, res, next) => {
    try {
        console.log(`Fetching student with ID: ${req.params.id}`);
        const student = await Student.findById(req.params.id)
            .maxTimeMS(5000);

        if (!student) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ERROR_MESSAGES.STUDENT_NOT_FOUND
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error in getStudent:', error);
        next(error);
    }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
export const createStudent = async (req, res, next) => {
    try {
        console.log('Creating new student with data:', req.body);
        const student = await Student.create(req.body);
        
        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error in createStudent:', error);
        next(error);
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
export const updateStudent = async (req, res, next) => {
    try {
        console.log(`Updating student with ID: ${req.params.id}`);
        console.log('Update data:', req.body);

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
                maxTimeMS: 5000
            }
        );

        if (!student) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ERROR_MESSAGES.STUDENT_NOT_FOUND
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error in updateStudent:', error);
        next(error);
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
export const deleteStudent = async (req, res, next) => {
    try {
        console.log(`Deleting student with ID: ${req.params.id}`);
        const student = await Student.findByIdAndDelete(req.params.id)
            .maxTimeMS(5000);

        if (!student) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ERROR_MESSAGES.STUDENT_NOT_FOUND
            });
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        next(error);
    }
}; 