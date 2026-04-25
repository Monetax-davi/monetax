// lib/types/permissions.ts

export type PlanType = 'free' | 'monthly' | 'annual'

export type Feature =
  // Free
  | 'transactions_basic'
  | 'goals_single'
  | 'debts_basic'
  | 'copilot_limited'
  | 'categories_basic'
  // Monthly
  | 'transactions_full'
  | 'goals_multiple'
  | 'debts_unlimited'
  | 'copilot_standard'
  | 'reports_basic'
  | 'export_data'
  | 'budget_alerts'
  | 'recurring_transactions'
  | 'categories_full'
  | 'cashflow_view'
  | 'pl_comparison'
  | 'autonomo_widgets'
  | 'negocio_widgets'
  // Annual
  | 'copilot_unlimited'
  | 'predictions'
  | 'reports_advanced'
  | 'tax_tags'
  | 'multi_accounts'
  | 'priority_support'
  | 'grafico_6meses'
  | 'edge_fn_insights'

export interface PermissionResult {
  allowed: boolean
  plan: PlanType
  feature: Feature
  plan_required: PlanType
  reason: string
}

// ─── MAPA CLIENT-SIDE (espelho do backend — para UI rápida) ───────────────
// NUNCA usar isso para proteger dados — só para mostrar/esconder elementos
const FEATURE_PLAN: Record<Feature, PlanType> = {
  transactions_basic:    'free',
  goals_single:          'free',
  debts_basic:           'free',
  copilot_limited:       'free',
  categories_basic:      'free',

  transactions_full:     'monthly',
  goals_multiple:        'monthly',
  debts_unlimited:       'monthly',
  copilot_standard:      'monthly',
  reports_basic:         'monthly',
  export_data:           'monthly',
  budget_alerts:         'monthly',
  recurring_transactions:'monthly',
  categories_full:       'monthly',
  cashflow_view:         'monthly',
  pl_comparison:         'monthly',
  autonomo_widgets:      'monthly',
  negocio_widgets:       'monthly',

  copilot_unlimited:     'annual',
  predictions:           'annual',
  reports_advanced:      'annual',
  tax_tags:              'annual',
  multi_accounts:        'annual',
  priority_support:      'annual',
  grafico_6meses:        'annual',
  edge_fn_insights:      'annual',
}

const PLAN_RANK: Record<PlanType, number> = { free: 0, monthly: 1, annual: 2 }

const PLAN_LABEL: Record<PlanType, string> = {
  free:    'Grátis',
  monthly: 'Mensal',
  annual:  'Anual',
}

// Verifica acesso client-side (UI only — não protege dados)
export function canAccessFeature(plan: PlanType, feature: Feature): boolean {
  const required = FEATURE_PLAN[feature]
  return PLAN_RANK[plan] >= PLAN_RANK[required]
}

// Retorna nome do plano mínimo necessário
export function requiredPlanLabel(feature: Feature): string {
  return PLAN_LABEL[FEATURE_PLAN[feature]]
}

// Mensagem de upgrade padrão
export function upgradeMessage(feature: Feature): string {
  const planLabel = requiredPlanLabel(feature)
  return `Disponível no plano ${planLabel}. Faça upgrade para desbloquear.`
}

// Limites quantitativos por plano
export const PLAN_LIMITS: Record<PlanType, {
  max_transactions: number   // -1 = ilimitado
  max_goals: number
  max_debts: number
  ai_messages_per_day: number
}> = {
  free:    { max_transactions: 50,  max_goals: 1,  max_debts: 2,  ai_messages_per_day: 3  },
  monthly: { max_transactions: -1,  max_goals: 10, max_debts: -1, ai_messages_per_day: 30 },
  annual:  { max_transactions: -1,  max_goals: -1, max_debts: -1, ai_messages_per_day: -1 },
}
