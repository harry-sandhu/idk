import React, { useState, useEffect, useRef } from "react";
import "./HeartPage.css";

const loveMessages = [
  "You're the sunshine of my life ☀️",
  "Forever isn't long enough with you 💖",
  "I knew it was you 💘",
  "You're my favorite person 😍",
  "Every moment with you is magic ✨",
  "My heart beats for you 💓",
  "You're my everything 💍",
  "You make my world brighter 🌈",
  "You complete me ❤️‍🔥",
  "My heart is yours forever 💞",
  "Loving you is easy 🥰",
  "You're my happy place 🌸",
  "I'm so lucky to have you 🍀",
  "You're my dream come true 🌟",
  "With you, every day is special 💐",
  "You light up my darkest days 🌙",
  "You're the reason I smile 😊",
  "My love for you grows every day 🌱",
  "You're my heart's melody 🎶",
  "Together is my favorite place to be 🏡",
  "You're my sweetest addiction 🍫",
  "I fall for you all over again ❤️‍🔥",
  "You make life beautiful 🎨",
  "You're my forever and always 🔒",
  "You're my peace in chaos 🌿",
  "I'm addicted to your love 💘",
  "You're the beat in my heart 🥁",
  "You're the one I want to grow old with 👵👴",
  "You're my endless adventure 🌍",
  "You make my heart skip a beat 💓",
  "You're my soulmate and best friend 💞",
  "Loving you feels like home 🏠",
  "You're the spark in my life ⚡️",
  "You're my little piece of heaven ☁️",
  "I'm yours, always and forever 💖",
  "You make my dreams sweeter 🍬",
  "You're the light of my life ✨",
  "You're my heart's desire ❤️",
  "Every day with you is a blessing 🙏",
  "You're my reason to believe in love 💫",
  "You're my forever crush 💕",
  "You bring joy to my soul 😇",
  "You're the best part of me 🌟",
  "You're my heart's true home 🏡",
  "You're my sweetest hello and hardest goodbye 💌",
  "You're my love story 📖",
  "I'm grateful for you every day 🙌",
  "You're my one and only 💘",
  "You make my life a fairy tale 🧚‍♀️",
  "You're my favorite “hello” and hardest “goodbye” 🥺",
];

const BUTTERFLY_COUNT = 10;
const HEART_COUNT = 20;

const randomRange = (min, max) => Math.random() * (max - min) + min;

