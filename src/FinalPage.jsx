import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import emailjs from "@emailjs/browser";
import html2canvas from "html2canvas";
import { AnimatePresence, motion } from "framer-motion";

import clapGif from "/clapping.gif"; // 👈 clapping animation

// For now, admin email is you.
// Later change to "support@anistonav.com" in one place.
const ADMIN_EMAIL = "sales@anistonav.com";

// EmailJS credentials
const SERVICE_ID = "service_cufdeu4";        // your Outlook_quizapp service
const TEMPLATE_ID = "template_ifidrpq";      // your EmailJS template ID
const PUBLIC_KEY = "PrvfH3gTkEwcwNKJC";      // your EmailJS public key

// ⭐ DESKTOP clapping GIF knobs ⭐
const CLAP_KNOBS_DESKTOP = {
  left: "25%",     // X axis
  bottom: "45%",   // Y axis
  height: "290px", // size
};

// ⭐ MOBILE clapping GIF overrides ⭐
const CLAP_KNOBS_MOBILE = {
  left: "4%",
  bottom: "62%",
  height: "200px",
};

// ⭐ Layout knobs (desktop + mobile) ⭐
const LAYOUT_KNOBS = {
  containerPaddingDesktop: "20px",
  containerPaddingMobile: "16px 12px",

  headingFontSizeDesktop: "2rem",
  headingFontSizeMobile: "1.5rem",

  checkmarkSizeDesktop: "80px",
  checkmarkSizeMobile: "60px",

  textFontSizeDesktop: "1rem",
  textFontSizeMobile: "0.9rem",

  couponFontSizeDesktop: "1.3rem",
  couponFontSizeMobile: "1.1rem",

  couponMinWidthDesktop: "260px",
  couponMinWidthMobile: "220px",
};

export default function FinalPage({ userData, correctAnswers, couponCode }) {
  const [copied, setCopied] = useState(false);
  const [fallbackDownloaded, setFallbackDownloaded] = useState(false);
  const cardRef = useRef(null);

  // 🔹 Detect mobile vs desktop
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

  // Merge GIF knobs
  const CLAP_KNOBS = isMobile ? CLAP_KNOBS_MOBILE : CLAP_KNOBS_DESKTOP;

  // Layout values
  const containerPadding = isMobile
    ? LAYOUT_KNOBS.containerPaddingMobile
    : LAYOUT_KNOBS.containerPaddingDesktop;

  const headingFontSize = isMobile
    ? LAYOUT_KNOBS.headingFontSizeMobile
    : LAYOUT_KNOBS.headingFontSizeDesktop;

  const checkmarkSize = isMobile
    ? LAYOUT_KNOBS.checkmarkSizeMobile
    : LAYOUT_KNOBS.checkmarkSizeDesktop;

  const textFontSize = isMobile
    ? LAYOUT_KNOBS.textFontSizeMobile
    : LAYOUT_KNOBS.textFontSizeDesktop;

  const couponFontSize = isMobile
    ? LAYOUT_KNOBS.couponFontSizeMobile
    : LAYOUT_KNOBS.couponFontSizeDesktop;

  const couponMinWidth = isMobile
    ? LAYOUT_KNOBS.couponMinWidthMobile
    : LAYOUT_KNOBS.couponMinWidthDesktop;

  // Confetti when final page loads
  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00eaff", "#ff0077", "#ffee00"],
    });
  };

  // JSON fallback download (offline or email error)
  const downloadJsonFallback = () => {
    if (!userData) return;

    const data = {
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      couponCode,
      score: correctAnswers,
      timestamp: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Aniston_coupon_backup_${couponCode || "no-code"}.json`;
    link.click();

    URL.revokeObjectURL(url);
    setFallbackDownloaded(true);
  };

  // Send email via EmailJS (only if online and coupon exists)
  const sendEmail = () => {
    if (!userData || !couponCode) return; // guard: only when coupon exists

    const isOnline = navigator.onLine;

    const templateParams = {
      user_name: userData.name,
      user_email: userData.email,
      user_mobile: userData.mobile,
      coupon_code: couponCode,
      score: correctAnswers,
      admin_email: ADMIN_EMAIL,
    };

    if (!isOnline) {
      console.warn("User is offline. Skipping email, downloading JSON backup.");
      downloadJsonFallback();
      return;
    }

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Email send error:", error);
        downloadJsonFallback();
      });
  };

  useEffect(() => {
    fireConfetti();
    sendEmail();
  }, []);

  // Copy coupon code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  // Download coupon card as PNG
  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // transparent around the card
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Aniston_coupon_${couponCode || "code"}.png`;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
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
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont",
        padding: containerPadding,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Clapping GIF overlay (permanent, behind text) */}
      <AnimatePresence>
        <motion.img
          key="clap-gif"
          src={clapGif}
          alt="Clapping"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: CLAP_KNOBS.bottom,
            left: CLAP_KNOBS.left,
            transform: "translateX(-50%)",
            height: CLAP_KNOBS.height,
            pointerEvents: "none",
            zIndex: 0, // behind text, above background
            opacity: 0.9,
          }}
        />
      </AnimatePresence>

      {/* Big check mark */}
      <div
        style={{
          fontSize: checkmarkSize,
          marginBottom: isMobile ? "12px" : "20px",
          color: "#00d1ff",
          zIndex: 1,
        }}
      >
        ✔
      </div>

      <h1
        style={{
          fontSize: headingFontSize,
          marginBottom: "10px",
          zIndex: 1,
        }}
      >
        Congratulations, {userData?.name || "Player"}!
      </h1>

      <p
        style={{
          opacity: 0.85,
          fontSize: textFontSize,
          marginBottom: isMobile ? "22px" : "30px",
          lineHeight: 1.4,
          zIndex: 1,
          maxWidth: "480px",
        }}
      >
        You scored <b>{correctAnswers}</b> out of 4.
        <br />
        Here is your <b>15% OFF</b> gift card
      </p>

      {/* Coupon card (screenshot target) */}
      <div
        ref={cardRef}
        style={{
          padding: "18px 30px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid #00d1ff",
          backdropFilter: "blur(10px)",
          fontSize: couponFontSize,
          fontWeight: "600",
          letterSpacing: "1px",
          color: "#00d1ff",
          marginBottom: "12px",
          minWidth: couponMinWidth,
          zIndex: 1,
        }}
      >
        {couponCode}
      </div>

      {/* Buttons row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            background: "#00d1ff",
            color: "#000",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          📋 Copy Code
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            border: "1px solid #00d1ff",
            background: "transparent",
            color: "#00d1ff",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ⬇️ Download Coupon
        </button>
      </div>

      {copied && (
        <div
          style={{
            fontSize: "0.85rem",
            color: "#00ff99",
            marginBottom: "10px",
            zIndex: 1,
          }}
        >
          Code copied!
        </div>
      )}

      <p
        style={{
          opacity: 0.6,
          fontSize: "0.9rem",
          maxWidth: "420px",
          zIndex: 1,
        }}
      >
        Your coupon and quiz details have been emailed to you{" "}
        {ADMIN_EMAIL}
        {fallbackDownloaded && (
          <>
            <br />
            <span style={{ color: "#ffcc66" }}>
              Email could not be sent or you were offline – a JSON backup file
              has been downloaded on your device.
            </span>
          </>
        )}
      </p>
    </div>
  );
}
