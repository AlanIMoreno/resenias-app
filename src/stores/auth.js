import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore(
  'auth',
  {
    state: () => ({
      user: null,
      profile: null,
      session: null,
      role: null
    }),

    actions: {
      setSession(session) {
        this.session = session
        this.user = session?.user ?? null
      },

      setProfile(profile) {
        this.profile = profile
        this.role = profile?.rol ?? null
      },

      clear() {
        this.user = null
        this.profile = null
        this.session = null
        this.role = null
      },

      async initializeAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          this.setSession(session)
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (profile) {
            this.setProfile(profile)
          }
        }
      }
    }
  }
)
