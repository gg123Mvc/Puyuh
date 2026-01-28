import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Key is missing! Check your .env file.')
}

// Fallback to prevent crash if env vars are missing
const url = supabaseUrl
const key = supabaseAnonKey

console.log('Supabase Config:', { 
  url: supabaseUrl ? 'Found in ENV' : 'Missing', 
  hasKey: !!supabaseAnonKey 
})

let supabase = null

try {
  if (url && key) {
    supabase = createClient(url, key)
  } else {
    console.warn('Supabase credentials missing! Auth features will be disabled.')
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
}

export { supabase }
