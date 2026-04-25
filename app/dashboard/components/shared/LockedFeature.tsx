// app/dashboard/components/shared/LockedFeature.tsx
// Overlay de paywall — exibido sobre qualquer widget bloqueado por plano
// Uso: <LockedFeature feature="grafico_6meses"> <Widget /> </LockedFeature>

'use client'

import { canAccessFeature, requiredPlanLabel } from '@/lib/types/permissions'
import type { PlanType, Feature } from '@/lib/types/permissions'

const PLAN_BADGE: Record<string, { label: string; cor: string }> = {
  monthly: { label: 'Mensal',  cor: '#1a6cff' },
  annual:  { label: 'Anual',   cor: '#ffd166' },
}

interface Props {
  plan: PlanType
  feature: Feature
  children: React.ReactNode
  // Se true: mostra children borrados com overlay; se false: não renderiza children
  blur?: boolean
}

export function LockedFeature({ plan, feature, children, blur = true }: Props) {
  const allowed = canAccessFeature(plan, feature)
  if (allowed) return <>{children}</>

  const planRequired = requiredPlanLabel(feature)
  const badge = PLAN_BADGE[planRequired.toLowerCase()] ?? { label: planRequired, cor: '#1a6cff' }

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
      {/* Children borrados (preview) */}
      {blur && (
        <div style={{ filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none', userSelect: 'none' }}>
          {children}
        </div>
      )}

      {/* Overlay de upgrade */}
      <div style={{
        position: blur ? 'absolute' : 'relative',
        inset: blur ? 0 : undefined,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: blur
          ? 'linear-gradient(135deg, rgba(3,5,8,0.82) 0%, rgba(3,5,8,0.92) 100%)'
          : 'var(--bg-card)',
        borderRadius: 16,
        border: `1px solid ${badge.cor}22`,
        padding: blur ? undefined : '32px 24px',
        backdropFilter: blur ? 'blur(2px)' : undefined,
        textAlign: 'center',
        gap: 12,
        minHeight: blur ? undefined : 120,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${badge.cor}15`,
          border: `1px solid ${badge.cor}35`,
          borderRadius: 999, padding: '4px 12px', marginBottom: 4,
        }}>
          <span style={{ fontSize: 12 }}>🔒</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: badge.cor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Plano {badge.label}
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5, maxWidth: 260 }}>
          Esta função está disponível no plano <strong style={{ color: '#fff' }}>{badge.label}</strong>.
        </p>

        <button
          onClick={() => window.location.href = '/#precos'}
          style={{
            marginTop: 4,
            padding: '9px 20px', borderRadius: 8,
            background: `linear-gradient(135deg, ${badge.cor}, ${badge.cor}cc)`,
            color: badge.cor === '#ffd166' ? '#000' : '#fff',
            border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 13,
            fontFamily: 'Syne, sans-serif',
            boxShadow: `0 0 14px ${badge.cor}30`,
            transition: 'opacity 0.15s',
          }}
        >
          Fazer upgrade →
        </button>
      </div>
    </div>
  )
}
