import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'  // OK here
export const createClient = () => createServerClient(...)
