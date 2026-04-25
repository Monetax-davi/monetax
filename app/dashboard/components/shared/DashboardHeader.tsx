// app/dashboard/components/shared/DashboardHeader.tsx
// Server-safe: sem estado, sem hooks — renderizado no servidor

import type { UserType } from '@/lib/types/dashboard'

interface Props {
  name:     string | null
  userType: UserType
  phase:    string
  plan:     string
}

const FASE_INFO: Record<string, { label: string; cor: string; emoji: string }> = {
  controle: { label: 'Controle', cor: '#ff6b6b', emoji: '🔴' },
  direcao:  { label: 'Direção',  cor: '#ffd166', emoji: '🟡' },
  fortuna:  { label: 'Fortuna',  cor: '#00d68f', emoji: '🟢' },
}

// Saudação adaptativa por userType — não parece genérico
const GREETING: Record<UserType, (name: string) => string> = {
  pessoal:  name => `Olá, ${name} 👋`,
  autonomo: name => `E aí, ${name} 🔧`,
  negocio:  name => `Bom dia, ${name} 📊`,
}

const SUBTITLE: Record<UserType, (phase: string) => string> = {
  pessoal:  phase => `Sua jornada financeira pessoal — fase ${phase}`,
  autonomo: _ => 'Controle do seu negócio e atendimentos',
  negocio:  _ => 'Visão analítica do seu negócio',
}

export function DashboardHeader({ name, userType, phase, plan }: Props) {
  const firstName = (name || 'Usuário').split(' ')[0]
  const fase      = FASE_INFO[phase] ?? FASE_INFO.controle
  const greeting  = GREETING[userType]?.(firstName) ?? `Olá, ${firstName}`
  const subtitle  = SUBTITLE[userType]?.(fase.label) ?? ''

  const now = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div style={{ marginBottom: 32 }}>
      <h1 className="font-display" style={{
        fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 8px',
      }}>
        {greeting}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Badge da fase CDF — só para pessoal e autonomo */}
        {userType !== 'negocio' && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${fase.cor}12`, border: `1px solid ${fase.cor}30`,
            borderRadius: 999, padding: '4px 12px',
          }}>
            <span style={{ fontSize: 11 }}>{fase.emoji}</span>
            <span style={{ fontSize: 11, color: fase.cor, fontWeight: 600 }}>
              Fase {fase.label}
            </span>
          </div>
        )}

        {/* Badge do plano */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
          borderRadius: 999, padding: '4px 10px',
        }}>
          <span style={{ fontSize: 10 }}>
            {plan === 'annual' ? '🏆' : plan === 'monthly' ? '⚡' : '🆓'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {plan === 'annual' ? 'Anual' : plan === 'monthly' ? 'Mensal' : 'Grátis'}
          </span>
        </div>

        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{now}</span>
      </div>

      {subtitle && (
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '6px 0 0', lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
