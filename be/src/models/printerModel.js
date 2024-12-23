const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const printerModel = {
    getAllPrinters: async () => {
        try {
            const printers = await query.getAll("Printer");
            
            // Kiểm tra nếu không có máy in nào
            if (!printers || printers.length === 0) {
                console.log("No printers found.");
                return [];
            }
            for (const printer of printers) {
                console.log("Processing Printer:", printer); 
                const location = await query.getOne("Location", { Location_ID: printer.loc_ID });
                printer.location = location || null; 
            }

            return printers;
        } catch (error) {
            console.error("Error in getAllPrinters:", error);
            throw error;
        }
    },

    createPrinter: async (branchName, model, description, status = 'enable', loc_ID) => {
        try {
            const printerData = { branchName, model, description, status, loc_ID };
            const result = await query.insertSingleRow("Printer", printerData);
            return { Printer_ID: result.insertId, ...printerData };
        } catch (error) {
            console.error("Error in createPrinter:", error);
            throw error;
        }
    },

    updatePrinter: async (printer_ID, updates) => {
        try {
            // Cập nhật bản ghi máy in
            await query.updateRow("Printer", updates, { Printer_ID: printer_ID });
            return { Printer_ID: parseInt(printer_ID), ...updates };
        } catch (error) {
            console.error("Error in updatePrinter:", error);
            throw error;
        }
    },
    

    deletePrinter: async (printer_ID) => {
        try {
            await query.deleteRow("Printer", { Printer_ID: printer_ID });
            return { Printer_ID: printer_ID };
        } catch (error) {
            console.error("Error in deletePrinter:", error);
            throw error;
        }
    },

    getPrinterById: async (printer_ID) => {
        try {
            const printer = await query.getOne("Printer", { Printer_ID: printer_ID });
            if (printer) {
                const location = await query.getOne("Location", { Location_ID: printer.loc_ID });
                printer.location = location;
            }
            return printer;
        } catch (error) {
            console.error("Error in getPrinterById:", error);
            throw error;
        }
    }
};

module.exports = printerModel;
