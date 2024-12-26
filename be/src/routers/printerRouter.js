module.exports = (router) => {
    const printerController = require("../controllers/printerController");
    const middlewareController = require("../controllers/middlewareController");

    router.get("/printers", printerController.getAllPrinters);
    router.get("/printers/:id", printerController.getPrinterById);
    router.post("/printers", printerController.createPrinter);
    router.put("/printers/:id", printerController.updatePrinter);
    router.put("/printers/:id/status", printerController.changeStatus);
    router.delete("/printers/:id", printerController.deletePrinter);
};
