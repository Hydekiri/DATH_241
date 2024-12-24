module.exports = (router) => {
    const printerController = require("../controllers/printerController");
    const middlewareController = require("../controllers/middlewareController");

    router.get("/printers", printerController.getAllPrinters);
    router.get("/printers/:id", printerController.getPrinterById);
    router.post("/printers", printerController.createPrinter);

    /// Set authorization that only spso can do
    router.put("/printers/:id", middlewareController.verifyAdmin, printerController.updatePrinter);
    router.delete("/printers/:id", middlewareController.verifyAdmin, printerController.deletePrinter);
};
