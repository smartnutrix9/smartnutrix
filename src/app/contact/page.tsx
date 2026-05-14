"use client";
// src/app/contact/page.tsx
// Contact page with email form

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
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
        {/* Contact Info */}
        <div className="space-y-6">
          {/* Email */}
          <div className="card">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-500 mb-2">Send us an email anytime</p>
            <a href="mailto:smartnutrix9@gmail.com" className="text-brand-600 text-sm font-medium hover:text-brand-700">
              smartnutrix9@gmail.com
            </a>
          </div>

          {/* Location */}
          <div className="card">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
            <p className="text-sm text-gray-500">
              Serving users worldwide<br />
              Based in India
            </p>
          </div>

          {/* Response Time */}
          <div className="card">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
            <p className="text-sm text-gray-500">
              We typically respond within<br />
              24-48 hours
            </p>
          </div>

          {/* Social Links */}
          <div className="card bg-gradient-to-br from-brand-50 to-green-50">
            <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-brand-600 hover:shadow transition-all">
                <span className="text-xl">𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-brand-600 hover:shadow transition-all">
                <span className="text-xl">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-brand-600 hover:shadow transition-all">
                <span className="text-xl">📷</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-green-900">Message sent successfully!</div>
                  <div className="text-sm text-green-700">We'll get back to you within 24-48 hours.</div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="search-input text-base py-3"
                  disabled={sending}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="search-input text-base py-3"
                  disabled={sending}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="search-input text-base py-3"
                  disabled={sending}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  className="search-input text-base py-3 resize-none"
                  disabled={sending}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              By submitting this form, you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Is SmartNutrix free to use?",
              a: "Yes! All nutrition search, calculators, and food comparison features are completely free."
            },
            {
              q: "Where does the nutrition data come from?",
              a: "We use the USDA FoodData Central database, which contains verified nutrition information for 900,000+ foods."
            },
            {
              q: "Can I track my daily meals?",
              a: "Meal tracking feature is coming soon! Sign up to get notified when it launches."
            },
            {
              q: "Do you have a mobile app?",
              a: "Not yet, but our website is fully mobile-responsive and works great on all devices!"
            }
          ].map((faq, i) => (
            <div key={i} className="card">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}