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

    // getConfigByDate: async (date) => {
    //     try {
    //         const printConfigs = await query.getOne("PrintConfiguration", { printEnd: date });

    //         if (!printConfigs || printConfigs.length === 0) {
    //             console.log("No printConfig found.");
    //             return [];
    //         }
    //         for (const config of printConfigs) {
    //             const user = await query.getOne("User", { user_ID: config.user_ID });
    //             const printer = await query.getOne("Printer", { Printer_ID: config.printer_ID });
    //             config.user = user || null;
    //             config.printer = printer || null;
    //         }

    //         return printConfigs;
    //     } catch (error) {
    //         console.error("Error in getConfigByDate:", error);
    //         throw error;
    //     }
    // },

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
    }
};
module.exports = printConfigModel;