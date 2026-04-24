// app/dashboard/components/pessoal/TopCategories.tsx
// Server Component: busca dados no Supabase e renderiza gráfico + alertas
// Visível apenas para userType === 'pessoal' (controle feito pelo dashboard pai)

import { getTopCategoriesPessoal } from '@/lib/actions/get-top-categories'
import { CategoryBarChart } from './CategoryBarChart'
import { SpendingAlert }    from './SpendingAlert'

interface Props {
  userId: string
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

// Estado vazio: sem transações ainda
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '28px 16px' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
        Nenhuma despesa registrada ainda.<br />
        Adicione uma transação para ver para onde vai seu dinheiro.
      </p>
    </div>
  )
}

export async function TopCategories({ userId }: Props) {
  const data = await getTopCategoriesPessoal(userId)

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 2 }}>
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

      {/* Gráfico ou estado vazio */}
      {categories.length === 0
        ? <EmptyState />
        : (
          <>
            <CategoryBarChart categories={categories} />
            <SpendingAlert alerts={alerts} />
          </>
        )
      }
    </section>
  )
}
