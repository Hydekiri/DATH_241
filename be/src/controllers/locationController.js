const locationModel = require('../models/locationModel');

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await locationModel.getAllLocation();
        res.status(200).json({ status: 200, data: locations, message: "Successfully Retrieved Locations!" });
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ status: 500, message: 'Error Retrieving Locations' });
    }
};

exports.createLocation = async (req, res) => {
    try {
        const { campus, building, room } = req.body;
        const newLocation = await locationModel.createLocation(campus, building, room);
        res.status(200).json({ status: 200, data: newLocation, message: "Successfully Created Location!" });
    } catch (error) {
        console.error("Error creating location:", error);
        res.status(500).json({ status: 500, message: 'Error Creating Location' });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const { campus, building, room } = req.body;
        const updatedLocation = await locationModel.updateLocation(locationId, { campus, building, room });
        res.status(200).json({ status: 200, data: updatedLocation, message: "Successfully Updated Location!" });
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ status: 500, message: 'Error Updating Location' });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const deletedLocation = await locationModel.deleteLocation(locationId);
        res.status(200).json({ status: 200, data: deletedLocation, message: "Successfully Deleted Location!" });
    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).json({ status: 500, message: 'Error Deleting Location' });
    }
};
