// app/dashboard/components/autonomo/CaixaBloco.tsx
// Blocos "Hoje" e "Semana" — caixa diário do autônomo

import type { CaixaBloco as CaixaBlocoType } from '@/lib/types/autonomo'

interface Props {
  label: 'Hoje' | 'Semana'
  dados: CaixaBlocoType
  icon: string
}

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

export function CaixaBloco({ label, dados, icon }: Props) {
  const temDados = dados.count > 0

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '20px',
      flex: 1,
      minWidth: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, marginBottom: 4 }}>
            {icon} {label}
          </p>
          <p style={{ fontSize: 26, fontWeight: 800, color: temDados ? 'var(--green)' : 'rgba(255,255,255,0.2)', margin: 0, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>
            {brl(dados.total)}
          </p>
        </div>
        <div style={{
          background: 'rgba(0,214,143,0.1)',
          borderRadius: 8, padding: '4px 10px',
          fontSize: 12, fontWeight: 700,
          color: 'var(--green)',
        }}>
          {dados.count} {dados.count === 1 ? 'serviço' : 'serviços'}
        </div>
      </div>

      {/* Pago vs Pendente */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, borderRadius: 8, padding: '8px 10px',
          background: 'rgba(0,214,143,0.07)',
          border: '1px solid rgba(0,214,143,0.15)',
        }}>
          <p style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, margin: 0, marginBottom: 2, textTransform: 'uppercase' }}>✓ Recebido</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', margin: 0 }}>{brl(dados.paid)}</p>
        </div>
        <div style={{
          flex: 1, borderRadius: 8, padding: '8px 10px',
          background: 'rgba(255,209,102,0.07)',
          border: '1px solid rgba(255,209,102,0.15)',
        }}>
          <p style={{ fontSize: 10, color: '#ffd166', fontWeight: 700, margin: 0, marginBottom: 2, textTransform: 'uppercase' }}>⏳ Pendente</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#ffd166', margin: 0 }}>{brl(dados.pending)}</p>
        </div>
      </div>
    </div>
  )
}
