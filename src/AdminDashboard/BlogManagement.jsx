"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";
import "./css/AdminDashboard.css";

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        slug: "",
        description: "",
        content: "",
        category: "",
        meta_title: "",
        meta_description: "",
    });
    const [image, setImage] = useState(null);
    const [editing, setEditing] = useState(false);

    // FETCH BLOGS
    const fetchBlogs = async () => {
        try {
            const response = await axios.get("/api/blogs");
            setBlogs(response.data.blogs || []);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // HANDLE CONTENT CHANGE FOR EDITOR
    const handleContentChange = (contentValue) => {
        setFormData((prev) => ({
            ...prev,
            content: contentValue,
        }));
    };

    // HANDLE IMAGE
    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };

    // SAVE BLOG
    const saveBlog = async () => {
        if (!formData.title || !formData.slug) {
            alert("Title and slug are required");
            return;
        }

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("description", formData.description || "");
            data.append("content", formData.content || "");
            data.append("category", formData.category || "");
            data.append("meta_title", formData.meta_title || "");
            data.append("meta_description", formData.meta_description || "");

            if (image) {
                data.append("image", image);
            }

            if (formData.id) {
                // Update existing
                await axios.put(`/api/blogs/${formData.id}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Blog Updated Successfully");
            } else {
                // Create new
                await axios.post("/api/blogs/add", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Blog Added Successfully");
            }

            resetForm();
            fetchBlogs();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed To Save Blog");
        }
    };

    // EDIT BLOG (populate form)
    const editBlog = (blog) => {
        setFormData({
            id: blog.id,
            title: blog.title || "",
            slug: blog.slug || "",
            description: blog.description || "",
            content: blog.content || "",
            category: blog.category || "",
            meta_title: blog.meta_title || "",
            meta_description: blog.meta_description || "",
        });
        setImage(null);
        setEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // DELETE BLOG
    const deleteBlog = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) {
            return;
        }

        try {
            await axios.delete(`/api/blogs/${id}`);
            alert("Blog Deleted Successfully");
            fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog");
        }
    };

    // RESET FORM
    const resetForm = () => {
        setFormData({
            id: null,
            title: "",
            slug: "",
            description: "",
            content: "",
            category: "",
            meta_title: "",
            meta_description: "",
        });
        setImage(null);
        setEditing(false);
    };

    return (
        <div className="location-management">
            <h2>{editing ? "Edit Blog Post" : "Add New Blog Post"}</h2>

            <div className="location-form">
                <div className="panel-group">
                    <label>Title *</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Blog Title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="panel-group">
                    <label>Slug *</label>
                    <input
                        type="text"
                        name="slug"
                        placeholder="Blog Slug (e.g., how-to-move-smoothly)"
                        value={formData.slug}
                        onChange={handleChange}
                    />
                </div>

                <div className="panel-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Category (e.g., Moving Tips)"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <div className="panel-group">
                    <label>Short Description</label>
                    <textarea
                        name="description"
                        placeholder="Short summary for the list page..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>

                <div className="panel-group">
                    <label>Full Blog Content</label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={handleContentChange}
                        placeholder="Write your blog post content here..."
                    />
                </div>

                <div className="panel-group">
                    <label>Meta Title</label>
                    <input
                        type="text"
                        name="meta_title"
                        placeholder="SEO Meta Title"
                        value={formData.meta_title}
                        onChange={handleChange}
                    />
                </div>

                <div className="panel-group">
                    <label>Meta Description</label>
                    <textarea
                        name="meta_description"
                        placeholder="SEO Meta Description"
                        value={formData.meta_description}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>

                <div className="panel-group">
                    <label>Blog Featured Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />
                </div>

                <div className="form-buttons">
                    <button
                        onClick={saveBlog}
                        className="btn btn-primary"
                    >
                        {editing ? "Update Blog" : "Add Blog"}
                    </button>
                    {editing && (
                        <button
                            onClick={resetForm}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* BLOG LIST */}
            <h3>All Blog Posts ({blogs.length})</h3>
            <div className="location-list">
                {blogs.map((blog) => (
                    <div
                        className="location-item"
                        key={blog.id}
                    >
                        {blog.image_url ? (
                            <img
                                src={`/uploads/${blog.image_url}`}
                                alt={blog.title}
                                width="120"
                                height="80"
                                style={{ objectFit: "cover", borderRadius: "4px" }}
                            />
                        ) : (
                            <div style={{ width: 120, height: 80, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12, borderRadius: "4px" }}>
                                No Image
                            </div>
                        )}

                        <div style={{ flex: 1, paddingLeft: 12 }}>
                            <h4 style={{ margin: "0 0 6px 0", fontSize: 16 }}>{blog.title}</h4>
                            <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#64748b" }}>
                                <strong>Slug:</strong> /blog/{blog.slug}
                            </p>
                            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                                <strong>Category:</strong> {blog.category || "General"}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={() => editBlog(blog)}
                                className="btn btn-edit"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteBlog(blog.id)}
                                className="btn btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogManagement;