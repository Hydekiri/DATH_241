const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

// Initialize the database connection
async function initDB() {
    pool = await connectDB();
}

initDB();

const queuePrinterModel = {
    getAllQueue: async (printer_ID) => {
        try {
            const queues = await query.getAll("Queue", { printer_ID: printer_ID });
            if (!queues || queues.length === 0) {
                console.log("No documents found.");
                return [];
            }
            for (const queue of queues) {
                console.log("Document: ", queue);
            }
            return queues;
        }
        catch (error) {
            console.error("Error in get all queue", error);
            throw error;
        }
    },
    deleteDocumentOnQueue: async (printer_ID, queue_ID) => {
        try {
            await query.deleteRow("Queue", { printer_ID: printer_ID, queue_ID: queue_ID });
            return { printer_ID: printer_ID, queue_ID: queue_ID };
        }
        catch (error) {
            console.error("Error for delete document", error);
            throw error;
        }
    },
    deleteAllDocumentInQueue: async (printer_ID) => {
        try {
            await query.deleteRow("Queue", { printer_ID: printer_ID, status: '1' });
            return { printer_ID: printer_ID };
        } catch (error) {
            console.error("Error for this queue", error);
            throw error;
        }
    }
};
module.exports = queuePrinterModel;