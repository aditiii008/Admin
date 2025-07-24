"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      <h1 className="font-bold text-lg">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
