import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

export const useUser = create((set, get) => ({
  user: null,
  profile: null,
  tokens: 0,
  loading: true,

  fetchUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        // Fetch tokens
        const { data: tokenData } = await supabase
          .from('user_tokens')
          .select('tokens')
          .eq('user_id', user.id)
          .single()

        set({
          user,
          profile: profile || null,
          tokens: tokenData?.tokens || 0,
          loading: false
        })
      } else {
        set({ user: null, profile: null, tokens: 0, loading: false })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ loading: false })
    }
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (!error) {
      set(state => ({
        profile: { ...state.profile, ...updates }
      }))
      
      // Refresh user data to get latest updates
      get().fetchUser()
    }
    
    return { error }
  },

  updateTokens: (newTokens) => {
    set({ tokens: newTokens })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, tokens: 0 })
  }
}))
