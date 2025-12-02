import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
config()


export const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})