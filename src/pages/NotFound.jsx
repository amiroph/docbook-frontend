import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHome = () => {
    if (!user) navigate("/");
    else if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "doctor") navigate("/doctor/dashboard");
    else navigate("/patient/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-8"
      style={{ backgroundColor: "#F7F9FA" }}
    >
      <div className="text-8xl mb-6">🏥</div>
      <h1 className="text-6xl font-bold mb-3" style={{ color: "#1A6B72" }}>404</h1>
      <h2 className="text-2xl font-bold mb-3" style={{ color: "#2D3748" }}>
        Page Not Found
      </h2>
      <p className="text-base mb-8 max-w-md" style={{ color: "#718096" }}>
        The page you're looking for doesn't exist or you don't have permission to access it.
      </p>
      <button
        onClick={handleHome}
        className="px-8 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
        style={{ backgroundColor: "#1A6B72" }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}