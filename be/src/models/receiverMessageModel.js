const query = require("../config/query");

const notificationModel = {
    createNotification: async (title, content) => {
        const notificationData = { title, content };
        const result = await query.insertSingleRow("Notification_Message", notificationData);
        return { notification_ID: result.insertId, ...notificationData };
    },

    addReceiver: async (notification_ID, user_ID) => {
        await query.insertSingleRow("Receiver_Message", { notification_ID, user_ID });
    },

    getReceiversByNotification: async (notification_ID) => {
        const receivers = await query.getAll("Receiver_Message", { notification_ID });
        return receivers;
    },

    getNotificationsForUser: async (user_ID) => {
        const notifications = await query.getAll("Receiver_Message", { user_ID });
        return notifications;
    },

    removeReceiver: async (notification_ID, user_ID) => {
        await query.deleteRow("Receiver_Message", { notification_ID, user_ID });
    }
};


module.exports = notificationModel;
