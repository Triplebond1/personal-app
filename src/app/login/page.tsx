
"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../components/auth/authProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

//    function handleSubmit() {
//     setError("");
//     setIsLoading(true);

//     console.log({
//       email,
//       password,
//       rememberMe,
//     });

//     setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//   }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) 
  { event.preventDefault();
     setError(""); setIsLoading(true); 

     // Authentication will be implemented later. 
     console.log({ email, password, rememberMe, }); 
      login();

  setTimeout(() => {
    setIsLoading(false);
    router.push("/dashboard");
  }, 1000); }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight"
          >
            Olayinka.
          </Link>

          <p className="mt-3 text-sm text-zinc-500">
            Sign in to your dashboard
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-8">
            <h1 className="text-xl font-semibold">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Enter your credentials to continue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Error */}
            {error && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-zinc-950"
                  onClick={() => {
                    // Password recovery will be implemented later.
                    console.log("Forgot password");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-950"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-4 w-4 rounded border-zinc-300"
              />

              <span className="text-sm text-zinc-600">
                Remember me
              </span>
            </label>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-950"
          >
            ← Back to website
          </Link>
        </div>

      </div>
    </main>
  );
}
