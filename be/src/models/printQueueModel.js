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
    deleteAllDocumentInQueue: async (printer_ID) => {
        try {
            await query.deleteRow("Queue", { printer_ID: printer_ID });
            return { printer_ID: printer_ID };
        } catch (error) {
            console.error("Error for this queue", error);
            throw error;
        }
    },
    addPrintJob: async (userId, printerId, configId, numPages) => {
        try {
            // 1. Thêm bản ghi vào `PrintConfiguration`
            // 2. Lấy thông tin tài liệu từ `Document`
            const [document] = await pool.query(
                'SELECT `name` FROM `Document` WHERE `config_ID` = ?',
                [configId]
            );
            if (!document) {
                throw new Error('Document not found for the given config_ID');
            }

            // 3. Tính toán vị trí tiếp theo trong hàng đợi
            const [result] = await pool.query(
                `SELECT COUNT(*) + 1 AS next_position
                FROM Queue
                WHERE printer_ID = ?`,
                [printerId]
            );
            const queuePosition = result[0].next_position;
            // 4. Xác định trạng thái ban đầu (đang in hoặc chờ in)
            const status = 'unCompleted'
            const printStart = null;

            // 5. Thêm bản ghi vào `Queue`
            await pool.query(
                `INSERT INTO Queue (
                    userID, printer_ID, config_ID, document_name, queue_position, status, numPages, print_start
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, printerId, configId, document.name, queuePosition, status, numPages, printStart]
            );
            //tăng thêm một job cho queue trong printer
            await pool.query(
                `UPDATE Printer 
                 SET queue = queue + 1 
                 WHERE Printer_ID = ?`,
                [printerId]
            );


        } catch (error) {
            console.error("Error for add to queue", error);
            throw error;
        }
    },
    processPrintQueue: async (printer_ID, queue_ID) => {
        try {
            // 1. Lấy tài liệu cụ thể trong hàng đợi dựa trên queue_ID
            const [currentJob] = await pool.query(
                `SELECT * FROM Queue 
                 WHERE printer_ID = ? AND queue_ID = ?`,
                [printer_ID, queue_ID]
            );

            if (currentJob) {
                console.log(`Starting to print document: ${currentJob.document_name} on Printer ${printer_ID}`);

                // 2. Giả lập thời gian in (10 giây mỗi trang)
                //update printStart
                await pool.query(
                    `UPDATE PrintConfiguration
                    SET printStart = NOW()
                    WHERE config_ID = ?`
                    [currentJob.configId]
                );
                currentJob.print_start = new Date();
                const printTime = currentJob.numPages * 10000; // numPages * 10 giây
                await sleep(printTime);
                console.log(`Completed printing: ${currentJob.document_name} on Printer ${printer_ID}`);
                //update printEnd
                await pool.query(
                    `UPDATE PrintConfiguration
                    SET printEnd = NOW()
                    WHERE config_ID = ?`
                    [currentJob.configId]
                );
                //currentJob.print_end = new Date();

                // 3. Xóa tài liệu đã in khỏi hàng đợi
                await pool.query(
                    `DELETE FROM Queue WHERE queue_ID = ?`,
                    [currentJob.queue_ID]
                );
                // decrease queue in printer
                await pool.query(
                    `UPDATE Printer
                    SET queue = queue - 1
                    WHERE Printer_ID = ?`
                    [printer_ID]
                );

                // 4. Cập nhật vị trí và trạng thái của các tài liệu còn lại trong hàng đợi
                await pool.query(
                    `UPDATE Queue 
                     SET queue_position = queue_position - 1 
                     WHERE printer_ID = ? AND queue_position > ?`,
                    [printer_ID, currentJob.queue_position]
                );

            } else {
                console.log(`No job found in the queue for Printer ${printer_ID} with queue_ID ${queue_ID}`);
            }
        } catch (err) {
            console.error(`Error processing queue for Printer ${printer_ID}:`, err.message);
        }
    }
}
module.exports = queuePrinterModel;