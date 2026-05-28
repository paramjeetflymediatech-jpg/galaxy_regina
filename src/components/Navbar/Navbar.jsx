"use client";
import React, { useEffect, useState } from "react";
import "./Navbar.css";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import { FaChevronDown, FaPhoneAlt } from "react-icons/fa";

import logo from "../../assets/logo/Galaxy-Movers-Regina-Logo.png";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (

    <header className="navbar">

      <div className="nav-container">

        {/* LOGO */}
        <div className="logo">
          <Image
            src={logo}
            alt="Company Logo"
            width={220}
            height={70}
            priority
          />
        </div>

        {/* NAV LINKS */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
          <Link href="/location" onClick={() => setMenuOpen(false)}>LOCATIONS</Link>
          <Link href="/book-appointment" onClick={() => setMenuOpen(false)}>BOOK APPOINTMENT</Link>
          <Link href="/blogs" onClick={() => setMenuOpen(false)}>BLOG</Link>
        </div>

        {/* PHONE */}
        <div className="phone-box">

          <FaPhoneAlt />

          <span>(306) 450 0708</span>

        </div>

        {/* HAMBURGER */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >

          <span></span>
          <span></span>
          <span></span>

        </div>

      </div>

    </header>

  );
};

export default Navbar;