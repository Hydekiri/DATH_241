module.exports = (router) => {
    const printerController = require("../controllers/printerController");
    const middlewareController = require("../controllers/middlewareController");
    const cron = require('node-cron');
    router.get("/printers", printerController.getAllPrinters);
    router.get("/printers/:id", printerController.getPrinterById);
    router.post("/printers", printerController.createPrinter);
    router.put("/printers/:id", printerController.updatePrinter);
    router.put("/printers/:id/status", printerController.changeStatus);
    router.put("/printers/resetPrintInDay", printerController.resetPrintInDay);
    router.put("/printers/:id/updatePagePrint", printerController.updatePages_printed);
    router.put("/printers/:id/resetPrintInDay", printerController.resetPrintInDayByID);
    router.put("/printers/:id/increPrintInDay", printerController.increPrintInDayByID);
    router.put("/printers/:id/decreQueue", printerController.decreQueue);
    router.delete("/printers/:id", printerController.deletePrinter);
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log("Bắt đầu reset số lượt in trong ngày...");
            await printerController.resetPrintInDay(); // Gọi controller
            console.log("Reset thành công.");
        } catch (error) {
            console.error("Lỗi khi reset số lượt in:", error);
        }
    });
    
};
