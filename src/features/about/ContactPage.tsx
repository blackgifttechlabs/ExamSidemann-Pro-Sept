import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Facebook } from "lucide-react";

const WHATSAPP_NUMBER = "263782456936";
const FACEBOOK_URL = "https://www.facebook.com/share/1BRk5FHizj/";
const DISPLAY_PHONE = "+263 78 245 6936";
const SUPPORT_EMAIL = "blackgiftechlabs@gmail.com";

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildWhatsAppMessage = () => {
    const name = formData.name.trim() || "Not provided";
    const email = formData.email.trim() || "Not provided";
    const subject = formData.subject.trim() || "Appointment request";
    const message = formData.message.trim() || "No extra message provided.";

    return [
      "Hello Exam Sidemann, I would like to request an appointment.",
      "",
      `Full Name: ${name}`,
      `Email Address: ${email}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n");
  };

  const handleWhatsAppRequest = () => {
    const encodedMessage = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      formData.subject.trim() || "Appointment request",
    );
    const body = encodeURIComponent(
      [
        "Hello Exam Sidemann, I would like to request an appointment.",
        "",
        `Full Name: ${formData.name.trim()}`,
        `Reply Email: ${formData.email.trim()}`,
        "",
        "Message:",
        formData.message.trim(),
      ].join("\n"),
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12 px-4 md:px-[30px] mt-16 font-sans text-left">
      <div className="w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="relative mb-16 overflow-hidden rounded-3xl bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/10 shadow-xl px-6 py-12 md:px-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Have questions or need support? We're here to help. Reach out to our
              team.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:absolute md:right-8 md:bottom-8 md:mt-0 md:justify-end">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Exam Sidemann, I would like to make an appointment.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-green-700"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-blue-700"
            >
              <Facebook size={16} />
              Facebook
            </a>
            <a
              href={`tel:${DISPLAY_PHONE.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <Phone size={16} />
              {DISPLAY_PHONE}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Request an appointment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-inner"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-inner"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-inner"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-inner resize-none"
                    placeholder="Enter your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                  <Send size={18} />
                  Continue in Email App
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppRequest}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                  <MessageCircle size={18} />
                  Continue in WhatsApp
                </button>
                <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium leading-relaxed text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200">
                  This form does not send or store your message by itself. Choose
                  email or WhatsApp, review the pre-filled message, then send it
                  from that app.
                </p>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-white/10 transform transition-transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Email Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    For general inquiries and support
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline break-all"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-white/10 transform transition-transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Call Us
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Mon-Fri from 8am to 5pm
                  </p>
                  <a
                    href="tel:+263782456936"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    +263 78 245 6936
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-white/10 transform transition-transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Office
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Come say hello
                  </p>
                  <address className="not-italic text-gray-800 dark:text-gray-200">
                    234, Hillside
                    <br />
                    Masvingo, Zimbabwe
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
