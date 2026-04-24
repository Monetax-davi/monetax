// app/dashboard/components/pessoal/SpendingAlert.tsx
// Alerta simples: gasto atual vs período anterior, linguagem sem termos técnicos

import type { CategoryAlert } from '@/lib/types/dashboard'

interface Props {
  alerts: CategoryAlert[]
}

// Mapeia variação para ícone + tom amigável
function getAlertTone(pct: number): { icon: string; color: string; label: string } {
  if (pct >= 50) return { icon: '🔴', color: '#ff6b6b', label: 'Atenção' }
  if (pct >= 30) return { icon: '🟠', color: '#ff9f43', label: 'Cuidado' }
  return             { icon: '🟡', color: '#ffd166', label: 'Aviso' }
}

// Converte a mensagem técnica em texto simples para o usuário final
function humanMessage(alert: CategoryAlert): string {
  const pct = Math.abs(Math.round(alert.variation_pct))
  return `Você gastou ${pct}% a mais em ${alert.category} comparado ao mês passado.`
}

export function SpendingAlert({ alerts }: Props) {
  if (alerts.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
      {alerts.map((alert) => {
        const tone = getAlertTone(alert.variation_pct)
        return (
          <div
            key={alert.category}
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              background: `${tone.color}10`,
              border: `1px solid ${tone.color}30`,
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>{tone.icon}</span>
            <div>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: tone.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: 2,
              }}>
                {tone.label}
              </span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                {humanMessage(alert)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
