"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { apiAxios, storeTokens } from "@/src/lib/api-helpers";
import { API, ROUTES } from "@/src/lib/url-helpers";
import logo from "@/src/assets/logo.png";

// ─── Types ────────────────────────────────────────────────────────

type Mode = "loading" | "setup" | "login" | "forgot";

// ─── Setup Form ───────────────────────────────────────────────────

function SetupForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState({ adminEmail: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => { setValues((p) => ({ ...p, [k]: v })); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (values.newPassword.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (values.newPassword !== values.confirmPassword) { setError("Passwords do not match"); return; }
    if (!values.adminEmail) { setError("Email is required"); return; }

    setLoading(true);
    try {
      const resp = await apiAxios.post<{ accessToken: string; refreshToken: string }>(API.AUTH.SETUP, values);
      storeTokens(resp.data.accessToken, resp.data.refreshToken);
      const from = searchParams.get("from");
      const redirectTo = from && from.startsWith("/admin") ? from : ROUTES.ADMIN.ROOT;
      window.location.replace(redirectTo);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? "Setup failed. Check the email matches ADMIN_SETUP_EMAIL on the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src={logo} alt="Zafora Holding" className="h-24 w-auto mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 bg-[#173f35]/10 text-[#173f35] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck size={12} /> First-Time Setup
          </div>
          <h1 className="text-2xl font-bold text-[#10231f] mb-1">Create Admin Password</h1>
          <p className="text-[#65736f] text-sm">One-time setup — enter the authorized email and choose a password.</p>
        </div>

        <div className="bg-[#fef9ec] border border-[#c59b4a]/40 rounded-xl px-4 py-3 mb-5 flex gap-2.5">
          <AlertTriangle size={15} className="text-[#c59b4a] shrink-0 mt-0.5" />
          <p className="text-xs text-[#7a6230] leading-relaxed">
            Enter the email set as <strong>ADMIN_SETUP_EMAIL</strong> on the server. This screen disappears permanently after setup.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-semibold text-[#10231f] mb-2">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@zaforaholding.com"
                  value={values.adminEmail}
                  onChange={(e) => set("adminEmail", e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#10231f] mb-2">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 4 characters"
                  value={values.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-10 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]" tabIndex={-1}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#10231f] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={values.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm flex items-center gap-1.5">
                <AlertTriangle size={13} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account…" : "Create Admin Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Forgot Password Form ─────────────────────────────────────────

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [values, setValues] = useState({ adminEmail: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => { setValues((p) => ({ ...p, [k]: v })); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!values.adminEmail) { setError("Email is required"); return; }
    if (values.newPassword.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (values.newPassword !== values.confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await apiAxios.post(API.AUTH.RESET_PASSWORD, values);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? "Reset failed. Check the email matches ADMIN_SETUP_EMAIL on the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src={logo} alt="Zafora Holding" className="h-24 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#10231f] mb-1">Reset Password</h1>
          <p className="text-[#65736f] text-sm">Enter the authorized admin email and choose a new password.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
                <ShieldCheck size={24} className="text-green-600" />
              </div>
              <p className="font-bold text-[#10231f]">Password reset successfully.</p>
              <p className="text-sm text-[#65736f]">You can now sign in with your new password.</p>
              <button
                onClick={onBack}
                className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">Authorized Admin Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="admin@zaforaholding.com"
                    value={values.adminEmail}
                    onChange={(e) => set("adminEmail", e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Minimum 4 characters"
                    value={values.newPassword}
                    onChange={(e) => set("newPassword", e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-10 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]" tabIndex={-1}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={values.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm flex items-center gap-1.5">
                  <AlertTriangle size={13} /> {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        {!success && (
          <div className="mt-6 text-center">
            <button onClick={onBack} className="text-sm text-[#65736f] hover:text-[#173f35] transition-colors">
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password) { setError("Password is required"); return; }
    setLoading(true);
    try {
      const resp = await apiAxios.post<{ accessToken: string; refreshToken: string }>(API.AUTH.LOGIN, { password });
      storeTokens(resp.data.accessToken, resp.data.refreshToken);
      const from = searchParams.get("from");
      const redirectTo = from && from.startsWith("/admin") ? from : ROUTES.ADMIN.ROOT;
      window.location.replace(redirectTo);
    } catch {
      setError("Invalid password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src={logo} alt="Zafora Holding" className="h-24 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#10231f] mb-1">Admin Sign In</h1>
          <p className="text-[#65736f] text-sm">Enter your password to access the admin panel</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#10231f] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className={`w-full border rounded-xl pl-9 pr-10 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]" tabIndex={-1}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm flex items-center gap-1.5">
                <Lock size={13} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={onForgot}
              className="text-sm text-[#65736f] hover:text-[#173f35] transition-colors"
            >
              Forgot password?
            </button>
            <Link href={ROUTES.HOME} className="text-sm text-[#65736f] hover:text-[#173f35] transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root — checks setup status then renders the right screen ─────

function AuthGate() {
  const [mode, setMode] = useState<Mode>("loading");

  useEffect(() => {
    apiAxios
      .get<{ required: boolean }>(API.AUTH.SETUP_STATUS)
      .then((res) => setMode(res.data.required ? "setup" : "login"))
      .catch(() => setMode("login")); // if check fails, fall through to normal login
  }, []);

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f4ef" }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#173f35]" />
      </div>
    );
  }

  if (mode === "setup") {
    return <SetupForm />;
  }

  if (mode === "forgot") {
    return <ForgotPasswordForm onBack={() => setMode("login")} />;
  }

  return <LoginForm onForgot={() => setMode("forgot")} />;
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthGate />
    </Suspense>
  );
}
