
"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../components/auth/authProvider";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await register(
        firstname,
        lastname,
        email,
        password
      );

      router.push("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

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
            Create your account
          </p>
        </div>

        {/* Signup card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-8">
            <h1 className="text-xl font-semibold">
              Create an account
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Enter your details to get started.
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

            {/* First and Last name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* First name */}
              <div>
                <label
                  htmlFor="firstname"
                  className="mb-2 block text-sm font-medium"
                >
                  First name
                </label>

                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(event) =>
                    setFirstname(event.target.value)
                  }
                  placeholder="Olayinka"
                  autoComplete="given-name"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="lastname"
                  className="mb-2 block text-sm font-medium"
                >
                  Last name
                </label>

                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(event) =>
                    setLastname(event.target.value)
                  }
                  placeholder="Ade..."
                  autoComplete="family-name"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />
              </div>

            </div>

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
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
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-950"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Create account */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>
        </div>

        {/* Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-950 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
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
