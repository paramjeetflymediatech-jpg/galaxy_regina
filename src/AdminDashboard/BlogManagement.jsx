"use client";

import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { FiSearch, FiImage, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const BlogManagement = forwardRef(({ onFormStateChange }, ref) => {
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
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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

    useImperativeHandle(ref, () => ({
        openNewBlog
    }));

    useEffect(() => {
        if (onFormStateChange) {
            onFormStateChange(showForm);
        }
    }, [showForm, onFormStateChange]);

    // HANDLE INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const filteredBlogs = blogs.filter((blog) => 
        (blog.title && blog.title.toLowerCase().includes(search.toLowerCase())) || 
        (blog.slug && blog.slug.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
    const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            toast.error("Title and slug are required");
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
                toast.success("Blog Updated Successfully");
            } else {
                // Create new
                await axios.post("/api/blogs/add", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Blog Added Successfully");
            }

            resetForm();
            setShowForm(false);
            fetchBlogs();
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error("Failed To Save Blog");
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
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const openNewBlog = () => {
        resetForm();
        setShowForm(true);
    };

    // DELETE BLOG
    const deleteBlog = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Blog Post?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#CC0336',
            cancelButtonColor: '#06056C',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;
        try {
            await axios.delete(`/api/blogs/${id}`);
            toast.success("Blog Deleted Successfully");
            fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog");
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
        <div className="flex flex-col gap-6 w-full">
            <div>
                {showForm && (
                    <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col gap-6 mb-8 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{editing ? "Edit Blog Post" : "Configure New Blog Post"}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-900">Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Blog Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-900">Slug *</label>
                            <input
                                type="text"
                                name="slug"
                                placeholder="e.g., how-to-move-smoothly"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Category (e.g., Moving Tips)"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Short Description</label>
                        <textarea
                            name="description"
                            placeholder="Short summary for the list page..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            Full Blog Content
                        </label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={handleContentChange}
                            placeholder="Write your blog post content here..."
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata</h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="meta_title"
                                placeholder="SEO Meta Title"
                                value={formData.meta_title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                            <textarea
                                name="meta_description"
                                placeholder="SEO Meta Description"
                                value={formData.meta_description}
                                onChange={handleChange}
                                rows={2}
                                className="w-full border border-gray-300 p-3 text-sm outline-none bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                            <FiImage /> Blog Featured Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={saveBlog}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-colors"
                        >
                            {editing ? "Update Blog" : "Add Blog"}
                        </button>
                        {editing && (
                            <button
                                onClick={() => { resetForm(); setShowForm(false); }}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 transition-colors border border-gray-200"
                            >
                                Cancel
                            </button>
                        )}
                        {!editing && (
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 transition-colors border border-gray-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                )}
            </div>

            {/* BLOG LIST */}
            {!showForm && (
                <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-500 hidden md:block">
                                {filteredBlogs.length} found ({blogs.length} total)
                            </span>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search blogs..." 
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:border-[#06056C] focus:ring-1 focus:ring-[#06056C] rounded-lg shadow-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                                    <th className="py-4 px-6 font-semibold">Blog Post</th>
                                    <th className="py-4 px-6 font-semibold">Category</th>
                                    <th className="py-4 px-6 font-semibold">URL Slug</th>
                                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBlogs.map((blog, idx) => (
                                    <tr key={blog.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                {blog.image_url ? (
                                                    <img
                                                        src={blog.image_url.startsWith('http') ? blog.image_url : `/uploads/${blog.image_url}`}
                                                        alt={blog.title}
                                                        className="w-16 h-12 rounded object-cover border border-gray-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-12 rounded bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
                                                        <FiImage size={20} className="text-gray-300" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600">{blog.category || "General"}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">/blog/{blog.slug}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => editBlog(blog)} title="Edit Blog" className="bg-white border border-gray-200 hover:border-[#06056C] hover:bg-[#06056C] hover:text-white text-[#06056C] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiEdit2 size={16} /></button>
                                                <button onClick={() => deleteBlog(blog.id)} title="Delete Blog" className="bg-white border border-gray-200 hover:border-[#CC0336] hover:bg-[#CC0336] hover:text-white text-[#CC0336] p-2 rounded-lg transition-all shadow-sm flex items-center justify-center"><FiTrash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paginatedBlogs.length === 0 && <div className="p-10 text-center text-gray-500">No blogs found.</div>}
                    </div>
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                            <span className="text-sm text-gray-500">
                                Showing <span className="font-medium">{filteredBlogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredBlogs.length)}</span> of <span className="font-medium">{filteredBlogs.length}</span> blogs
                            </span>
                            <div className="flex gap-2">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default BlogManagement;