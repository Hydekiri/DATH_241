const printConfigModel = require('../models/printConfigModel');
const query = require('../config/query.js'); // Add this line to import the query module

exports.getAllConfigs = async (req, res) => {
    try {
        const configs = await printConfigModel.getAllConfig();
        if (!configs || configs.length === 0) {
            return res.status(404).json({ status: 404, message: "No Print Configurations Found" });
        }

        const formattedConfigs = await Promise.all(configs.map(async config => {
            const documents = await query.getAll("Document", { config_ID: config.config_ID });
            return {
                config_ID: config.config_ID,
                printStart: config.printStart,
                printEnd: config.printEnd,
                user : config.user ? {
                    user_ID: config.user.user_ID,
                    name: config.user.name
                } : null,
                printer: config.printer ? {
                    branchName: config.printer.branchName
                } : null,
                numPages: config.numPages,
                numCopies: config.numCopies,
                paperSize: config.paperSize,
                printSide: config.printSide,
                orientation: config.orientation,
                status: config.status,
                documents: documents.map(doc => ({
                    name: doc.name
                }))
            };
        }));
        res.status(200).json({ status: 200, data: formattedConfigs, message: "Successfully Retrieved Print Configurations!" });
    } catch (error) {
        console.error("Error fetching print configurations:", error);
        res.status(500).json({ status: 500, message: 'Error Retrieving Print Configurations' });
    }
};

exports.getConfigByID = async (req, res) => {
    try {
        const configs = await printConfigModel.getConfigByID(req.params.userID);
        if (!configs || configs.length === 0) {
            return res.status(404).json({ status: 404, message: "No Print Configurations Found" });
        }

        const formattedConfigs = await Promise.all(configs.map(async config => {
            const documents = await query.getAll("Document", { config_ID: config.config_ID });
            return {
                config_ID: config.config_ID,
                printStart: config.printStart,
                printEnd: config.printEnd,
                user : config.user ? {
                    user_ID: config.user.user_ID,
                    name: config.user.name
                } : null,
                printer: config.printer ? {
                    branchName: config.printer.branchName
                } : null,
                numPages: config.numPages,
                numCopies: config.numCopies,
                paperSize: config.paperSize,
                printSide: config.printSide,
                orientation: config.orientation,
                status: config.status,
                documents: documents.map(doc => ({
                    name: doc.name
                }))
            };
        }));
        res.status(200).json({ status: 200, data: formattedConfigs, message: "Successfully Retrieved Print Configurations!" });
    } catch (error) {
        console.error("Error fetching print configurations:", error);
        res.status(500).json({ status: 500, message: 'Error Retrieving Print Configurations' });
    }
};

exports.getConfigByPrinter = async (req, res) => {
    try {
        const configs = await printConfigModel.getConfigByPrinter(req.params.printerID);
        if (!configs || configs.length === 0) {
            return res.status(404).json({ status: 404, message: "No Print Configurations Found" });
        }

        const formattedConfigs = await Promise.all(configs.map(async config => {
            const documents = await query.getAll("Document", { config_ID: config.config_ID });
            return {
                config_ID: config.config_ID,
                printStart: config.printStart,
                printEnd: config.printEnd,
                user : config.user ? {
                    user_ID: config.user.user_ID,
                    name: config.user.name
                } : null,
                printer: config.printer ? {
                    branchName: config.printer.branchName
                } : null,
                numPages: config.numPages,
                numCopies: config.numCopies,
                paperSize: config.paperSize,
                printSide: config.printSide,
                orientation: config.orientation,
                status: config.status,
                documents: documents.map(doc => ({
                    name: doc.name
                }))
            };
        }));
        res.status(200).json({ status: 200, data: formattedConfigs, message: "Successfully Retrieved Print Configurations!" });
    } catch (error) {
        console.error("Error fetching print configurations:", error);
        res.status(500).json({ status: 500, message: 'Error Retrieving Print Configurations' });
    }
};
