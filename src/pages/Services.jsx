import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SERVICES = [
  {
    icon: "🩺",
    title: "General Consultation",
    desc: "Meet with a general practitioner for routine checkups, referrals, prescriptions, and everyday health concerns.",
    features: ["Full body checkup", "Prescription renewal", "Health screening", "Referral letters"],
  },
  {
    icon: "🫀",
    title: "Cardiology",
    desc: "Expert heart care from certified cardiologists. Diagnosis and treatment of heart conditions, hypertension, and more.",
    features: ["ECG & heart monitoring", "Hypertension management", "Cholesterol screening", "Heart disease treatment"],
  },
  {
    icon: "🧠",
    title: "Neurology",
    desc: "Specialized care for brain and nervous system disorders including migraines, epilepsy, and stroke recovery.",
    features: ["Migraine treatment", "Epilepsy management", "Stroke rehabilitation", "Memory disorders"],
  },
  {
    icon: "🦷",
    title: "Dentistry",
    desc: "Complete dental care from routine cleanings to complex procedures — all in a comfortable environment.",
    features: ["Teeth cleaning", "Fillings & extractions", "Teeth whitening", "Orthodontics"],
  },
  {
    icon: "👁️",
    title: "Ophthalmology",
    desc: "Comprehensive eye care services including vision testing, glasses prescriptions, and surgical consultations.",
    features: ["Vision testing", "Glasses & contact lens", "Cataract consultation", "Glaucoma screening"],
  },
  {
    icon: "🦴",
    title: "Orthopedics",
    desc: "Treatment of bone, joint, and muscle conditions. From sports injuries to joint replacement consultations.",
    features: ["Sports injury treatment", "Joint pain management", "Fracture care", "Physiotherapy referral"],
  },
  {
    icon: "🧒",
    title: "Pediatrics",
    desc: "Dedicated care for infants, children, and teenagers. Vaccinations, growth monitoring, and more.",
    features: ["Vaccination programs", "Growth monitoring", "Newborn care", "Child nutrition advice"],
  },
  {
    icon: "🌸",
    title: "Dermatology",
    desc: "Expert treatment for skin, hair, and nail conditions. From acne to eczema and cosmetic dermatology.",
    features: ["Acne treatment", "Eczema & psoriasis", "Skin cancer screening", "Cosmetic procedures"],
  },
];

const WHY_US = [
  { icon: "✅", title: "Verified Doctors", desc: "Every doctor on our platform is verified, licensed, and approved by our medical team." },
  { icon: "⚡", title: "Instant Booking", desc: "Book an appointment in under 2 minutes — no phone calls, no waiting on hold." },
  { icon: "🔒", title: "Private & Secure", desc: "Your medical information is encrypted and never shared without your consent." },
  { icon: "💬", title: "Real Reviews", desc: "Read honest reviews from real patients to help you choose the right doctor." },
  { icon: "📅", title: "Flexible Scheduling", desc: "Find appointments that fit your schedule, including evenings and weekends." },
  { icon: "📧", title: "Email Confirmations", desc: "Get instant email confirmation and reminders for every appointment you book." },
];

export default function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-4 sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Doc<span style={{ color: "#E8734A" }}>Book</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-white">
          {["Home", "Doctors", "Services", "About", "Contact"].map((link) => (
            <span
              key={link}
              className="cursor-pointer opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition"
              onClick={() => {
                if (link === "Home") navigate("/");
                else if (link === "Doctors") navigate("/doctors");
                else if (link === "Services") navigate("/services");
                else if (link === "About") navigate("/about");
                else if (link === "Contact") navigate("/contact");
              }}
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
      <section className="px-10 py-20 text-center" style={{ backgroundColor: "#1A6B72" }}>
        <h1 className="text-5xl font-bold text-white">Our Services</h1>
        <p className="mt-4 text-lg opacity-80 text-white max-w-2xl mx-auto">
          From general checkups to specialized care — DocBook connects you with the right doctor for every health need.
        </p>
        <button
          onClick={() => navigate("/doctors")}
          className="mt-8 px-8 py-3 rounded-xl font-bold text-lg transition hover:opacity-90"
          style={{ backgroundColor: "#E8734A", color: "#ffffff" }}
        >
          Browse All Doctors
        </button>
      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-10 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: "#2D3748" }}>Medical Specialties</h2>
          <p className="mt-2" style={{ color: "#718096" }}>
            Explore our wide range of medical services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl p-6 transition hover:shadow-md hover:-translate-y-1"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#2D3748" }}>
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#718096" }}>
                {service.desc}
              </p>
              <ul className="flex flex-col gap-1 mb-5">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#4A5568" }}>
                    <span style={{ color: "#1A6B72", fontWeight: "bold" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(`/doctors?specialty=${service.title}`)}
                className="w-full py-2 rounded-xl text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: "#E8734A22", color: "#E8734A", border: "1px solid #E8734A" }}
              >
                Find {service.title} Doctors
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="px-10 py-20" style={{ backgroundColor: "#2D3748" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Why Choose DocBook?</h2>
            <p className="mt-2 opacity-60 text-white">Everything you need for a smooth healthcare experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#3D4A5C", border: "1px solid #4A5568" }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A0AEC0" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-20 text-center" style={{ backgroundColor: "#E8734A" }}>
        <h2 className="text-4xl font-bold text-white">Ready to Get Started?</h2>
        <p className="mt-3 text-lg text-white opacity-80">
          Book your first appointment today — it only takes 2 minutes.
        </p>
        <button
          onClick={() => user ? navigate("/doctors") : navigate("/register")}
          className="mt-8 px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90"
          style={{ backgroundColor: "#ffffff", color: "#E8734A" }}
        >
          {user ? "Book Appointment" : "Create Free Account"}
        </button>
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