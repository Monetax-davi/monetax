// app/dashboard/components/pessoal/TopCategoriesClient.tsx
// Client component: busca dados via API route e renderiza o widget
// Separado do server action para funcionar dentro de 'use client' pai

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CategoryBarChart } from './CategoryBarChart'
import { SpendingAlert }    from './SpendingAlert'
import type { TopCategoriesResult } from '@/lib/types/dashboard'

interface Props {
  userId: string
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '28px 16px' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
        Nenhuma despesa registrada ainda.<br />
        Adicione uma transação para ver para onde vai seu dinheiro.
      </p>
    </div>
  )
}

export function TopCategoriesClient({ userId }: Props) {
  const [data,    setData]    = useState<TopCategoriesResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.rpc('get_top_categories_pessoal', {
      p_user_id: userId,
      p_limit:   3,
    }).then(({ data: result, error }) => {
      if (!error && result) setData(result as TopCategoriesResult)
      setLoading(false)
    })
  }, [userId])

  const categories = data?.categories ?? []
  const alerts     = data?.alerts     ?? []
  const total      = data?.total_expenses ?? 0

  return (
    <section
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '22px 20px',
      }}
      aria-label="Onde seu dinheiro está indo"
    >
      {/* Cabeçalho */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 18,
      }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 2, color: '#fff' }}>
            Para onde vai seu dinheiro
          </h3>
          {total > 0 && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Total gasto este mês: {formatBRL(total)}
            </p>
          )}
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'rgba(26,108,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>
          📊
        </div>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Calculando...</span>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <CategoryBarChart categories={categories} />
          <SpendingAlert alerts={alerts} />
        </>
      )}
    </section>
  )
}
