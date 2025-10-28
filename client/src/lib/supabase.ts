// Supabase anon key and URL are public client values — put them in config.js or .env and do not commit service_role keys.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configurable badWords array in code/DB — sanitize before saving (replace with '***').
export const badWords = [
  'badword1',
  'badword2',
  'offensive',
  // Add more words as needed
];

// Linkless reviews: client uses regex /(https?:\/\/|www\.)/i to reject URLs. Server policies also reject them.
export const containsUrl = (text: string): boolean => {
  return /(https?:\/\/|www\.)/i.test(text);
};

export const sanitizeBadWords = (text: string): string => {
  let sanitized = text;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    sanitized = sanitized.replace(regex, '***');
  });
  return sanitized;
};
