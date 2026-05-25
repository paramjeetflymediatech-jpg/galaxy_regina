"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from "next/image";
import './BlogComponents.css';
import Footer from "../Footer/Footer";

const Blog = () => {

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH BLOGS
  const fetchBlogs = async () => {
    try {

      const response = await axios.get(
        'http://localhost:5000/api/blogs'
      );

      if (response.data.success) {
        setBlogPosts(response.data.blogs);
      }

    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <div className="blog-container">

        <div className="blog-header">
          <div className="blog-tabs">
            <button className="tab active">All Posts</button>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <h2>Loading Blogs...</h2>
        ) : (
     <div className="blog-card">

  <div className="blog-image">

    <img
      src={`http://localhost:5000/uploads/${post.image_url}`}
      alt={post.title}
      className="blog-img"
    />

  </div>

  <div className="blog-content">

    <span className="blog-date">
      {new Date(post.created_at).toDateString()}
    </span>

    <h3>{post.title}</h3>

    <p>{post.description}</p>

    <a
      href={`/blog/${post.slug}`}
      className="read-more"
    >
      Read More →
    </a>

  </div>

</div>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Blog;