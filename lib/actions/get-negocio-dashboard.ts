// lib/actions/get-negocio-dashboard.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NegocioDashboard } from '@/lib/types/negocio'

export async function getNegocioDashboard(
  userId: string
): Promise<NegocioDashboard | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data, error } = await supabase.rpc('get_negocio_dashboard', {
    p_user_id: userId,
  })

  if (error) {
    console.error('[getNegocioDashboard]', error.message)
    return null
  }

  return data as NegocioDashboard
}
