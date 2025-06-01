import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import
import Confetti from "react-confetti";
import "./App.css";

const messages = [
  "Are you sure? 🥺",
  "Think again... 💔",
  "I baked cookies! 🍪",
  "You’re breaking my heart 💘",
  "We’re perfect together! 😢",
  "Come on, say yes 😇",
  "You can’t say no to this face 😿",
];

const HEART_COUNT = 40;
const randomRange = (min, max) => Math.random() * (max - min) + min;

function App() {
  const [accepted, setAccepted] = useState(false);
  const [showContinue, setShowContinue] = useState(false); // NEW: track when to show Continue button
  const [messageIndex, setMessageIndex] = useState(-1);
  const [noDisabled, setNoDisabled] = useState(false);
  const [hearts, setHearts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const initialHearts = Array.from({ length: HEART_COUNT }).map(() => ({
      x: randomRange(0, 100),
      y: randomRange(0, 20),
      speed: randomRange(0.1, 0.3),
      driftSpeed: randomRange(0.2, 0.5),
      driftDirection: Math.random() > 0.5 ? 1 : -1,
      size: randomRange(20, 50),
      popped: false,
      popProgress: 0,
    }));
    setHearts(initialHearts);
  }, []);

  useEffect(() => {
    let animationId;

    const animateHearts = () => {
      setHearts((hearts) =>
        hearts.map((heart) => {
          if (heart.popped) {
            const progress = heart.popProgress + 0.05;
            if (progress >= 1) {
              return {
                ...heart,
                x: randomRange(0, 100),
                y: randomRange(0, 20),
                speed: randomRange(0.1, 0.3),
                driftSpeed: randomRange(0.2, 0.5),
                driftDirection: Math.random() > 0.5 ? 1 : -1,
                size: randomRange(20, 50),
                popped: false,
                popProgress: 0,
              };
            }
            return { ...heart, popProgress: progress };
          }

          let newY = heart.y + heart.speed;
          let newX =
            heart.x +
            heart.driftDirection *
              heart.driftSpeed *
              0.1 *
              (Math.random() > 0.5 ? 1 : -1);

          if (newX < 0 || newX > 100) {
            newX = Math.max(0, Math.min(newX, 100));
            heart.driftDirection *= -1;
          }

          if (newY >= 100) {
            return { ...heart, popped: true, popProgress: 0, y: 100 };
          }

          return {
            ...heart,
            x: newX,
            y: newY,
          };
        })
      );
      animationId = requestAnimationFrame(animateHearts);
    };

    animationId = requestAnimationFrame(animateHearts);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleNoClick = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex((prev) => prev + 1);
    } else {
      setMessageIndex(messages.length);
      setNoDisabled(true);
    }
  };

  // UPDATED: now show message + Continue button instead of direct navigate
  const handleYesClick = () => {
    setAccepted(true);
    setShowContinue(true);
  };

  const handleContinueClick = () => {
    navigate("/love");
  };

  return (
    <div className="container">
      <audio autoPlay loop>
        <source src="/romantic.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {hearts.map((heart, index) => (
        <div
          key={index}
          className={`heart-bubble ${heart.popped ? "pop" : ""}`}
          style={{
            left: `${heart.x}vw`,
            bottom: `${heart.y}vh`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.popped ? 1 - heart.popProgress : 0.7,
            transform: heart.popped
              ? `scale(${1 + heart.popProgress}) rotate(-45deg)`
              : `rotate(-45deg)`,
          }}
        />
      ))}

      {accepted && <Confetti />}

      <div className="centered-wrapper">
        {accepted ? (
          <>
            <h1 className="love-message">Yay! I love you, putt! 💖💍</h1>
            {showContinue && (
              <button className="continue-button" onClick={handleContinueClick}>
                Continue
              </button>
            )}
          </>
        ) : (
          <>
            <h1>Will you be mine forever? 💖</h1>
            <div className="buttons">
              <button className="yes" onClick={handleYesClick}>
                Yes 💍
              </button>
              <button
                className="no"
                onClick={handleNoClick}
                disabled={noDisabled}
              >
                No 🙈
              </button>
            </div>
            {messageIndex >= 0 && (
              <p className="no-message">
                {messageIndex < messages.length
                  ? messages[messageIndex]
                  : "No more escape routes! 😆"}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
