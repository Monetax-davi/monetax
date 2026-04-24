// app/dashboard/components/autonomo/TransacoesList.tsx
// Lista de transações exibidas como serviços prestados (cliente + serviço)

import type { AutonomoTransacao } from '@/lib/types/autonomo'

interface Props {
  transacoes: AutonomoTransacao[]
}

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function dataRelativa(dateStr: string): string {
  const hoje = new Date()
  const data  = new Date(dateStr + 'T00:00:00')
  const diff  = Math.floor((hoje.getTime() - data.getTime()) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  if (diff < 7)  return `${diff} dias atrás`
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '28px 16px' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>🔧</div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
        Nenhum serviço registrado ainda.<br />
        Adicione seu primeiro atendimento para ver o histórico aqui.
      </p>
    </div>
  )
}

export function TransacoesList({ transacoes }: Props) {
  return (
    <section style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '20px',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 16 }}>
        🕒 Últimos atendimentos
      </p>

      {transacoes.length === 0 ? <EmptyState /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transacoes.map(tx => (
            <div key={tx.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              gap: 12,
            }}>
              {/* Ícone status */}
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: tx.paid ? 'rgba(0,214,143,0.12)' : 'rgba(255,209,102,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15,
              }}>
                {tx.paid ? '✓' : '⏳'}
              </div>

              {/* Cliente + Serviço */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  margin: 0, marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {tx.client_name  ?? 'Cliente avulso'}
                </p>
                <p style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.45)',
                  margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {tx.service_name ?? tx.description ?? 'Serviço avulso'}
                </p>
              </div>

              {/* Valor + data */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{
                  fontSize: 14, fontWeight: 800,
                  color: tx.paid ? 'var(--green)' : '#ffd166',
                  margin: 0, marginBottom: 2,
                  fontFamily: 'Syne, sans-serif',
                }}>
                  {brl(tx.amount)}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  {dataRelativa(tx.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
