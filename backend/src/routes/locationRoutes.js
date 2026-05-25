const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const upload = require("../config/multer");   // Ya jahan bhi multer config hai

// Existing Routes
router.get("/", locationController.getLocations);
router.get("/:slug", locationController.getLocationBySlug);
router.post("/add", upload.single("image"), locationController.addLocation);

// ← New Update Route
router.put("/:id", upload.single("image"), locationController.updateLocation);

router.delete("/:id", locationController.deleteLocation);

module.exports = router;