import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  name: string
  email: string
  plan: 'free' | 'monthly' | 'annual'
  avatar_url?: string
  financial_goal?: string
  monthly_income: number
  onboarding_completed: boolean
  cdf_phase: 'controle' | 'direcao' | 'fortuna'
  created_at: string
}

export type Transaction = {
  id: string
  user_id: string
  category_id?: string
  amount: number
  type: 'income' | 'expense'
  description: string
  date: string
  is_recurring: boolean
  created_at: string
  categories?: Category
}

export type Category = {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  is_default: boolean
}

export type Goal = {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
  color: string
  icon: string
  completed: boolean
}

export type Debt = {
  id: string
  user_id: string
  name: string
  total_amount: number
  current_balance: number
  interest_rate: number
  min_payment: number
  due_day?: number
  creditor?: string
}
