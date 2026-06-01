import { Link } from "react-router";
import { ArrowLeft, HardHat, Mail } from "lucide-react";

const UnderConstructionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f3f6] to-[#ebf5ee] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">

      {/* Animated background circles */}
      <div className="absolute w-[400px] h-[400px] rounded-full border border-[#027027]/10 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute w-[350px] h-[350px] rounded-full border border-[#027027]/10 animate-ping" style={{ animationDuration: "2.2s", animationDelay: "0.4s" }} />
      <div className="absolute w-[200px] h-[200px] rounded-full border border-[#027027]/10 animate-ping" style={{ animationDuration: "1.6s", animationDelay: "0.8s" }} />

      {/* Card */}
      <div className="relative z-10 bg-white border border-gray-100 rounded-3xl shadow-sm px-10 py-14 max-w-lg w-full text-center flex flex-col items-center gap-6">

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-green-50">
          <HardHat className="w-10 h-10 text-[#027027]" strokeWidth={1.5} />
        </div>

        {/* Label */}
        <span className="uppercase tracking-[0.2em] text-xs font-bold text-[#027027]">
          Coming Soon
        </span>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            We're Building Something Great
          </h1>
          <p className="text-gray-500 leading-relaxed text-sm">
            This page is currently under construction. Our team is working hard
            to bring it to life. Check back soon or get in touch with us
            directly.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Progress</span>
            <span>65%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#027027] rounded-full animate-pulse"
              style={{ width: "65%" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-100" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto flex-1 border border-gray-200 text-gray-600 bg-transparent px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:bg-gray-50 hover:-translate-y-0.5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>

          <a
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto flex-1 bg-[#027027] hover:bg-[#01551d] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </a>
        </div>

      </div>

      {/* NIMA logo / footer note */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-2">
        <img
          src="https://nimanv.com/wp-content/uploads/2024/12/nima-logo.png"
          alt="NIMA"
          className="w-24 object-contain opacity-60"
        />
        <p className="text-xs text-gray-400">
          © 2026 Nevada Iranian-American Medical Association
        </p>
      </div>

    </div>
  );
};

export default UnderConstructionPage;