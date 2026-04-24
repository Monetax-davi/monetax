// lib/types/dashboard.ts
// Tipos centrais para o sistema de dashboard adaptativo

export type UserType = 'pessoal' | 'autonomo' | 'negocio'
export type PlanType = 'free' | 'monthly' | 'annual'

export interface CategoryData {
  name: string
  icon: string
  color: string
  total: number
  percentage: number
  prev_total: number
  variation_pct: number | null
}

export interface CategoryAlert {
  category: string
  variation_pct: number
  message: string
}

export interface TopCategoriesResult {
  total_expenses: number
  categories: CategoryData[]
  alerts: CategoryAlert[]
}
