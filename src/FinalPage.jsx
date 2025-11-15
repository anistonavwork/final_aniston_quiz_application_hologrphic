import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import emailjs from "@emailjs/browser";
import html2canvas from "html2canvas";

// For now, admin email is you.
// Later change to "support@anistonav.com" in one place.
const ADMIN_EMAIL = "sales@anistonav.com";

// EmailJS credentials
const SERVICE_ID = "service_cufdeu4";        // your Outlook_quizapp service
const TEMPLATE_ID = "template_ifidrpq";      // your EmailJS template ID
const PUBLIC_KEY = "PrvfH3gTkEwcwNKJC";   // your EmailJS public key

export default function FinalPage({ userData, correctAnswers, couponCode }) {
  const [copied, setCopied] = useState(false);
  const [fallbackDownloaded, setFallbackDownloaded] = useState(false);
  const cardRef = useRef(null);

  // Confetti when final page loads
  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00eaff", "#ff0077", "#ffee00"],
    });
  };

  // JSON fallback download
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

  // Send email via EmailJS (only if online)
  const sendEmail = () => {
    if (!userData) return;

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
        // If email fails for ANY reason, download JSON backup
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
        background: " #fff",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "80px",
          marginBottom: "20px",
          color: "#00d1ff",
        }}
      >
        ✔
      </div>

      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
        Congratulations, {userData?.name || "Player"}!
      </h1>

      <p
        style={{
          opacity: 0.85,
          fontSize: "1rem",
          marginBottom: "30px",
          lineHeight: 1.4,
        }}
      >
        You scored <b>{correctAnswers}</b> out of 4.
        <br />
        Here is your <b>50% OFF</b> coupon code:
      </p>

      {/* Coupon card (screenshot target) */}
      <div
        ref={cardRef}
        style={{
          padding: "18px 30px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(10px)",
          fontSize: "1.3rem",
          fontWeight: "600",
          letterSpacing: "1px",
          color: "#00d1ff",
          marginBottom: "12px",
          minWidth: "260px",
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
          }}
        >
          Code copied!
        </div>
      )}

      <p style={{ opacity: 0.6, fontSize: "0.9rem", maxWidth: "420px" }}>
        Your coupon and quiz details have been emailed to you and{" "}
        {ADMIN_EMAIL}.
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
