// app/dashboard/components/autonomo/AutonomoWidgets.tsx
// Client component: busca dados via RPC e renderiza todos os blocos do autônomo
// Renderizado condicionalmente no dashboard apenas quando userType === 'autonomo'

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CaixaBloco }          from './CaixaBloco'
import { ServicosIndicadores } from './ServicosIndicadores'
import { TransacoesList }      from './TransacoesList'
import type { AutonomoDashboard } from '@/lib/types/autonomo'

interface Props {
  userId: string
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[140, 110, 200].map(h => (
        <div key={h} style={{
          height: h, borderRadius: 16,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
    </div>
  )
}

const EMPTY_CAIXA = { total: 0, count: 0, paid: 0, pending: 0 }

export function AutonomoWidgets({ userId }: Props) {
  const [data,    setData]    = useState<AutonomoDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .rpc('get_autonomo_dashboard', { p_user_id: userId })
      .then(({ data: result, error }) => {
        if (!error && result) setData(result as AutonomoDashboard)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <Skeleton />

  const hoje    = data?.hoje    ?? EMPTY_CAIXA
  const semana  = data?.semana  ?? EMPTY_CAIXA
  const servicos = data?.servicos ?? { total_services: 0, total_clients: 0, top_service: null }
  const ultimas  = data?.ultimas  ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Caixa Hoje + Semana ── */}
      <div style={{ display: 'flex', gap: 16 }}>
        <CaixaBloco label="Hoje"   dados={hoje}   icon="📅" />
        <CaixaBloco label="Semana" dados={semana} icon="📆" />
      </div>

      {/* ── Indicadores de serviços ── */}
      <ServicosIndicadores dados={servicos} />

      {/* ── Últimos atendimentos ── */}
      <TransacoesList transacoes={ultimas} />
    </div>
  )
}
