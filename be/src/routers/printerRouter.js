module.exports = (router) => {
    const printerController = require("../controllers/printerController");

    router.get("/printer", printerController.getAllPrinters);
    router.get("/printers/:id", printerController.getPrinterById);
    router.post("/printer", printerController.createPrinter);
    router.put("/printers/:id", printerController.updatePrinter);
    router.delete("/printers/:id", printerController.deletePrinter);
};
