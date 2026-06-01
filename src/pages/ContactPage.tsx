import { useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import NimaFooter from "../component/Footer";

function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = { up: "translate-y-8", left: "-translate-x-8", right: "translate-x-8", none: "" }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translate}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@nimanv.com",
    href: "mailto:info@nimanv.com",
  },
];

const subjects = [
  "General Inquiry",
  "Membership",
  "Events & Sponsorship",
  "Media & Press",
  "Volunteering",
  "Other",
];

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] py-20 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0}>
            <span className="uppercase tracking-[0.2em] text-sm font-bold text-[#027027] mb-4 block">
              Get in Touch
            </span>
          </FadeIn>
          <FadeIn delay={120}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Contact Us
            </h1>
          </FadeIn>
          <FadeIn delay={240}>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Have a question, want to collaborate, or interested in joining
              NIMA? We'd love to hear from you. Reach out and our team will get
              back to you shortly.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 py-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — contact info */}
          <div className="flex flex-col gap-5">

            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.label} direction="left" delay={i * 80}>
                  <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#027027] group-hover:w-full transition-all duration-500" />
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 group-hover:bg-[#027027] transition-colors duration-300 shrink-0">
                        <Icon className="w-5 h-5 text-[#027027] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-medium text-gray-800 hover:text-[#027027] transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-gray-800">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}

            {/* About card */}
            <FadeIn direction="left" delay={280}>
              <div className="relative bg-[#006e25] rounded-2xl p-6 overflow-hidden mt-1">
                <h3 className="text-lg font-bold text-white mb-2">Nevada Iranian-American Medical Association</h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Fostering excellence in medicine while preserving our rich
                  cultural heritage within the Nevada healthcare landscape.
                </p>
                <Mail
                  className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.07]"
                  strokeWidth={1}
                />
              </div>
            </FadeIn>

          </div>

          {/* Right — form */}
          <FadeIn direction="right" delay={100} className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-full">

              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#027027]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-gray-500 max-w-sm">
                    Thank you for reaching out. A member of our team will get
                    back to you within 1–2 business days.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 text-sm text-[#027027] font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          Full Name <span className="text-[#027027]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Dr. Jane Smith"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027027]/20 focus:border-[#027027] transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          Email Address <span className="text-[#027027]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027027]/20 focus:border-[#027027] transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Subject <span className="text-[#027027]">*</span>
                      </label>
                      <select
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027027]/20 focus:border-[#027027] transition-all bg-white text-gray-700"
                      >
                        <option value="" disabled>Select a subject...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Message <span className="text-[#027027]">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027027]/20 focus:border-[#027027] transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center justify-center gap-2 bg-[#027027] hover:bg-[#01551d] active:scale-95 disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 self-start"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>

                  </form>
                </>
              )}

            </div>
          </FadeIn>

        </div>
      </section>
      <NimaFooter />
    </div>
  );
};

export default ContactPage;