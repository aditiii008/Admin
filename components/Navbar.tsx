"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    router.push("/login");
  }

  return (
    <header className="bg-white shadow px-6 py-3">
      <div className="relative flex items-center justify-between">
        {/* Left: Logo or Title */}
        <h1 className="font-bold text-lg">Admin Panel</h1>

        {/* Center: Navigation links (desktop only) */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
          <Link href="/dashboard/products/add" className="text-gray-700 hover:text-black">
            Add Product
          </Link>
          <Link href="/dashboard/orders" className="text-gray-700 hover:text-black">
            View Orders
          </Link>
          <Link href="/dashboard/products" className="text-gray-700 hover:text-black">
            View Products
          </Link>
        </nav>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="hidden md:block text-red-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mt-2 space-y-2 md:hidden">
          <Link
            href="/dashboard/products/add"
            className="block text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            Add Product
          </Link>
          <Link
            href="/dashboard/orders"
            className="block text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            View Orders
          </Link>
          <Link
            href="/dashboard/products"
            className="block text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            View Products
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="block text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
