// app/dashboard/page.tsx
// SERVER COMPONENT — sem 'use client'
// Dados buscados no servidor em uma única RPC antes de renderizar.
// Widgets pesados isolados em LazyWidgets (Client Component) com dynamic(ssr:false).

import { redirect } from 'next/navigation'
import { getFullDashboardContext } from '@/lib/actions/get-full-dashboard-context'
import { DashboardShell }  from './components/shared/DashboardShell'
import { DashboardHeader } from './components/shared/DashboardHeader'
import { SummaryCards }    from './components/shared/SummaryCards'
import { PlanBanner }      from './components/shared/PlanBanner'
import { WelcomeCTA }      from './components/shared/WelcomeCTA'
import { LazyWidgets }     from './components/shared/LazyWidgets'

export default async function DashboardPage() {
  // Uma única RPC: profile + subscription + stats + permissões
  const ctx = await getFullDashboardContext()

  // Redirect server-side — sem flash de tela deslogada no cliente
  if (!ctx) redirect('/login')

  const hasData = ctx.stats.total_transacoes > 0

  return (
    <DashboardShell ctx={ctx}>

      {/* Header adaptativo por userType — renderizado no servidor */}
      <DashboardHeader
        name={ctx.name}
        userType={ctx.user_type}
        phase={ctx.cdf_phase}
        plan={ctx.plan}
      />

      {/* Banner de upgrade — server-rendered, zero JS */}
      <PlanBanner plan={ctx.plan} />

      {/* Cards de resumo com dados reais do servidor — zero fetch no cliente */}
      <SummaryCards
        stats={ctx.stats}
        userType={ctx.user_type}
        phase={ctx.cdf_phase}
      />

      {/* Widgets lazy (Client Component) — carregam JS só para o userType correto */}
      <LazyWidgets
        userId={ctx.user_id}
        userType={ctx.user_type}
        plan={ctx.plan}
        canAccess={ctx.can_access}
      />

      {/* CTA adaptativo — só exibe se sem transações, renderizado no servidor */}
      <WelcomeCTA
        userType={ctx.user_type}
        phase={ctx.cdf_phase}
        hasData={hasData}
      />

    </DashboardShell>
  )
}
