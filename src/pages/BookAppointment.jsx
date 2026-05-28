import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

function getNext14Days() {
  const days = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getDayName(date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export default function BookAppointment() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const days = getNext14Days();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchBookedSlots();
    }
  }, [selectedDate]);

  const fetchDoctor = async () => {
    try {
      const res = await API.get(`/doctors/${id}`);
      setDoctor(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const res = await API.get("/appointments/booked-slots", {
        params: {
          doctor_id: doctor.doctor_id,
          date: formatDate(selectedDate),
        },
      });
  
      setBookedSlots(res.data.map((t) => t.slice(0, 5)));
    } catch (err) {
      console.error(err);
    }
  };

  const isDayAvailable = (date) => {
    if (!doctor?.availability?.length) return false;
    const dayName = getDayName(date);
    return doctor.availability.some((a) => a.day_of_week === dayName);
  };

  const isSlotAvailable = (time) => {
    if (!selectedDate || !doctor?.availability?.length) return false;
    const dayName = getDayName(selectedDate);
    const avail = doctor.availability.find((a) => a.day_of_week === dayName);
    if (!avail) return false;
    const slotTime = time + ":00";
    return slotTime >= avail.start_time && slotTime < avail.end_time;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctor_id: id,
          appointment_date: formatDate(selectedDate),
          appointment_time: selectedTime,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F9FA" }}>
        <p style={{ color: "#718096" }}>Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F9FA" }}>
        <div
          className="rounded-2xl p-12 text-center max-w-md w-full shadow-lg"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#2D3748" }}>
            Appointment Booked!
          </h2>
          <p className="text-sm mb-2" style={{ color: "#718096" }}>
            Your appointment with <strong>{doctor?.name}</strong> has been confirmed.
          </p>
          <p className="text-sm mb-6" style={{ color: "#718096" }}>
            📅 {selectedDate?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            &nbsp; ⏰ {selectedTime}
          </p>
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
            style={{ backgroundColor: "#1A6B72" }}
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

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
        <button
          onClick={() => navigate("/doctors")}
          className="text-white text-sm font-semibold opacity-80 hover:opacity-100 transition"
        >
          ← Back to Doctors
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Doctor Info Card */}
        <div
          className="rounded-2xl p-6 mb-8 flex items-center gap-5"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#1A6B72" }}
          >
            {doctor?.name?.[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: "#2D3748" }}>{doctor?.name}</h2>
            <p className="text-sm" style={{ color: "#1A6B72" }}>{doctor?.specialty}</p>
            <p className="text-sm mt-1" style={{ color: "#718096" }}>{doctor?.bio}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-2xl font-bold" style={{ color: "#E8734A" }}>
              ${parseFloat(doctor?.consultation_fee).toFixed(2)}
            </p>
            <p className="text-xs" style={{ color: "#718096" }}>Consultation fee</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left — Date Picker */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <h3 className="font-bold text-base mb-4" style={{ color: "#2D3748" }}>
              📅 Select a Date
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {days.map((day, i) => {
                const available = isDayAvailable(day);
                const isSelected = selectedDate && formatDate(selectedDate) === formatDate(day);
                return (
                  <button
                    key={i}
                    disabled={!available}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime(null);
                    }}
                    className="rounded-xl py-2 px-1 text-center transition"
                    style={{
                      backgroundColor: isSelected ? "#1A6B72" : available ? "#F7F9FA" : "#f0f0f0",
                      color: isSelected ? "#ffffff" : available ? "#2D3748" : "#c0c0c0",
                      border: isSelected ? "2px solid #1A6B72" : "1px solid #e2e8f0",
                      cursor: available ? "pointer" : "not-allowed",
                    }}
                  >
                    <p style={{ fontSize: "10px", fontWeight: "600" }}>
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p style={{ fontSize: "16px", fontWeight: "700" }}>{day.getDate()}</p>
                    <p style={{ fontSize: "10px" }}>
                      {day.toLocaleDateString("en-US", { month: "short" })}
                    </p>
                  </button>
                );
              })}
            </div>
            {doctor?.availability?.length > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e2e8f0" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "#718096" }}>
                  Available days:
                </p>
                <div className="flex flex-wrap gap-1">
                  {doctor.availability.map((a) => (
                    <span
                      key={a.day_of_week}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#E6FFFA", color: "#2C7A7B" }}
                    >
                      {a.day_of_week} {a.start_time?.slice(0, 5)}–{a.end_time?.slice(0, 5)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Time Slots + Form */}
          <div className="flex flex-col gap-6">

            {/* Time Slots */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <h3 className="font-bold text-base mb-4" style={{ color: "#2D3748" }}>
                ⏰ Select a Time
              </h3>
              {!selectedDate ? (
                <p className="text-sm" style={{ color: "#A0AEC0" }}>Please select a date first.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const available = isSlotAvailable(time);
                    const booked = bookedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        disabled={!available || booked}
                        onClick={() => setSelectedTime(time)}
                        className="py-2 rounded-xl text-xs font-semibold transition"
                        style={{
                          backgroundColor: isSelected ? "#E8734A" : booked ? "#f0f0f0" : available ? "#F7F9FA" : "#f0f0f0",
                          color: isSelected ? "#ffffff" : booked ? "#c0c0c0" : available ? "#2D3748" : "#c0c0c0",
                          border: isSelected ? "2px solid #E8734A" : "1px solid #e2e8f0",
                          cursor: available && !booked ? "pointer" : "not-allowed",
                          textDecoration: booked ? "line-through" : "none",
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reason */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
            >
              <h3 className="font-bold text-base mb-3" style={{ color: "#2D3748" }}>
                📝 Reason for Visit <span style={{ color: "#A0AEC0", fontWeight: 400 }}>(optional)</span>
              </h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your symptoms or reason for visit..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#F7F9FA", color: "#2D3748" }}
                onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
              />
            </div>

            {/* Summary + Book */}
            {selectedDate && selectedTime && (
              <div
                className="rounded-2xl p-5"
                style={{ backgroundColor: "#E6FFFA", border: "1px solid #81E6D9" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "#2C7A7B" }}>
                  Appointment Summary
                </p>
                <p className="text-sm" style={{ color: "#2D3748" }}>
                  👨‍⚕️ <strong>{doctor?.name}</strong> — {doctor?.specialty}
                </p>
                <p className="text-sm" style={{ color: "#2D3748" }}>
                  📅 {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <p className="text-sm" style={{ color: "#2D3748" }}>⏰ {selectedTime}</p>
                <p className="text-sm" style={{ color: "#2D3748" }}>
                  💵 ${parseFloat(doctor?.consultation_fee).toFixed(2)}
                </p>
              </div>
            )}

            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#FFF5F5", color: "#C53030", border: "1px solid #FED7D7" }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedDate || !selectedTime}
              className="w-full py-4 rounded-xl text-white font-bold text-sm transition hover:opacity-90"
              style={{
                backgroundColor: !selectedDate || !selectedTime ? "#A0AEC0" : "#E8734A",
                cursor: !selectedDate || !selectedTime ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}