import React, { useEffect, useState } from "react";
import axios from "axios";

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

            const response = await axios.get(
                "http://localhost:5000/api/blogs"
            );

            setBlogs(response.data.blogs || []);

        } catch (error) {

            console.log(error);
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


    // HANDLE IMAGE
    const handleImage = (e) => {

        setImage(e.target.files[0]);
    };


    // SAVE BLOG
    const saveBlog = async () => {

        try {

            const data = new FormData();

            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("description", formData.description);
            data.append("content", formData.content);
            data.append("category", formData.category);
            data.append("meta_title", formData.meta_title);
            data.append("meta_description", formData.meta_description);

            if (image) {
                data.append("image", image);
            }

            await axios.post(
                "http://localhost:5000/api/blogs/add",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Blog Added Successfully");

            resetForm();

            fetchBlogs();

        } catch (error) {

            console.log(error);

            alert("Failed To Add Blog");
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

            <h2>Blog Management</h2>

            <div className="location-form">

                <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="slug"
                    placeholder="Blog Slug"
                    value={formData.slug}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Short Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                />

                <textarea
                    name="content"
                    placeholder="Full Blog Content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                />

                <input
                    type="text"
                    name="meta_title"
                    placeholder="Meta Title"
                    value={formData.meta_title}
                    onChange={handleChange}
                />

                <textarea
                    name="meta_description"
                    placeholder="Meta Description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows={3}
                />

                <input
                    type="file"
                    onChange={handleImage}
                />

                <button
                    onClick={saveBlog}
                    className="btn btn-primary"
                >
                    Add Blog
                </button>

            </div>


            {/* BLOG LIST */}

            <div className="location-list">

                {blogs.map((blog) => (

                    <div
                        className="location-item"
                        key={blog.id}
                    >

                        {blog.image_url && (

                            <img
                                src={`http://localhost:5000/uploads/${blog.image_url}`}
                                alt={blog.title}
                                width="120"
                            />
                        )}

                        <div>

                            <h3>{blog.title}</h3>

                            <p>
                                <strong>Slug:</strong>
                                {" "}
                                {blog.slug}
                            </p>

                            <p>
                                <strong>Category:</strong>
                                {" "}
                                {blog.category}
                            </p>

                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default BlogManagement;