const express = require('express');
const { createComplaint, getComplaints, getComplaintById, updateComplaintStatus, deleteComplaint, trackComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Route
/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Submit a new complaint
 *     tags: [Complaints Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               mobile: { type: string }
 *               email: { type: string }
 *               category: { type: string }
 *               description: { type: string }
 *               location: { type: string }
 *               address: { type: string }
 *     responses:
 *       201:
 *         description: Complaint submitted
 */
router.post('/complaints', createComplaint);

// Public Route for Tracking
/**
 * @swagger
 * /api/complaints/ticket/{complaintId}:
 *   get:
 *     summary: Track complaint status by ID
 *     tags: [Complaints Public]
 *     parameters:
 *       - in: path
 *         name: complaintId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Complaint status details
 *       404:
 *         description: Complaint not found
 */
router.get('/complaints/ticket/:complaintId', trackComplaint);

// Admin Routes
/**
 * @swagger
 * /api/admin/complaints:
 *   get:
 *     summary: Get all complaints (Admin)
 *     tags: [Complaints Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.get('/admin/complaints', protect, getComplaints);

/**
 * @swagger
 * /api/admin/complaints/{id}:
 *   get:
 *     summary: Get complaint details (Admin)
 *     tags: [Complaints Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Complaint details
 */
router.get('/admin/complaints/:id', protect, getComplaintById);

/**
 * @swagger
 * /api/admin/complaints/{id}/status:
 *   patch:
 *     summary: Update complaint status (Admin)
 *     tags: [Complaints Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Complaint updated
 */
router.patch('/admin/complaints/:id/status', protect, updateComplaintStatus);

/**
 * @swagger
 * /api/admin/complaints/{id}:
 *   delete:
 *     summary: Delete a complaint (Admin)
 *     tags: [Complaints Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Complaint deleted
 */
router.delete('/admin/complaints/:id', protect, deleteComplaint);

module.exports = router;
