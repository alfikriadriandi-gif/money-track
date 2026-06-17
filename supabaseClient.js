import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://URL_PROYEK_KAMU.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

console.log("Supabase berhasil dipanggil!")