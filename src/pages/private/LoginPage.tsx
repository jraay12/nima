import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Lock, Mail, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useLogin } from "../../features/user/user.hooks";

// Lightweight animated dot-grid background
function DotGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dots"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="#027027" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // react query
  const loginMutation = useLogin();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          navigate("/dashboard", { replace: true });
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9f7] flex overflow-hidden relative">
      {/* ── Left panel ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[#014d1a] flex-col justify-between overflow-hidden">
        <DotGrid />

        {/* Large decorative circle */}
        <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#027027]/20 pointer-events-none" />
        <div className="absolute top-24 right-0 translate-x-1/2 w-80 h-80 rounded-full bg-[#04a03e]/10 pointer-events-none" />

        {/* Logo */}
        <div
          className={`relative z-10 px-14 pt-14 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              NIMANV
            </span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 px-14 pb-16">
          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <p className="text-[#5dca9a] text-sm font-semibold uppercase tracking-[0.18em] mb-4">
              Member Portal
            </p>
            <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-5">
              Connecting Iranian-American Medical Professionals
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Access events, CME resources, member directories, and the latest
              news from Nevada's medical community.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
        {/* Mobile logo */}
        <div className="absolute top-8 left-6 flex items-center gap-2.5 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-[#027027] flex items-center justify-center">
            <BadgeCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-[#027027] font-bold text-base tracking-wide">
            NIMANV
          </span>
        </div>

        <div
          className={`w-full max-w-[400px] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Heading */}
          <div className="mb-9">
            <h2 className="text-gray-900 text-[2rem] font-bold leading-tight mb-2">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to your member account to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#027027]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400
                    outline-none transition-all duration-200
                    focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10
                    hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[#027027] hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#027027]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400
                    outline-none transition-all duration-200
                    focus:border-[#027027] focus:ring-2 focus:ring-[#027027]/10
                    hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[#027027] cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                Remember me for 30 days
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#027027] text-white font-semibold text-sm
                py-3.5 rounded-xl transition-all duration-200 mt-2
                hover:bg-[#025f22] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-[#027027]/30"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-10 leading-relaxed">
            By signing in you agree to NIMANV's{" "}
            <a href="#" className="underline hover:text-gray-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
