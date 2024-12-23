const receiverMessageModel = require("../models/receiverMessageModel");
const notificationModel = require("../models/notificationModel");

exports.getUserNotificationsWithDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Lấy danh sách notification_ID mà user nhận được
        const userNotifications = await receiverMessageModel.getNotificationsForUser(userId);
        if (!userNotifications || userNotifications.length === 0) {
            return res
                .status(404)
                .json({ status: 404, message: "No notifications found for this user" });
        }

        // Lấy chi tiết từng notification_ID
        const notificationDetails = await Promise.all(
            userNotifications.map(async (notification) => {
                const detail = await notificationModel.getNotificationById(notification.notification_ID);
                return {
                    ...detail,
                    status: notification.status, // Kết hợp thêm trạng thái từ Receiver_Message
                };
            })
        );

        // Trả về dữ liệu đã hợp nhất
        res.status(200).json({
            status: 200,
            data: notificationDetails,
            message: "Successfully retrieved notifications with details",
        });
    } catch (error) {
        console.error("Error retrieving user notifications with details:", error);
        res.status(500).json({
            status: 500,
            message: "Error retrieving notifications",
            error: error.message,
        });
    }
};
