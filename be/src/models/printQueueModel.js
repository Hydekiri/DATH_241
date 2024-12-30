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
                WHERE printer_ID = ? AND status IN ('1', '0')`,
                [printerId]
            );
            const queuePosition = result[0].next_position;
            // 4. Xác định trạng thái ban đầu (đang in hoặc chờ in)
            const status = queuePosition === 1 ? '0' : '1'; // '0' = đang in, '1' = chờ in
            const printStart = queuePosition === 1 ? new Date() : null;

            // 5. Thêm bản ghi vào `Queue`
            await pool.query(
                `INSERT INTO Queue (
                userID, printer_ID, config_ID, document_name, queue_position, status, numPages, print_start
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, printerId, configId, document.name, queuePosition, status, numPages, printStart]
            );

        } catch (error) {
            console.error("Error for add to queue", error);
            throw error;
        }
    },
    processPrintQueue: async (printer_ID) => {
        while (true) {
            try {
                // 1. Lấy tài liệu đang in cho máy in
                const [currentJob] = await db.query(
                    `SELECT * FROM Queue 
                     WHERE printer_ID = ? AND status = '0' 
                     ORDER BY queue_position LIMIT 1`,
                    [printer_ID]
                );

                if (currentJob) {
                    console.log(`Printing document on Printer ${printer_ID}: ${currentJob.document_name}`);

                    // 2. Giả lập thời gian in (10 giây mỗi trang)
                    const printTime = currentJob.numPages * 10000; // numPages * 10 giây
                    await sleep(printTime);
                    console.log(`Completed printing on Printer ${printer_ID}: ${currentJob.document_name}`);

                    // 3. Xóa tài liệu đã in
                    await pool.query(
                        `DELETE FROM Queue WHERE queue_ID = ?`,
                        [currentJob.queue_ID]
                    );

                    // 4. Dịch chuyển hàng đợi và cập nhật trạng thái tài liệu tiếp theo
                    await pool.query(
                        `UPDATE Queue 
                         SET queue_position = queue_position - 1 
                         WHERE printer_ID = ? AND queue_position > ?`,
                        [printer_ID, currentJob.queue_position]
                    );

                    await pool.query(
                        `UPDATE Queue 
                         SET status = '0', print_start = NOW() 
                         WHERE printer_ID = ? AND queue_position = 1 AND status = '1'`,
                        [printer_ID]
                    );
                } else {
                    console.log(`Queue for Printer ${printer_ID} is empty. Waiting for new jobs...`);
                    await sleep(5000);
                }
            } catch (err) {
                console.error(`Error processing queue for Printer ${printer_ID}:`, err.message);
                await sleep(5000);
            }
        }
    }

};
module.exports = queuePrinterModel;