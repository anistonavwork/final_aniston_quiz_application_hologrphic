import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import walkingGirl from "/Walking_girl2.gif";
import flyingBird from "/flying_bird.gif";

const productImages = [
  "/products/camra.png",
  "/products/celling_speaker.png",
  "/products/micorphone.png",
  "/products/speaker.png",
  "/products/transparent_diaplay.png",
  "/products/Video_Bar.png",
];

// ⭐ FULL CONTROL KNOBS ⭐
const KNOBS = {
  // LOGO
  logoFontSize: "6.5rem",
  logoLetterSpacing: "0.4rem",
  logoTop: "8%",

  // TAGLINE
  taglineTop: "40%",
  taglineFontSize: "1.2rem",
  taglineWidth: "80%",
  taglineLineHeight: "1.45",
  taglineOpacity: 0.9,

  // PRODUCT ROW
  productRowTop: "58%",
  productSize: 150,
  productSpacing: "clamp(20px, 2vw, 80px)",
  productGlow: "0px 0px 22px rgba(0,255,255,0.35)",

  // FLOAT EFFECT
  floatDistance: 12,
  floatDuration: 3,

  // SEQUENCE TIMING
  logoDuration: 1.2,
  taglineDelay: 1.4,
  productsDelay: 2.2,

  // GIRL GIF CONTROL
  girlX: "52%",
  girlY: "2%",
  girlSize: 820,
  girlRenderDelay: 3.5,
  girlFadeOutDelay: 6,
  girlFadeDuration: 1.2,

  // BIRD GIF CONTROL
  birdX: "52%",
  birdY: "18%",
  birdSize: 580,
  birdRenderDelay: 3.5,
  birdFadeOutDelay: 5,
  birdFadeDuration: 1.2,

  // SPLASH EXIT (used only for fade out on Start)
  fadeDuration: 2,
};

// TEXT
const tagline =
  "Aniston is a professional AV solutions brand offering DSP processors, ceiling microphones, PTZ cameras, conferencing bars, transparent displays and AV-over-IP systems.";

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [show, setShow] = useState(true);

  // Controls GIF trigger
  const [girlPlay, setGirlPlay] = useState(false);
  const [birdPlay, setBirdPlay] = useState(false);

  // Controls fade-out for GIFs
  const [girlFade, setGirlFade] = useState(false);
  const [birdFade, setBirdFade] = useState(false);

  useEffect(() => {
    // Trigger GIRL GIF
    const t1 = setTimeout(
      () => setGirlPlay(true),
      KNOBS.girlRenderDelay * 1000
    );

    // Trigger BIRD GIF
    const t2 = setTimeout(
      () => setBirdPlay(true),
      KNOBS.birdRenderDelay * 1000
    );

    // Fade GIFs
    const t3 = setTimeout(
      () => setGirlFade(true),
      KNOBS.girlFadeOutDelay * 1000
    );
    const t4 = setTimeout(
      () => setBirdFade(true),
      KNOBS.birdFadeOutDelay * 1000
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!show) return null;

  const randomOffset = () =>
    (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 200);

  // New: user-controlled start
  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      onFinish();
    }, KNOBS.fadeDuration * 1000);
  };

  return (
    <div
      className="splash-container"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: `opacity ${KNOBS.fadeDuration}s ease`,
      }}
    >
      {/* ------------- LOGO ------------- */}
      <motion.div
        style={{
          position: "absolute",
          top: KNOBS.logoTop,
          fontSize: KNOBS.logoFontSize,
          letterSpacing: KNOBS.logoLetterSpacing,
          fontWeight: 900,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
      >
        {"ANISTON".split("").map((letter, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: {
                opacity: 0,
                x: randomOffset(),
                y: randomOffset(),
                rotate: randomOffset() / 7,
              },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                transition: { duration: KNOBS.logoDuration },
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>

      {/* ------------- TAGLINE ------------- */}
      <motion.div
        style={{
          position: "absolute",
          top: KNOBS.taglineTop,
          width: KNOBS.taglineWidth,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: KNOBS.taglineOpacity,
          fontSize: KNOBS.taglineFontSize,
          lineHeight: KNOBS.taglineLineHeight,
          zIndex: 4,
          fontWeight:"600"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: KNOBS.taglineDelay, duration: 1 }}
      >
        {tagline}
      </motion.div>

      {/* ------------- PRODUCT ROW ------------- */}
      <div
        style={{
          position: "absolute",
          top: KNOBS.productRowTop,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: KNOBS.productSpacing,
          zIndex: 4,
        }}
      >
        {productImages.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            style={{
              width: KNOBS.productSize,
              filter: `drop-shadow(${KNOBS.productGlow})`,
            }}
            initial={{
              opacity: 0,
              x: randomOffset(),
              y: randomOffset(),
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -KNOBS.floatDistance, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              opacity: { delay: KNOBS.productsDelay + i * 0.15, duration: 1 },
              x: { delay: KNOBS.productsDelay + i * 0.15, duration: 1.2 },
              y: {
                delay: KNOBS.productsDelay + i * 0.15,
                duration: KNOBS.floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>

      {/* ------------- GIRL GIF (STARTS AT EXACT MOMENT) ------------- */}
      {girlPlay && (
        <motion.img
          src={walkingGirl}
          initial={{ opacity: 0 }}
          animate={{ opacity: girlFade ? 0 : 1 }}
          transition={{
            duration: KNOBS.girlFadeDuration,
          }}
          style={{
            position: "absolute",
            top: KNOBS.girlY,
            left: KNOBS.girlX,
            transform: "translateX(-50%)",
            width: KNOBS.girlSize,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}

      {/* ------------- BIRD GIF (STARTS AT EXACT MOMENT) ------------- */}
      {birdPlay && (
        <motion.img
          src={flyingBird}
          initial={{ opacity: 0 }}
          animate={{ opacity: birdFade ? 0 : 1 }}
          transition={{
            duration: KNOBS.birdFadeDuration,
          }}
          style={{
            position: "absolute",
            top: KNOBS.birdY,
            left: KNOBS.birdX,
            transform: "translateX(-50%)",
            width: KNOBS.birdSize,
            pointerEvents: "none",
            zIndex: 45,
          }}
        />
      )}

      {/* ------------- START BUTTON ------------- */}
      <button
        onClick={handleStart}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "15px 36px",
          borderRadius: "999px",
          border: "none",
          background: "#00d1ff",
          color: "#000",
          fontWeight: 800,
          fontSize: "0.95rem",
          letterSpacing: "0.5px",
          cursor: "pointer",
        }}
      >
        Start
      </button>
    </div>
  );
}
