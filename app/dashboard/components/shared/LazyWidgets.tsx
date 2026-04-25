'use client'
// app/dashboard/components/shared/LazyWidgets.tsx
// Client Component: único lugar onde dynamic(ssr:false) é permitido
// O Server Component page.tsx importa este wrapper e passa os dados via props

import dynamic from 'next/dynamic'
import type { CanAccess } from '@/lib/actions/get-full-dashboard-context'
import type { UserType, PlanType } from '@/lib/types/dashboard'
import { LockedFeature } from './LockedFeature'

const TopCategoriesClient = dynamic(
  () => import('../pessoal/TopCategoriesClient').then(m => m.TopCategoriesClient),
  { ssr: false, loading: () => <WidgetSkeleton height={200} /> }
)

const AutonomoWidgets = dynamic(
  () => import('../autonomo/AutonomoWidgets').then(m => m.AutonomoWidgets),
  { ssr: false, loading: () => <WidgetSkeleton height={260} /> }
)

const NegocioWidgets = dynamic(
  () => import('../negocio/NegocioWidgets').then(m => m.NegocioWidgets),
  { ssr: false, loading: () => <WidgetSkeleton height={320} /> }
)

function WidgetSkeleton({ height }: { height: number }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, height,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Carregando...</span>
    </div>
  )
}

interface Props {
  userId:   string
  userType: UserType
  plan:     PlanType
  canAccess: CanAccess
}

export function LazyWidgets({ userId, userType, plan, canAccess }: Props) {
  return (
    <>
      {/* Categorias — pessoal */}
      {userType === 'pessoal' && (
        <div style={{ marginBottom: 24 }}>
          <TopCategoriesClient userId={userId} />
        </div>
      )}

      {/* Caixa + atendimentos — autônomo, locked se free */}
      {userType === 'autonomo' && (
        <div style={{ marginBottom: 24 }}>
          <LockedFeature plan={plan} feature="autonomo_widgets">
            <AutonomoWidgets userId={userId} />
          </LockedFeature>
        </div>
      )}

      {/* P&L + gráfico — negócio, locked se free */}
      {userType === 'negocio' && (
        <div style={{ marginBottom: 24 }}>
          <LockedFeature plan={plan} feature="negocio_widgets">
            <NegocioWidgets userId={userId} />
          </LockedFeature>
        </div>
      )}
    </>
  )
}
