import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Left Panel */}
      <div
        className="hidden md:flex flex-col justify-center items-center w-1/2 px-16"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div className="text-7xl mb-6">🩺</div>
        <h2 className="text-4xl font-bold text-white text-center leading-tight">
          Welcome Back to <br />
          <span style={{ color: "#E8734A" }}>DocBook</span>
        </h2>
        <p className="text-white opacity-70 mt-4 text-center text-lg">
          Your trusted platform for booking doctor appointments quickly and easily.
        </p>
        <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
          {["Verified Doctors", "Instant Confirmation", "Easy Rescheduling"].map((item) => (
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
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <div
          className="w-full max-w-md rounded-2xl p-10 shadow-lg"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Logo */}
          <div className="text-2xl font-bold mb-8 text-center">
            Doc<span style={{ color: "#E8734A" }}>Book</span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: "#2D3748" }}>Sign in</h1>
          <p className="text-sm mb-6" style={{ color: "#718096" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1A6B72" }} className="font-semibold hover:underline">
              Register here
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div
              className="text-sm px-4 py-3 rounded-lg mb-4"
              style={{ backgroundColor: "#FFF5F5", color: "#C53030", border: "1px solid #FED7D7" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#F7F9FA", color: "#2D3748" }}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#F7F9FA", color: "#2D3748" }}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
              <div className="text-right mt-1">
                <span className="text-xs cursor-pointer hover:underline" style={{ color: "#1A6B72" }}>
                  Forgot password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
              style={{ backgroundColor: loading ? "#A0AEC0" : "#1A6B72" }}
            >
              {loading ? "Signing in..." : "Sign In"}
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