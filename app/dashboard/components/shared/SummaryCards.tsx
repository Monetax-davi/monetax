// app/dashboard/components/shared/SummaryCards.tsx
// Server-safe: recebe dados prontos como props, zero fetch, zero estado
// Adapta labels e valores por userType

import type { DashboardStats } from '@/lib/actions/get-full-dashboard-context'
import type { UserType } from '@/lib/types/dashboard'

interface Props {
  stats:    DashboardStats
  userType: UserType
  phase:    string
}

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

// Textos adaptativos por userType — sem parecer genérico
const LABELS: Record<UserType, {
  card1: string; card2: string; card3: string; card4: string
  sub1:  (s: DashboardStats) => string
  sub2:  (s: DashboardStats) => string
  sub3:  (s: DashboardStats) => string
  sub4:  (s: DashboardStats) => string
}> = {
  pessoal: {
    card1: 'Saldo do mês',
    card2: 'Receitas',
    card3: 'Despesas',
    card4: 'Metas ativas',
    sub1: s => s.total_transacoes > 0 ? `${s.total_transacoes} transações` : 'Sem transações ainda',
    sub2: s => s.receita > 0 ? 'Entradas do mês' : 'Nenhuma receita',
    sub3: s => s.despesa > 0 ? 'Saídas do mês'  : 'Nenhuma despesa',
    sub4: s => s.metas_ativas > 0 ? `${s.metas_ativas} em andamento` : 'Configure suas metas',
  },
  autonomo: {
    card1: 'Faturamento',
    card2: 'Recebimentos',
    card3: 'Custos',
    card4: 'Atendimentos',
    sub1: s => s.total_transacoes > 0 ? `${s.total_transacoes} lançamentos` : 'Nenhum lançamento ainda',
    sub2: s => s.receita > 0 ? 'Serviços pagos' : 'Nenhum recebimento',
    sub3: s => s.despesa > 0 ? 'Despesas do mês' : 'Sem custos lançados',
    sub4: s => s.metas_ativas > 0 ? `${s.metas_ativas} meta(s)` : 'Sem metas ativas',
  },
  negocio: {
    card1: 'Lucro líquido',
    card2: 'Receita bruta',
    card3: 'Despesas totais',
    card4: 'Dívidas ativas',
    sub1: s => s.total_transacoes > 0 ? `Margem ${s.receita > 0 ? Math.round((s.saldo/s.receita)*100) : 0}%` : 'Sem dados',
    sub2: s => s.receita > 0 ? 'Total de entradas' : 'Sem receita registrada',
    sub3: s => s.despesa > 0 ? 'Total de saídas'  : 'Sem despesas',
    sub4: s => s.dividas_ativas > 0 ? `${s.dividas_ativas} em aberto` : 'Sem dívidas',
  },
}

const FASE_COR: Record<string, string> = {
  controle: '#ff6b6b',
  direcao:  '#ffd166',
  fortuna:  '#00d68f',
}

export function SummaryCards({ stats, userType, phase }: Props) {
  const L   = LABELS[userType] ?? LABELS.pessoal
  const cor = FASE_COR[phase] ?? 'var(--blue)'

  const cards = [
    { label: L.card1, valor: brl(stats.saldo),   sub: L.sub1(stats), cor: stats.saldo >= 0 ? cor : '#ff6b6b', ico: '💰' },
    { label: L.card2, valor: brl(stats.receita), sub: L.sub2(stats), cor: 'var(--green)', ico: '📈' },
    { label: L.card3, valor: brl(stats.despesa), sub: L.sub3(stats), cor: '#ff6b6b',      ico: '📉' },
    { label: L.card4,
      valor: userType === 'negocio' ? String(stats.dividas_ativas) : String(stats.metas_ativas),
      sub: userType === 'negocio' ? L.sub4(stats) : L.sub4(stats),
      cor: '#ffd166', ico: '🎯' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16, marginBottom: 32,
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '22px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{card.label}</span>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${card.cor}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 14 }}>{card.ico}</span>
            </div>
          </div>
          <div className="font-display" style={{
            fontSize: 22, fontWeight: 800, color: card.cor, marginBottom: 4,
            letterSpacing: '-0.5px',
          }}>
            {card.valor}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
