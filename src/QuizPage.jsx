import { useEffect, useState } from "react";
import questionsData from "./data/questions.json";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import thinkingGif from "/thinking.gif";
import yesGif from "/yes.gif";
import noGif from "/no.gif";

// Knobs for GIF positions & sizes
const GIF_KNOBS = {
  thinking: {
    left: "8%",       // horizontal position
    bottom: "17%",    // vertical position
    height: "277px",  // size
  },
  yes: {
    left: "75%",
    bottom: "5%",
    height: "280px",
  },
  no: {
    left: "75%",
    bottom: "5%",
    height: "280px",
  },
};

// Knobs for YES/NO visibility time & question switch delay
const FEEDBACK_KNOBS = {
  feedbackDurationMs: 2000,   // how long YES/NO + popup are visible
  nextQuestionDelayMs: 2200,  // when to switch to the next question
};

export default function QuizPage({ onFinishQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const [popup, setPopup] = useState(null); // "correct" or "wrong"
  const [popupVisible, setPopupVisible] = useState(false);

  // Pick random 4 questions on mount
  useEffect(() => {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 4));
  }, []);

  if (questions.length === 0) return null;

  const current = questions[index];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#00eaff", "#ff0077", "#ffee00"],
    });
  };

  const showPopup = (type) => {
    setPopup(type);
    setPopupVisible(true);
    setTimeout(
      () => setPopupVisible(false),
      FEEDBACK_KNOBS.feedbackDurationMs
    );
  };

  const handleSubmit = () => {
    if (!selected) return;

    const isCorrect = selected === current.answer;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      triggerConfetti();
      showPopup("correct");
    } else {
      showPopup("wrong");
    }

    // move to next question after feedback duration
    setTimeout(() => {
      if (index === 3) {
        onFinishQuiz(correctCount + (isCorrect ? 1 : 0));
      } else {
        setIndex(index + 1);
        setSelected(null);
      }
    }, FEEDBACK_KNOBS.nextQuestionDelayMs);
  };

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
        padding: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Thinking GIF (always visible on left) */}
      <img
        src={thinkingGif}
        alt="Thinking"
        style={{
          position: "absolute",
          left: GIF_KNOBS.thinking.left,
          bottom: GIF_KNOBS.thinking.bottom,
          height: GIF_KNOBS.thinking.height,
          pointerEvents: "none",
          opacity: 0.95,
        }}
      />

      {/* YES / NO GIFs based on answer result */}
      <AnimatePresence>
        {popupVisible && popup === "correct" && (
          <motion.img
            key="yes-gif"
            src={yesGif}
            alt="Correct"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              left: GIF_KNOBS.yes.left,
              bottom: GIF_KNOBS.yes.bottom,
              transform: "translateX(-50%)",
              height: GIF_KNOBS.yes.height,
              pointerEvents: "none",
              zIndex: 40,
            }}
          />
        )}

        {popupVisible && popup === "wrong" && (
          <motion.img
            key="no-gif"
            src={noGif}
            alt="Wrong"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              left: GIF_KNOBS.no.left,
              bottom: GIF_KNOBS.no.bottom,
              transform: "translateX(-50%)",
              height: GIF_KNOBS.no.height,
              pointerEvents: "none",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      {/* Semi-transparent popup text */}
      <AnimatePresence>
        {popupVisible && (
          <motion.div
            key="popup-overlay"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "40%",
              background: "rgba(255,255,255,0.1)",
              padding: "14px 26px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
              fontSize: "1rem",
              zIndex: 35,
            }}
          >
            {popup === "correct" ? "Correct Answer!" : "Wrong Answer!"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question number */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "25px", fontSize: "2rem" }}
      >
        Question {index + 1} of 4
      </motion.h2>

      {/* Question text (alternate left/right animation) */}
      <motion.p
        key={current.question}
        initial={{
          opacity: 0,
          x: index % 2 === 0 ? -200 : 200,
        }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          fontSize: "1.3rem",
          marginBottom: "15px",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        {current.question}
      </motion.p>

      {/* Options */}
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {current.options.map((opt, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: i % 2 === 0 ? -200 : 200,
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            onClick={() => setSelected(opt)}
            style={{
              padding: "12px 14px",
              marginBottom: "12px",
              borderRadius: "6px",
              border:
                selected === opt ? "2px solid #00d1ff" : "1px solid #555",
              cursor: "pointer",
              background: selected === opt ? "#003b45" : "#fff",
              transition: "0.3s",
              width:"100%"
            }}
          >
            {opt}
          </motion.div>
        ))}
      </div>

      {/* Next / Finish button */}
      <motion.button
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleSubmit}
        style={{
          marginTop: "15px",
          padding: "12px 30px",
          background: "#00d1ff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "600",
          cursor: "pointer",
          color: "#000",
          fontSize: "1rem",
          width:"43%"
        }}
      >
        {index === 3 ? "Finish Quiz" : "Next"}
      </motion.button>
    </div>
  );
}
