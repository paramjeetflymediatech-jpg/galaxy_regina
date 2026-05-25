const db = require("../config/db");

const LocationModel = {

  // GET ALL
  getAllLocations: async () => {

    const [rows] = await db.query(
      "SELECT * FROM locations ORDER BY location_name ASC"
    );

    return rows;
  },

  // GET BY SLUG
  getLocationBySlug: async (slug) => {

    const [rows] = await db.query(
      "SELECT * FROM locations WHERE slug = ?",
      [slug]
    );

    return rows[0];
  },

  // ADD OR UPDATE
  addOrUpdateLocation: async (
    location_name,
    slug,
    hero_title,
    hero_subtitle,
    content,
    meta_title,
    meta_description,
    meta_keywords,
    image_url
  ) => {

    const query = `
      INSERT INTO locations (
        location_name,
        slug,
        hero_title,
        hero_subtitle,
        content,
        meta_title,
        meta_description,
        meta_keywords,
        image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        location_name = VALUES(location_name),
        slug = VALUES(slug),
        hero_title = VALUES(hero_title),
        hero_subtitle = VALUES(hero_subtitle),
        content = VALUES(content),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        image_url = COALESCE(VALUES(image_url), image_url)
    `;

    const [result] = await db.query(query, [
      location_name,
      slug,
      hero_title,
      hero_subtitle,
      content,
      meta_title,
      meta_description,
      meta_keywords,
      image_url
    ]);

    return result;
  },

  // UPDATE
  updateLocation: async (
    id,
    location_name,
    slug,
    hero_title,
    hero_subtitle,
    content,
    meta_title,
    meta_description,
    meta_keywords,
    image_url
  ) => {

    const query = `
      UPDATE locations 
      SET location_name = ?,
          slug = ?,
          hero_title = ?,
          hero_subtitle = ?,
          content = ?,
          meta_title = ?,
          meta_description = ?,
          meta_keywords = ?,
          image_url = COALESCE(?, image_url)
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      location_name,
      slug,
      hero_title,
      hero_subtitle,
      content,
      meta_title,
      meta_description,
      meta_keywords,
      image_url,
      id
    ]);

    return result;
  },

  // DELETE
  deleteLocation: async (id) => {

    const [result] = await db.query(
      "DELETE FROM locations WHERE id = ?",
      [id]
    );

    return result;
  }

};

module.exports = LocationModel;