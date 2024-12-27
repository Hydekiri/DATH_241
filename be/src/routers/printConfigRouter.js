module.exports = (router) => {
    const printConfigController = require("../controllers/printConfigController");

    router.get("/printconfigs", printConfigController.getAllConfigs);
    router.get("/printconfigs/user/:userID", printConfigController.getConfigByID);
    router.get("/printconfigs/printer/:printerID", printConfigController.getConfigByPrinter);
    router.post("/printconfigs", printConfigController.createConfig);
    router.put("/printconfigs/:id", printConfigController.updateConfig);
    router.delete("/printconfigs/:id", printConfigController.deleteConfig);
    router.delete("/printconfigs/printer/:printerID", printConfigController.deleteConfigByPrinter);
    router.get("/printconfigs/user/:userID/history", printConfigController.getAllUserHistory);
};