// lib/hooks/use-plan.ts
'use client'
// Hook cliente: busca plano real da subscription e expõe canAccess()
// Uso: const { plan, canAccess, loading } = usePlan()

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { canAccessFeature } from '@/lib/types/permissions'
import type { PlanType, Feature } from '@/lib/types/permissions'

interface UsePlanResult {
  plan: PlanType
  loading: boolean
  canAccess: (feature: Feature) => boolean
}

export function usePlan(): UsePlanResult {
  const [plan,    setPlan]    = useState<PlanType>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_type, status, expires_at')
        .eq('user_id', data.user.id)
        .in('status', ['active', 'trialing'])
        .single()

      if (sub) {
        const expired = sub.expires_at && new Date(sub.expires_at) < new Date()
        setPlan(expired ? 'free' : (sub.plan_type as PlanType))
      }
      setLoading(false)
    })
  }, [])

  return {
    plan,
    loading,
    canAccess: (feature: Feature) => canAccessFeature(plan, feature),
  }
}
