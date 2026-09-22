"use client";

import Link from "next/link";
import { useAuth } from "../../components/auth/authProvider";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";


export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function closeSidebar() {
    setIsOpen(false);
  }

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 md:hidden">
        <div>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            Olayinka.
          </Link>

          <p className="text-xs text-zinc-500">
            Dashboard
          </p>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open dashboard menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-zinc-900" />
            <span className="h-0.5 w-5 bg-zinc-900" />
            <span className="h-0.5 w-5 bg-zinc-900" />
          </span>
        </button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-200 bg-white
          transition-transform duration-200 ease-out
          md:translate-x-0 md:flex md:w-64 md:flex-col
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <Link
              href="/"
              onClick={closeSidebar}
              className="text-xl font-semibold tracking-tight"
            >
              Olayinka.
            </Link>

            <p className="mt-1 text-xs text-zinc-500">
              Dashboard
            </p>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close dashboard menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 md:hidden"
          >
            <span className="text-2xl leading-none">
              ×
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              isActive("/dashboard")
                ? "bg-zinc-100 font-medium text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            Overview
          </Link>

          <Link
            href="/dashboard/posts"
            onClick={closeSidebar}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              isActive("/dashboard/posts")
                ? "bg-zinc-100 font-medium text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            Posts
          </Link>

          <Link
            href="/dashboard/posts/new"
            onClick={closeSidebar}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              isActive("/dashboard/posts/new")
                ? "bg-zinc-100 font-medium text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            New Post
          </Link>
        </nav>

        {/* Bottom */}
        <div className="border-t border-zinc-200 p-4">
          <Link
            href="/"
            onClick={closeSidebar}
            className="mb-2 block rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            View website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}