module.exports = (router) => {
    const locationController = require("../controllers/locationController");

    router.get("/locations", locationController.getAllLocations);
    router.post("/locations", locationController.createLocation);
    router.put("/locations/:id", locationController.updateLocation);
    router.delete("/locations/:id", locationController.deleteLocation);
};
