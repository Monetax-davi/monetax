// lib/actions/get-autonomo-dashboard.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { AutonomoDashboard } from '@/lib/types/autonomo'

export async function getAutonomoDashboard(
  userId: string
): Promise<AutonomoDashboard | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data, error } = await supabase.rpc('get_autonomo_dashboard', {
    p_user_id: userId,
  })

  if (error) {
    console.error('[getAutonomoDashboard]', error.message)
    return null
  }

  return data as AutonomoDashboard
}
