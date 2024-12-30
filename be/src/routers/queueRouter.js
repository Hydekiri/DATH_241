
module.exports = (router) => {
    const queueController = require('../controllers/printerQueuController');
    router.get('/queue/:id', queueController.getAllDocumentOnQueue);
    // Route: Delete all documents in the queue for a specific printer
    router.delete('/queue/:printer_ID', queueController.deleteAllDocumentOnQueue);
    router.post('/queue/:printID/:queueID')
};
