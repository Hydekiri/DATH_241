module.exports = (router) => {
    const userNotificationController = require("../controllers/userNotificationController");
    const middlewareController = require("../controllers/middlewareController");

    // API lấy danh sách chi tiết thông báo của một user
    router.get("/users/:userId/notifications/details", middlewareController.verifyControllerAndAdmin, userNotificationController.getUserNotificationsWithDetails );
};