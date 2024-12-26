const queuePrinterModel = require('../models/printQueueModel');

exports.getAllDocumentOnQueue = async (req, res) => {
    try {
        const queues = await queuePrinterModel.getAllQueue(req.params.id);
        if (!queues) {
            return res.status(404).json({ status: 404, message: "Queue does not exist" });
        }
        const formmatQueue = queues.map(queue => ({
            userName: queue.userName,
            time_start: queue.print_start,
            queue_position: queue.queue_position,
            documentName: queue.document_name,
        }));
        res.status(200).json({ status: 200, data, formmatQueue, message: "Successfully Retrived Queue" })
    } catch (error) {
        console.error("Error Retrieving Queue:", error.message);
        res.status(500).json({ status: 500, message: 'Error Retrieving Queue', error: error.message });
    }
};
exports.deleteDocumentOnQueue = async (req, res) => {
    try {
        const printer_ID = req.params.printer_ID;  // Lấy giá trị printer_ID từ URL params
        const queue_ID = req.params.queue_ID;      // Lấy giá trị queue_ID từ URL params
        const deleteDocument = await queuePrinterModel.deleteDocumentOnQueue(printer_ID, queue_ID);
        res.status(200).json({ status: 200, data: deleteDocument, message: "Successfully Deleted Document on Queue!" })
    } catch (error) {
        console.error("Error Delete this Document on Queue:", error);
        res.status(500).json({ status: 500, message: 'Error Delete this Document on Queue' });
    }
};
exports.deleteAllDocumentOnQueue = async (req, res) => {
    try {
        const printer_ID = req.params.printer_ID;  // Lấy giá trị printer_ID từ URL params
        const deleteAllDocument = await queuePrinterModel.deleteAllDocumentInQueue(printer_ID);
        res.status(200).json({ status: 200, data: deleteAllDocument, message: "Successfully Deleted All Documents on Queue!" })
    } catch (error) {
        console.error("Error Delete all Documents on Queue!!", error);
        res.status(500).json({ status: 500, message: 'Error Delete all Documents on Queue' })
    }
}
