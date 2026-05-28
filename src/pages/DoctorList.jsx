import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const SPECIALTIES = [
  "all", "Cardiology", "Neurology", "Dentistry",
  "Ophthalmology", "Orthopedics", "Pediatrics", "General", "Dermatology"
];

const SPECIALTY_ICONS = {
  Cardiology: "🫀", Neurology: "🧠", Dentistry: "🦷",
  Ophthalmology: "👁️", Orthopedics: "🦴", Pediatrics: "🧒",
  General: "🩺", Dermatology: "🌸", all: "🏥",
};

function StarRating({ rating }) {
  const num = parseFloat(rating) || 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= Math.round(num) ? "#E8734A" : "#e2e8f0", fontSize: "14px" }}
        >
          ★
        </span>
      ))}
      <span style={{ color: "#718096", fontSize: "12px", marginLeft: "4px" }}>
        {num.toFixed(1)}
      </span>
    </div>
  );
}

export default function DoctorList() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const location = useLocation();
const params = new URLSearchParams(location.search);
const initialSpecialty = params.get("specialty") || "all";
const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);

useEffect(() => {
  const p = new URLSearchParams(location.search);
  const s = p.get("specialty") || "all";
  setSelectedSpecialty(s);
}, [location.search]);

useEffect(() => {
  fetchDoctors();
}, [selectedSpecialty]);

const fetchDoctors = async () => {
  setLoading(true);

  try {
    const params = {};

    if (selectedSpecialty !== "all") {
      params.specialty = selectedSpecialty;
    }

    if (search) {
      params.search = search;
    }

    const res = await API.get("/doctors", { params });

    setDoctors(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F9FA" }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-10 py-4 shadow-sm"
        style={{ backgroundColor: "#1A6B72" }}
      >
        <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
          Doc<span style={{ color: "#E8734A" }}>Book</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={() => navigate("/patient/dashboard")}
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold border-2 border-white text-white transition"
                onMouseEnter={e => { e.target.style.color = "#1A6B72"; e.target.style.backgroundColor = "#fff"; }}
                onMouseLeave={e => { e.target.style.color = "#fff"; e.target.style.backgroundColor = "transparent"; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-white text-sm font-semibold opacity-80 hover:opacity-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#E8734A" }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#2D3748" }}>Find a Doctor</h1>
          <p className="mt-1 text-sm" style={{ color: "#718096" }}>
            Browse our verified doctors and book your appointment today
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="flex-1 px-5 py-3 rounded-xl text-sm outline-none"
            style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#2D3748" }}
            onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
            onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
            style={{ backgroundColor: "#1A6B72" }}
          >
            Search
          </button>
        </form>

        {/* Specialty Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpecialty(s)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition capitalize flex items-center gap-1"
              style={{
                backgroundColor: selectedSpecialty === s ? "#1A6B72" : "#ffffff",
                color: selectedSpecialty === s ? "#ffffff" : "#718096",
                border: "1px solid #e2e8f0",
              }}
            >
              <span>{SPECIALTY_ICONS[s]}</span>
              <span>{s === "all" ? "All Specialties" : s}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm mb-4" style={{ color: "#718096" }}>
            Showing <strong>{doctors.length}</strong> doctor{doctors.length !== 1 ? "s" : ""}
            {selectedSpecialty !== "all" ? ` in ${selectedSpecialty}` : ""}
          </p>
        )}

        {/* Doctor Cards */}
        {loading ? (
          <div className="text-center py-20" style={{ color: "#718096" }}>
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold" style={{ color: "#2D3748" }}>No doctors found</p>
            <p className="text-sm mt-1" style={{ color: "#718096" }}>
              Try a different search or specialty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-2xl p-6 flex flex-col justify-between transition hover:shadow-md"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                {/* Top */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: "#1A6B72" }}
                  >
                    {doctor.name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: "#2D3748" }}>
                      {doctor.name}
                    </p>
                    <p className="text-sm" style={{ color: "#1A6B72" }}>{doctor.specialty}</p>
                    <StarRating rating={doctor.rating} />
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "#718096" }}>
                  {doctor.bio?.length > 90 ? doctor.bio.slice(0, 90) + "..." : doctor.bio}
                </p>

                {/* Info Row */}
                <div className="flex gap-4 text-xs mb-5" style={{ color: "#4A5568" }}>
                  <span>🏅 {doctor.experience_years} yrs</span>
                  <span>💬 {doctor.total_reviews} reviews</span>
                  <span>💵 ${doctor.consultation_fee}</span>
                </div>

                {/* Buttons */}
<div className="flex gap-2">
  <button
    onClick={() => navigate(`/doctors/${doctor.id}`)}
    className="flex-1 py-3 rounded-xl font-semibold text-sm transition hover:opacity-90"
    style={{ backgroundColor: "#F7F9FA", color: "#1A6B72", border: "1px solid #1A6B72" }}
  >
    View Profile
  </button>
  <button
    onClick={() => navigate(`/book/${doctor.id}`)}
    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
    style={{ backgroundColor: "#E8734A" }}
  >
    Book
  </button>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}