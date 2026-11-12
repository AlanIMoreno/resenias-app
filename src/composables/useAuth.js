import { supabase } from '../lib/supabase'

export function useAuth() {

  async function signup(
    email,
    password
  ) {

    return await supabase.auth.signUp({

      email,

      password

    })

  }

  async function login(
    email,
    password
  ) {

    return await supabase.auth.signInWithPassword({

      email,

      password

    })

  }

  async function logout() {

    return await supabase.auth.signOut()

  }

  async function getUser() {

    return await supabase.auth.getUser()

  }

  return {

    signup,

    login,

    logout,

    getUser

  }

}