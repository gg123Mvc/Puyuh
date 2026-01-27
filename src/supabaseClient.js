import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Key is missing! Check your .env file.')
}

// Fallback to prevent crash if env vars are missing
const url = supabaseUrl || 'https://cusmwcirycfhxhlypbey.supabase.co'
const key = supabaseAnonKey || 'sb_publishable_zU8xOVm8XHB6voOK6FNTyw_zHJNKSGb'

console.log('Supabase Config:', { 
  url: supabaseUrl ? 'Found in ENV' : 'Using Placeholder', 
  hasKey: !!supabaseAnonKey 
})

export const supabase = createClient(url, key)
