import { useEffect, useState } from "react";
import questionsData from "./data/questions.json";
import { motion, AnimatePresence } from "framer-motion";

// Confetti effect library (CDN free)
import confetti from "canvas-confetti";

export default function QuizPage({ onFinishQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  // Overlay popup state
  const [popup, setPopup] = useState(null); // "correct" or "wrong"
  const [popupVisible, setPopupVisible] = useState(false);

  // Load 4 random questions
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

    setTimeout(() => {
      setPopupVisible(false);
    }, 900);
  };

  const handleSubmit = () => {
    if (!selected) return;

    let isCorrect = selected === current.answer;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      triggerConfetti();
      showPopup("correct");
    } else {
      showPopup("wrong");
    }

    // switch question after slight delay
    setTimeout(() => {
      if (index === 3) {
        onFinishQuiz(correctCount + (isCorrect ? 1 : 0));
      } else {
        setIndex(index + 1);
        setSelected(null);
      }
    }, 1000);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        color: "#fff",
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
      {/* Overlay Popup */}
      <AnimatePresence>
        {popupVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: "absolute",
              top: "40%",
              background: "rgba(255,255,255,0.1)",
              padding: "30px 50px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
              fontSize: "1.2rem",
              zIndex: 50,
            }}
          >
            {popup === "correct" ? "✔ Correct Answer!" : "✖ Wrong Answer!"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Number */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "35px", fontSize: "1.2rem" }}
      >
        Question {index + 1} of 4
      </motion.h2>

      {/* Question Text (Alternate Left/Right) */}
      <motion.p
        key={current.question}
        initial={{
          opacity: 0,
          x: index % 2 === 0 ? -200 : 200,
        }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          fontSize: "1.2rem",
          marginBottom: "25px",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        {current.question}
      </motion.p>

      {/* OPTIONS */}
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
              border: selected === opt ? "2px solid #00d1ff" : "1px solid #555",
              cursor: "pointer",
              background: selected === opt ? "#003b45" : "#111",
              transition: "0.3s",
            }}
          >
            {opt}
          </motion.div>
        ))}
      </div>

      {/* NEXT BUTTON */}
      <motion.button
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleSubmit}
        style={{
          marginTop: "25px",
          padding: "12px 30px",
          background: "#00d1ff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "600",
          cursor: "pointer",
          color: "#000",
          fontSize: "1rem",
        }}
      >
        {index === 3 ? "Finish Quiz" : "Next"}
      </motion.button>
    </div>
  );
}
