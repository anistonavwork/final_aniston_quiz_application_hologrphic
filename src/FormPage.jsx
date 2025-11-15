import { useState } from "react";
import { motion } from "framer-motion";
import standingGif from "/standing_character.gif"; // your transparent GIF

export default function FormPage({ onSubmitForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  return (
    <div 
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#000",
        fontFamily: "-apple-system, BlinkMacSystemFont",
        color: "#fff",
        overflow: "hidden",
        padding: "20px 220px",
        position: "relative"
      }}
    >
      {/* ---------------- FORM ON LEFT SIDE ---------------- */}
      <div 
        style={{
          width: "100%",
          maxWidth: "420px",
          zIndex: 10,
        }}
      >
        <motion.h2 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "1rem",
            marginBottom: "20px",
            lineHeight: "1.4",
            opacity: 0.9,
            letterSpacing: "0.5px",
            fontWeight: "600"
          }}
        >
          Please fill these details to play the quiz and get a <b>50% OFF coupon code</b>
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
          onClick={() => onSubmitForm({ name, email, mobile })}
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
            cursor: "pointer"
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
          height: "51vh",
          objectFit: "contain",
          position: "absolute",
          right: "15%",
          bottom: "20%",
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
  background: "#111",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
};
