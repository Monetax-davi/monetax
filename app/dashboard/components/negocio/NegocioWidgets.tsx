// app/dashboard/components/negocio/NegocioWidgets.tsx
// Client component: busca dados via RPC e renderiza P&L + gráfico + comparação
// Renderizado condicionalmente no dashboard apenas quando userType === 'negocio'

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PLCards }             from './PLCards'
import { GraficoBarras6Meses } from './GraficoBarras6Meses'
import { ComparacaoMes }       from './ComparacaoMes'
import type { NegocioDashboard } from '@/lib/types/negocio'

interface Props { userId: string }

const EMPTY_PL = {
  receita: 0, despesa: 0, lucro: 0, margem_pct: 0, total_transacoes: 0,
  receita_anterior: 0, despesa_anterior: 0, lucro_anterior: 0,
  crescimento_receita_pct: null, crescimento_lucro_pct: null,
}

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ height: 96, borderRadius: 14,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
      {/* chart skeleton */}
      <div style={{ height: 200, borderRadius: 14,
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
        animation: 'pulse 1.5s ease-in-out infinite' }} />
      {/* table skeleton */}
      <div style={{ height: 130, borderRadius: 14,
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
        animation: 'pulse 1.5s ease-in-out infinite' }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }`}</style>
    </div>
  )
}

export function NegocioWidgets({ userId }: Props) {
  const [data,    setData]    = useState<NegocioDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .rpc('get_negocio_dashboard', { p_user_id: userId })
      .then(({ data: result, error }) => {
        if (!error && result) setData(result as NegocioDashboard)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <Skeleton />

  const pl      = data?.pl      ?? EMPTY_PL
  const grafico = data?.grafico ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── P&L Cards: Receita / Despesa / Lucro / Margem ── */}
      <PLCards pl={pl} />

      {/* ── Gráfico 6 meses ── */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14, padding: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>
            📊 Receita × Despesa × Lucro — últimos 6 meses
          </p>
          {pl.total_transacoes > 0 && (
            <span style={{
              fontSize: 11, color: 'rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 6, padding: '3px 8px',
            }}>
              {pl.total_transacoes} transações este mês
            </span>
          )}
        </div>
        <GraficoBarras6Meses dados={grafico} />
      </div>

      {/* ── Comparação mês atual vs anterior ── */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>
          📅 Comparação mensal
        </p>
        <ComparacaoMes pl={pl} />
      </div>

    </div>
  )
}
