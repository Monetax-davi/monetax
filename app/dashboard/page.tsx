// app/dashboard/page.tsx
// SERVER COMPONENT — sem 'use client'
// Busca todos os dados em uma única RPC no servidor antes de renderizar
// Client Components são carregados com dynamic() + Suspense apenas onde há interatividade

import { redirect } from 'next/navigation'
import { Suspense }  from 'react'
import dynamic       from 'next/dynamic'

import { getFullDashboardContext } from '@/lib/actions/get-full-dashboard-context'
import { DashboardShell }  from './components/shared/DashboardShell'
import { DashboardHeader } from './components/shared/DashboardHeader'
import { SummaryCards }    from './components/shared/SummaryCards'
import { PlanBanner }      from './components/shared/PlanBanner'
import { LockedFeature }   from './components/shared/LockedFeature'
import { WelcomeCTA }      from './components/shared/WelcomeCTA'

// ── Lazy: widgets pesados carregados apenas quando necessários ─────────────
// ssr:false → não bloqueia o HTML inicial; Suspense exibe skeleton enquanto JS carrega
const TopCategoriesClient = dynamic(
  () => import('./components/pessoal/TopCategoriesClient').then(m => m.TopCategoriesClient),
  { ssr: false }
)

const AutonomoWidgets = dynamic(
  () => import('./components/autonomo/AutonomoWidgets').then(m => m.AutonomoWidgets),
  { ssr: false }
)

const NegocioWidgets = dynamic(
  () => import('./components/negocio/NegocioWidgets').then(m => m.NegocioWidgets),
  { ssr: false }
)

// ── Skeletons inline — renderizados no servidor, sem JS extra ─────────────
function WidgetSkeleton({ height = 180 }: { height?: number }) {
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

// ── Server Component: layout dinâmico por widget_order ────────────────────
function WidgetSlot({
  id, ctx,
}: {
  id: string
  ctx: Awaited<ReturnType<typeof getFullDashboardContext>> & {}
}) {
  const { user_id, user_type, plan, can_access } = ctx

  switch (id) {
    // Categorias pessoal
    case 'top_categories':
      return user_type === 'pessoal' ? (
        <div style={{ marginBottom: 24 }}>
          <Suspense fallback={<WidgetSkeleton height={200} />}>
            <TopCategoriesClient userId={user_id} />
          </Suspense>
        </div>
      ) : null

    // Caixa diário autônomo — locked se free
    case 'caixa_diario':
    case 'servicos':
    case 'atendimentos':
      return user_type === 'autonomo' && id === 'caixa_diario' ? (
        <div style={{ marginBottom: 24 }}>
          <LockedFeature plan={plan} feature="autonomo_widgets">
            <Suspense fallback={<WidgetSkeleton height={260} />}>
              <AutonomoWidgets userId={user_id} />
            </Suspense>
          </LockedFeature>
        </div>
      ) : null

    // P&L negócio — locked se free
    case 'pl_cards':
    case 'grafico':
    case 'comparacao':
      return user_type === 'negocio' && id === 'pl_cards' ? (
        <div style={{ marginBottom: 24 }}>
          <LockedFeature plan={plan} feature="negocio_widgets">
            <Suspense fallback={<WidgetSkeleton height={320} />}>
              <NegocioWidgets userId={user_id} />
            </Suspense>
          </LockedFeature>
        </div>
      ) : null

    // Summary cards — renderizados no servidor, sem lazy
    case 'summary_cards':
      return (
        <SummaryCards
          stats={ctx.stats}
          userType={user_type}
          phase={ctx.cdf_phase}
        />
      )

    case 'cta':
      return (
        <WelcomeCTA
          userType={user_type}
          phase={ctx.cdf_phase}
          hasData={ctx.stats.total_transacoes > 0}
        />
      )

    default:
      return null
  }
}

// ── PAGE: Server Component principal ──────────────────────────────────────
export default async function DashboardPage() {
  // Uma única chamada RPC — profile + subscription + stats + permissões
  const ctx = await getFullDashboardContext()

  // Redirect server-side: sem flash de tela no cliente
  if (!ctx) redirect('/login')

  const hasData = ctx.stats.total_transacoes > 0

  return (
    <DashboardShell ctx={ctx}>
      {/* Header adaptativo por userType */}
      <DashboardHeader
        name={ctx.name}
        userType={ctx.user_type}
        phase={ctx.cdf_phase}
        plan={ctx.plan}
      />

      {/* Banner de upgrade — server-rendered, zero JS */}
      <PlanBanner plan={ctx.plan} />

      {/* Layout dinâmico: widget_order vem do banco, muda por userType */}
      {ctx.widget_order.map(id => (
        <WidgetSlot key={id} id={id} ctx={ctx} />
      ))}
    </DashboardShell>
  )
}
