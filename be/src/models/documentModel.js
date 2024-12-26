const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const DocModel = {
    getAllDoc: async () => {
        try {
            return await query.getAll("Document");
        } catch (error) {
            console.error("Error in getAllDoc:", error);
            throw error;
        }
    },

    getDoc: async (configID) => {
        try {
            return await query.getOne("Document", { config_ID: configID });
        } catch (error) {
            console.error("Error in getDoc:", error);
            throw error;
        }
    },

    createNewDoc: async (config_ID, name, size, lastModifiedDate) => {
        try {
            const docData = { config_ID, name, size, lastModifiedDate };
            const result = await query.insertSingleRow("Document", docData);
            return { config_ID, name, ...docData };
        } catch (error) {
            console.error("Error in createNewDoc:", error);
            throw error;
        }
    },

    updateDoc: async (config_ID, name, updates) => {
        try {
            await query.updateRow(
                "Document",
                updates,
                { config_ID: config_ID, name: name }
            );
            return { config_ID, name, ...updates };
        } catch (error) {
            console.error("Error in updateDoc:", error);
            throw error;
        }
    },

    deleteDoc: async (config_ID, name) => {
        try {
            await query.deleteRow("Document", { config_ID: config_ID, name: name });
            return { config_ID, name };
        } catch (error) {
            console.error("Error in deleteDoc:", error);
            throw error;
        }
    }
};

module.exports = DocModel;