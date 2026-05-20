"use client";
// src/app/contact/page.tsx

import { useState } from "react";
import { Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [sending, setSending]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSending(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
        <p className="text-lg text-gray-500">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* ── Left: Contact Info (Location box removed) ── */}
        <div className="space-y-6">

          {/* Email */}
          <div className="card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                 style={{ backgroundColor: "#E1F5EE" }}>
              <Mail className="w-6 h-6" style={{ color: "#1D9E75" }} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-500 mb-2">Send us an email anytime</p>
            <a
              href="mailto:smartnutrix9@gmail.com"
              className="text-sm font-medium hover:underline"
              style={{ color: "#1D9E75" }}
            >
              smartnutrix9@gmail.com
            </a>
          </div>

          {/* Response Time */}
          <div className="card">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                 style={{ backgroundColor: "#F3F4F6" }}>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
            <p className="text-sm text-gray-500">
              We typically respond within<br />24–48 hours
            </p>
          </div>

          {/* What we help with */}
          <div className="card" style={{ backgroundColor: "#E1F5EE", borderColor: "#B8E8D4" }}>
            <h3 className="font-semibold mb-3" style={{ color: "#0F6E56" }}>We can help with</h3>
            <ul className="space-y-2 text-sm" style={{ color: "#1D9E75" }}>
              {[
                "Nutrition questions",
                "Food data corrections",
                "Feature suggestions",
                "Partnership enquiries",
                "General feedback",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right: Contact Form ── */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            {success && (
              <div className="mb-6 p-4 rounded-xl flex items-start gap-3"
                   style={{ backgroundColor: "#E1F5EE", border: "1px solid #B8E8D4" }}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1D9E75" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#0F6E56" }}>
                    Message sent successfully!
                  </p>
                  <p className="text-sm" style={{ color: "#1D9E75" }}>
                    We'll get back to you within 24–48 hours.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text" name="subject" value={formData.subject}
                  onChange={handleChange} required
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  name="message" value={formData.message}
                  onChange={handleChange} required rows={6}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#1D9E75" }}
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
