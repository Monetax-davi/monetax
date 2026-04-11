'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  name: string | null
  email: string | null
  plan: string
  cdf_phase: string
  monthly_income: number
  financial_goal: string | null
}

const faseInfo: Record<string, { label: string; cor: string; emoji: string }> = {
  controle: { label: 'Controle', cor: '#ff6b6b', emoji: '🔴' },
  direcao: { label: 'Direção', cor: '#ffd166', emoji: '🟡' },
  fortuna: { label: 'Fortuna', cor: '#00d68f', emoji: '🟢' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      setProfile(p)
      setLoading(false)
    })
  }, [router])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #1a6cff, #0040c0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 20,
          boxShadow: '0 0 20px rgba(26,108,255,0.4)'
        }}>⚡</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Carregando dashboard...</p>
      </div>
    </div>
  )

  const firstName = (profile?.name || 'Usuário').split(' ')[0]
  const fase = faseInfo[profile?.cdf_phase || 'controle']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
        background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 40
      }}>
        <div className="font-display" style={{ fontSize: 20, fontWeight: 800, padding: '4px 8px', marginBottom: 32 }}>
          Moneta<span style={{ color: 'var(--blue)' }}>X</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {[
            { ico: '🏠', label: 'Início', ativo: true },
            { ico: '💳', label: 'Transações', ativo: false },
            { ico: '🎯', label: 'Metas', ativo: false },
            { ico: '💸', label: 'Dívidas', ativo: false },
            { ico: '🤖', label: 'Copiloto IA', ativo: false },
            { ico: '📊', label: 'Relatórios', ativo: false },
          ].map(item => (
            <button key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: item.ativo ? 'rgba(26,108,255,0.12)' : 'transparent',
              color: item.ativo ? '#fff' : 'var(--text-muted)',
              fontSize: 14, fontWeight: item.ativo ? 600 : 400, width: '100%',
              outline: item.ativo ? '1px solid rgba(26,108,255,0.2)' : 'none',
              transition: 'all 0.15s'
            }}>
              <span>{item.ico}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div style={{
          padding: '12px', background: 'rgba(255,255,255,0.04)',
          borderRadius: 12, border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{firstName}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'capitalize' }}>
            Plano {profile?.plan || 'free'}
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '7px 0', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
            color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer'
          }}>
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, padding: '32px 36px', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Olá, {firstName} 👋
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${fase.cor}12`, border: `1px solid ${fase.cor}30`,
              borderRadius: 999, padding: '4px 12px'
            }}>
              <span style={{ fontSize: 12 }}>{fase.emoji}</span>
              <span style={{ fontSize: 12, color: fase.cor, fontWeight: 600 }}>Fase {fase.label}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Bem-vindo ao MonetaX</span>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Saldo do mês', valor: 'R$0,00', sub: 'Sem transações ainda', cor: 'var(--blue)', ico: '💰' },
            { label: 'Receitas', valor: 'R$0,00', sub: 'Nenhuma receita', cor: 'var(--green)', ico: '📈' },
            { label: 'Despesas', valor: 'R$0,00', sub: 'Nenhuma despesa', cor: '#ff6b6b', ico: '📉' },
            { label: 'Meta do mês', valor: '0%', sub: 'Configure suas metas', cor: '#ffd166', ico: '🎯' },
          ].map(card => (
            <div key={card.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '22px 20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{card.label}</span>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${card.cor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 14 }}>{card.ico}</span>
                </div>
              </div>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: card.cor, marginBottom: 4 }}>
                {card.valor}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Empty state / Onboarding nudge */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,108,255,0.08) 0%, rgba(0,214,143,0.04) 100%)',
          border: '1px solid rgba(26,108,255,0.2)',
          borderRadius: 20, padding: '40px 36px', textAlign: 'center'
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
            Comece a usar o MonetaX
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: 400, margin: '0 auto 28px' }}>
            Adicione sua primeira transação para ativar o Copiloto IA e começar sua jornada de {fase.label}.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              padding: '12px 24px', borderRadius: 10,
              background: 'var(--blue)', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, fontFamily: 'Syne, sans-serif'
            }}>
              + Adicionar transação
            </button>
            <button style={{
              padding: '12px 24px', borderRadius: 10,
              background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border)', cursor: 'pointer',
              fontWeight: 500, fontSize: 14
            }}>
              🤖 Perguntar ao Copiloto
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
