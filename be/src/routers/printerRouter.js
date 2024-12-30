module.exports = (router) => {
    const printerController = require("../controllers/printerController");

    router.get("/printers", printerController.getAllPrinters);
    router.get("/printers/:id", printerController.getPrinterById);
    router.post("/printers", printerController.createPrinter);
    router.put("/printers/:id", printerController.updatePrinter);
    router.delete("/printers/:id", printerController.deletePrinter);
};
