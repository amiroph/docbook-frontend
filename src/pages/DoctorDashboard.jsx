import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  pending:   { bg: "#FFF8E1", color: "#B7791F", label: "Pending" },
  confirmed: { bg: "#E6FFFA", color: "#2C7A7B", label: "Confirmed" },
  completed: { bg: "#F0FFF4", color: "#276749", label: "Completed" },
  cancelled: { bg: "#FFF5F5", color: "#C53030", label: "Cancelled" },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");
  const [activeFilter, setActiveFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [availSaving, setAvailSaving] = useState(false);
  const [availMsg, setAvailMsg] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [apptRes, profileRes, availRes] = await Promise.all([
        API.get("/doctor/appointments"),
        API.get("/doctor/profile"),
        API.get("/doctor/availability"),
      ]);
      setAppointments(apptRes.data);
      setProfile(profileRes.data);
      setAvailability(availRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
  
    try {
      await API.put(`/doctor/appointments/${id}/status`, { status });
  
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleDay = (day) => {
    const exists = availability.find((a) => a.day_of_week === day);
    if (exists) {
      setAvailability(availability.filter((a) => a.day_of_week !== day));
    } else {
      setAvailability([...availability, {
        day_of_week: day, start_time: "09:00", end_time: "17:00"
      }]);
    }
  };

  const updateTime = (day, field, value) => {
    setAvailability(availability.map((a) =>
      a.day_of_week === day ? { ...a, [field]: value } : a
    ));
  };

  const saveAvailability = async () => {
    setAvailSaving(true);
    setAvailMsg("");
  
    try {
      await API.post("/doctor/availability", { availability });
  
      setAvailMsg("✅ Availability saved successfully!");
    } catch (err) {
      setAvailMsg("❌ Failed to save availability.");
    } finally {
      setAvailSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filtered = activeFilter === "all"
    ? appointments
    : appointments.filter((a) => a.status === activeFilter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(
    (a) => a.appointment_date?.slice(0, 10) === todayStr && a.status !== "cancelled"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F9FA" }}>
        <p style={{ color: "#718096" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 shadow-sm" style={{ backgroundColor: "#1A6B72" }}>
        <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
          Doc<span style={{ color: "#E8734A" }}>Book</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "#E8734A" }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-white opacity-60">Doctor</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-semibold border-2 border-white text-white transition"
            onMouseEnter={e => { e.target.style.color = "#1A6B72"; e.target.style.backgroundColor = "#fff"; }}
            onMouseLeave={e => { e.target.style.color = "#fff"; e.target.style.backgroundColor = "transparent"; }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#2D3748" }}>
            Welcome, Dr. {user?.name?.split(" ").slice(1).join(" ") || user?.name} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#718096" }}>
            {profile?.specialty} · {profile?.is_approved ? "✅ Approved" : "⏳ Pending Approval"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: counts.all, color: "#1A6B72", icon: "📋" },
            { label: "Today", value: todayAppts.length, color: "#E8734A", icon: "📅" },
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
        <div className="flex gap-3 mb-8">
          {["appointments", "availability", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition capitalize"
              style={{
                backgroundColor: activeTab === tab ? "#1A6B72" : "#ffffff",
                color: activeTab === tab ? "#ffffff" : "#718096",
                border: "1px solid #e2e8f0",
              }}
            >
              {tab === "appointments" ? "📋 Appointments" : tab === "availability" ? "🗓 Availability" : "👤 Profile"}
            </button>
          ))}
        </div>

        {/* ── APPOINTMENTS TAB ── */}
        {activeTab === "appointments" && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 flex-wrap mb-5">
              {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition capitalize"
                  style={{
                    backgroundColor: activeFilter === f ? "#1A6B72" : "#ffffff",
                    color: activeFilter === f ? "#ffffff" : "#718096",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {f} ({counts[f]})
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div
                className="rounded-2xl p-16 text-center"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                <div className="text-5xl mb-3">📭</div>
                <p className="font-semibold" style={{ color: "#2D3748" }}>No appointments found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((appt) => {
                  const s = STATUS_STYLES[appt.status] || STATUS_STYLES.pending;
                  return (
                    <div
                      key={appt.id}
                      className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                    >
                      {/* Patient Info */}
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: "#E8734A" }}
                        >
                          {appt.patient_name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: "#2D3748" }}>{appt.patient_name}</p>
                          <p className="text-xs" style={{ color: "#718096" }}>{appt.patient_email}</p>
                          {appt.patient_phone && (
                            <p className="text-xs" style={{ color: "#718096" }}>📞 {appt.patient_phone}</p>
                          )}
                          {appt.reason && (
                            <p className="text-xs mt-1" style={{ color: "#A0AEC0" }}>Reason: {appt.reason}</p>
                          )}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#A0AEC0" }}>Date</p>
                          <p className="font-semibold mt-1" style={{ color: "#2D3748" }}>
                            {new Date(appt.appointment_date).toLocaleDateString("en-US", {
                              weekday: "short", month: "short", day: "numeric"
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#A0AEC0" }}>Time</p>
                          <p className="font-semibold mt-1" style={{ color: "#2D3748" }}>
                            {appt.appointment_time?.slice(0, 5)}
                          </p>
                        </div>
                      </div>

                      {/* Status + Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: s.bg, color: s.color }}
                        >
                          {s.label}
                        </span>
                        {appt.status === "pending" && (
                          <button
                            onClick={() => updateStatus(appt.id, "confirmed")}
                            disabled={updatingId === appt.id}
                            className="px-3 py-1 rounded-xl text-xs font-semibold text-white transition hover:opacity-80"
                            style={{ backgroundColor: "#2C7A7B" }}
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(appt.id, "completed")}
                            disabled={updatingId === appt.id}
                            className="px-3 py-1 rounded-xl text-xs font-semibold text-white transition hover:opacity-80"
                            style={{ backgroundColor: "#276749" }}
                          >
                            Complete
                          </button>
                        )}
                        {(appt.status === "pending" || appt.status === "confirmed") && (
                          <button
                            onClick={() => updateStatus(appt.id, "cancelled")}
                            disabled={updatingId === appt.id}
                            className="px-3 py-1 rounded-xl text-xs font-semibold transition hover:opacity-80"
                            style={{ backgroundColor: "#FFF5F5", color: "#C53030", border: "1px solid #FED7D7" }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {activeTab === "availability" && (
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: "#2D3748" }}>Set Your Weekly Availability</h3>
            <p className="text-sm mb-6" style={{ color: "#718096" }}>
              Toggle days on/off and set your working hours for each day.
            </p>
            <div className="flex flex-col gap-4">
              {DAYS.map((day) => {
                const active = availability.find((a) => a.day_of_week === day);
                return (
                  <div key={day} className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={() => toggleDay(day)}
                      className="w-32 py-2 rounded-xl text-sm font-semibold transition"
                      style={{
                        backgroundColor: active ? "#1A6B72" : "#F7F9FA",
                        color: active ? "#ffffff" : "#718096",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {active ? "✓ " : ""}{day}
                    </button>
                    {active && (
                      <>
                        <input
                          type="time"
                          value={active.start_time?.slice(0, 5) || "09:00"}
                          onChange={(e) => updateTime(day, "start_time", e.target.value)}
                          className="px-3 py-2 rounded-xl text-sm outline-none"
                          style={{ border: "1px solid #e2e8f0", color: "#2D3748" }}
                        />
                        <span style={{ color: "#718096" }}>to</span>
                        <input
                          type="time"
                          value={active.end_time?.slice(0, 5) || "17:00"}
                          onChange={(e) => updateTime(day, "end_time", e.target.value)}
                          className="px-3 py-2 rounded-xl text-sm outline-none"
                          style={{ border: "1px solid #e2e8f0", color: "#2D3748" }}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {availMsg && (
              <p className="mt-4 text-sm font-semibold" style={{ color: availMsg.includes("✅") ? "#276749" : "#C53030" }}>
                {availMsg}
              </p>
            )}
            <button
              onClick={saveAvailability}
              disabled={availSaving}
              className="mt-6 px-8 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
              style={{ backgroundColor: availSaving ? "#A0AEC0" : "#E8734A" }}
            >
              {availSaving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <h3 className="font-bold text-lg mb-6" style={{ color: "#2D3748" }}>Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: profile?.name },
                { label: "Email", value: profile?.email },
                { label: "Phone", value: profile?.phone || "Not set" },
                { label: "Specialty", value: profile?.specialty },
                { label: "Experience", value: `${profile?.experience_years} years` },
                { label: "Consultation Fee", value: `$${parseFloat(profile?.consultation_fee || 0).toFixed(2)}` },
                { label: "Rating", value: `${parseFloat(profile?.rating || 0).toFixed(1)} ⭐ (${profile?.total_reviews} reviews)` },
                { label: "Status", value: profile?.is_approved ? "✅ Approved" : "⏳ Pending Approval" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#A0AEC0" }}>
                    {item.label}
                  </p>
                  <p className="font-semibold" style={{ color: "#2D3748" }}>{item.value}</p>
                </div>
              ))}
            </div>
            {profile?.bio && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#A0AEC0" }}>Bio</p>
                <p style={{ color: "#4A5568" }}>{profile.bio}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}