const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const messageModel = {

    getAllNotifications: async () => {
        try {
            const notifications = await query.getAll("messages");
            return notifications;
        } catch (error) {
            console.error("Error in getAllNotifications:", error);
            throw error;
        }
    },

    createMessage: async (sender_id, receiver_id, content) => {
        //const messageData = { sender_id, receiver_id, content }; //, content

        const result = await query.insertSingleRow("messages", { sender_id, receiver_id, content });
        return { id: result.insertId };
    },

    // addReceiver: async (id, sender_id, receiver_id) => {
    //     await query.insertSingleRow("messages", { id, sender_id, receiver_id });
    // },

    getReceiversByMessage: async (id) => {
        const receivers = await query.getAll("messages", { id });
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

    getMessagesForUser: async (sender_id, receiver_id) => {
        try {
            const messages = await query.getAll("messages", { sender_id, receiver_id });

            if (!messages || messages.length === 0) {
                console.log("No message found.");
                return [];
            }
            for (const message of messages) {
                const messageDetails = await query.getOne("messages", { id: message.id });
                message.messageDetails = messageDetails || null;
            }
            return messages;
        } catch (error) {
            console.error("Error in getMessageForUser:", error);
            throw error;
        }
    },

    removeMessage: async (sender_id, receiver_id) => {
        const sql = `
            DELETE FROM messages
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
        `;
        try {
            await pool.execute(sql, [sender_id, receiver_id, receiver_id, sender_id]);
        } catch (error) {
            console.error("Error in removeMessage:", error);
            throw error;
        }
    },

    getMessageById: async (id) => {
        try {
            const notification = await query.getOne("messages", { id });
            return notification;
        } catch (error) {
            console.error("Error in getMessageById:", error);
            throw error;
        }
    },
    getStatusByMessages: async (id) => {
        const result = await query.getOne("messages", { id });
        return result;
    }
};

module.exports = messageModel;