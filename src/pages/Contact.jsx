import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CONTACT_INFO = [
  {
    icon: "📍",
    title: "Our Address",
    lines: ["123 Medical Center Drive", "Health District, London", "United Kingdom, EC1A 1BB"],
  },
  {
    icon: "📞",
    title: "Phone",
    lines: ["+44 20 7946 0958", "+44 20 7946 0959", "Mon–Fri, 9am – 6pm"],
  },
  {
    icon: "✉️",
    title: "Email",
    lines: ["support@docbook.com", "doctors@docbook.com", "We reply within 24 hours"],
  },
  {
    icon: "🕐",
    title: "Working Hours",
    lines: ["Monday – Friday: 9am – 6pm", "Saturday: 10am – 4pm", "Sunday: Closed"],
  },
];

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Simply register as a patient, browse our verified doctors, select a date and time that works for you, and confirm your booking. You'll receive an email confirmation instantly.",
  },
  {
    q: "How are doctors verified?",
    a: "Every doctor goes through a thorough verification process including license checks, credential validation, and approval by our medical team before appearing on the platform.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes! You can cancel any pending or confirmed appointment from your patient dashboard. Please cancel at least 24 hours in advance as a courtesy to the doctor.",
  },
  {
    q: "How do I register as a doctor?",
    a: "Click Register, select the Doctor option, fill in your details and specialty. Your account will be reviewed and approved by our admin team within 24–48 hours.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All your personal and medical information is encrypted and stored securely. We never share your data with third parties without your explicit consent.",
  },
];

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const NAV_LINKS = ["Home", "Doctors", "Services", "About", "Contact"];

  const handleNav = (link) => {
    if (link === "Home") navigate("/");
    else if (link === "Doctors") navigate("/doctors");
    else if (link === "Services") navigate("/services");
    else if (link === "About") navigate("/about");
    else if (link === "Contact") navigate("/contact");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputStyle = {
    border: "1px solid #e2e8f0",
    backgroundColor: "#F7F9FA",
    color: "#2D3748",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-4 sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
          Doc<span style={{ color: "#E8734A" }}>Book</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-white">
          {NAV_LINKS.map((link) => (
            <span
              key={link}
              onClick={() => handleNav(link)}
              className="cursor-pointer opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition"
            >
              {link}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => {
                  if (user.role === "admin") navigate("/admin/dashboard");
                  else if (user.role === "doctor") navigate("/doctor/dashboard");
                  else navigate("/patient/dashboard");
                }}
                className="text-white text-sm font-semibold opacity-80 hover:opacity-100 transition"
              >
                Dashboard
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: "#E8734A" }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg font-semibold border-2 text-white transition"
                style={{ borderColor: "#ffffff" }}
                onMouseEnter={e => { e.target.style.color = "#1A6B72"; e.target.style.backgroundColor = "#ffffff"; }}
                onMouseLeave={e => { e.target.style.color = "#ffffff"; e.target.style.backgroundColor = "transparent"; }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#E8734A" }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-10 py-24 text-center" style={{ backgroundColor: "#1A6B72" }}>
        <h1 className="text-5xl font-bold text-white">Contact Us</h1>
        <p className="mt-4 text-lg opacity-80 text-white max-w-xl mx-auto">
          Have a question or need help? We're here for you. Reach out and we'll get back to you within 24 hours.
        </p>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-6xl mx-auto px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {CONTACT_INFO.map((info) => (
            <div
              key={info.title}
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <div className="text-4xl mb-3">{info.icon}</div>
              <h3 className="font-bold mb-3" style={{ color: "#2D3748" }}>{info.title}</h3>
              {info.lines.map((line, i) => (
                <p
                  key={i}
                  className="text-sm"
                  style={{ color: i === info.lines.length - 1 ? "#A0AEC0" : "#4A5568" }}
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Form + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Form */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#2D3748" }}>
              Send Us a Message
            </h2>
            <p className="text-sm mb-6" style={{ color: "#718096" }}>
              Fill out the form and our team will get back to you shortly.
            </p>

            {submitted ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: "#F0FFF4", border: "1px solid #9AE6B4" }}
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#276749" }}>
                  Message Sent!
                </h3>
                <p className="text-sm" style={{ color: "#4A5568" }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "#1A6B72" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                    onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                    onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                    onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                  >
                    <option value="">Select a subject...</option>
                    <option>General Inquiry</option>
                    <option>Appointment Issue</option>
                    <option>Doctor Registration</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={5}
                    required
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                    onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
                  style={{ backgroundColor: "#E8734A" }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right Side — Map + Social */}
          <div className="flex flex-col gap-6">

            {/* Fake Map */}
            <div
              className="rounded-2xl overflow-hidden flex-1 flex flex-col items-center justify-center text-center p-10"
              style={{
                backgroundColor: "#E6FFFA",
                border: "1px solid #81E6D9",
                minHeight: "280px",
              }}
            >
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#2C7A7B" }}>
                123 Medical Center Drive
              </h3>
              <p className="text-sm" style={{ color: "#4A5568" }}>
                Health District, London, EC1A 1BB
              </p>
              <button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#1A6B72" }}
              >
                Open in Google Maps
              </button>
            </div>

            {/* Social Media */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <h3 className="font-bold mb-4" style={{ color: "#2D3748" }}>Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", icon: "📘", color: "#1877F2" },
                  { label: "Twitter", icon: "🐦", color: "#1DA1F2" },
                  { label: "Instagram", icon: "📸", color: "#E1306C" },
                  { label: "LinkedIn", icon: "💼", color: "#0A66C2" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition hover:opacity-80 flex flex-col items-center gap-1"
                    style={{ backgroundColor: "#F7F9FA", color: "#2D3748", border: "1px solid #e2e8f0" }}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-xs" style={{ color: "#718096" }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-10 py-20" style={{ backgroundColor: "#2D3748" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="mt-2 opacity-60 text-white">Quick answers to common questions</p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{ backgroundColor: "#3D4A5C", border: "1px solid #4A5568" }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <p className="font-semibold text-sm text-white">{faq.q}</p>
                  <span
                    className="text-lg transition-transform flex-shrink-0 ml-4"
                    style={{
                      color: "#E8734A",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    +
                  </span>
                </div>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#A0AEC0" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-20 text-center" style={{ backgroundColor: "#E8734A" }}>
        <h2 className="text-4xl font-bold text-white">Still Have Questions?</h2>
        <p className="mt-3 text-lg text-white opacity-80">
          Our support team is ready to help you Monday to Saturday.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/doctors")}
            className="px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
            style={{ backgroundColor: "#ffffff", color: "#E8734A" }}
          >
            Browse Doctors
          </button>
          <button
            onClick={() => user ? navigate("/patient/dashboard") : navigate("/register")}
            className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-white text-white transition"
            onMouseEnter={e => { e.target.style.backgroundColor = "#ffffff"; e.target.style.color = "#E8734A"; }}
            onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#ffffff"; }}
          >
            {user ? "My Dashboard" : "Get Started"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-10" style={{ backgroundColor: "#2D3748" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold text-white">
            Doc<span style={{ color: "#E8734A" }}>Book</span>
          </div>
          <p className="text-sm" style={{ color: "#A0AEC0" }}>© 2026 DocBook. All rights reserved.</p>
          <div className="flex gap-6 text-sm" style={{ color: "#A0AEC0" }}>
            <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/services")}>Services</span>
            <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/about")}>About</span>
            <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/contact")}>Contact</span>
          </div>
        </div>
      </footer>

    </div>
  );
}