import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://uhxlmskvuxholdkghqeb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeGxtc2t2dXhob2xka2docWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMjQxMzMsImV4cCI6MjA0NTkwMDEzM30.xM0rzOByXYpyGAWI16FyzWeeWbBZApoQBiT85yuwkKE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
