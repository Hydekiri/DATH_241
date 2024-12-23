const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const notificationModel = {
    getAllNotifications: async () => {
        try {
            const notifications = await query.getAll("Notification_Message");
            return notifications;
        } catch (error) {
            console.error("Error in getAllNotifications:", error);
            throw error;
        }
    },

    createNotification: async (title, content) => {
        try {
            const notificationData = { title, content };
            const result = await query.insertSingleRow("Notification_Message", notificationData);
            return { notification_ID: result.insertId, ...notificationData };
        } catch (error) {
            console.error("Error in createNotification:", error);
            throw error;
        }
    },

    getNotificationById: async (notification_ID) => {
        try {
            const notification = await query.getOne("Notification_Message", { notification_ID });
            return notification;
        } catch (error) {
            console.error("Error in getNotificationById:", error);
            throw error;
        }
    },

    deleteNotification: async (notification_ID) => {
        try {
            const result = await query.deleteRow("Notification_Message", { notification_ID });
            return result ? { notification_ID } : null;
        } catch (error) {
            console.error("Error in deleteNotification:", error);
            throw error;
        }
    },

    addReceiver: async (notification_ID, user_ID) => {
        try {
            const receiverData = { notification_ID, user_ID, status: 'unread' };
            const result = await query.insertSingleRow('Receiver_Message', receiverData);
            return result;
        } catch (error) {
            console.error("Error in addReceiver:", error);
            throw error;
        }
    },
    getNotificationsForUser: async (user_ID) => {
        const notifications = await query.getAll("Receiver_Message", { user_ID });
        return notifications;
    },
    getReceiversByNotification: async (notification_ID) => {
        try {
            const receivers = await query.getAll('Receiver_Message', { notification_ID });
            return receivers.map(receiver => ({
                user_ID: receiver.user_ID,
                status: receiver.status
            }));
        } catch (error) {
            console.error("Error in getReceiversByNotification:", error);
            throw error;
        }
    },

    removeReceiver: async (notification_ID, user_ID) => {
        try {
            const result = await query.deleteRow('Receiver_Message', { notification_ID, user_ID });
            if (result.affectedRows === 0) {
                throw new Error("Receiver not found or already removed");
            }
            return { message: "Receiver successfully removed", notification_ID, user_ID };
        } catch (error) {
            console.error("Error in removeReceiver:", error);
            throw error;
        }
    },

    markAsRead: async (notification_ID, user_ID) => {
        try {
            const result = await query.updateRow('Receiver_Message', { status: 'read' }, { notification_ID, user_ID });
            if (result.affectedRows === 0) {
                throw new Error("Receiver or Notification not found");
            }
            return { message: "Notification marked as read", notification_ID, user_ID };
        } catch (error) {
            console.error("Error in markAsRead:", error);
            throw error;
        }
    },
    getReceiverByNotificationAndUser: async (notification_ID, user_ID) => {
        const result = await query.getOne("Receiver_Message", { notification_ID, user_ID });
        return result;
    }
};

module.exports = notificationModel;
