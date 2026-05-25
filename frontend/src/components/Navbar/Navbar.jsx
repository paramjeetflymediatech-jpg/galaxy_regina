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

  const [locations, setLocations] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // FETCH LOCATIONS
  const fetchLocations = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/locations"
      );

      setLocations(response.data.locations);

    } catch (error) {

      console.error("Error fetching locations:", error);

    }
  };

  // LOAD ON PAGE
  useEffect(() => {

    fetchLocations();

  }, []);

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

          {/* HOME */}
          <Link href="/">HOME</Link>

          {/* ABOUT */}
          <div className={`dropdown ${openDropdown === 'about' ? 'open' : ''}`}>

            <Link href="/about" className="dropbtn" onClick={() => setOpenDropdown(null)}>
              ABOUT <FaChevronDown />
            </Link>

            <div className="dropdown-content">

              <Link href="/faq" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>FAQ’s</Link>

              <Link href="/blog" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>BLOGS</Link>

              <Link href="/licensee" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>LICENSEE</Link>

              <Link href="/insurance-and-policy-claims" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                INSURANCE & POLICY CLAIMS
              </Link>

            </div>

          </div>

          {/* RESIDENTIAL */}
          <div className={`dropdown ${openDropdown === 'residential' ? 'open' : ''}`}>

            <button className="dropbtn" type="button" onClick={() => setOpenDropdown(openDropdown === 'residential' ? null : 'residential')}>
              RESIDENTIAL <FaChevronDown />
            </button>

            <div className="dropdown-content">

              <Link href="/house-moving" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                HOUSE REMOVAL
              </Link>

              <Link href="/StorageServices" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                STORAGE SERVICES
              </Link>

              <Link href="/manpower" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                MANPOWER ONLY
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                APPLIANCES MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                PIANO MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                SENIORS MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                JUNK REMOVAL
              </Link>

            </div>

          </div>

          {/* BUSINESS */}
          <div className={`dropdown ${openDropdown === 'business' ? 'open' : ''}`}>

            <button className="dropbtn" type="button" onClick={() => setOpenDropdown(openDropdown === 'business' ? null : 'business')}>
              BUSINESS <FaChevronDown />
            </button>

            <div className="dropdown-content">

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                COMMERCIAL MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                OFFICE RELOCATIONS
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                IT EQUIPMENT MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                SCHOOL MOVING
              </Link>

            </div>

          </div>
          {/* LOCATIONS */}
          <div
            className={`dropdown ${openDropdown === "locations" ? "open" : ""
              }`}
          >

            <button
              className="dropbtn"
              type="button"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "locations"
                    ? null
                    : "locations"
                )
              }
            >
              LOCATIONS <FaChevronDown />
            </button>

            <div className="dropdown-content">

              {locations && locations.length > 0 ? (

                locations.map((location) => (

                  <Link
                    key={location.id}
                    href={`/location/${location.slug}`}
                    onClick={() => {
                      setOpenDropdown(null);
                      setMenuOpen(false);
                    }}
                  >
                    {location.location_name}
                  </Link>

                ))

              ) : (

                <span className="loading-text">
                  No Locations Found
                </span>

              )}

            </div>

          </div>

          {/* LONG DISTANCE */}
          <div className={`dropdown ${openDropdown === 'longdistance' ? 'open' : ''}`}>

            <button className="dropbtn" type="button" onClick={() => setOpenDropdown(openDropdown === 'longdistance' ? null : 'longdistance')}>
              LONG DISTANCE <FaChevronDown />
            </button>

            <div className="dropdown-content">

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                EMPLOYEE RELOCATION
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                CROSS COUNTRY MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                INTERPROVINCIAL MOVING
              </Link>

              <Link href="/" onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>
                PACKING SERVICES
              </Link>

            </div>

          </div>

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