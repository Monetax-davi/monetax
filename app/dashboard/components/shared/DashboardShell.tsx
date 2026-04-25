// app/dashboard/components/shared/DashboardShell.tsx
// Client Component mínimo: só gerencia estado da sidebar e logout
// Recebe ctx como prop do Server Component pai — sem fetch próprio

'use client'

import { useRouter } from 'next/navigation'
import { useCallback, memo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { FullDashboardContext } from '@/lib/actions/get-full-dashboard-context'

const PLAN_LABEL: Record<string, string> = {
  free:    'Grátis',
  monthly: 'Mensal',
  annual:  'Anual',
}

const NAV = [
  { ico: '🏠', label: 'Início',       ativo: true  },
  { ico: '💳', label: 'Transações',   ativo: false },
  { ico: '🎯', label: 'Metas',        ativo: false },
  { ico: '💸', label: 'Dívidas',      ativo: false },
  { ico: '🤖', label: 'Copiloto IA',  ativo: false },
  { ico: '📊', label: 'Relatórios',   ativo: false },
]

interface Props {
  ctx: FullDashboardContext
  children: React.ReactNode
}

// memo: re-renderiza só se ctx ou children mudarem
export const DashboardShell = memo(function DashboardShell({ ctx, children }: Props) {
  const router   = useRouter()
  const firstName = (ctx.name || 'Usuário').split(' ')[0]

  const logout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }, [router])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 224,
        background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 40,
      }}>
        <div className="font-display" style={{
          fontSize: 20, fontWeight: 800, padding: '4px 8px', marginBottom: 32,
        }}>
          Moneta<span style={{ color: 'var(--blue)' }}>X</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV.map(item => (
            <button key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, border: 'none',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              background: item.ativo ? 'rgba(26,108,255,0.12)' : 'transparent',
              color: item.ativo ? '#fff' : 'var(--text-muted)',
              fontSize: 14, fontWeight: item.ativo ? 600 : 400,
              outline: item.ativo ? '1px solid rgba(26,108,255,0.2)' : 'none',
              transition: 'background 0.15s, color 0.15s',
            }}>
              <span style={{ fontSize: 16 }}>{item.ico}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div style={{
          padding: 14, background: 'rgba(255,255,255,0.04)',
          borderRadius: 12, border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{firstName}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 12px' }}>
            Plano {PLAN_LABEL[ctx.plan] ?? ctx.plan}
          </p>
          <button onClick={logout} style={{
            width: '100%', padding: '8px 0', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
            color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
          }}>
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main content — injetado pelo Server Component ────────── */}
      <main style={{ marginLeft: 224, padding: '36px 40px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
})
