const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const locationModel = {
    getAllLocation: async () => {
        try {
            return await query.getAll("Location");
        } catch (error) {
            console.error("Error in getAllLocations:", error);
            throw error;
        }
    },

    createLocation: async (campus, building, room) => {
        try {
            const locationData = { campus, building, room };
            const result = await query.insertSingleRow("Location", locationData);
            return { Location_ID: result.insertId, ...locationData };
        } catch (error) {
            console.error("Error in createLocation:", error);
            throw error;
        }
    },

    updateLocation: async (location_ID, updates) => {
        try {
            await query.updateRow("Location", updates, { Location_ID: location_ID });
            return { Location_ID: location_ID, ...updates };
        } catch (error) {
            console.error("Error in updateLocation:", error);
            throw error;
        }
    },

    deleteLocation: async (location_ID) => {
        try {
            await query.deleteRow("Location", { Location_ID: location_ID });
            return { Location_ID: location_ID };
        } catch (error) {
            console.error("Error in deleteLocation:", error);
            throw error;
        }
    },

    findLocation: async (location) => {
        try {
            return await query.getOne("Location", location);
        } catch (error) {
            console.error("Error in findLocation:", error);
            throw error;
        }
    }
};

module.exports = locationModel;
