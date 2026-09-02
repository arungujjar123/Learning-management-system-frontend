import React, { useState } from "react";
import { FaEnvelope, FaUser, FaCommentDots, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    } else if (form.name.trim().length > 100) {
      errs.name = "Name must be less than 100 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      errs.name = "Name can only contain letters and spaces";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.message.trim()) {
      errs.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${backend}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ ok: true, message: "Thanks! We have received your message and will get back to you shortly." });
        setForm({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setStatus({ ok: false, message: data.message || "Failed to submit message." });
      }
    } catch {
      setStatus({ ok: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Get in Touch</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Have questions, suggestions, or want to partner with us? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {status && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
              status.ok
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                : "bg-red-50 text-red-800 border border-red-200/60"
            }`}
          >
            {status.ok ? (
              <FaCheckCircle className="text-emerald-500 shrink-0 text-base" />
            ) : (
              <FaExclamationCircle className="text-red-500 shrink-0 text-base" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              />
            </div>
            {errors.name && <p className="text-xs font-medium text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                maxLength={254}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-xs font-medium text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Your Message</label>
            <div className="relative">
              <textarea
                name="message"
                placeholder="Tell us what you need..."
                rows={4}
                value={form.message}
                onChange={handleChange}
                maxLength={2000}
                className="w-full p-4 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none"
              />
            </div>
            {errors.message && <p className="text-xs font-medium text-red-600">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaPaperPlane size={13} />
            <span>{submitting ? "Sending..." : "Send Message"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

