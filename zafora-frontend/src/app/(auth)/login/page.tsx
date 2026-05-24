"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { LoginSchema, type LoginFormValues } from "@/src/modules/admin/auth";
import { loginAdmin } from "@/src/modules/admin/auth";
import { ROUTES } from "@/src/lib/url-helpers";
import logo from "@/src/assets/logo.png";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = LoginSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(parsed.data);
      const from = searchParams.get("from");
      const redirectTo =
        from && from.startsWith("/admin") ? from : ROUTES.ADMIN.ROOT;
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "#f7f4ef" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src={logo} alt="Zafora Holding" className="h-16 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#10231f] mb-1">Admin Sign In</h1>
          <p className="text-[#65736f] text-sm">Sign in to manage your website</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#10231f] mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@zaforaholding.com"
                  value={values.email}
                  onChange={handleChange}
                  className={`w-full border rounded-xl pl-9 pr-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${
                    error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"
                  }`}
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#10231f] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a958f]"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  className={`w-full border rounded-xl pl-9 pr-10 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${
                    error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f] hover:text-[#10231f]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm flex items-center gap-1.5">
                <Lock size={13} />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href={ROUTES.HOME}
              className="text-sm text-[#65736f] hover:text-[#173f35] transition-colors"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
