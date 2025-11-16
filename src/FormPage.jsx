import { useState } from "react";
import { motion } from "framer-motion";
import standingGif from "/standing_character.gif"; // your transparent GIF

export default function FormPage({ onSubmitForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000); // hide after 2 sec
  };

  const handleSubmit = () => {
    // Basic required checks (optional but recommended)
    if (!name.trim()) {
      showError("Please enter your name.");
      return;
    }

    // Mobile validation: exactly 10 digits
    const digitsOnly = mobile.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Email validation: must have @ and .com
    const emailLower = email.toLowerCase().trim();
    if (
      !emailLower.includes("@") ||
      !emailLower.includes(".") ||
      !emailLower.endsWith(".com")
    ) {
      showError("Please enter a valid email address.");
      return;
    }

    // If all good, call parent
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
        padding: "20px 220px",
        position: "relative",
        
      }}
    >
      {/* --------- Error Popup Overlay (local to form) --------- */}
      {errorMessage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
            color:"red"
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
          maxWidth: "520px",
          zIndex: 10,
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "1.4rem",
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

      {/* ---------------- GIF ON RIGHT SIDE ---------------- */}
      <img
        src={standingGif}
        alt="Character"
        style={{
          height: "62vh",
          objectFit: "contain",
          position: "absolute",
          right: "7%",
          bottom: "18%",
          pointerEvents: "none",
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
