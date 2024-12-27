module.exports = (router) => {
    const fileTypeController = require("../controllers/fileTypeController");

    router.get("/filetypes", fileTypeController.getAllFileTypes);
    router.post("/filetypes", fileTypeController.createFileType);
    router.delete("/filetypes/:type", fileTypeController.deleteFileType);
    router.post("/filetypes/validate", fileTypeController.validateFileType);
};
