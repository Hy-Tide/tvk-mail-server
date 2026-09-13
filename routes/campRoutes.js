const express = require('express');
const { getPublicCamps, getPublicCampById, createCamp, getAdminCamps, getAdminCampById, updateCamp, deleteCamp } = require('../controllers/campController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/camps:
 *   get:
 *     summary: Get all published camps
 *     tags: [Camps Public]
 *     responses:
 *       200:
 *         description: List of active camps
 */
router.get('/camps', getPublicCamps);

/**
 * @swagger
 * /api/camps/{id}:
 *   get:
 *     summary: Get camp by ID
 *     tags: [Camps Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Camp details
 */
router.get('/camps/:id', getPublicCampById);

// ADMIN ROUTES
/**
 * @swagger
 * /api/admin/camps:
 *   post:
 *     summary: Create a new camp
 *     tags: [Camps Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               location: { type: string }
 *               address: { type: string }
 *               date: { type: string }
 *               startTime: { type: string }
 *               endTime: { type: string }
 *               status: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Camp created
 */
router.post('/admin/camps', protect, createCamp);

/**
 * @swagger
 * /api/admin/camps:
 *   get:
 *     summary: Get all camps (Admin)
 *     tags: [Camps Admin]
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
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of all camps
 */
router.get('/admin/camps', protect, getAdminCamps);

/**
 * @swagger
 * /api/admin/camps/{id}:
 *   get:
 *     summary: Get camp by ID (Admin)
 *     tags: [Camps Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Camp details
 */
router.get('/admin/camps/:id', protect, getAdminCampById);

/**
 * @swagger
 * /api/admin/camps/{id}:
 *   patch:
 *     summary: Update a camp (Admin)
 *     tags: [Camps Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Camp updated
 */
router.patch('/admin/camps/:id', protect, updateCamp);

/**
 * @swagger
 * /api/admin/camps/{id}:
 *   delete:
 *     summary: Delete a camp (Admin)
 *     tags: [Camps Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Camp deleted
 */
router.delete('/admin/camps/:id', protect, deleteCamp);

module.exports = router;
