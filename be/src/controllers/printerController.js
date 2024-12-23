const printerModel = require('../models/printerModel');
const locationModel = require('../models/locationModel');

// Lấy tất cả các máy in kèm theo thông tin vị trí
exports.getAllPrinters = async (req, res) => {
    try {
        const printers = await printerModel.getAllPrinters();

        if (!printers || printers.length === 0) {
            return res.status(404).json({ status: 404, message: "No Printers Found" });
        }

        const formattedPrinters = printers.map(printer => ({
            Printer_ID: printer.Printer_ID,
            branchName: printer.branchName,
            model: printer.model,
            description: printer.description,
            status: printer.status,
            location: printer.location ? {
                campus: printer.location.campus,
                building: printer.location.building,
                room: printer.location.room
            } : null
        }));
        
        res.status(200).json({ status: 200, data: formattedPrinters, message: "Successfully Retrieved Printers!" });
    } catch (error) {
        console.error("Error Retrieving Printers:", error.message);
        res.status(500).json({ status: 500, message: 'Error Retrieving Printers', error: error.message });
    }
};
exports.getPrinterById = async (req, res) => {
    try {
        const printer = await printerModel.getPrinterById(req.params.id);
        if (!printer) {
            return res.status(404).json({ status: 404, message: "Printer does not exist" });
        }

        const formattedPrinter = {
            Printer_ID: printer.Printer_ID,
            branchName: printer.branchName,
            model: printer.model,
            description: printer.description,
            status: printer.status,
            location: printer.location ? {
                campus: printer.location.campus,
                building: printer.location.building,
                room: printer.location.room
            } : null
        };

        res.status(200).json({ status: 200, data: formattedPrinter, message: "Printer details retrieved successfully!" });
    } catch (error) {
        console.error("Error Retrieving Printer:", error.message);
        res.status(500).json({ status: 500, message: 'Error Retrieving Printer Details', error: error.message });
    }
};


// Tạo mới máy in
exports.createPrinter = async (req, res) => {
    try {
        const { branchName, model, description, status = 'enable', location } = req.body;

        let loc_ID = null;
        if (location) {
            const existingLocation = await locationModel.findLocation(location);
            if (existingLocation) {
                loc_ID = existingLocation.Location_ID;
            } else {
                const newLocation = await locationModel.createLocation(location.campus, location.building, location.room);
                loc_ID = newLocation.Location_ID;
            }
        }

        const newPrinter = await printerModel.createPrinter(branchName, model, description, status, loc_ID);
        res.status(201).json({ status: 201, data: newPrinter, message: "Successfully Created Printer!" });
    } catch (error) {
        console.error("Error Creating Printer:", error);
        res.status(500).json({ status: 500, message: 'Error Creating Printer' });
    }
};


exports.updatePrinter = async (req, res) => {
    try {
        const printerId = req.params.id;
        const { branchName, model, description, status, location } = req.body;

        let loc_ID = null;

        // Check if location is provided in the request body
        if (location) {
            const existingLocation = await locationModel.findLocation(location);

            if (existingLocation) {
                loc_ID = existingLocation.Location_ID;

                // If the location details have changed, update it
                if (
                    existingLocation.campus !== location.campus ||
                    existingLocation.building !== location.building ||
                    existingLocation.room !== location.room
                ) {
                    await locationModel.updateLocation(loc_ID, location);
                }
                const newLocation = await locationModel.createLocation(location.campus, location.building, location.room);
                loc_ID = newLocation.Location_ID;
            } else {
                // Create new location if it does not exist
                const newLocation = await locationModel.createLocation(location.campus, location.building, location.room);
                loc_ID = newLocation.Location_ID;
            }
        }

        // Update the printer details in the database
        const updatedPrinter = await printerModel.updatePrinter(printerId, {
            branchName,
            model,
            description,
            status,
            loc_ID,
        });

        // Fetch the updated printer with location details
        const printerWithDetails = await printerModel.getPrinterById(printerId);

        // Return the updated printer details in the response
        res.status(200).json({
            status: 200,
            data: {
                Printer_ID: printerWithDetails.Printer_ID,
                branchName: printerWithDetails.branchName,
                model: printerWithDetails.model,
                description: printerWithDetails.description,
                status: printerWithDetails.status,
                location: printerWithDetails.location || null // If location is null, return null instead of an empty object
            },
            message: "Successfully Updated Printer!",
        });
    } catch (error) {
        console.error("Error Updating Printer:", error);
        res.status(500).json({ status: 500, message: "Error Updating Printer" });
    }
};


exports.deletePrinter = async (req, res) => {
    try {
        const printerId = req.params.id;
        const deletedPrinter = await printerModel.deletePrinter(printerId);
        res.status(200).json({ status: 200, data: deletedPrinter, message: "Successfully Deleted Printer!" });
    } catch (error){
        console.error("Error Deleted Printer!!!", error);
        res.status(500).json({ status: 500, message: 'Error Deleted Printer!!!' });
    }
};