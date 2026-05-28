import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TEAM = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Chief Medical Officer",
    specialty: "Cardiology",
    icon: "👩‍⚕️",
    bio: "20+ years of clinical experience. Leads our medical quality assurance and doctor verification program.",
  },
  {
    name: "James Okafor",
    role: "CEO & Co-Founder",
    specialty: "Healthcare Technology",
    icon: "👨‍💼",
    bio: "Former hospital administrator turned tech entrepreneur. Built DocBook to solve the appointment booking crisis.",
  },
  {
    name: "Dr. Priya Nair",
    role: "Head of Patient Experience",
    specialty: "General Practice",
    icon: "👩‍💼",
    bio: "Passionate about making healthcare accessible. Oversees patient satisfaction and platform usability.",
  },
  {
    name: "Marcus Chen",
    role: "CTO & Co-Founder",
    specialty: "Software Engineering",
    icon: "👨‍💻",
    bio: "Full-stack engineer with 15 years of experience building scalable healthcare platforms.",
  },
];

const MILESTONES = [
  { year: "2020", title: "DocBook Founded", desc: "Started with a simple idea — make booking a doctor as easy as booking a restaurant." },
  { year: "2021", title: "First 100 Doctors", desc: "Reached our first milestone of 100 verified doctors across 8 specialties." },
  { year: "2022", title: "10,000 Patients", desc: "Crossed 10,000 registered patients and launched our email confirmation system." },
  { year: "2023", title: "Expanded Nationally", desc: "Expanded to cover doctors across the entire country with real-time availability." },
  { year: "2024", title: "Reviews Launched", desc: "Introduced verified patient reviews to help patients make informed decisions." },
  { year: "2026", title: "1,200+ Happy Patients", desc: "Serving over 1,200 patients monthly with 50+ verified doctors and growing." },
];

const VALUES = [
  { icon: "❤️", title: "Patient First", desc: "Every decision we make starts with one question — is this good for the patient?" },
  { icon: "🔬", title: "Medical Integrity", desc: "We verify every doctor thoroughly. No shortcuts, no compromises on quality." },
  { icon: "🌍", title: "Accessibility", desc: "Healthcare should be accessible to everyone, regardless of location or background." },
  { icon: "🔒", title: "Privacy", desc: "Your health data belongs to you. We protect it with the highest security standards." },
];

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const NAV_LINKS = ["Home", "Doctors", "Services", "About", "Contact"];

  const handleNav = (link) => {
    if (link === "Home") navigate("/");
    else if (link === "Doctors") navigate("/doctors");
    else if (link === "Services") navigate("/services");
    else if (link === "About") navigate("/about");
    else if (link === "Contact") navigate("/contact");
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
        <h1 className="text-5xl font-bold text-white">About DocBook</h1>
        <p className="mt-4 text-lg opacity-80 text-white max-w-2xl mx-auto leading-relaxed">
          We're on a mission to make quality healthcare accessible to everyone — by connecting patients with verified doctors in minutes, not days.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "#E8734A22", color: "#E8734A" }}
            >
              Our Mission
            </span>
            <h2 className="text-3xl font-bold mt-4 leading-tight" style={{ color: "#2D3748" }}>
              Healthcare should be simple, fast, and available to everyone
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "#4A5568" }}>
              DocBook was born out of frustration. Long waiting times, unanswered phone calls, and confusing appointment systems were making people delay getting the care they needed.
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: "#4A5568" }}>
              We built DocBook to change that — a platform where you can find a verified doctor, check their real availability, and book a confirmed appointment in under 2 minutes.
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="mt-6 px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "#1A6B72" }}
            >
              Meet Our Doctors
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "50+", label: "Verified Doctors" },
              { value: "1,200+", label: "Happy Patients" },
              { value: "8", label: "Specialties" },
              { value: "2 min", label: "Avg Booking Time" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                <p className="text-3xl font-bold" style={{ color: "#E8734A" }}>{stat.value}</p>
                <p className="text-sm mt-1" style={{ color: "#718096" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-10 py-20" style={{ backgroundColor: "#2D3748" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Our Values</h2>
            <p className="mt-2 opacity-60 text-white">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#3D4A5C", border: "1px solid #4A5568" }}
              >
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A0AEC0" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-10 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: "#2D3748" }}>Our Journey</h2>
          <p className="mt-2" style={{ color: "#718096" }}>From a small idea to a growing healthcare platform</p>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: "#e2e8f0" }}
          />
          <div className="flex flex-col gap-8">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0 z-10"
                  style={{ backgroundColor: i % 2 === 0 ? "#1A6B72" : "#E8734A" }}
                >
                  {m.year.slice(2)}
                </div>
                <div
                  className="flex-1 rounded-2xl p-5"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold" style={{ color: "#1A6B72" }}>{m.year}</span>
                    <h3 className="font-bold" style={{ color: "#2D3748" }}>{m.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#718096" }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-10 py-20" style={{ backgroundColor: "#1A6B72" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Meet the Team</h2>
            <p className="mt-2 opacity-70 text-white">The people behind DocBook</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="text-5xl mb-4">{member.icon}</div>
                <h3 className="font-bold" style={{ color: "#2D3748" }}>{member.name}</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: "#E8734A" }}>{member.role}</p>
                <p className="text-xs mt-1 mb-3" style={{ color: "#1A6B72" }}>{member.specialty}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#718096" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-20 text-center" style={{ backgroundColor: "#E8734A" }}>
        <h2 className="text-4xl font-bold text-white">Join the DocBook Community</h2>
        <p className="mt-3 text-lg text-white opacity-80">
          Whether you're a patient or a doctor — there's a place for you on DocBook.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
            style={{ backgroundColor: "#ffffff", color: "#E8734A" }}
          >
            Join as Patient
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-white text-white transition"
            onMouseEnter={e => { e.target.style.backgroundColor = "#ffffff"; e.target.style.color = "#E8734A"; }}
            onMouseLeave={e => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#ffffff"; }}
          >
            Join as Doctor
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