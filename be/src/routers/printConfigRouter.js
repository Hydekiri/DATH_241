module.exports = (router) => {
    const printConfigController = require("../controllers/printConfigController");

    router.get("/printconfigs", printConfigController.getAllConfigs);
    // router.get("/printconfigs/:date", printConfigController.getConfigByDates);
    router.get("/printconfigs/user/:userID", printConfigController.getConfigByID);
    router.get("/printconfigs/printer/:printerID", printConfigController.getConfigByPrinter);
};

