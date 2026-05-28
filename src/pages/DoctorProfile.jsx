import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function StarRating({ rating }) {
  const num = parseFloat(rating) || 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= Math.round(num) ? "#E8734A" : "#e2e8f0", fontSize: "18px" }}
        >
          ★
        </span>
      ))}
      <span className="ml-1 font-semibold" style={{ color: "#2D3748" }}>{num.toFixed(1)}</span>
    </div>
  );
}

function ReviewStars({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: "28px",
            cursor: "pointer",
            color: star <= (hovered || value) ? "#E8734A" : "#e2e8f0",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [completedAppts, setCompletedAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewError, setReviewError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctor();
    fetchReviews();
    if (user?.role === "patient") fetchCompletedAppts();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
      setDoctor(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompletedAppts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter completed appointments for this doctor
      const completed = res.data.filter(
        (a) => a.status === "completed" && String(a.doctor_user_id) === String(id)
      );
      setCompletedAppts(completed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!rating) return setReviewError("Please select a rating.");
    if (!selectedAppt) return setReviewError("Please select an appointment.");
    setReviewError("");
    setSubmitting(true);
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          doctor_id: doctor.doctor_id,
          appointment_id: selectedAppt,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewMsg("✅ Review submitted! Thank you.");
      setShowReviewForm(false);
      setRating(0);
      setComment("");
      fetchReviews();
      fetchDoctor();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
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

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F7F9FA" }}>
        <p style={{ color: "#718096" }}>Doctor not found.</p>
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

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Doctor Card */}
        <div
          className="rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-6"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#1A6B72" }}
          >
            {doctor.name?.[0]}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#2D3748" }}>{doctor.name}</h1>
                <p className="text-lg font-semibold mt-1" style={{ color: "#1A6B72" }}>{doctor.specialty}</p>
                <div className="mt-2">
                  <StarRating rating={doctor.rating} />
                  <p className="text-sm mt-1" style={{ color: "#718096" }}>
                    {parseInt(doctor.total_reviews)} reviews
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{ color: "#E8734A" }}>
                  ${parseFloat(doctor.consultation_fee).toFixed(2)}
                </p>
                <p className="text-sm" style={{ color: "#718096" }}>per consultation</p>
                <button
                  onClick={() => {
                    if (!user) navigate("/login");
                    else if (user.role === "patient") navigate(`/book/${id}`);
                  }}
                  className="mt-3 px-6 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
                  style={{ backgroundColor: "#E8734A" }}
                >
                  Book Appointment
                </button>
              </div>
            </div>

            <p className="mt-4 leading-relaxed" style={{ color: "#4A5568" }}>{doctor.bio}</p>

            {/* Stats Row */}
            <div className="flex gap-6 mt-5 flex-wrap">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: "#F7F9FA" }}
              >
                <span>🏅</span>
                <div>
                  <p className="text-xs" style={{ color: "#718096" }}>Experience</p>
                  <p className="font-bold text-sm" style={{ color: "#2D3748" }}>
                    {doctor.experience_years} years
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: "#F7F9FA" }}
              >
                <span>📞</span>
                <div>
                  <p className="text-xs" style={{ color: "#718096" }}>Phone</p>
                  <p className="font-bold text-sm" style={{ color: "#2D3748" }}>
                    {doctor.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: "#F7F9FA" }}
              >
                <span>✉️</span>
                <div>
                  <p className="text-xs" style={{ color: "#718096" }}>Email</p>
                  <p className="font-bold text-sm" style={{ color: "#2D3748" }}>{doctor.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        {doctor.availability?.length > 0 && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "#2D3748" }}>
              🗓️ Available Days
            </h2>
            <div className="flex flex-wrap gap-3">
              {doctor.availability.map((a) => (
                <div
                  key={a.day_of_week}
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: "#E6FFFA", border: "1px solid #81E6D9" }}
                >
                  <p className="font-bold" style={{ color: "#2C7A7B" }}>{a.day_of_week}</p>
                  <p style={{ color: "#4A5568" }}>
                    {a.start_time?.slice(0, 5)} – {a.end_time?.slice(0, 5)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: "#2D3748" }}>
              ⭐ Patient Reviews ({reviews.length})
            </h2>
            {user?.role === "patient" && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#1A6B72" }}
              >
                + Write a Review
              </button>
            )}
          </div>

          {/* Review success message */}
          {reviewMsg && (
            <div
              className="px-4 py-3 rounded-xl mb-4 text-sm font-semibold"
              style={{ backgroundColor: "#F0FFF4", color: "#276749", border: "1px solid #9AE6B4" }}
            >
              {reviewMsg}
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ backgroundColor: "#F7F9FA", border: "1px solid #e2e8f0" }}
            >
              <h3 className="font-bold mb-4" style={{ color: "#2D3748" }}>Your Review</h3>

              {/* Select appointment */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                  Select Completed Appointment
                </label>
                {completedAppts.length === 0 ? (
                  <p className="text-sm" style={{ color: "#A0AEC0" }}>
                    You need a completed appointment with this doctor to leave a review.
                  </p>
                ) : (
                  <select
                    value={selectedAppt}
                    onChange={(e) => setSelectedAppt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#2D3748" }}
                  >
                    <option value="">Select appointment...</option>
                    {completedAppts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {new Date(a.appointment_date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })} at {a.appointment_time?.slice(0, 5)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Star rating */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-2" style={{ color: "#2D3748" }}>
                  Rating
                </label>
                <ReviewStars value={rating} onChange={setRating} />
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="text-sm font-semibold block mb-1" style={{ color: "#2D3748" }}>
                  Comment <span style={{ color: "#A0AEC0", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#2D3748" }}
                  onFocus={e => e.target.style.border = "1.5px solid #1A6B72"}
                  onBlur={e => e.target.style.border = "1px solid #e2e8f0"}
                />
              </div>

              {reviewError && (
                <p className="text-sm mb-3" style={{ color: "#C53030" }}>{reviewError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleReviewSubmit}
                  disabled={submitting || completedAppts.length === 0}
                  className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: submitting ? "#A0AEC0" : "#E8734A" }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => { setShowReviewForm(false); setReviewError(""); }}
                  className="px-6 py-2 rounded-xl text-sm font-semibold transition"
                  style={{ backgroundColor: "#ffffff", color: "#718096", border: "1px solid #e2e8f0" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">💬</div>
              <p className="font-semibold" style={{ color: "#2D3748" }}>No reviews yet</p>
              <p className="text-sm mt-1" style={{ color: "#718096" }}>
                Be the first to review this doctor
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: "#F7F9FA", border: "1px solid #e2e8f0" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: "#1A6B72" }}
                      >
                        {review.patient_name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "#2D3748" }}>
                          {review.patient_name}
                        </p>
                        <p className="text-xs" style={{ color: "#A0AEC0" }}>
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            month: "long", day: "numeric", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            color: star <= review.rating ? "#E8734A" : "#e2e8f0",
                            fontSize: "16px",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm leading-relaxed mt-2" style={{ color: "#4A5568" }}>
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}