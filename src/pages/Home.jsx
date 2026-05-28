import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = ["Home", "Doctors", "Services", "About", "Contact"];

const SPECIALTIES = [
  { icon: "🫀", name: "Cardiology" },
  { icon: "🧠", name: "Neurology" },
  { icon: "🦷", name: "Dentistry" },
  { icon: "👁️", name: "Ophthalmology" },
  { icon: "🦴", name: "Orthopedics" },
  { icon: "🧒", name: "Pediatrics" },
  { icon: "🩺", name: "General" },
  { icon: "🌸", name: "Dermatology" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Find a Doctor", desc: "Search by specialty or doctor name and browse verified profiles." },
  { step: "02", title: "Book a Slot", desc: "Pick a date and time that works for you from the doctor's availability." },
  { step: "03", title: "Get Confirmation", desc: "Receive an instant email confirmation with your appointment details." },
];

const TESTIMONIALS = [
  { name: "Sarah M.", role: "Patient", text: "Booking my appointment was so easy. Found the right doctor in minutes!" },
  { name: "James K.", role: "Patient", text: "I love how I get an email confirmation right away. Very professional." },
  { name: "Amina T.", role: "Patient", text: "The best platform I've used. Clean, fast, and reliable." },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, specialties: 0 });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#F7F9FA", color: "#2D3748" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-4 sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div className="text-2xl font-bold text-white tracking-tight">
          Doc<span style={{ color: "#E8734A" }}>Book</span>
        </div>

        <ul className="hidden md:flex gap-8 font-medium text-white">
          {NAV_LINKS.map((link) => (
            <li
              key={link}
              className="cursor-pointer transition opacity-80 hover:opacity-100 hover:underline underline-offset-4"
              onClick={() => {
                if (link === "Doctors") navigate("/doctors");
                else if (link === "Services") navigate("/services");
                else if (link === "About") navigate("/about");
                else if (link === "Contact") navigate("/contact");
              }}
            >
              {link}
            </li>
          ))}
        </ul>

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
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                style={{ backgroundColor: "#E8734A" }}
                onClick={() => {
                  if (user.role === "admin") navigate("/admin/dashboard");
                  else if (user.role === "doctor") navigate("/doctor/dashboard");
                  else navigate("/patient/dashboard");
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button
                className="px-4 py-2 rounded-lg font-semibold border-2 text-white transition"
                style={{ borderColor: "#ffffff" }}
                onMouseEnter={e => { e.target.style.color = "#1A6B72"; e.target.style.backgroundColor = "#ffffff"; }}
                onMouseLeave={e => { e.target.style.color = "#ffffff"; e.target.style.backgroundColor = "transparent"; }}
                onClick={() => { logout(); navigate("/"); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button
                  className="px-4 py-2 rounded-lg font-semibold border-2 text-white transition"
                  style={{ borderColor: "#ffffff" }}
                  onMouseEnter={e => { e.target.style.color = "#1A6B72"; e.target.style.backgroundColor = "#ffffff"; }}
                  onMouseLeave={e => { e.target.style.color = "#ffffff"; e.target.style.backgroundColor = "transparent"; }}
                >
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="px-4 py-2 rounded-lg font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: "#E8734A", color: "#ffffff" }}
                >
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-10 py-24 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-12">
        <div className="max-w-lg">
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: "#E8734A22", color: "#E8734A" }}
          >
            Trusted by 1,200+ patients
          </span>
          <h1 className="text-5xl font-bold mt-5 leading-tight" style={{ color: "#2D3748" }}>
            Your Health, <br />
            <span style={{ color: "#1A6B72" }}>Our Priority</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: "#4A5568" }}>
            Find verified doctors, check real-time availability, and book appointments in minutes — all from one place.
          </p>

          {/* Search bar */}
          <div
            className="flex items-center mt-8 rounded-xl overflow-hidden shadow-md"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <input
              type="text"
              placeholder="Search by doctor or specialty..."
              className="flex-1 px-5 py-4 text-base outline-none"
              style={{ backgroundColor: "transparent", color: "#2D3748" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  navigate(`/doctors?search=${e.target.value}`);
                }
              }}
            />
            <button
              className="px-6 py-4 font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "#1A6B72" }}
              onClick={() => navigate("/doctors")}
            >
              Search
            </button>
          </div>

          <div className="flex gap-6 mt-6 text-sm" style={{ color: "#4A5568" }}>
            <span>✅ Free to use</span>
            <span>✅ Verified doctors</span>
            <span>✅ Instant confirmation</span>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 rounded-xl text-lg font-semibold text-white shadow transition hover:opacity-90"
              style={{ backgroundColor: "#E8734A" }}
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 rounded-xl text-lg font-semibold border-2 transition hover:opacity-80"
              style={{ borderColor: "#1A6B72", color: "#1A6B72" }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Hero visual */}
        <div
          className="rounded-3xl p-10 flex flex-col items-center justify-center shadow-lg"
          style={{ backgroundColor: "#1A6B72", minWidth: "280px" }}
        >
          <div className="text-8xl">🩺</div>
          <p className="mt-4 text-white font-semibold text-lg text-center">Book in 3 easy steps</p>
          <p className="text-sm mt-1 text-center opacity-70 text-white">No queues. No hassle.</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: "#2D3748" }} className="py-14">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold" style={{ color: "#E8734A" }}>{stats.doctors}+</p>
            <p className="mt-2 text-sm uppercase tracking-widest" style={{ color: "#A0AEC0" }}>Verified Doctors</p>
          </div>
          <div>
            <p className="text-4xl font-bold" style={{ color: "#E8734A" }}>{stats.patients}+</p>
            <p className="mt-2 text-sm uppercase tracking-widest" style={{ color: "#A0AEC0" }}>Happy Patients</p>
          </div>
          <div>
            <p className="text-4xl font-bold" style={{ color: "#E8734A" }}>{stats.specialties}+</p>
            <p className="mt-2 text-sm uppercase tracking-widest" style={{ color: "#A0AEC0" }}>Specialties</p>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="max-w-6xl mx-auto px-10 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: "#2D3748" }}>Browse by Specialty</h2>
          <p className="mt-2" style={{ color: "#718096" }}>Find the right doctor for your specific health needs</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {SPECIALTIES.map((s) => (
            <div
              key={s.name}
              onClick={() => navigate(`/doctors?specialty=${s.name}`)}
              className="flex flex-col items-center p-6 rounded-2xl cursor-pointer transition hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", transition: "all 0.2s ease" }}
            >
              <span className="text-4xl">{s.icon}</span>
              <p className="mt-3 font-semibold text-sm" style={{ color: "#2D3748" }}>{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-10 py-20" style={{ backgroundColor: "#1A6B72" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="mt-2 opacity-70 text-white">Simple steps to get the care you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#ffffff" }}>
                <div className="text-3xl font-bold mb-3" style={{ color: "#E8734A" }}>{item.step}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#2D3748" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#718096" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-10 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: "#2D3748" }}>What Patients Say</h2>
          <p className="mt-2" style={{ color: "#718096" }}>Real experiences from real patients</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A5568" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: "#1A6B72" }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#2D3748" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#A0AEC0" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-20 text-center" style={{ backgroundColor: "#E8734A" }}>
        <h2 className="text-4xl font-bold text-white">Ready to Book Your Appointment?</h2>
        <p className="mt-3 text-lg opacity-80 text-white">
          Join thousands of patients who trust DocBook every day.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => user ? navigate("/doctors") : navigate("/register")}
            className="px-8 py-4 font-bold text-lg rounded-xl shadow transition hover:opacity-90"
            style={{ backgroundColor: "#ffffff", color: "#E8734A" }}
          >
            {user ? "Book Appointment" : "Get Started — It's Free"}
          </button>
          <button
            onClick={() => navigate("/doctors")}
            className="px-8 py-4 font-bold text-lg rounded-xl border-2 border-white text-white transition"
            onMouseEnter={e => { e.target.style.color = "#E8734A"; e.target.style.backgroundColor = "#ffffff"; }}
            onMouseLeave={e => { e.target.style.color = "#ffffff"; e.target.style.backgroundColor = "transparent"; }}
          >
            Browse Doctors
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
            <span className="cursor-pointer hover:text-white transition">Privacy</span>
            <span className="cursor-pointer hover:text-white transition">Terms</span>
            <span className="cursor-pointer hover:text-white transition">Contact</span>
          </div>
        </div>
      </footer>

    </div>
  );
}