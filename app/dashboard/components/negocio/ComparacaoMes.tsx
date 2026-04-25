// app/dashboard/components/negocio/ComparacaoMes.tsx
// Comparação mês atual vs anterior em linha: crescimento e tendência

import type { PLMes } from '@/lib/types/negocio'

interface Props { pl: PLMes }

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function Chip({ pct, inverso = false }: { pct: number | null; inverso?: boolean }) {
  if (pct === null) return <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>—</span>
  // inverso: despesa subindo é ruim
  const bom = inverso ? pct <= 0 : pct >= 0
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: 99,
      background: bom ? 'rgba(0,214,143,0.1)' : 'rgba(255,107,107,0.1)',
      color: bom ? '#00d68f' : '#ff6b6b',
      fontSize: 11, fontWeight: 700,
    }}>
      {pct >= 0 ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

export function ComparacaoMes({ pl }: Props) {
  const variacao_despesa = pl.despesa_anterior > 0
    ? Math.round(((pl.despesa - pl.despesa_anterior) / pl.despesa_anterior) * 10) / 10
    : null

  const rows = [
    {
      label: 'Receita',
      atual: pl.receita,
      anterior: pl.receita_anterior,
      pct: pl.crescimento_receita_pct,
      inverso: false,
    },
    {
      label: 'Despesa',
      atual: pl.despesa,
      anterior: pl.despesa_anterior,
      pct: variacao_despesa,
      inverso: true,
    },
    {
      label: 'Lucro',
      atual: pl.lucro,
      anterior: pl.lucro_anterior,
      pct: pl.crescimento_lucro_pct,
      inverso: false,
    },
  ]

  const mesAtual   = new Date().toLocaleDateString('pt-BR', { month: 'short' })
  const mesAnterior = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleDateString('pt-BR', { month: 'short' })

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Header da tabela */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
        gap: 8, padding: '12px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid var(--border)',
      }}>
        {['', mesAnterior, mesAtual, 'Variação'].map(h => (
          <span key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Linhas */}
      {rows.map((row, i) => (
        <div key={row.label} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: 8, padding: '13px 16px', alignItems: 'center',
          borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            {row.label}
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'Syne, sans-serif' }}>
            {brl(row.anterior)}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>
            {brl(row.atual)}
          </span>
          <Chip pct={row.pct} inverso={row.inverso} />
        </div>
      ))}
    </div>
  )
}
