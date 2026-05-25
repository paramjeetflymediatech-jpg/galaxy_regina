const LocationModel = require("../models/locationModel");

const createSlug = (text) => {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
};

exports.getLocations = (req, res) => {
  LocationModel.getAllLocations((err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, locations: results });
  });
};

exports.getLocationBySlug = (req, res) => {
  const { slug } = req.params;
  LocationModel.getLocationBySlug(slug, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Location not found" });
    res.json({ success: true, location: results[0] });
  });
};

exports.addLocation = (req, res) => {
  const {
    location_name,
    hero_title = null,
    hero_subtitle = null,
    content = null,
    meta_title = null,
    meta_description = null,
    meta_keywords = null,
  } = req.body;

  if (!location_name) {
    return res.status(400).json({ success: false, message: "Location name is required" });
  }

  const slug = createSlug(location_name);
  const image_url = req.file ? req.file.filename : null;

  LocationModel.addOrUpdateLocation(
    location_name, slug, hero_title, hero_subtitle, content,
    meta_title, meta_description, meta_keywords, image_url,
    (err) => {
      if (err) {
        console.error("Add Location Error:", err);
        return res.status(500).json({ success: false, message: "Failed to save location", error: err.message });
      }
      res.json({ success: true, message: "Location added successfully", slug });
    }
  );
};

exports.deleteLocation = (req, res) => {
  const { id } = req.params;
  LocationModel.deleteLocation(id, (err) => {
    if (err) return res.status(500).json({ success: false, message: "Delete failed" });
    res.json({ success: true, message: "Location deleted" });
  });
};

// ... existing functions ke neeche yeh add karo
// UPDATE LOCATION
exports.updateLocation = (req, res) => {
  const { id } = req.params;
  const {
    location_name,
    hero_title,
    hero_subtitle,
    content,
    meta_title,
    meta_description,
    meta_keywords,
  } = req.body;

  const image_url = req.file ? req.file.filename : null;

  if (!location_name) {
    return res.status(400).json({ success: false, message: "Location name is required" });
  }

  const slug = createSlug(location_name);

  LocationModel.updateLocation(
    id,
    location_name,
    slug,
    hero_title,
    hero_subtitle,
    content,
    meta_title,
    meta_description,
    meta_keywords,
    image_url,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to update location" });
      }
      res.json({ success: true, message: "Location updated successfully" });
    }
  );
};