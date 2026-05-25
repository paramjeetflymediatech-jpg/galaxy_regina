import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AdminDashboard.css';
import './css/LocationManagement.css';

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        location_name: '',
        hero_title: '',
        hero_subtitle: '',
        content: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
    });
    const [image, setImage] = useState(null);
    const [editing, setEditing] = useState(false);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/locations');
            setLocations(response.data.locations || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const saveLocation = async () => {
        if (!formData.location_name) {
            alert('Location name is required');
            return;
        }

        const data = new FormData();
        data.append("location_name", formData.location_name);
        data.append("hero_title", formData.hero_title);
        data.append("hero_subtitle", formData.hero_subtitle);
        data.append("content", formData.content);
        data.append("meta_title", formData.meta_title);
        data.append("meta_description", formData.meta_description);
        data.append("meta_keywords", formData.meta_keywords);

        if (image) data.append("image", image);

        try {
            if (formData.id) {
                // Update
                await axios.put(`http://localhost:5000/api/locations/${formData.id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Location Updated Successfully!");
            } else {
                // Add
                await axios.post('http://localhost:5000/api/locations/add', data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Location Added Successfully!");
            }

            resetForm();
            fetchLocations();
        } catch (error) {
            console.error(error);
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    const editLocation = (loc) => {
        setFormData({
            id: loc.id,
            location_name: loc.location_name || '',
            hero_title: loc.hero_title || '',
            hero_subtitle: loc.hero_subtitle || '',
            content: loc.content || '',
            meta_title: loc.meta_title || '',
            meta_description: loc.meta_description || '',
            meta_keywords: loc.meta_keywords || '',
        });
        setImage(null);
        setEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteLocation = async (id) => {
        if (!window.confirm('Delete this location?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/locations/${id}`);
            fetchLocations();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            location_name: '',
            hero_title: '',
            hero_subtitle: '',
            content: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
        });
        setImage(null);
        setEditing(false);
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <div className="location-management">
            <h2>{editing ? "Edit Location" : "Add New Location"}</h2>

            <div className="location-form">
                <input
                    type="text"
                    name="location_name"
                    placeholder="Location Name *"
                    value={formData.location_name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="hero_title"
                    placeholder="Hero Title"
                    value={formData.hero_title}
                    onChange={handleChange}
                />
                <textarea
                    name="hero_subtitle"
                    placeholder="Hero Subtitle"
                    value={formData.hero_subtitle}
                    onChange={handleChange}
                />
                <textarea
                    name="content"
                    placeholder="Main Content (HTML allowed)"
                    value={formData.content}
                    onChange={handleChange}
                    rows={6}
                />

                <input type="text" name="meta_title" placeholder="Meta Title" value={formData.meta_title} onChange={handleChange} />
                <textarea name="meta_description" placeholder="Meta Description" value={formData.meta_description} onChange={handleChange} />
                <input type="text" name="meta_keywords" placeholder="Meta Keywords" value={formData.meta_keywords} onChange={handleChange} />

                <input type="file" accept="image/*" onChange={handleFileChange} />

                <div className="form-buttons">
                    <button onClick={saveLocation} className="btn btn-primary">
                        {editing ? "Update Location" : "Add Location"}
                    </button>
                    {editing && <button onClick={resetForm} className="btn btn-secondary">Cancel</button>}
                </div>
            </div>

            {/* Locations List */}
            <h3>All Locations ({locations.length})</h3>
            <div className="location-list">
                {locations.map((loc) => (
                    <div className="location-item" key={loc.id}>
                        {loc.image_url && (
                            <img 
                                src={`http://localhost:5000/uploads/${loc.image_url}`} 
                                alt={loc.location_name}
                                width="150"
                            />
                        )}
                        <div>
                            <h3>{loc.location_name}</h3>
                            <p><strong>Slug:</strong> /location/{loc.slug}</p>
                            {loc.hero_title && <p><strong>Hero:</strong> {loc.hero_title}</p>}
                        </div>
                        <div>
                            <button onClick={() => editLocation(loc)} className="btn btn-edit">Edit</button>
                            <button onClick={() => deleteLocation(loc.id)} className="btn btn-delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationManagement;