const printConfigModel = require('../models/printConfigModel');
const query = require('../config/query.js'); // Add this line to import the query module
const userModel = require('../models/usersModel');
const printerModel = require('../models/printerModel');

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

exports.createConfig = async (req, res) => {
    try {
        const { user_ID, printer_ID, numPages, numCopies, paperSize, printSide, orientation, status = 'unCompleted' } = req.body;
        const user = await userModel.getUserById(user_ID);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User does not exist" });
        }
        const printer = await printerModel.getPrinterById(printer_ID);
        if (!printer) {
            return res.status(404).json({ status: 404, message: "Printer does not exist" });
        }

        const config = await printConfigModel.createConfig( user_ID, printer_ID, numPages, numCopies, paperSize, printSide, orientation, status);
        res.status(201).json({ status: 201, data: config, message: "Print Configuration Created Successfully!" });
    } catch (error) {
        console.error("Error creating print configuration:", error);
        res.status(500).json({ status: 500, message: 'Error Creating Print Configuration' });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const config_ID = req.params.id;
        const { printEnd, user_ID, printer_ID, numPages, numCopies, paperSize, printSide, orientation, status } = req.body;

        const configDetail = await printConfigModel.getConfigByID(config_ID);
        if (!configDetail) {
            return res.status(404).json({ status: 404, message: "Print Configuration does not exist" });
        }

        const updates = {};
        if (printEnd !== undefined) updates.printEnd = printEnd;
        if (user_ID !== undefined) updates.user_ID = user_ID;
        if (printer_ID !== undefined) updates.printer_ID = printer_ID;
        if (numPages !== undefined) updates.numPages = numPages;
        if (numCopies !== undefined) updates.numCopies = numCopies;
        if (paperSize !== undefined) updates.paperSize = paperSize;
        if (printSide !== undefined) updates.printSide = printSide;
        if (orientation !== undefined) updates.orientation = orientation;
        if (status !== undefined) updates.status = status;

        const updatedConfig = await printConfigModel.updateConfig(config_ID, updates);

        res.status(200).json({ 
            status: 200, 
            data: updatedConfig, 
            message: "Print Configuration Updated Successfully!" 
        });
    } catch (error) {
        console.error("Error updating print configuration:", error);
        res.status(500).json({ status: 500, message: 'Error Updating Print Configuration' });
    }
};

exports.deleteConfig = async (req, res) => {
    try {
        const config_ID = req.params.id;
        const configDetail = await printConfigModel.getConfigByID(config_ID);
        if (!configDetail) {
            return res.status(404).json({ status: 404, message: "Print Configuration does not exist" });
        }

        const deletedConfig = await printConfigModel.deleteConfig(config_ID);

        res.status(200).json({ 
            status: 200, 
            data: deletedConfig, 
            message: "Print Configuration Deleted Successfully!" 
        });
    } catch (error) {
        console.error("Error deleting print configuration:", error);
        res.status(500).json({ status: 500, message: 'Error Deleting Print Configuration' });
    }
};

exports.deleteConfigByPrinter = async (req, res) => {
    try {
        const printer_ID = req.params.printerID;
        const printer = await printerModel.getPrinterById(printer_ID);
        if (!printer) {
            return res.status(404).json({ status: 404, message: "Printer does not exist" });
        }

        const deletedConfig = await printConfigModel.deleteConfigByPrinter(printer_ID);

        res.status(200).json({ 
            status: 200, 
            data: deletedConfig, 
            message: "Print Configuration Deleted Successfully!" 
        });
    } catch (error) {
        console.error("Error deleting print configuration:", error);
        res.status(500).json({ status: 500, message: 'Error Deleting Print Configuration' });
    }
};

exports.getAllUserHistory = async (req, res) => {
    try {
        const user_ID = req.params.userID;
        const user = await userModel.getUserById(user_ID);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User does not exist" });
        }

        const printConfigs = await printConfigModel.getAllUserHistory(user_ID);
        if (!printConfigs || printConfigs.length === 0) {
            return res.status(404).json({ status: 404, message: "No Print Configurations Found" });
        }

        const formattedConfigs = await Promise.all(printConfigs.map(async config => {
            const documents = await query.getAll("Document", { config_ID: config.config_ID });
            const location = await query.getOne("Location", { location_ID: config.printer.loc_ID });
            return {
                config_ID: config.config_ID,
                printStart: config.printStart,
                printEnd: config.printEnd,
                user : config.user ? {
                    user_ID: config.user.user_ID,
                    name: config.user.name,
                    email: config.user.email,
                    pageBalance: config.user.pageBalance
                } : null,
                printer: config.printer ? {
                    branchName: config.printer.branchName,
                    location: location ? {
                        building: location.building
                    } : null
                    // location: location ? `${location.campus}, ${location.building}, ${location.room}` : null
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