import React from "react";
import "./PageHero.css";

const PageHero = ({ title, bgImage }) => {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="overlay"></div>

      <h1>{title}</h1>
    </section>
  );
};

export default PageHero;