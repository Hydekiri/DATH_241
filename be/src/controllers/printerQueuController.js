const queuePrinterModel = require('../models/printQueueModel');

exports.getAllDocumentOnQueue = async (req, res) => {
    try {
        const queues = await queuePrinterModel.getAllQueue(req.params.id);
        if (!queues || queues.length === 0) {
            return res.status(404).json({ status: 404, message: "Queue does not exist or is empty" });
        }

        const formattedQueue = queues.map(queue => ({
            userID: queue.userID,
            timeStart: queue.print_start,
            queuePosition: queue.queue_position,
            numPages: queue.numPages,
            documentName: queue.document_name,
        }));

        return res.status(200).json({
            status: 200,
            data: formattedQueue,
            message: "Successfully retrieved queue",
        });
    } catch (error) {
        console.error("Error retrieving queue:", error.message);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while retrieving the queue",
            error: error.message,
        });
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
};
exports.printJobOnQueue = async (req, res) => {
    const { printer_ID, queue_ID } = req.body;

    if (!printer_ID || !queue_ID) {
        return res.status(400).json({
            status: 400,
            message: "Printer ID and Queue ID are required."
        });
    }
    try {
        await queuePrinterModel.processPrintQueue(printer_ID, queue_ID);
        return res.status(200).json({
            status: 200,
            message: "Print job completed successfully.",
            data: {
                printer_ID,
                queue_ID
            }
        });

    } catch (error) {
        console.error("Error to print this document on Queue", error);
        res.status(500).json({ status: 500, message: 'Error to print this document on Queue' })
    }
};
