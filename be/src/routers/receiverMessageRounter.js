module.exports = (router) => {
    const receiverMessageController = require("../controllers/receiverMessageController");

    // Gửi thông báo đến một người dùng cụ thể
    router.post("/notifications/send", receiverMessageController.sendNotificationToUser);

    // Lấy danh sách người nhận của một thông báo
    router.get("/notifications/:notificationId/receivers", receiverMessageController.getReceiversByNotification);

    // Lấy danh sách thông báo được gửi đến một người dùng
    router.get("/users/:userId/notifications", receiverMessageController.getNotificationsForUser);

    // Xóa một người nhận khỏi thông báo
    router.delete("/notifications/:notificationId/receivers/:userId", receiverMessageController.removeReceiverFromNotification);

    // Gửi thông báo đến tất cả người dùng
    router.post("/notifications/sendToAll", receiverMessageController.sendNotificationToAllUsers);
};

/* 
    1. GET /notifications  => Lấy tất cả thông báo từ hệ thống.

    2. POST /notifications => Tạo một thông báo mới với tiêu đề và nội dung.

    3. PUT /notifications/:id => Cập nhật thông báo theo id (cập nhật tiêu đề và nội dung).

    4. DELETE /notifications/:id =>  Xóa thông báo theo id.

    5. POST /notifications/send => Gửi thông báo cho một người dùng cụ thể (dựa trên notification_ID và user_ID).

    6. GET /notifications/:notificationId/receivers => Lấy danh sách người nhận của một thông báo cụ thể (dựa trên notificationId).

    7. GET /users/:userId/notifications => Lấy tất cả thông báo đã gửi cho một người dùng cụ thể (dựa trên userId).

    8. DELETE /notifications/:notificationId/receivers/:userId =>  Xóa một người nhận khỏi danh sách nhận thông báo (dựa trên notificationId và userId).

    9. POST /notifications/send-to-all => Gửi thông báo đến tất cả người dùng trong hệ thống.
 */


    