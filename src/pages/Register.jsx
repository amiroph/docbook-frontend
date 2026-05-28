import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    phone: "",
    specialty: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: "1px solid #e2e8f0",
    backgroundColor: "#F7F9FA",
    color: "#2D3748",
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Left Panel */}
      <div
        className="hidden md:flex flex-col justify-center items-center w-1/2 px-16"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div className="text-7xl mb-6">🏥</div>
        <h2 className="text-4xl font-bold text-white text-center leading-tight">
          Join <span style={{ color: "#E8734A" }}>DocBook</span> Today
        </h2>
        <p className="text-white opacity-70 mt-4 text-center text-lg">
          Create your account and start booking appointments with top doctors near you.
        </p>
        <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
          {["Free to Register", "Book in Minutes", "Secure & Private"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: "#E8734A", color: "#fff" }}
              >
                ✓
              </div>
              <span className="text-white opacity-90 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-10">
        <div
          className="w-full max-w-md rounded-2xl p-10 shadow-lg"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="text-2xl font-bold mb-6 text-center">
            Doc<span style={{ color: "#E8734A" }}>Book</span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: "#2D3748" }}>Create Account</h1>
          <p className="text-sm mb-6" style={{ color: "#718096" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1A6B72" }} className="font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {/* Role Selector */}
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: "1px solid #e2e8f0" }}>
            {["patient", "doctor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className="flex-1 py-2 text-sm font-semibold transition capitalize"
                style={{
                  backgroundColor: form.role === r ? "#1A6B72" : "#ffffff",
                  color: form.role === r ? "#ffffff" : "#718096",
                }}
              >
                {r === "patient" ? "🙋 Patient" : "👨‍⚕️ Doctor"}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-lg mb-4"
              style={{ backgroundColor: "#FFF5F5", color: "#C53030", border: "1px solid #FED7D7" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

           {/* Doctor only fields */}
{form.role === "doctor" && (
  <>
    <div>
      <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Specialty</label>
      <select
        name="specialty"
        value={form.specialty}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={inputStyle}
        onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
        onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
      >
        <option value="">Select specialty...</option>
        <option>Cardiology</option>
        <option>Neurology</option>
        <option>Dentistry</option>
        <option>Ophthalmology</option>
        <option>Orthopedics</option>
        <option>Pediatrics</option>
        <option>General</option>
        <option>Dermatology</option>
      </select>
    </div>

    <div>
      <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Years of Experience</label>
      <input
        type="number"
        name="experience_years"
        value={form.experience_years}
        onChange={handleChange}
        placeholder="e.g. 5"
        min="0"
        max="50"
        required
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={inputStyle}
        onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
        onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
      />
    </div>

    <div>
      <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Consultation Fee ($)</label>
      <input
        type="number"
        name="consultation_fee"
        value={form.consultation_fee}
        onChange={handleChange}
        placeholder="e.g. 100"
        min="0"
        required
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={inputStyle}
        onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
        onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
      />
    </div>

    <div>
      <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
        Bio <span style={{ color: "#A0AEC0", fontWeight: 400 }}>(optional)</span>
      </label>
      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Brief description of your experience and expertise..."
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
        style={inputStyle}
        onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
        onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
      />
    </div>
  </>
)}

            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 mt-2"
              style={{ backgroundColor: loading ? "#A0AEC0" : "#E8734A" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm hover:underline" style={{ color: "#718096" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}