// app/dashboard/components/negocio/PLCards.tsx
// Cards de P&L: Receita, Despesa, Lucro, Margem — com variação vs mês anterior

import type { PLMes } from '@/lib/types/negocio'

interface Props { pl: PLMes }

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function Variacao({ pct }: { pct: number | null }) {
  if (pct === null) return <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>sem histórico</span>
  const positivo = pct >= 0
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      color: positivo ? 'var(--green)' : '#ff6b6b',
    }}>
      {positivo ? '▲' : '▼'} {Math.abs(pct)}% vs mês anterior
    </span>
  )
}

interface Card {
  label: string
  valor: number
  variacao: number | null
  cor: string
  icon: string
  formatado?: string
}

export function PLCards({ pl }: Props) {
  const cards: Card[] = [
    {
      label: 'Receita',
      valor: pl.receita,
      variacao: pl.crescimento_receita_pct,
      cor: 'var(--green)',
      icon: '📈',
    },
    {
      label: 'Despesa',
      valor: pl.despesa,
      // Despesa crescendo é ruim — invertemos o sinal visual no componente
      variacao: pl.despesa_anterior > 0
        ? Math.round(((pl.despesa - pl.despesa_anterior) / pl.despesa_anterior) * 10) / 10
        : null,
      cor: '#ff6b6b',
      icon: '📉',
    },
    {
      label: 'Lucro',
      valor: pl.lucro,
      variacao: pl.crescimento_lucro_pct,
      cor: pl.lucro >= 0 ? '#00d68f' : '#ff6b6b',
      icon: pl.lucro >= 0 ? '💰' : '⚠️',
    },
    {
      label: 'Margem',
      valor: pl.margem_pct,
      variacao: null,
      cor: pl.margem_pct >= 20 ? 'var(--green)' : pl.margem_pct >= 0 ? '#ffd166' : '#ff6b6b',
      icon: '🎯',
      formatado: `${pl.margem_pct}%`,
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 16px',
          borderTop: `2px solid ${card.cor}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{card.label}</span>
            <span style={{ fontSize: 16 }}>{card.icon}</span>
          </div>
          <p style={{
            fontSize: 22, fontWeight: 800, color: card.cor,
            margin: '0 0 6px', fontFamily: 'Syne, sans-serif',
            letterSpacing: '-0.5px',
          }}>
            {card.formatado ?? brl(card.valor)}
          </p>
          <Variacao pct={card.label === 'Despesa'
            ? (card.variacao !== null ? -card.variacao : null) // despesa subindo = negativo visualmente
            : card.variacao}
          />
        </div>
      ))}
    </div>
  )
}
