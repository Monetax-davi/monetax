// app/dashboard/components/shared/PlanBanner.tsx
// Banner de upgrade inline — exibido apenas para plano free ou monthly (sem annual)

'use client'

import type { PlanType } from '@/lib/types/permissions'

interface Props { plan: PlanType }

const CONFIG = {
  free: {
    icon:    '⚡',
    titulo:  'Desbloqueie tudo no MonetaX',
    texto:   'Você está no plano Grátis. Faça upgrade para o plano Mensal e tenha relatórios, alertas, copiloto avançado e muito mais.',
    cta:     'Ver planos — a partir de R$27,90/mês',
    cor:     '#1a6cff',
    bg:      'rgba(26,108,255,0.06)',
    border:  'rgba(26,108,255,0.18)',
  },
  monthly: {
    icon:    '🏆',
    titulo:  'Plano Anual: o mais completo',
    texto:   'Você está no plano Mensal. Faça upgrade para o Anual e desbloqueie previsões com IA, gráficos avançados e suporte prioritário.',
    cta:     'Fazer upgrade para Anual — R$279,90/ano',
    cor:     '#ffd166',
    bg:      'rgba(255,209,102,0.06)',
    border:  'rgba(255,209,102,0.18)',
  },
}

export function PlanBanner({ plan }: Props) {
  if (plan === 'annual') return null

  const c = CONFIG[plan]

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 14,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${c.cor}15`, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          {c.icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 3 }}>
            {c.titulo}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: 480, lineHeight: 1.5 }}>
            {c.texto}
          </p>
        </div>
      </div>
      <button
        onClick={() => window.location.href = '/#precos'}
        style={{
          padding: '9px 18px', borderRadius: 8, flexShrink: 0,
          background: `linear-gradient(135deg, ${c.cor}, ${c.cor}cc)`,
          color: c.cor === '#ffd166' ? '#000' : '#fff',
          border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 13,
          fontFamily: 'Syne, sans-serif',
          whiteSpace: 'nowrap',
          boxShadow: `0 0 14px ${c.cor}25`,
        }}
      >
        {c.cta}
      </button>
    </div>
  )
}
