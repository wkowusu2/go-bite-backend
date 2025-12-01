require('dotenv').config()
import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(process.env.SUPABASE_URL, SUPABASE_SECRET, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})