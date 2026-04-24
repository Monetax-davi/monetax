// app/dashboard/components/autonomo/ServicosIndicadores.tsx
// Indicadores: total de serviços, clientes e serviço mais vendido

import type { ServicosIndicadores as ServicosIndicadoresType } from '@/lib/types/autonomo'

interface Props {
  dados: ServicosIndicadoresType
}

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

export function ServicosIndicadores({ dados }: Props) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '20px',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 16 }}>
        📋 Seus números
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        {/* Serviços cadastrados */}
        <div style={{
          flex: 1, borderRadius: 10, padding: '12px',
          background: 'rgba(26,108,255,0.08)',
          border: '1px solid rgba(26,108,255,0.15)',
        }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            {dados.total_services}
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, marginTop: 2 }}>
            Serviços ativos
          </p>
        </div>

        {/* Clientes cadastrados */}
        <div style={{
          flex: 1, borderRadius: 10, padding: '12px',
          background: 'rgba(26,108,255,0.08)',
          border: '1px solid rgba(26,108,255,0.15)',
        }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)', margin: 0, fontFamily: 'Syne, sans-serif' }}>
            {dados.total_clients}
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, marginTop: 2 }}>
            Clientes ativos
          </p>
        </div>
      </div>

      {/* Serviço mais vendido */}
      {dados.top_service ? (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: 'rgba(0,214,143,0.07)',
          border: '1px solid rgba(0,214,143,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', margin: 0, marginBottom: 3, letterSpacing: '0.07em' }}>
              🏆 Mais vendido este mês
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>
              {dados.top_service.name}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', margin: 0 }}>
              {brl(dados.top_service.total)}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              {dados.top_service.count}× vendido
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Nenhum serviço vendido este mês ainda.
          </p>
        </div>
      )}
    </div>
  )
}
