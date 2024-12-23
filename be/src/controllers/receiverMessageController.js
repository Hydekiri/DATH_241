const notificationModel = require("../models/notificationModel");
const userModel = require("../models/usersModel");

exports.sendNotificationToUser = async (req, res) => {
    try {
        const { userId, title, content } = req.body;

        // Tạo thông báo mới
        const notification = await notificationModel.createNotification(title, content);

        // Thêm người nhận thông báo
        await notificationModel.addReceiver(notification.notification_ID, userId);

        // Lấy chi tiết thông báo vừa tạo
        const notificationDetails = await notificationModel.getNotificationById(notification.notification_ID);

        // Kết hợp thêm trạng thái từ Receiver_Message
        const receiver = await notificationModel.getReceiverByNotificationAndUser(notification.notification_ID, userId);

        res.status(201).json({
            status: 201,
            data: {
                ...notificationDetails,
                status: receiver.status, // trạng thái từ Receiver_Message (vd: đã đọc hoặc chưa đọc)
            },
            message: "Notification sent to user successfully!",
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ status: 500, message: "Error sending notification", error: error.message });
    }
};


exports.getReceiversByNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const receivers = await notificationModel.getReceiversByNotification(notificationId);
        res.status(200).json({ status: 200, data: receivers, message: "Successfully retrieved receivers!" });
    } catch (error) {
        console.error("Error retrieving receivers:", error);
        res.status(500).json({ status: 500, message: "Error retrieving receivers", error: error.message });
    }
};

exports.getNotificationsForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await notificationModel.getNotificationsForUser(userId);
        res.status(200).json({ status: 200, data: notifications, message: "Successfully retrieved notifications!" });
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        res.status(500).json({ status: 500, message: "Error retrieving notifications", error: error.message });
    }
};

exports.removeReceiverFromNotification = async (req, res) => {
    try {
        const { notificationId, userId } = req.params;
        await notificationModel.removeReceiver(notificationId, userId);
        res.status(200).json({ status: 200, message: "Receiver removed from notification successfully!" });
    } catch (error) {
        console.error("Error removing receiver:", error);
        res.status(500).json({ status: 500, message: "Error removing receiver", error: error.message });
    }
};

exports.sendNotificationToAllUsers = async (req, res) => {
    try {
        const { title, content } = req.body;
        const notification = await notificationModel.createNotification(title, content);
        const users = await userModel.getALLUsers();
        for (const user of users) {
            await notificationModel.addReceiver(notification.notification_ID, user.user_ID);
        }
        res.status(201).json({ status: 201, message: "Notification sent to all users successfully!" });
    } catch (error) {
        console.error("Error sending notification to all users:", error);
        res.status(500).json({ status: 500, message: "Error sending notification to all users", error: error.message });
    }
};
