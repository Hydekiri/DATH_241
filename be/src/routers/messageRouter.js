


module.exports = (router) => {
    const messageController = require('../controllers/messageController');


    // Gửi tin nhắn tới một người dùng
    router.post("/messages/:sender_id", messageController.sendMessageToUser);

    //lấy danh sách người dùng gần nhất
    router.get("/messages/names/:userID", messageController.getNameAndStatus);

    router.put("/messages/change", messageController.changeStatus);

    router.get("/messages/all", messageController.getAllNotifications);

    //Search tên
    router.get("/messages/search", messageController.SearchUserByName);

    // Lấy tất cả tin nhắn giữa hai người dùng (cả gửi và nhận)
    router.get("/messages", messageController.getMessagesForUser);

    // Xóa toàn bộ lịch sử trò chuyện giữa hai người dùng
    router.delete("/messages/:sender_id/:receiver_id", messageController.deleteAllMessage);
};
