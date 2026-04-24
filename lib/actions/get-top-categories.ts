// lib/actions/get-top-categories.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { TopCategoriesResult } from '@/lib/types/dashboard'

export async function getTopCategoriesPessoal(
  userId: string
): Promise<TopCategoriesResult | null> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data, error } = await supabase.rpc('get_top_categories_pessoal', {
    p_user_id: userId,
    p_limit:   3,
  })

  if (error) {
    console.error('[getTopCategoriesPessoal]', error.message)
    return null
  }

  return data as TopCategoriesResult
}
