const userController = require("../controllers/usersController.js")


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
    updateStatus: async (sender_id, receiver_id, status) => {
        try {
            // Kiểm tra các tham số đầu vào
            if (!sender_id || !receiver_id || typeof status !== 'string') {
                throw new Error("Invalid parameters. Ensure sender_id, receiver_id, and status are provided.");
            }

            // Tạo query để cập nhật trạng thái trong cơ sở dữ liệu
            const query = `
                UPDATE messages
                SET status = ?
                WHERE sender_id = ? AND receiver_id = ?
            `;

            // Thực hiện query với tham số truyền vào
            const result = await pool.execute(query, [status, sender_id, receiver_id]);

            return result;
        } catch (error) {
            console.error("Error updating status:", error.message);
            return { success: false, message: error.message };
        }
    },
    getNameandStatus: async (userID) => {
        try {
            // Truy vấn để lấy 5 người gửi/nhận khác nhau gần nhất
            const query = `
            SELECT 
    u.user_ID AS user_ID,
    u.name AS name,
    m.sender_id as sender_id,
    m.content AS content,
    m.status AS status,
    m.created_at AS created_at
FROM 
    (
        SELECT 
            CASE 
                WHEN sender_id = ? THEN receiver_id
                ELSE sender_id 
            END AS other_user_id,
            MAX(id) AS message_id
        FROM 
            messages
        WHERE 
            sender_id = ? OR receiver_id = ?
        GROUP BY 
            other_user_id
        ORDER BY 
            MAX(created_at) DESC
    ) AS subquery
JOIN 
    messages m ON m.id = subquery.message_id
JOIN 
    User u ON u.user_ID = subquery.other_user_id
ORDER BY 
    m.created_at DESC;
`;


            // Lấy dữ liệu từ bảng messages
            const [messages] = await pool.execute(query, [userID, userID, userID]);
            console.log(messages)

            // Mảng chứa kết quả cuối cùng
            // const results = [];

            // // Lấy username của mỗi user khác
            // for (const message of messages) {
            //     const otherUserID = message.other_user_id;

            //     // Gọi hàm getUserById để lấy username
            //     const [user] = await userController.getUserById(otherUserID);

            //     if (user) {
            //         results.push({
            //             username: user.name, // Username từ hàm getUserById
            //             content: message.content, // Nội dung tin nhắn
            //             //status: message.status,
            //             created_at: message.created_at // Thời gian tạo tin nhắn
            //         });
            //     }
            // }

            return messages; // Trả về kết quả cuối cùng
        } catch (error) {
            console.error("Error in getNameandStatus:", error.message);
            throw new Error("Failed to fetch data.");
        }
    },
    getNameUserBySearch: async (key, role) => {
        const query = `
            SELECT user_ID, name, role
            FROM User
            WHERE name LIKE CONCAT('%', ?, '%') AND role = ?
            ORDER BY name ASC
        `;

        try {
            const [results] = await pool.execute(query, [key, role]);
            return results; // Trả về danh sách kết quả tìm được
        } catch (error) {
            console.error("Error in getNameUserBySearch:", error.message);
            throw new Error("Failed to fetch user by search.");
        }
    }

};

module.exports = messageModel;