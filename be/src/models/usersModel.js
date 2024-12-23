    const { connectDB } = require("../config/config.js");
    const query = require("../config/query.js");

    let pool;

    async function initDB() {
        pool = await connectDB();
    }

    initDB();

    const usersModel = {
        getALLUsers: async (condition = {}) => {
            try {
                const users = await query.getAll("User", condition);
                return users;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        getUserById: async (id) => {
            try {
                const user = await query.getOne("User", { user_ID: id });
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        updateUser: async (id, userData) => {
            try {
                const result = await query.updateRow("User", userData, { user_ID: id });
                return result;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        deleteUser: async (id) => {
            try {
                const result = await query.deleteRow("User", { user_ID: id });
                return result;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        createUser: async (userData) => {
            try {
                const result = await query.insertSingleRow("User", userData);
                return { id: result.insertId, ...userData };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        getUserByEmail: async (email) => {
            try {
                const user = await query.getOne("User", { email: email });
                return user;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    };



    module.exports = usersModel;