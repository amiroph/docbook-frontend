import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  pending:   { bg: "#FFF8E1", color: "#B7791F", label: "Pending" },
  confirmed: { bg: "#E6FFFA", color: "#2C7A7B", label: "Confirmed" },
  completed: { bg: "#F0FFF4", color: "#276749", label: "Completed" },
  cancelled: { bg: "#FFF5F5", color: "#C53030", label: "Cancelled" },
};

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel.");
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filtered = activeTab === "all"
    ? appointments
    : appointments.filter((a) => a.status === activeTab);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };

  const TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-4 shadow-sm"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Doc<span style={{ color: "#E8734A" }}>Book</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "#E8734A" }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{user?.name}</p>
              <p className="text-xs opacity-60 text-white capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-semibold border-2 border-white text-white transition hover:bg-white"
            onMouseEnter={e => { e.target.style.color = "#1A6B72"; e.target.style.backgroundColor = "#fff"; }}
            onMouseLeave={e => { e.target.style.color = "#fff"; e.target.style.backgroundColor = "transparent"; }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#2D3748" }}>
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#718096" }}>
              Manage your appointments from your dashboard
            </p>
          </div>
          <button
            onClick={() => navigate("/doctors")}
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 shadow"
            style={{ backgroundColor: "#E8734A" }}
          >
            + Book New Appointment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.all, color: "#1A6B72", icon: "📋" },
            { label: "Pending", value: counts.pending, color: "#B7791F", icon: "⏳" },
            { label: "Confirmed", value: counts.confirmed, color: "#2C7A7B", icon: "✅" },
            { label: "Completed", value: counts.completed, color: "#276749", icon: "🏁" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: "#718096" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition capitalize"
              style={{
                backgroundColor: activeTab === tab ? "#1A6B72" : "#ffffff",
                color: activeTab === tab ? "#ffffff" : "#718096",
                border: "1px solid #e2e8f0",
              }}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-20" style={{ color: "#718096" }}>
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold" style={{ color: "#2D3748" }}>No appointments found</p>
            <p className="text-sm mt-1 mb-6" style={{ color: "#718096" }}>
              {activeTab === "all"
                ? "You haven't booked any appointments yet."
                : `No ${activeTab} appointments.`}
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ backgroundColor: "#1A6B72" }}
            >
              Browse Doctors
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((appt) => {
              const status = STATUS_STYLES[appt.status] || STATUS_STYLES.pending;
              return (
                <div
                  key={appt.id}
                  className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: "#1A6B72" }}
                    >
                      {appt.doctor_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-base" style={{ color: "#2D3748" }}>
                        Dr. {appt.doctor_name}
                      </p>
                      <p className="text-sm" style={{ color: "#718096" }}>{appt.specialty}</p>
                      {appt.reason && (
                        <p className="text-xs mt-1" style={{ color: "#A0AEC0" }}>
                          Reason: {appt.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle */}
                  <div className="flex gap-6 text-sm" style={{ color: "#4A5568" }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#A0AEC0" }}>Date</p>
                      <p className="font-semibold mt-1">
                        {new Date(appt.appointment_date).toLocaleDateString("en-US", {
                          weekday: "short", year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#A0AEC0" }}>Time</p>
                      <p className="font-semibold mt-1">
                        {appt.appointment_time?.slice(0, 5)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#A0AEC0" }}>Fee</p>
                      <p className="font-semibold mt-1">${appt.consultation_fee}</p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                    {(appt.status === "pending" || appt.status === "confirmed") && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancelling === appt.id}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                        style={{ backgroundColor: "#FFF5F5", color: "#C53030", border: "1px solid #FED7D7" }}
                      >
                        {cancelling === appt.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}