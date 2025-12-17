"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/store/useUser"

export default function TestRealtimePage() {
  const { user, profile, fetchUser } = useUser()
  const [logs, setLogs] = useState<string[]>([])
  const [channelStatus, setChannelStatus] = useState("Not connected")
  const [testXP, setTestXP] = useState(0)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20))
    console.log(message)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (!profile?.id) {
      addLog("❌ No profile found. Please login first.")
      return
    }

    addLog(`✅ Profile loaded: ${profile.email}`)
    addLog(`📊 Current XP: ${profile.xp}`)
    setTestXP(profile.xp || 0)

    // Test realtime connection
    addLog("🔌 Connecting to realtime channel...")

    const testChannel = supabase
      .channel('test-realtime-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${profile.id}`
        },
        (payload) => {
          addLog(`🔥 REALTIME UPDATE RECEIVED!`)
          addLog(`📦 Payload: ${JSON.stringify(payload.new)}`)
          const newData = payload.new as any
          if (newData.xp !== testXP) {
            addLog(`✨ XP changed: ${testXP} → ${newData.xp}`)
            setTestXP(newData.xp)
            fetchUser()
          }
        }
      )
      .subscribe((status) => {
        addLog(`📡 Channel status: ${status}`)
        setChannelStatus(status)
        
        if (status === 'SUBSCRIBED') {
          addLog("✅ Successfully subscribed to realtime!")
          addLog("🧪 Now update your XP in Supabase dashboard to test")
        } else if (status === 'CHANNEL_ERROR') {
          addLog("❌ Channel error! Check if realtime is enabled on 'users' table")
        } else if (status === 'TIMED_OUT') {
          addLog("❌ Connection timed out! Check RLS policies")
        }
      })

    return () => {
      addLog("🔌 Disconnecting from realtime...")
      supabase.removeChannel(testChannel)
    }
  }, [profile?.id])

  const testManualUpdate = async () => {
    if (!profile?.id) {
      addLog("❌ No profile found")
      return
    }

    addLog("🧪 Testing manual XP update...")
    const newXP = (profile.xp || 0) + 50

    const { error } = await supabase
      .from('users')
      .update({ xp: newXP })
      .eq('id', profile.id)

    if (error) {
      addLog(`❌ Update failed: ${error.message}`)
    } else {
      addLog(`✅ XP updated to ${newXP}`)
      addLog("⏳ Waiting for realtime event...")
    }
  }

  const checkRealtimeStatus = async () => {
    addLog("🔍 Checking Supabase configuration...")
    
    // Check if user can read from users table
    const { data, error } = await supabase
      .from('users')
      .select('id, email, xp')
      .eq('id', profile?.id)
      .single()

    if (error) {
      addLog(`❌ Cannot read users table: ${error.message}`)
      addLog("💡 Check RLS policies!")
    } else {
      addLog(`✅ Can read users table`)
      addLog(`📊 Current data: XP=${data.xp}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Realtime Test Page
          </h1>
          <p className="text-gray-600 mb-6">
            Test if Supabase Realtime is working properly
          </p>

          {/* Status */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">User Status</p>
              <p className="text-lg font-bold text-blue-700">
                {user ? "✅ Logged In" : "❌ Not Logged In"}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Channel Status</p>
              <p className="text-lg font-bold text-purple-700">
                {channelStatus}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Current XP</p>
              <p className="text-lg font-bold text-green-700">
                {testXP}
              </p>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={testManualUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🧪 Test XP Update (+50)
            </button>
            <button
              onClick={checkRealtimeStatus}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔍 Check Configuration
            </button>
            <button
              onClick={() => setLogs([])}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🗑️ Clear Logs
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-bold text-yellow-800 mb-2">📋 How to Test:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Make sure you're logged in</li>
              <li>Click "Test XP Update" button</li>
              <li>Watch the logs below - should see "🔥 REALTIME UPDATE RECEIVED!"</li>
              <li>If not working, click "Check Configuration"</li>
              <li>Or manually update XP in Supabase dashboard</li>
            </ol>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">📝 Realtime Logs</h3>
              <span className="text-gray-400 text-sm">
                {logs.length} events
              </span>
            </div>
            <div className="space-y-1 font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">Waiting for events...</p>
              ) : (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.includes('🔥') ? 'text-green-400' :
                      log.includes('✅') ? 'text-green-300' :
                      log.includes('❌') ? 'text-red-400' :
                      log.includes('⏳') ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
            <h3 className="font-bold text-red-800 mb-2">❌ Not Working?</h3>
            <div className="text-sm text-red-700 space-y-2">
              <p><strong>1. Enable Realtime:</strong> Supabase Dashboard → Database → Replication → Realtime → Enable "users" table</p>
              <p><strong>2. Check RLS:</strong> Make sure SELECT policy exists for authenticated users</p>
              <p><strong>3. Check Console:</strong> Open browser console (F12) for detailed errors</p>
              <p><strong>4. Restart:</strong> Supabase Dashboard → Realtime → Restart</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
