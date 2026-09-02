import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaLock, FaShieldAlt, FaCheckCircle, FaUser } from "react-icons/fa";

const validateCardNumber = (num) => /^\d{12}$/.test(num);
const validateCvv = (cvv) => /^\d{3}$/.test(cvv);
const validateName = (name) => {
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  if (trimmed.length > 100) return false;
  if (!/^[A-Za-z ]+$/.test(trimmed)) return false;
  return true;
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = (location.state && location.state.cartItems) || [];
  const total = (location.state && location.state.total) || 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateCardNumber(cardNumber)) newErrors.cardNumber = "Card number must be exactly 12 digits";
    if (!validateCvv(cvv)) newErrors.cvv = "CVV must be exactly 3 digits";
    if (!validateName(name)) {
      if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      } else if (name.trim().length > 100) {
        newErrors.name = "Name must be less than 100 characters";
      } else {
        newErrors.name = "Name can only contain letters and spaces";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const courseIds = cartItems.map((i) => i.id);

      const response = await fetch(`${backendUrl}/cart/update-enroll-courses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseIds }),
      });

      const json = await response.json();
      if (response.ok && json.success) {
        let redirectCourseId = null;
        if (json.data?.enrolledCourses) {
          const enrolledIds = json.data.enrolledCourses
            .map((course) => course?._id || course?.id || course)
            .filter((id) => typeof id === "string" && id.trim().length > 0);
          localStorage.setItem("enrolledCourseIds", JSON.stringify(enrolledIds));
          window.dispatchEvent(new Event("enrolledCourseIdsUpdated"));

          const cartCourseIds = courseIds.map(String);
          redirectCourseId = cartCourseIds.find((id) => enrolledIds.includes(id));
        }

        if (redirectCourseId) {
          navigate(`/student/courses/${redirectCourseId}`);
        } else if (courseIds.length > 0) {
          navigate(`/student/courses/${courseIds[0]}`);
        } else {
          navigate("/student");
        }
      } else {
        setErrors({ form: json.message || "Checkout failed" });
      }
    } catch (err) {
      setErrors({ form: "Network error during checkout" });
      console.error("Checkout error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Secure Checkout
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your purchase to gain instant access to your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Payment Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg">
              <FaCreditCard />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Payment Information</h2>
              <p className="text-xs text-slate-400">All transactions are encrypted and secured</p>
            </div>
          </div>

          {errors.form && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200/60">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Card Number (12 Digits)</label>
              <div className="relative">
                <FaCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="1234 5678 9012"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
              </div>
              {errors.cardNumber && (
                <p className="text-xs font-medium text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CVV (3 Digits)</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                  />
                </div>
                {errors.cvv && (
                  <p className="text-xs font-medium text-red-600">{errors.cvv}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Name on Card</label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^A-Za-z ]/g, ""))}
                    placeholder="John Doe"
                    maxLength={100}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs font-medium text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? "Processing Payment..." : `Pay ₹${total}`}
            </button>
          </form>
        </div>

        {/* Summary (5 cols) */}
        <aside className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Items to Purchase
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No items in cart</p>
            ) : (
              cartItems.map((c) => (
                <div key={c.id} className="py-3 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 line-clamp-1 mr-2">{c.title}</span>
                  <strong className="text-slate-900 shrink-0">₹{c.price}</strong>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700">Total Price:</span>
            <span className="text-xl font-extrabold text-violet-700">₹{total}</span>
          </div>

          <div className="p-3 rounded-xl bg-violet-50/50 border border-violet-100 flex items-center gap-2.5 text-xs text-violet-700">
            <FaShieldAlt className="shrink-0 text-violet-600" />
            <span>Guaranteed 30-day money-back satisfaction guarantee</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

