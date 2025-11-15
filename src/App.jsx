import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import FormPage from "./FormPage";
import QuizPage from "./QuizPage";
import FinalPage from "./FinalPage";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // data from form
  const [userData, setUserData] = useState(null); // { name, email, mobile }

  // quiz result
  const [correctAnswers, setCorrectAnswers] = useState(null); // number or null

  // coupon code
  const [couponCode, setCouponCode] = useState("");

  // -------- Online / Offline status --------
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [statusMessage, setStatusMessage] = useState(null); // text for overlay

  useEffect(() => {
    const showMessage = (text) => {
      setStatusMessage(text);
      setTimeout(() => setStatusMessage(null), 2000); // hide after 2s
    };

    const handleOnline = () => {
      setIsOnline(true);
      showMessage("You are back online");
    };

    const handleOffline = () => {
      setIsOnline(false);
      showMessage("You are offline");
    };

    // initial state check (in case user opens while offline)
    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // -------- Step flow: Splash → Form → Quiz → Final --------

  let screen;

  if (showSplash) {
    screen = <SplashScreen onFinish={() => setShowSplash(false)} />;
  } else if (!userData) {
    screen = (
      <FormPage
        onSubmitForm={(data) => {
          // data = { name, email, mobile }
          setUserData(data);
        }}
      />
    );
  } else if (correctAnswers === null) {
    screen = (
      <QuizPage
        onFinishQuiz={(correct) => {
          setCorrectAnswers(correct);
          const code =
            "Aniston-" + Math.random().toString(36).substring(2, 8);
          setCouponCode(code);
        }}
      />
    );
  } else {
    screen = (
      <FinalPage
        userData={userData}
        correctAnswers={correctAnswers}
        couponCode={couponCode}
      />
    );
  }

  return (
    <>
      {/* Global online/offline overlay */}
      {statusMessage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontFamily: "-apple-system, BlinkMacSystemFont",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              padding: "14px 24px",
              borderRadius: "12px",
              background: "rgba(20, 20, 20, 0.95)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: "0.95rem",
              letterSpacing: "0.5px",
            }}
          >
            {statusMessage}
          </div>
        </div>
      )}

      {screen}
    </>
  );
}


