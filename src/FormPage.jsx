import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import standingGif from "/standing_character.gif"; // your transparent GIF

// ⭐ DESKTOP KNOBS ⭐
const KNOBS = {
  containerPadding: "20px 220px",

  headingFontSize: "1.4rem",
  headingMaxWidth: "520px",

  formMaxWidth: "520px",

  gifHeight: "62vh",
  gifLeft: "82%",   // percentage from left (with translateX(-50%))
  gifBottom: "18%",

  errorOverlayColor: "rgba(0,0,0,0.6)",
};

// ⭐ MOBILE OVERRIDES ⭐
const MOBILE_OVERRIDES = {
  containerPadding: "20px 16px",

  headingFontSize: "1.2rem",
  headingMaxWidth: "100%",

  formMaxWidth: "100%",

  gifHeight: "36vh",
  gifLeft: "90%",
  gifBottom: "6%",
};

export default function FormPage({ onSubmitForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);

  // 🔹 detect mobile vs desktop
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // merge knobs
  const k = isMobile ? { ...KNOBS, ...MOBILE_OVERRIDES } : KNOBS;

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showError("Please enter your name.");
      return;
    }

    const digitsOnly = mobile.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const emailLower = email.toLowerCase().trim();
    if (
      !emailLower.includes("@") ||
      !emailLower.includes(".") ||
      !emailLower.endsWith(".com")
    ) {
      showError("Please enter a valid email address.");
      return;
    }

    onSubmitForm({
      name: name.trim(),
      email: emailLower,
      mobile: digitsOnly,
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        fontFamily: "-apple-system, BlinkMacSystemFont",
        color: "#000",
        overflow: "hidden",
        padding: k.containerPadding,
        position: "relative",
      }}
    >
      {/* --------- Error Popup Overlay (local to form) --------- */}
      {errorMessage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: k.errorOverlayColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
            color: "red",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "rgba(20,20,20,0.95)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: "0.95rem",
              letterSpacing: "0.3px",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        </div>
      )}

      {/* ---------------- FORM ON LEFT SIDE ---------------- */}
      <div
        style={{
          width: "100%",
          maxWidth: k.formMaxWidth,
          zIndex: 10,
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: k.headingFontSize,
            maxWidth: k.headingMaxWidth,
            marginBottom: "20px",
            lineHeight: "1.4",
            opacity: 0.9,
            letterSpacing: "0.5px",
            fontWeight: "600",
          }}
        >
          Please fill these details to play the quiz and get a{" "}
          <b>15% OFF gift card</b>
        </motion.h2>

        {/* NAME - COME FROM LEFT */}
        <motion.input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* EMAIL - COME FROM RIGHT */}
        <motion.input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* MOBILE - COME FROM LEFT */}
        <motion.input
          type="tel"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={inputStyle}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* SUBMIT BUTTON - FADE UP */}
        <motion.button
          onClick={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            width: "100%",
            padding: "12px",
            background: "#00d1ff",
            border: "none",
            borderRadius: "6px",
            color: "#000",
            fontWeight: "600",
            fontSize: "1rem",
            marginTop: "12px",
            cursor: "pointer",
          }}
        >
          Submit
        </motion.button>
      </div>

      {/* ---------------- GIF ON RIGHT SIDE / BOTTOM ON MOBILE ---------------- */}
      <img
        src={standingGif}
        alt="Character"
        style={{
          height: k.gifHeight,
          objectFit: "contain",
          position: "absolute",
          left: k.gifLeft,
          bottom: k.gifBottom,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #555",
  background: "#fff",
  color: "#111",
  fontSize: "1rem",
  outline: "none",
};
