module.exports = (router) => {
    const notificationController = require("../controllers/notificationController");

    const middlewareController = require("../controllers/middlewareController");

    router.get("/notifications", middlewareController.verifyAdmin, notificationController.getAllNotifications);
    router.post("/notifications", middlewareController.verifyAdmin, notificationController.createNotification);
    router.get("/notifications/:id", middlewareController.verifyControllerAndAdmin, notificationController.getNotificationById);
    router.delete("/notifications/:id", middlewareController.verifyToken, notificationController.deleteNotification);
    router.put('/notifications/:notificationId/user/:userId/read', middlewareController.verifyToken, notificationController.markNotificationAsRead);
};
