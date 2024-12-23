module.exports = (router) => {
    const notificationController = require("../controllers/notificationController");

    router.get("/notifications", notificationController.getAllNotifications);
    router.post("/notifications", notificationController.createNotification);
    router.get("/notifications/:id", notificationController.getNotificationById);
    router.delete("/notifications/:id", notificationController.deleteNotification);
    router.put('/notifications/:notificationId/user/:userId/read', notificationController.markNotificationAsRead);
};
