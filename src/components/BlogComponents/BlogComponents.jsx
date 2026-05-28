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
        '/api/blogs'
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
            <button className="tab">Local Movers</button>
          </div>
        </div>

        {loading ? (
          <h2>Loading Blogs...</h2>
        ) : blogPosts.length === 0 ? (
          <h2>No Blogs Found</h2>
        ) : (
          <>
            <div className="blog-grid">
              {blogPosts.map((post) => (
              <div className="blog-card" key={post.id}>
                <div className="blog-image">
                  {post.image_url && (
                    <img
                      src={`/uploads/${post.image_url}`}
                      alt={post.title}
                      className="blog-img"
                    />
                  )}
                </div>
                <div className="blog-content">
                  <h3>{post.title}</h3>
                  <span className="blog-date">
                    {new Date(post.created_at || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} /
                  </span>
                  <p>{post.short_description || (post.description ? post.description.substring(0, 120) + '...' : '')}</p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="read-more"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="load-more">
            <button className="load-btn">Load More</button>
          </div>
          </>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Blog;