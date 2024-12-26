module.exports = (router) => {
    const documentController = require("../controllers/documentController");

    const middlewareController = require("../controllers/middlewareController");

    router.get("/documents", middlewareController.verifyAdmin ,documentController.getAllDocuments);

    router.post("/documents", middlewareController.verifyToken,documentController.createDocument);

    router.put("/documents/:config_ID/:name", middlewareController.verifyToken,documentController.updateDocument);

    router.delete("/documents/:config_ID/:name", middlewareController.verifyToken, documentController.deleteDocument);
};
