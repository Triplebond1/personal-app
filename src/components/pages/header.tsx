"use client";

import { ABOUT_ME_URL, DASHBOARD_URL, NOW_URL, PROJECT_URL, RESEARCH_URL, WORK_WITH_ME_URL, WRITING_URL } from "@/src/lib/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide the public header on authentication
  // and dashboard pages.
  const isPrivateRoute =
    pathname === "/login" ||
    pathname.startsWith(DASHBOARD_URL);

  if (isPrivateRoute) {
    return null;
  }

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="border-b border-zinc-200 bg-white text-zinc-950">
      <div className="mx-auto max-w-6xl px-6">

        {/* Main header */}
        <div className="flex items-center justify-between py-5">

          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            onClick={closeMenu}
          >
            Olayinka.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            <Link
              href={WRITING_URL}
              className="transition hover:text-zinc-950"
            >
              Writing
            </Link>

            <Link
              href={PROJECT_URL}
              className="transition hover:text-zinc-950"
            >
              Projects
            </Link>

            <Link
              href="/researchs"
              className="transition hover:text-zinc-950"
            >
              Research
            </Link>

            <Link
              href={ABOUT_ME_URL}
              className="transition hover:text-zinc-950"
            >
              About
            </Link>

            <Link
              href={NOW_URL}
              className="transition hover:text-zinc-950"
            >
              Now
            </Link>
          </nav>

          {/* Desktop CTA */}
          <Link
            href={WORK_WITH_ME_URL}
            className="hidden rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 md:block"
          >
            Work with me
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 transition hover:bg-zinc-100 md:hidden"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="border-t border-zinc-100 py-5 md:hidden">
            <div className="flex flex-col">

              <Link
                href={WRITING_URL}
                onClick={closeMenu}
                className="border-b border-zinc-100 py-4 text-sm text-zinc-700 transition hover:text-zinc-950"
              >
                Writing
              </Link>

              <Link
                href={PROJECT_URL}
                onClick={closeMenu}
                className="border-b border-zinc-100 py-4 text-sm text-zinc-700 transition hover:text-zinc-950"
              >
                Projects
              </Link>

              <Link
                href={RESEARCH_URL}
                onClick={closeMenu}
                className="border-b border-zinc-100 py-4 text-sm text-zinc-700 transition hover:text-zinc-950"
              >
                Research
              </Link>

              <Link
                href={ABOUT_ME_URL}
                onClick={closeMenu}
                className="border-b border-zinc-100 py-4 text-sm text-zinc-700 transition hover:text-zinc-950"
              >
                About
              </Link>

              <Link
                href={NOW_URL}
                onClick={closeMenu}
                className="border-b border-zinc-100 py-4 text-sm text-zinc-700 transition hover:text-zinc-950"
              >
                Now
              </Link>

              <Link
                href={WORK_WITH_ME_URL}
                onClick={closeMenu}
                className="mt-5 rounded-full bg-zinc-950 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Work with me
              </Link>

            </div>
          </nav>
        )}
      </div>
    </header>
  );
};