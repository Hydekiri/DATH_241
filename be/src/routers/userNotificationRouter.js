module.exports = (router) => {
    const userNotificationController = require("../controllers/userNotificationController");

    // API lấy danh sách chi tiết thông báo của một user
    router.get("/users/:userId/notifications/details", userNotificationController.getUserNotificationsWithDetails );
};