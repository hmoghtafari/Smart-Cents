import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://izfpmcgxmkckirecpzds.supabase.co", // Replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZnBtY2d4bWtja2lyZWNwemRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MDk4NjAsImV4cCI6MjA1NzA4NTg2MH0.NUClT_xBLqwb6vWDvv6Q1CM2cRbNMxJRAovtzjIXhfo" // Replace with your API key
);