function HeartPage() {
  const [butterflies, setButterflies] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const confettiRef = useRef(null);
  const confettiAnimationRef = useRef(null);
  const confettiParticles = useRef([]);

  // Initialize butterflies
  useEffect(() => {
    const initialButterflies = Array.from({ length: BUTTERFLY_COUNT }).map(
      (_, i) => ({
        x: randomRange(5, 80),
        y: randomRange(5, 80),
        speed: randomRange(0.02, 0.05),
        driftSpeed: randomRange(0.03, 0.1),
        driftDirection: Math.random() > 0.5 ? 1 : -1,
        size: randomRange(150, 220),
        popped: false,
        popProgress: 0,
        message: loveMessages[i],
        flutterPhase: Math.random() * 360,
        vx: 0, // velocity x for repelling
        vy: 0, // velocity y for repelling
      })
    );
    setButterflies(initialButterflies);
  }, []);

  // Initialize hearts (small floating hearts)
  useEffect(() => {
    const initialHearts = Array.from({ length: HEART_COUNT }).map(() => ({
      x: randomRange(0, 80),
      y: randomRange(-10, 0),
      speed: randomRange(0.1, 0.5),
      size: randomRange(10, 40),
      opacity: randomRange(0.4, 0.9),
    }));
    setHearts(initialHearts);
  }, []);

  // Animate hearts floating up
  useEffect(() => {
    let animationId;
    const animateHearts = () => {
      setHearts((hearts) =>
        hearts.map((heart) => {
          let newY = heart.y + heart.speed;
          if (newY > 110) {
            // reset heart back to bottom
            return {
              ...heart,
              y: randomRange(-10, 0),
              x: randomRange(0, 80),
              size: randomRange(10, 20),
              opacity: randomRange(0.4, 0.9),
              speed: randomRange(0.5, 1.2),
            };
          }
          return { ...heart, y: newY };
        })
      );
      animationId = requestAnimationFrame(animateHearts);
    };
    animationId = requestAnimationFrame(animateHearts);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Animate butterflies + repel logic + pop reset
  useEffect(() => {
    let animationId;

    const repelDistance = 15; // pixels (vw/vh approx)

    const animate = () => {
      setButterflies((butterflies) => {
        const updated = butterflies.map((butterfly, i) => {
          if (butterfly.popped) {
            const progress = butterfly.popProgress + 0.03;
            if (progress >= 1) {
              // Reset butterfly
              return {
                ...butterfly,
                x: randomRange(0, 80),
                y: randomRange(0, 20),
                speed: randomRange(0.02, 0.05),
                driftSpeed: randomRange(0.03, 0.05),
                driftDirection: Math.random() > 0.5 ? 1 : -1,
                size: randomRange(150, 220),
                popped: false,
                popProgress: 0,
                flutterPhase: Math.random() * 360,
                vx: 0,
                vy: 0,
              };
            }
            return { ...butterfly, popProgress: progress };
          }

          return { ...butterfly };
        });

        // Repel butterflies from each other
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            let b1 = updated[i];
            let b2 = updated[j];

            // Calculate dx, dy between butterflies, scale to vw/vh as approximate px
            let dx = b2.x - b1.x;
            let dy = b2.y - b1.y;

            // Approximate distance (since units are vw/vh)
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < repelDistance && dist > 0) {
              // Calculate repelling force
              const force = ((repelDistance - dist) / repelDistance) * 0.5; // strength
              const nx = dx / dist;
              const ny = dy / dist;

              // Apply repelling velocity oppositely
              updated[i].vx -= nx * force;
              updated[i].vy -= ny * force;
              updated[j].vx += nx * force;
              updated[j].vy += ny * force;
            }
          }
        }

        // Update position with velocity and natural flutter/drift/speed
        return updated.map((butterfly) => {
          if (butterfly.popped) return butterfly;

          // Natural movement
          let newY = butterfly.y + butterfly.speed + butterfly.vy;
          let newX =
            butterfly.x +
            butterfly.driftDirection *
              butterfly.driftSpeed *
              Math.sin(butterfly.flutterPhase * (Math.PI / 180)) *
              0.5 +
            butterfly.vx;

          let newFlutterPhase = (butterfly.flutterPhase + 6) % 360;

          // Bounce horizontally within screen
          let driftDirection = butterfly.driftDirection;
          if (newX < 0) {
            newX = 0;
            driftDirection = 1;
          } else if (newX > 80) {
            newX = 80;
            driftDirection = -1;
          }

          // Prevent butterflies from leaving the vertical bounds
          if (newY >= 100) {
            return { ...butterfly, popped: true, popProgress: 0, y: 100 };
          }

          // Apply friction to velocity so butterflies don't keep moving too fast
          const friction = 0.85;
          const vx = butterfly.vx * friction;
          const vy = butterfly.vy * friction;

          return {
            ...butterfly,
            x: newX,
            y: newY,
            flutterPhase: newFlutterPhase,
            driftDirection,
            vx,
            vy,
          };
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Confetti code
  const createConfetti = () => {
    const canvas = confettiRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Initialize confetti particles if empty
    if (confettiParticles.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        confettiParticles.current.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: randomRange(2, 5),
          d: randomRange(10, 30),
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          tilt: randomRange(-10, 10),
          tiltAngle: 0,
          tiltAngleIncrement: randomRange(0.05, 0.12),
          speedY: randomRange(1, 3),
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      confettiParticles.current.forEach((p) => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleIncrement;
        p.y += p.speedY;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (p.y > H) {
          p.x = Math.random() * W;
          p.y = -20;
        }
      });
    };

    const animateConfetti = () => {
      draw();
      confettiAnimationRef.current = requestAnimationFrame(animateConfetti);
    };

    animateConfetti();
  };

  const stopConfetti = () => {
    if (confettiAnimationRef.current) {
      cancelAnimationFrame(confettiAnimationRef.current);
      confettiAnimationRef.current = null;
    }
    if (confettiRef.current) {
      const ctx = confettiRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        confettiRef.current.width,
        confettiRef.current.height
      );
      confettiParticles.current = [];
    }
  };

  // Start confetti when butterfly pops
  useEffect(() => {
    if (selectedMsg) {
      createConfetti();
    } else {
      stopConfetti();
    }
    // Cleanup on unmount
    return () => stopConfetti();
  }, [selectedMsg]);

  return (
    <div
      className="heart-container"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={confettiRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      {/* Small hearts */}
      {hearts.map((heart, i) => (
        <div
          key={`heart-${i}`}
          className="small-heart"
          style={{
            left: `${heart.x}vw`,
            bottom: `${heart.y}vh`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
            pointerEvents: "none",
            position: "absolute",
            color: "red",
            fontSize: `${heart.size}px`,
            userSelect: "none",
          }}
        >
          ❤️
        </div>
      ))}

      {/* Big butterflies */}
      {butterflies.map((butterfly, index) => (
        <div
          key={index}
          className={`butterfly-bubble ${butterfly.popped ? "pop" : ""}`}
          style={{
            left: `${butterfly.x}vw`,
            bottom: `${butterfly.y}vh`,
            width: `${butterfly.size}px`,
            height: `${butterfly.size * 0.9}px`,
            opacity: butterfly.popped ? 1 - butterfly.popProgress : 0.9,
            transform: butterfly.popped
              ? `scale(${1 + butterfly.popProgress})`
              : `scale(1)`,
            pointerEvents: butterfly.popped ? "none" : "auto",
            "--flutter-phase": butterfly.flutterPhase + "deg",
            position: "absolute",
          }}
          onClick={() => {
            setSelectedMsg(butterfly.message);
            setButterflies((prev) =>
              prev.map((b, i) =>
                i === index ? { ...b, popped: true, popProgress: 0 } : b
              )
            );
          }}
          title={butterfly.message}
        >
          <span className="butterfly-text">{butterfly.message}</span>
        </div>
      ))}

      {/* Popup */}
      {selectedMsg && (
        <div
          className="popup"
          onClick={() => setSelectedMsg(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
        >
          <div
            className="popup-message"
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "90vw",
              textAlign: "center",
            }}
          >
            <h2>🦋 Just for You</h2>
            <p>{selectedMsg}</p>
            <p className="small">(Tap anywhere to close)</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeartPage;
