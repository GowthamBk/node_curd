import express from 'express';
import {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} from '../controllers/studentController.js';
import { auth } from '../middleware/auth.js';
import { securityMiddleware } from '../middleware/security.js';
import { timeout } from '../middleware/timeout.js';

const router = express.Router();

// Apply security middleware to all routes
router.use(securityMiddleware.securityHeaders);
router.use(securityMiddleware.mongoSanitize);
router.use(securityMiddleware.xss);
router.use(securityMiddleware.hpp);

// Apply shorter timeout for database operations
router.use(timeout(15000)); // 15 seconds timeout for database operations

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - grade
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the student
 *         name:
 *           type: string
 *           description: The student's name
 *         age:
 *           type: number
 *           description: The student's age
 *         grade:
 *           type: string
 *           description: The student's grade
 *         email:
 *           type: string
 *           description: The student's email
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the student was created
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students with pagination
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or email
 *     responses:
 *       200:
 *         description: List of students
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, getAllStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student details
 *       404:
 *         description: Student not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', auth, getStudent);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               age:
 *                 type: number
 *               grade:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               age:
 *                 type: number
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', auth, updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', auth, deleteStudent);

export default router; 