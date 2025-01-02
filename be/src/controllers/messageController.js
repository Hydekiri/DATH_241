// const receiverMessageModel = require("../models/receiverMessageModel");
// const userModel = require("../models/usersModel");
const messageModel = require("../models/messageModel");

exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await messageModel.getAllNotifications();

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ status: 404, message: "No Notifications Found" });
        }

        res.status(200).json({ status: 200, data: notifications, message: "Successfully Retrieved Notifications!" });
    } catch (error) {
        console.error("Error Retrieving Notifications:", error.message);
        res.status(500).json({ status: 500, message: 'Error Retrieving Notifications', error: error.message });
    }
};

exports.sendMessageToUser = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.params.sender_id;

        // Tạo tin nhắn mới
        const message = await messageModel.createMessage(sender_id, receiver_id, content);

        // Lấy chi tiết thông báo vừa tạo
        const messageDetails = await messageModel.getMessageById(message.id);

        res.status(201).json({
            status: 201,
            data: {
                ...messageDetails,
                //status: receiver.status, // trạng thái
            },
            message: "Message sent to user successfully!",
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ status: 500, message: "Error sending message", error: error.message });
    }
};


// exports.getReceiversByNotification = async (req, res) => {
//     try {
//         const { notificationId } = req.params;
//         const receivers = await notificationModel.getReceiversByNotification(notificationId);
//         res.status(200).json({ status: 200, data: receivers, message: "Successfully retrieved receivers!" });
//     } catch (error) {
//         console.error("Error retrieving receivers:", error);
//         res.status(500).json({ status: 500, message: "Error retrieving receivers", error: error.message });
//     }
// };

// exports.getNotificationsForUser = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const notifications = await notificationModel.getNotificationsForUser(userId);
//         res.status(200).json({ status: 200, data: notifications, message: "Successfully retrieved notifications!" });
//     } catch (error) {
//         console.error("Error retrieving notifications:", error);
//         res.status(500).json({ status: 500, message: "Error retrieving notifications", error: error.message });
//     }
// };

exports.getMessagesForUser = async (req, res) => {
    const { sender_id, receiver_id } = req.query;

    if (!sender_id || !receiver_id) {
        return res.status(400).json({ status: 400, message: "Sender ID and Receiver ID are required." });
    }

    try {
        // Lấy tin nhắn từ `sender_id -> receiver_id`
        const sentMessages = await messageModel.getMessagesForUser(sender_id, receiver_id);

        // Lấy tin nhắn từ `receiver_id -> sender_id`
        const receivedMessages = await messageModel.getMessagesForUser(receiver_id, sender_id);

        // Hợp nhất tin nhắn từ hai phía
        const allMessages = [...sentMessages, ...receivedMessages];

        // Sắp xếp tin nhắn theo thứ tự thời gian
        const sortedMessages = allMessages.sort((a, b) => new Date(a.messageDetails.created_at) - new Date(b.messageDetails.created_at));

        // Chuẩn hóa tin nhắn cho front-end
        const messagesDetails = sortedMessages.map((message) => ({
            id: message.id,
            sender_id: message.messageDetails ? message.messageDetails.sender_id : null,
            content: message.messageDetails ? message.messageDetails.content : null,
            status: message.messageDetails ? message.messageDetails.status : null,
            created_at: message.messageDetails ? message.messageDetails.created_at : null
        }));

        res.status(200).json({ status: 200, data: messagesDetails, message: "Successfully retrieved messages!" });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ status: 500, message: "Error retrieving messages", error: error.message });
    }
};


exports.deleteAllMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.params;
        await messageModel.removeMessage(sender_id, receiver_id);
        res.status(200).json({ status: 200, message: "Historic Chat has been deleted!" });
    } catch (error) {
        console.error("Error deleting:", error);
        res.status(500).json({ status: 500, message: "Error deleting", error: error.message });
    }
};

// exports.sendNotificationToAllUsers = async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const notification = await notificationModel.createNotification(title, content);
//         const users = await userModel.getALLUsers();
//         for (const user of users) {
//             await notificationModel.addReceiver(notification.notification_ID, user.user_ID);
//         }
//         res.status(201).json({ status: 201, message: "Notification sent to all users successfully!" });
//     } catch (error) {
//         console.error("Error sending notification to all users:", error);
//         res.status(500).json({ status: 500, message: "Error sending notification to all users", error: error.message });
//     }
// };
