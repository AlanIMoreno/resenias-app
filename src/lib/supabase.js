import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://keosufkhkmzrsdrnebgn.supabase.co'   // tu URL del proyecto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlb3N1Zmtoa216cnNkcm5lYmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MzEyMTUsImV4cCI6MjEwODAwNzIxNX0.T1FU7SAfbneKqE_kkQyeZ4_HlEB5yWrdT_7Rob1FwqA'                       // tu clave pública (anon key)

export const supabase = createClient(supabaseUrl, supabaseKey)