"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/store/useUser"
import { motion } from "framer-motion"

export default function Navbar() {
  const pathname = usePathname()
  const { profile, tokens, logout } = useUser()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/priority", label: "Priority", icon: "⭐" },
    { href: "/unpriority", label: "Later", icon: "📚" },
    { href: "/game", label: "Game", icon: "🎮" },
    { href: "/mentor", label: "Mentor", icon: "🧠" },
    { href: "/profile", label: "Profile", icon: "👤" }
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#2956D9]">NayaDisha</span>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-[#2956D9] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* Tokens */}
            <Link href="/purchase">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-[#FFC947] px-4 py-2 rounded-full cursor-pointer"
              >
                <span className="text-xl">🪙</span>
                <span className="font-bold text-[#2956D9]">{tokens}</span>
              </motion.div>
            </Link>

            {/* XP & Level */}
            {profile && (
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                <span className="text-xl">⚡</span>
                <span className="font-bold text-[#2956D9]">
                  Lvl {profile.level} • {profile.xp} XP
                </span>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded-lg whitespace-nowrap text-sm ${
                pathname === item.href
                  ? "bg-[#2956D9] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
