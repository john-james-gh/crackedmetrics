import {createClient} from '@supabase/supabase-js';

import type {Database} from '@crackedmetrics/types';

const supabaseUrl = 'https://ttuqputnayjfqwwdzorw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXFwdXRuYXlqZnF3d2R6b3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODYwOTYsImV4cCI6MjA2NDU2MjA5Nn0.fAiOkJf5a6qA5UXWLsB18kBxlYkxMTtGAuh9tVksefE';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
