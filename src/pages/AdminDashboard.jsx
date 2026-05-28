import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  pending:   { bg: "#FFF8E1", color: "#B7791F" },
  confirmed: { bg: "#E6FFFA", color: "#2C7A7B" },
  completed: { bg: "#F0FFF4", color: "#276749" },
  cancelled: { bg: "#FFF5F5", color: "#C53030" },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, doctorsRes, patientsRes, apptsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", { headers }),
        axios.get("http://localhost:5000/api/admin/doctors", { headers }),
        axios.get("http://localhost:5000/api/admin/patients", { headers }),
        axios.get("http://localhost:5000/api/admin/appointments", { headers }),
      ]);
      setStats(statsRes.data);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
      setAppointments(apptsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId, approve) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/doctors/${doctorId}/approve`,
        { approve },
        { headers }
      );
      setDoctors((prev) =>
        prev.map((d) => d.doctor_id === doctorId ? { ...d, is_approved: approve } : d)
      );
      setStats((prev) => ({
        ...prev,
        pendingDoctors: approve ? prev.pendingDoctors - 1 : prev.pendingDoctors + 1,
        totalDoctors: approve ? prev.totalDoctors : prev.totalDoctors,
      }));
    } catch (err) {
      alert("Failed to update doctor status");
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/toggle`,
        {},
        { headers }
      );
      setPatients((prev) =>
        prev.map((p) => p.id === userId ? { ...p, is_active: !p.is_active } : p)
      );
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const TABS = [
    { key: "overview", label: "📊 Overview" },
    { key: "doctors", label: "👨‍⚕️ Doctors" },
    { key: "patients", label: "🙋 Patients" },
    { key: "appointments", label: "📋 Appointments" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-4 shadow-sm"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
          Doc<span style={{ color: "#E8734A" }}>Book</span>
          <span
            className="ml-2 text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: "#E8734A", color: "#fff" }}
          >
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "#E8734A" }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <p className="text-white text-sm font-semibold">{user?.name}</p>
          <button
            onClick={() => { logout(); navigate("/"); }}
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
          <h1 className="text-3xl font-bold" style={{ color: "#2D3748" }}>Admin Dashboard</h1>
          <p className="mt-1 text-sm" style={{ color: "#718096" }}>
            Manage doctors, patients, and appointments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                backgroundColor: activeTab === tab.key ? "#1A6B72" : "#ffffff",
                color: activeTab === tab.key ? "#ffffff" : "#718096",
                border: "1px solid #e2e8f0",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: "#718096" }}>Loading...</div>
        ) : (
          <>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                  {[
                    { label: "Total Patients", value: stats.totalPatients, icon: "🙋", color: "#1A6B72" },
                    { label: "Total Doctors", value: stats.totalDoctors, icon: "👨‍⚕️", color: "#2C7A7B" },
                    { label: "Pending Approvals", value: stats.pendingDoctors, icon: "⏳", color: "#B7791F" },
                    { label: "Total Appointments", value: stats.totalAppointments, icon: "📋", color: "#553C9A" },
                    { label: "Today's Appointments", value: stats.todayAppointments, icon: "📅", color: "#E8734A" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-6 shadow-sm"
                      style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                    >
                      <div className="text-3xl mb-3">{s.icon}</div>
                      <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-sm mt-1" style={{ color: "#718096" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Pending doctors alert */}
                {stats.pendingDoctors > 0 && (
                  <div
                    className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ backgroundColor: "#FFF8E1", border: "1px solid #F6E05E" }}
                  >
                    <div>
                      <p className="font-bold" style={{ color: "#B7791F" }}>
                        ⚠️ {stats.pendingDoctors} doctor{stats.pendingDoctors > 1 ? "s" : ""} waiting for approval
                      </p>
                      <p className="text-sm mt-1" style={{ color: "#975A16" }}>
                        Review and approve doctor registrations to let them accept appointments.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("doctors")}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 flex-shrink-0"
                      style={{ backgroundColor: "#B7791F" }}
                    >
                      Review Now
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Doctors Tab */}
            {activeTab === "doctors" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm mb-2" style={{ color: "#718096" }}>
                  {doctors.length} doctors registered · {stats.pendingDoctors} pending approval
                </p>
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{
                      backgroundColor: "#ffffff",
                      border: `1px solid ${doc.is_approved ? "#e2e8f0" : "#F6E05E"}`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                        style={{ backgroundColor: "#1A6B72" }}
                      >
                        {doc.name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "#2D3748" }}>{doc.name}</p>
                        <p className="text-sm" style={{ color: "#1A6B72" }}>{doc.specialty}</p>
                        <p className="text-xs" style={{ color: "#718096" }}>{doc.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-5 text-sm">
                      <div>
                        <p className="text-xs" style={{ color: "#A0AEC0" }}>Experience</p>
                        <p className="font-semibold" style={{ color: "#2D3748" }}>{doc.experience_years} yrs</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#A0AEC0" }}>Fee</p>
                        <p className="font-semibold" style={{ color: "#2D3748" }}>${doc.consultation_fee}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#A0AEC0" }}>Rating</p>
                        <p className="font-semibold" style={{ color: "#2D3748" }}>{doc.rating?.toFixed(1)} ⭐</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: doc.is_approved ? "#F0FFF4" : "#FFF8E1",
                          color: doc.is_approved ? "#276749" : "#B7791F",
                        }}
                      >
                        {doc.is_approved ? "Approved" : "Pending"}
                      </span>
                      {!doc.is_approved ? (
                        <button
                          onClick={() => handleApprove(doc.doctor_id, true)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-90"
                          style={{ backgroundColor: "#276749" }}
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(doc.doctor_id, false)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                          style={{ backgroundColor: "#FFF5F5", color: "#C53030", border: "1px solid #FED7D7" }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === "patients" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm mb-2" style={{ color: "#718096" }}>
                  {patients.length} patients registered
                </p>
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: patient.is_active ? "#1A6B72" : "#A0AEC0" }}
                      >
                        {patient.name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "#2D3748" }}>{patient.name}</p>
                        <p className="text-xs" style={{ color: "#718096" }}>{patient.email}</p>
                        {patient.phone && (
                          <p className="text-xs" style={{ color: "#718096" }}>📞 {patient.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-5 text-sm">
                      <div>
                        <p className="text-xs" style={{ color: "#A0AEC0" }}>Appointments</p>
                        <p className="font-semibold" style={{ color: "#2D3748" }}>{patient.total_appointments}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#A0AEC0" }}>Joined</p>
                        <p className="font-semibold" style={{ color: "#2D3748" }}>
                          {new Date(patient.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: patient.is_active ? "#F0FFF4" : "#FFF5F5",
                          color: patient.is_active ? "#276749" : "#C53030",
                        }}
                      >
                        {patient.is_active ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => handleToggleUser(patient.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                        style={{
                          backgroundColor: patient.is_active ? "#FFF5F5" : "#F0FFF4",
                          color: patient.is_active ? "#C53030" : "#276749",
                          border: `1px solid ${patient.is_active ? "#FED7D7" : "#9AE6B4"}`,
                        }}
                      >
                        {patient.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm mb-2" style={{ color: "#718096" }}>
                  Showing last 50 appointments
                </p>
                {appointments.map((appt) => {
                  const s = STATUS_STYLES[appt.status] || STATUS_STYLES.pending;
                  return (
                    <div
                      key={appt.id}
                      className="rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
                    >
                      <div className="flex gap-6 text-sm flex-wrap">
                        <div>
                          <p className="text-xs" style={{ color: "#A0AEC0" }}>Patient</p>
                          <p className="font-semibold" style={{ color: "#2D3748" }}>{appt.patient_name}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "#A0AEC0" }}>Doctor</p>
                          <p className="font-semibold" style={{ color: "#2D3748" }}>{appt.doctor_name}</p>
                          <p className="text-xs" style={{ color: "#718096" }}>{appt.specialty}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "#A0AEC0" }}>Date</p>
                          <p className="font-semibold" style={{ color: "#2D3748" }}>
                            {new Date(appt.appointment_date).toLocaleDateString("en-US", {
                              weekday: "short", month: "short", day: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "#A0AEC0" }}>Time</p>
                          <p className="font-semibold" style={{ color: "#2D3748" }}>
                            {appt.appointment_time?.slice(0, 5)}
                          </p>
                        </div>
                        {appt.reason && (
                          <div>
                            <p className="text-xs" style={{ color: "#A0AEC0" }}>Reason</p>
                            <p className="text-xs" style={{ color: "#718096" }}>{appt.reason}</p>
                          </div>
                        )}
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold capitalize flex-shrink-0"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        {appt.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}