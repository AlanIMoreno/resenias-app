import { defineStore } from 'pinia'

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

      }

    }
  }
)
