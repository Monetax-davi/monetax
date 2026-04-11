'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const modoParam = searchParams.get('modo')
  const errorParam = searchParams.get('error')

  const [modo, setModo] = useState<'login' | 'cadastro'>(modoParam === 'cadastro' ? 'cadastro' : 'login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(errorParam === 'auth' ? 'Erro ao autenticar. Tente novamente.' : '')
  const [sucesso, setSucesso] = useState('')
  const [step, setStep] = useState(0)

  // Animated mount
  useEffect(() => {
    const t = setTimeout(() => setStep(1), 50)
    return () => clearTimeout(t)
  }, [])

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    if (modo === 'cadastro') {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { name: nome },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        setErro(error.message === 'User already registered' ? 'Email já cadastrado. Faça login.' : error.message)
      } else {
        setSucesso('Conta criada! Verifique seu email para confirmar. Você será redirecionado...')
        setTimeout(() => router.push('/onboarding'), 2500)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) {
        setErro('Email ou senha incorretos.')
      } else if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single()
        
        router.push(profile?.onboarding_completed ? '/dashboard' : '/onboarding')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px'
    }}>
      {/* Background glows */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '70vw', height: '70vw', maxWidth: 700, maxHeight: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,108,255,0.07) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '60vw', height: '60vw', maxWidth: 600, maxHeight: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,214,143,0.05) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440, position: 'relative', zIndex: 1,
        opacity: step ? 1 : 0,
        transform: step ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Logo */}
        <a href="/" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 36, textDecoration: 'none'
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #1a6cff, #0040c0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(26,108,255,0.4)'
          }}>
            <span style={{ fontSize: 16 }}>⚡</span>
          </div>
          <span className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Moneta<span style={{ color: 'var(--blue)' }}>X</span>
          </span>
        </a>

        {/* Card body */}
        <div style={{
          background: 'rgba(12,17,32,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '40px 36px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(26,108,255,0.05)'
        }}>
          {/* Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 4, marginBottom: 32
          }}>
            {(['login', 'cadastro'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setModo(m); setErro(''); setSucesso('') }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 9,
                  border: 'none', cursor: 'pointer',
                  background: modo === m ? 'rgba(26,108,255,0.9)' : 'transparent',
                  color: modo === m ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: 14,
                  fontFamily: 'Syne, sans-serif',
                  transition: 'all 0.2s',
                  boxShadow: modo === m ? '0 2px 12px rgba(26,108,255,0.3)' : 'none'
                }}
              >
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
              {modo === 'login' ? 'Bem-vindo de volta' : 'Comece sua jornada'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>
              {modo === 'login'
                ? 'Entre na sua conta MonetaX'
                : 'Crie sua conta grátis em segundos'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {modo === 'cadastro' && (
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 7, fontWeight: 500 }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 7, fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Senha</label>
                {modo === 'login' && (
                  <button type="button" style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--blue-light)', fontSize: 12, fontWeight: 500
                  }}>
                    Esqueci a senha
                  </button>
                )}
              </div>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder={modo === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••••'}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>

            {/* Erro / Sucesso */}
            {erro && (
              <div style={{
                background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)',
                borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: 15 }}>⚠️</span>
                <span style={{ color: '#ff8080', fontSize: 13, lineHeight: 1.4 }}>{erro}</span>
              </div>
            )}

            {sucesso && (
              <div style={{
                background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)',
                borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: 15 }}>✅</span>
                <span style={{ color: 'var(--green)', fontSize: 13, lineHeight: 1.4 }}>{sucesso}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                padding: '15px 0', borderRadius: 12,
                background: loading ? 'rgba(26,108,255,0.5)' : 'linear-gradient(135deg, #1a6cff 0%, #0050e6 100%)',
                color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Syne, sans-serif', letterSpacing: '-0.2px',
                boxShadow: loading ? 'none' : '0 0 24px rgba(26,108,255,0.35)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '...' : modo === 'login' ? 'Entrar na minha conta' : '⚡ Criar conta grátis'}
            </button>
          </form>

          {/* Divisor */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Trocar modo */}
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            {modo === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <button
              type="button"
              onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(''); setSucesso('') }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--blue-light)', fontWeight: 600, fontSize: 14
              }}
            >
              {modo === 'login' ? 'Criar conta grátis' : 'Fazer login'}
            </button>
          </p>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', color: 'var(--text-muted)', fontSize: 12,
          marginTop: 20, lineHeight: 1.5
        }}>
          Ao continuar, você concorda com os{' '}
          <a href="/termos" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Termos de Uso</a>
          {' '}e a{' '}
          <a href="/privacidade" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Política de Privacidade</a>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 15px', borderRadius: 10,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  color: '#fff', fontSize: 14,
  outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'DM Sans, sans-serif'
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}
