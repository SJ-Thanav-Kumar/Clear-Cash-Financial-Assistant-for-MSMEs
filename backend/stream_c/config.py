"""
stream_c/config.py
Supabase client singleton — import `supabase` from here everywhere.
"""
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY: str = os.environ["SUPABASE_SERVICE_KEY"]

# Service-role client — bypasses RLS, used server-side only.
# Never expose this key to the frontend.
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
