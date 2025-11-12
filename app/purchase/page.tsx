"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useUser } from "@/store/useUser"
import Navbar from "@/components/Navbar"

export default function PurchasePage() {
  const router = useRouter()
  const { user, tokens, fetchUser } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    await fetchUser()
    setLoading(false)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user])

  const packages = [
    {
      tokens: 5,
      price: 99,
      popular: false,
      features: ["5 AI Mentor Questions", "Valid for 30 days", "No expiry on unused tokens"]
    },
    {
      tokens: 15,
      price: 249,
      popular: true,
      features: ["15 AI Mentor Questions", "Valid for 60 days", "Priority support", "Best value!"]
    },
    {
      tokens: 30,
      price: 449,
      popular: false,
      features: ["30 AI Mentor Questions", "Valid for 90 days", "Priority support", "Exclusive badges"]
    }
  ]

  const handlePurchase = (packageIndex: number) => {
    alert(`Stripe integration coming soon! You selected ${packages[packageIndex].tokens} tokens for ₹${packages[packageIndex].price}`)
    // TODO: Implement Stripe checkout
    // const response = await fetch('/api/purchase', {
    //   method: 'POST',
    //   body: JSON.stringify({ package: packageIndex })
    // })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2956D9]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Get More Tokens 🪙
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Unlock unlimited AI mentor guidance
          </p>
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-gray-600">Current Balance:</span>
            <span className="text-3xl font-bold text-[#2956D9]">{tokens} 🪙</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl p-8 ${
                pkg.popular ? "ring-4 ring-[#FFC947] scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#FFC947] text-[#2956D9] font-bold px-6 py-2 rounded-full text-sm">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🪙</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {pkg.tokens} Tokens
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-[#2956D9]">₹{pkg.price}</span>
                  <span className="text-gray-500">one-time</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(index)}
                className={`w-full font-bold py-4 rounded-full transition-colors ${
                  pkg.popular
                    ? "bg-[#FFC947] hover:bg-[#e6b33f] text-[#2956D9]"
                    : "bg-[#2956D9] hover:bg-[#1a3a8a] text-white"
                }`}
              >
                Purchase Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">What are tokens?</h3>
              <p className="text-gray-600">
                Tokens are used to ask questions to our AI Mentor. Each question costs 1 token. Free rule-based suggestions don't require tokens.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Do tokens expire?</h3>
              <p className="text-gray-600">
                Unused tokens don't expire, but each package has a validity period for new purchases.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Can I get a refund?</h3>
              <p className="text-gray-600">
                Yes! If you're not satisfied within 7 days of purchase, contact support for a full refund.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">Payment methods?</h3>
              <p className="text-gray-600">
                We accept all major credit/debit cards, UPI, and net banking through Stripe.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-[#2956D9] font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
