const express = require('express');
const router = express.Router();
const queueController = require('../controllers/printerQueuController');

// Route: Get all documents in the queue
router.get('/queue/:id', queueController.getAllDocumentOnQueue);

// Route: Delete a specific document in the queue
router.delete('/queue/:printer_ID/:queue_ID', queueController.deleteDocumentOnQueue);

// Route: Delete all documents in the queue for a specific printer
router.delete('/queue/:printer_ID', queueController.deleteAllDocumentOnQueue);

module.exports = router;
