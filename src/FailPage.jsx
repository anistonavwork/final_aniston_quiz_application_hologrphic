import { motion } from "framer-motion";
import noGif from "/sad.gif";

export default function FailPage({ userData, correctAnswers, onRetry }) {
  const name = userData?.name || "Player";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#fff",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Oops GIF */}
      <motion.img
        src={noGif}
        alt="Oops"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          height: "260px",
          marginBottom: "10px",
          pointerEvents: "none",
        }}
      />

      {/* Oops text */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ fontSize: "2rem", marginBottom: "10px" }}
      >
        Oops, {name}! 
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          maxWidth: "500px",
          fontSize: "1rem",
          lineHeight: 1.5,
          opacity: 0.85,
          marginBottom: "24px",
        }}
      >
        You scored <b>{correctAnswers}</b> out of 4 this time.
        <br />
        You need at least <b>2 correct answers</b> to unlock the 15% OFF
        gift card. Don’t worry — you can try the quiz again!
      </motion.p>

      {/* Retry button */}
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={onRetry}
        style={{
          padding: "12px 28px",
          borderRadius: "999px",
          border: "none",
          background: "#00d1ff",
          color: "#000",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Retry Quiz
      </motion.button>
    </div>
  );
}
