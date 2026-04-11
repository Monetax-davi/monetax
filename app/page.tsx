'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5,8,15,0.88)', backdropFilter: 'blur(14px)'
      }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
          Moneta<span style={{ color: 'var(--blue)' }}>X</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 22px', borderRadius: 10,
              background: 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)',
              color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              fontFamily: 'Syne, sans-serif', boxShadow: '0 0 18px rgba(26,108,255,0.3)'
            }}>
              Ir para o meu dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" style={{
                color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', fontWeight: 500
              }}>Entrar</Link>
              <Link href="/login?modo=cadastro" style={{
                padding: '10px 20px', borderRadius: 10,
                background: 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)',
                color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                fontFamily: 'Syne, sans-serif', boxShadow: '0 0 18px rgba(26,108,255,0.25)'
              }}>Começar Grátis</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '100px 24px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)', width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,108,255,0.11) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(26,108,255,0.1)', border: '1px solid rgba(26,108,255,0.25)',
          borderRadius: 999, padding: '6px 16px', marginBottom: 28
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          <span style={{ color: 'var(--blue-light)', fontSize: 13, fontWeight: 500 }}>IA financeira para quem quer sair das dívidas</span>
        </div>

        <h1 className="font-display" style={{
          fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24, maxWidth: 800
        }}>
          Saia das dívidas.<br />
          <span style={{ color: 'var(--blue)' }}>Construa sua fortuna.</span>
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--text-muted)', maxWidth: 520,
          lineHeight: 1.65, marginBottom: 44
        }}>
          O MonetaX usa IA para criar seu plano financeiro personalizado — do controle das dívidas até a construção de patrimônio real.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/login?modo=cadastro" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 34px', borderRadius: 12,
            background: 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)',
            color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
            fontFamily: 'Syne, sans-serif', letterSpacing: '-0.3px',
            boxShadow: '0 0 32px rgba(26,108,255,0.38)'
          }}>
            ⚡ Começar grátis agora
          </Link>
          <a href="#precos" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 28px', borderRadius: 12,
            border: '1px solid var(--border)',
            color: 'var(--text-muted)', fontWeight: 500, fontSize: 15, textDecoration: 'none'
          }}>
            Ver planos e preços ↓
          </a>
        </div>

        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)', opacity: 0.7 }}>
          Grátis para sempre • Sem cartão de crédito
        </p>
      </section>

      {/* METODOLOGIA CDF */}
      <section id="como-funciona" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
            A metodologia <span style={{ color: 'var(--blue)' }}>C.D.F.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Três fases para transformar sua vida financeira</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { fase: 'C', titulo: 'Controle', desc: 'Mapeie todas suas despesas, dívidas e receitas. A IA identifica onde você está perdendo dinheiro.', cor: '#ff6b6b' },
            { fase: 'D', titulo: 'Direção', desc: 'Receba um plano personalizado com metas realistas para quitar dívidas e criar reservas de emergência.', cor: 'var(--blue)' },
            { fase: 'F', titulo: 'Fortuna', desc: 'Com as bases sólidas, comece a investir com estratégia e construa patrimônio de verdade.', cor: 'var(--green)' },
          ].map((item) => (
            <div key={item.fase} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '32px 28px'
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${item.cor}15`, border: `1px solid ${item.cor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
              }}>
                <span className="font-display" style={{ fontSize: 20, fontWeight: 800, color: item.cor }}>{item.fase}</span>
              </div>
              <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{item.titulo}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREÇOS — id="precos" para o botão "Ver planos e preços ↓" funcionar */}
      <section id="precos" style={{ padding: '80px 24px', maxWidth: 940, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>
            Simples e transparente
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Comece grátis, faça upgrade quando quiser</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

          {/* FREE */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '36px 28px'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>Gratuito</p>
            <div className="font-display" style={{ fontSize: 40, fontWeight: 800, marginBottom: 4 }}>R$0</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Para sempre</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Dashboard completo', 'Controle de gastos', 'Metas financeiras', 'Copiloto IA (limitado)'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: 'var(--green)', fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/login?modo=cadastro" style={{
              display: 'block', textAlign: 'center', padding: '13px 0', borderRadius: 10,
              border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600,
              fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif'
            }}>
              Começar Grátis
            </Link>
          </div>

          {/* PRO MENSAL */}
          <div style={{
            background: 'linear-gradient(160deg, #0c1a3a 0%, #0c1120 100%)',
            border: '1px solid rgba(26,108,255,0.4)',
            borderRadius: 20, padding: '36px 28px', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '4px 16px', borderRadius: 999, fontFamily: 'Syne, sans-serif',
              letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap'
            }}>MAIS POPULAR</div>
            <p style={{ color: 'var(--blue-light)', fontSize: 14, marginBottom: 8 }}>Pro Mensal</p>
            <div className="font-display" style={{ fontSize: 40, fontWeight: 800, marginBottom: 4 }}>
              R$27<span style={{ fontSize: 18 }}>,90</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>/mês</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Tudo do Gratuito', 'Copiloto IA ilimitado', 'Simulador de dívidas', 'Open Finance', 'Relatórios avançados'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: 'var(--blue-light)', fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/login?modo=cadastro&plano=mensal" style={{
              display: 'block', textAlign: 'center', padding: '13px 0', borderRadius: 10,
              background: 'var(--blue)', color: '#fff', fontWeight: 700,
              fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif',
              boxShadow: '0 0 20px rgba(26,108,255,0.3)'
            }}>
              Começar Grátis
            </Link>
          </div>

          {/* PRO ANUAL */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '36px 28px'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>Pro Anual</p>
            <div className="font-display" style={{ fontSize: 40, fontWeight: 800, marginBottom: 4 }}>
              R$279<span style={{ fontSize: 18 }}>,90</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>/ano • economize 2 meses</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {['Tudo do Pro Mensal', 'Prioridade no suporte', 'Acesso antecipado', 'Relatório anual C.D.F.'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: 'var(--green)', fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/login?modo=cadastro&plano=anual" style={{
              display: 'block', textAlign: 'center', padding: '13px 0', borderRadius: 10,
              border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600,
              fontSize: 14, textDecoration: 'none', fontFamily: 'Syne, sans-serif'
            }}>
              Começar Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', padding: '60px 40px',
          background: 'var(--bg-card)', border: '1px solid rgba(26,108,255,0.18)',
          borderRadius: 24
        }}>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Pronto para mudar sua vida financeira?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
            Junte-se a quem já está no controle. Comece hoje, é grátis.
          </p>
          <Link href="/login?modo=cadastro" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 40px', borderRadius: 12,
            background: 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)',
            color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none',
            fontFamily: 'Syne, sans-serif', letterSpacing: '-0.3px',
            boxShadow: '0 0 40px rgba(26,108,255,0.32)'
          }}>
            ⚡ Começar grátis agora
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16
      }}>
        <div className="font-display" style={{ fontWeight: 800, fontSize: 18 }}>
          Moneta<span style={{ color: 'var(--blue)' }}>X</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[['Privacidade', '/privacidade'], ['Termos', '/termos'], ['Contato', '/contato']].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>© 2025 MonetaX. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
