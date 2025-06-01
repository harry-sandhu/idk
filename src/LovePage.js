import React from "react";
import { useNavigate } from "react-router-dom";
import "./LovePage.css";

function LovePage() {
  const navigate = useNavigate();

  return (
    <div className="love-page">
      <div className="content-wrapper">
        <h1 className="title">Our Journey Begins Here 💖✨</h1>
        <p className="subtitle">
          In your smile, I've found my home. <br />
          In your warmth, I find my peace. <br />
          Together, we create a love story more beautiful than any dream.
        </p>
        <div className="hearts-container">
          <span className="heart">❤️</span>
          <span className="heart">💞</span>
          <span className="heart">💕</span>
          <span className="heart">💓</span>
          <span className="heart">💗</span>
        </div>

        {/* The button to go to HeartPage */}
        <button
          className="go-to-heart-page-btn"
          onClick={() => navigate("/hearts")}
        >
          Take Me to My Heart 💖
        </button>
      </div>
    </div>
  );
}

export default LovePage;
