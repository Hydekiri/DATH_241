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

    // getNotificationsForUser: async (user_ID) => {
    //     const notifications = await query.execute(`
    //         SELECT rm.notification_ID, nm.title, nm.content
    //         FROM Receiver_Message rm
    //         JOIN Notification_Message nm ON rm.notification_ID = nm.notification_ID
    //         WHERE rm.user_ID = ?
    //     `, [user_ID]);
    //     return notifications;
    // },

    getNotificationsForUser: async (user_ID) => {
        try {
            const notifications = await query.getAll("Receiver_Message", { user_ID });

            if (!notifications || notifications.length === 0) {
                console.log("No notification found.");
                return [];
            }
            for (const notification of notifications) {
                const notificationDetails = await query.getOne("Notification_Message", { notification_ID: notification.notification_ID });
                notification.notificationDetails = notificationDetails || null;
            }
            return notifications;
        } catch (error) {
            console.error("Error in getNotificationForUser:", error);
            throw error;
        }
    },

    removeReceiver: async (notification_ID, user_ID) => {
        await query.deleteRow("Receiver_Message", { notification_ID, user_ID });
    }
};

module.exports = notificationModel;
