// lib/actions/get-full-dashboard-context.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { PlanType, UserType } from '@/lib/types/dashboard'

export interface CanAccess {
  categories_full:  boolean
  autonomo_widgets: boolean
  negocio_widgets:  boolean
  reports_basic:    boolean
  budget_alerts:    boolean
  grafico_6meses:   boolean
  predictions:      boolean
  edge_fn_insights: boolean
}

export interface DashboardStats {
  receita:          number
  despesa:          number
  saldo:            number
  total_transacoes: number
  metas_ativas:     number
  dividas_ativas:   number
}

export interface FullDashboardContext {
  user_id:        string
  name:           string | null
  user_type:      UserType
  cdf_phase:      string
  financial_goal: string | null
  monthly_income: number
  plan:           PlanType
  plan_status:    string
  plan_expires:   string | null
  stats:          DashboardStats
  widget_order:   string[]
  can_access:     CanAccess
}

export async function getFullDashboardContext(): Promise<FullDashboardContext | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data, error } = await supabase
    .rpc('get_full_dashboard_context', { p_user_id: user.id })

  if (error || !data || data.error) {
    console.error('[getFullDashboardContext]', error?.message ?? data?.error)
    return null
  }

  return data as FullDashboardContext
}
