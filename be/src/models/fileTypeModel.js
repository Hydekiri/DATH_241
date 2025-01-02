const { connectDB } = require("../config/config.js");
const Query = require("../config/query"); 

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();


const fileTypeModel = {
    getAllFileTypes: async () => {
        try {
            return await Query.getAll("FileType");
        } catch (error) {
            console.error("Error fetching all FileTypes:", error);
            throw error;
        }
    },

    createFileType: async (type, spso_ID) => {
        try {
            const data = { type, spso_ID };
            await Query.insertSingleRow("FileType", data);
            return data;
        } catch (error) {
            console.error("Error creating FileType:", error);
            throw error;
        }
    },

    deleteFileType: async (type) => {
        try {
            const condition = { type };
            await Query.deleteRow("FileType", condition);
            return condition;
        } catch (error) {
            console.error("Error deleting FileType:", error);
            throw error;
        }
    },

    isFileTypeValid: async (type) => {
        try {
            const condition = { type };
            const result = await Query.getRows("FileType", condition);
            return result.length > 0;
        } catch (error) {
            console.error("Error validating FileType:", error);
            throw error;
        }
    }
};

module.exports = fileTypeModel;

