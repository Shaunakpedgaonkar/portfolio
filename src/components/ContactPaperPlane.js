import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

const ContactPaperPlane = () => {
  const [animationData, setAnimationData] = useState(null);
  const [phase, setPhase] = useState("flyingIn"); // 'flyingIn' | 'unfolded' | 'flyingOut'
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/Animation - 1747925267667.json")
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);

  // Simulate plane arrival
  useEffect(() => {
    if (phase === "flyingIn") {
      const timer = setTimeout(() => setPhase("unfolded"), 2000);
      return () => clearTimeout(timer);
    }
    if (phase === "flyingOut") {
      const timer = setTimeout(() => setPhase("flyingIn"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = (e) => {
    e.preventDefault();
    setPhase("flyingOut");
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className={`contact-plane-lottie-bg ${phase}`}>
      {animationData && (
        <Lottie
          animationData={animationData}
          loop={phase !== "flyingOut"}
          style={{
            width: "400px",
            height: "400px",
            margin: "0 auto",
            pointerEvents: "none",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        />
      )}
      {phase === "unfolded" && (
        <form
          className="paper-form"
          onSubmit={handleSend}
          style={{
            position: "relative",
            zIndex: 2,
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "320px",
            margin: "0 auto",
            animation: "unfold 0.6s",
          }}
        >
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default ContactPaperPlane;