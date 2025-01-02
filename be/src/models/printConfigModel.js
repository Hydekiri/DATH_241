const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const printConfigModel = {
    getAllConfig: async () => {
        try {
            const printConfigs = await query.getAll("PrintConfiguration");


            if (!printConfigs || printConfigs.length === 0) {
                console.log("No printConfig found.");
                return [];
            }
            for (const config of printConfigs) {
                const user = await query.getOne("User", { user_ID: config.user_ID });
                const printer = await query.getOne("Printer", { Printer_ID: config.printer_ID });
                config.user = user || null;
                config.printer = printer || null;
            }

            return printConfigs;
        } catch (error) {
            console.error("Error in getAllConfig:", error);
            throw error;
        }
    },

    getConfigByID: async (user_ID) => {
        try {
            const printConfigs = await query.getAll("PrintConfiguration", { user_ID });

            if (!printConfigs || printConfigs.length === 0) {
                console.log("No printConfig found.");
                return [];
            }
            for (const config of printConfigs) {
                const user = await query.getOne("User", { user_ID: config.user_ID });
                const printer = await query.getOne("Printer", { Printer_ID: config.printer_ID });
                config.user = user || null;
                config.printer = printer || null;
            }

            return printConfigs;
        } catch (error) {
            console.error("Error in getConfigByID:", error);
            throw error;
        }
    },

    getConfigByPrinter: async (printer_ID) => {
        try {
            const printConfigs = await query.getAll("PrintConfiguration", { printer_ID });

            if (!printConfigs || printConfigs.length === 0) {
                console.log("No printConfig found.");
                return [];
            }
            for (const config of printConfigs) {
                const user = await query.getOne("User", { user_ID: config.user_ID });
                const printer = await query.getOne("Printer", { Printer_ID: config.printer_ID });
                config.user = user || null;
                config.printer = printer || null;
            }

            return printConfigs;
        } catch (error) {
            console.error("Error in getConfigByPrinter:", error);
            throw error;
        }
    },

    createConfig: async (user_ID, printer_ID, numPages, numCopies, paperSize, printSide, orientation, status = 'unCompleted') => {
        try {
            const configData = { user_ID, printer_ID, numPages, numCopies, paperSize, printSide, orientation, status };
            const result = await query.insertSingleRow("PrintConfiguration", configData);
            return { config_ID: result.insertId, ...configData };
        } catch (error) {
            console.error("Error in createConfig:", error);
            throw error;
        }
    },

    updateConfig: async (config_ID, updates) => {
        try {
            await query.updateRow("PrintConfiguration", updates, { config_ID });
            return { config_ID: parseInt(config_ID), ...updates };
        } catch (error) {
            console.error("Error in updateConfig:", error);
            throw error;
        }
    },

    deleteConfig: async (config_ID) => {
        try {
            await query.deleteRow("PrintConfiguration", { config_ID });
            return { config_ID: parseInt(config_ID) };
        } catch (error) {
            console.error("Error in deleteConfig:", error);
            throw error;
        }
    },

    deleteConfigByPrinter: async (printer_ID) => {
        try {
            await query.deleteRow("PrintConfiguration", { printer_ID });
            return { printer_ID: parseInt(printer_ID) };
        } catch (error) {
            console.error("Error in deleteConfigByPrinter:", error);
            throw error;
        }
    },

    getAllUserHistory: async (user_ID) => {
        try {
            const printConfigs = await query.getAll("PrintConfiguration", { user_ID });

            if (!printConfigs || printConfigs.length === 0) {
                console.log("No printConfig found.");
                return [];
            }
            for (const config of printConfigs) {
                const user = await query.getOne("User", { user_ID: config.user_ID });
                const printer = await query.getOne("Printer", { Printer_ID: config.printer_ID });
                config.user = user || null;
                config.printer = printer || null;
            }

            return printConfigs;
        } catch (error) {
            console.error("Error in getAllUserHistory:", error);
            throw error;
        }
    }, 

    deleteAllUserHistoryByID: async (user_ID) => {
        try {
            await query.deleteRow("PrintConfiguration", { user_ID });
            return { user_ID: parseInt(user_ID) };
        } catch (error) {
            console.error("Error in deleteAllUserHistory:", error);
            throw error;
        }
    },

    deleteCompletedConfigsByPrinter: async (printer_ID) => {
        try {
            await query.deleteRow("PrintConfiguration", { printer_ID, status: "Completed" });
            return { printer_ID: parseInt(printer_ID), status: "Completed" };
        } catch (error) {
            console.error("Error in deleteCompletedConfigsByPrinter:", error);
            throw error;
        }
    },

    deleteCompletedConfigsByUserID: async (user_ID) => {
        try {
            await query.deleteRow("PrintConfiguration", { user_ID, status: "Completed" });
            return { user_ID: parseInt(user_ID), status: "Completed" };
        } catch (error) {
            console.error("Error in deleteCompletedConfigsByUserID:", error);
            throw error;
        }
    }

};
module.exports = printConfigModel;