import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wcgkeofwjtgqlbrjprwy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZ2tlb2Z3anRncWxicmpwcnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODY1MjAsImV4cCI6MjA4NjQ2MjUyMH0.bkp3tZnDz9ikDM-9jsQfOnR74JMBH0J63Absvm-m0QY';

export const supabase = createClient(supabaseUrl, supabaseKey);
