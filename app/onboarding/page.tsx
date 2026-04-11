'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const steps = [
  {
    id: 'meta',
    titulo: 'Qual é o seu principal objetivo?',
    subtitulo: 'Isso vai personalizar toda a sua experiência no MonetaX',
    campo: 'financial_goal',
    opcoes: [
      { valor: 'sair_dividas', emoji: '🔓', titulo: 'Sair das dívidas', desc: 'Quitar cartão, empréstimos e financiamentos' },
      { valor: 'reserva', emoji: '🛡️', titulo: 'Criar reserva de emergência', desc: 'Ter uma rede de segurança financeira' },
      { valor: 'investir', emoji: '📈', titulo: 'Começar a investir', desc: 'Fazer o dinheiro trabalhar por mim' },
      { valor: 'organizar', emoji: '🗂️', titulo: 'Organizar as finanças', desc: 'Saber para onde vai cada centavo' },
    ]
  },
  {
    id: 'renda',
    titulo: 'Qual a sua renda mensal aproximada?',
    subtitulo: 'Usamos isso para calibrar as metas da metodologia C.D.F.',
    campo: 'monthly_income',
    opcoes: [
      { valor: '1500', emoji: '💼', titulo: 'Até R$1.500', desc: 'Salário mínimo ou renda variável baixa' },
      { valor: '3000', emoji: '💼', titulo: 'R$1.500 – R$3.000', desc: 'Renda média-baixa' },
      { valor: '6000', emoji: '💰', titulo: 'R$3.000 – R$6.000', desc: 'Renda média' },
      { valor: '10000', emoji: '💎', titulo: 'Acima de R$6.000', desc: 'Renda média-alta ou alta' },
    ]
  },
  {
    id: 'fase',
    titulo: 'Em qual fase você se encontra?',
    subtitulo: 'Seja honesto — a IA vai te ajudar de onde você está',
    campo: 'cdf_phase',
    opcoes: [
      { valor: 'controle', emoji: '🔴', titulo: 'Controle', desc: 'Gastos descontrolados, dívidas ou sem visibilidade financeira' },
      { valor: 'direcao', emoji: '🟡', titulo: 'Direção', desc: 'Consigo pagar as contas, mas não sobra nada para investir' },
      { valor: 'fortuna', emoji: '🟢', titulo: 'Fortuna', desc: 'Tenho controle e quero otimizar e fazer crescer o patrimônio' },
    ]
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [userName, setUserName] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'você'
      setUserName(name.split(' ')[0])
    })
  }, [router])

  const step = steps[stepIndex]
  const progressPct = ((stepIndex + 1) / steps.length) * 100

  function selecionar(valor: string) {
    setRespostas(prev => ({ ...prev, [step.campo]: valor }))
  }

  async function avancar() {
    if (!respostas[step.campo]) return

    if (stepIndex < steps.length - 1) {
      setStepIndex(i => i + 1)
      return
    }

    // Último step — salvar e redirecionar
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || userName,
      financial_goal: respostas.financial_goal,
      monthly_income: parseFloat(respostas.monthly_income),
      cdf_phase: respostas.cdf_phase,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.error('Erro ao salvar onboarding:', error)
    }

    setDone(true)
    // Pequeno delay para mostrar estado de sucesso antes de redirecionar
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }

  if (!mounted) return null

  // Tela de sucesso antes do redirect
  if (done) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 20
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(0,214,143,0.15)', border: '2px solid var(--green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
      }}>✅</div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 800 }}>Tudo pronto!</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Indo para o seu dashboard...</p>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '-10%', right: '-10%',
        width: '50vw', height: '50vw', maxWidth: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,108,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>
          Moneta<span style={{ color: 'var(--blue)' }}>X</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {stepIndex + 1} de {steps.length}
          </span>
          <div style={{ width: 120, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
            <div style={{
              height: '100%', borderRadius: 999, background: 'var(--blue)',
              width: `${progressPct}%`, transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ width: '100%', maxWidth: 560, zIndex: 1 }}>
        {stepIndex === 0 && userName && (
          <p style={{ color: 'var(--blue-light)', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
            Olá, {userName} 👋
          </p>
        )}

        <h1 className="font-display" style={{
          fontSize: 'clamp(26px, 4vw, 34px)', fontWeight: 800,
          letterSpacing: '-1px', marginBottom: 10, lineHeight: 1.15
        }}>
          {step.titulo}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 36, lineHeight: 1.55 }}>
          {step.subtitulo}
        </p>

        {/* Opções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {step.opcoes.map((opcao) => {
            const sel = respostas[step.campo] === opcao.valor
            return (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => selecionar(opcao.valor)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 20px', borderRadius: 14, border: 'none',
                  background: sel ? 'rgba(26,108,255,0.12)' : 'rgba(255,255,255,0.03)',
                  outline: sel ? '1.5px solid rgba(26,108,255,0.5)' : '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.18s',
                  boxShadow: sel ? '0 0 20px rgba(26,108,255,0.12)' : 'none'
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: sel ? 'rgba(26,108,255,0.2)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, transition: 'background 0.18s'
                }}>
                  {opcao.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600,
                    color: sel ? '#fff' : 'var(--text)',
                    fontFamily: 'Syne, sans-serif', marginBottom: 3
                  }}>
                    {opcao.titulo}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {opcao.desc}
                  </div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  border: sel ? '6px solid var(--blue)' : '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.18s'
                }} />
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={avancar}
          disabled={!respostas[step.campo] || saving}
          style={{
            width: '100%', padding: '16px 0', borderRadius: 12,
            background: respostas[step.campo]
              ? 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)'
              : 'rgba(255,255,255,0.05)',
            color: respostas[step.campo] ? '#fff' : 'var(--text-muted)',
            fontWeight: 700, fontSize: 15, border: 'none',
            cursor: respostas[step.campo] && !saving ? 'pointer' : 'not-allowed',
            fontFamily: 'Syne, sans-serif',
            boxShadow: respostas[step.campo] ? '0 0 28px rgba(26,108,255,0.35)' : 'none',
            transition: 'all 0.25s'
          }}
        >
          {saving
            ? '⏳ Salvando seu perfil...'
            : stepIndex < steps.length - 1
              ? 'Continuar →'
              : '🚀 Entrar no dashboard'}
        </button>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 28 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === stepIndex ? 24 : 6, height: 6, borderRadius: 999,
              background: i <= stepIndex ? 'var(--blue)' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
