// app/dashboard/components/shared/WelcomeCTA.tsx
// Server-safe: CTA adaptativo por userType + fase CDF

import type { UserType } from '@/lib/types/dashboard'

interface Props {
  userType: UserType
  phase:    string
  hasData:  boolean
}

const FASE_COR: Record<string, string> = {
  controle: '#ff6b6b',
  direcao:  '#ffd166',
  fortuna:  '#00d68f',
}

const CTA_CONFIG: Record<UserType, {
  icon: string
  titulo: string
  texto: (phase: string, cor: string) => React.ReactNode
  btn1:  string
  btn2:  string
}> = {
  pessoal: {
    icon:   '🚀',
    titulo: 'Bem-vindo ao MonetaX!',
    texto:  (phase, cor) => (
      <>
        Adicione sua primeira transação para ativar o Copiloto IA e começar sua
        jornada de <strong style={{ color: cor }}>{phase}</strong>.
      </>
    ),
    btn1: '+ Adicionar transação',
    btn2: '🤖 Perguntar ao Copiloto',
  },
  autonomo: {
    icon:   '🔧',
    titulo: 'Configure seus serviços',
    texto:  () => (
      <>
        Cadastre seus serviços e clientes para começar a registrar atendimentos
        e acompanhar seu caixa diário.
      </>
    ),
    btn1: '+ Adicionar serviço',
    btn2: '👤 Cadastrar cliente',
  },
  negocio: {
    icon:   '📊',
    titulo: 'Comece a monitorar seu negócio',
    texto:  () => (
      <>
        Adicione transações de receita e despesa para ativar o painel de
        P&L, margens e comparações mensais.
      </>
    ),
    btn1: '+ Lançar receita',
    btn2: '+ Lançar despesa',
  },
}

export function WelcomeCTA({ userType, phase, hasData }: Props) {
  if (hasData) return null

  const cfg = CTA_CONFIG[userType] ?? CTA_CONFIG.pessoal
  const cor  = FASE_COR[phase] ?? 'var(--blue)'

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26,108,255,0.07) 0%, rgba(0,214,143,0.03) 100%)',
      border: '1px solid rgba(26,108,255,0.18)',
      borderRadius: 20, padding: '48px 40px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 44, marginBottom: 16 }}>{cfg.icon}</div>
      <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>
        {cfg.titulo}
      </h2>
      <p style={{
        color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65,
        maxWidth: 440, margin: '0 auto 28px',
      }}>
        {cfg.texto(phase, cor)}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{
          padding: '12px 24px', borderRadius: 10,
          background: 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontWeight: 700, fontSize: 14, fontFamily: 'Syne, sans-serif',
          boxShadow: '0 0 18px rgba(26,108,255,0.25)',
        }}>
          {cfg.btn1}
        </button>
        <button style={{
          padding: '12px 24px', borderRadius: 10,
          background: 'transparent', color: 'var(--text-muted)',
          border: '1px solid var(--border)', cursor: 'pointer',
          fontWeight: 500, fontSize: 14,
        }}>
          {cfg.btn2}
        </button>
      </div>
    </div>
  )
}
