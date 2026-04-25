// app/dashboard/components/negocio/GraficoBarras6Meses.tsx
// Gráfico de barras agrupadas: receita × despesa × lucro — 6 meses, SVG puro

import type { GraficoPonto } from '@/lib/types/negocio'

interface Props { dados: GraficoPonto[] }

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const CORES = {
  receita: '#1a6cff',
  despesa: '#ff6b6b',
  lucro:   '#00d68f',
}

export function GraficoBarras6Meses({ dados }: Props) {
  if (dados.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Sem dados históricos ainda. As barras aparecerão conforme você registrar transações.
        </p>
      </div>
    )
  }

  // Valores máximos para escala — separar positivos e negativos
  const maxVal = Math.max(
    ...dados.flatMap(d => [d.receita, d.despesa, Math.abs(d.lucro)]),
    1
  )

  const W         = 480  // largura útil do gráfico
  const H         = 140  // altura da área de barras positivas
  const H_NEG     = 40   // altura reservada para lucro negativo
  const TOTAL_H   = H + H_NEG + 28  // + espaço labels
  const GROUP_W   = Math.floor(W / dados.length)
  const BAR_W     = Math.max(8, Math.floor(GROUP_W / 4) - 2)
  const LABEL_H   = 50
  const SVG_W     = W + 40
  const SVG_H     = TOTAL_H + LABEL_H

  const barHeight = (val: number) => Math.max(2, (val / maxVal) * H)

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: 'block', minWidth: 320 }}
        aria-label="Gráfico de receita, despesa e lucro dos últimos 6 meses"
      >
        {/* Linhas de grade */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = H - frac * H
          return (
            <g key={frac}>
              <line x1={36} y1={y} x2={SVG_W - 4} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              {frac > 0 && (
                <text x={32} y={y + 4} textAnchor="end"
                  fontSize={9} fill="rgba(255,255,255,0.3)" fontFamily="inherit">
                  {brl(maxVal * frac)}
                </text>
              )}
            </g>
          )
        })}

        {/* Linha zero */}
        <line x1={36} y1={H} x2={SVG_W - 4} y2={H}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {/* Barras por mês */}
        {dados.map((d, i) => {
          const cx   = 40 + i * GROUP_W + GROUP_W / 2
          const hR   = barHeight(d.receita)
          const hD   = barHeight(d.despesa)
          const hL   = barHeight(Math.abs(d.lucro))
          const lucroPosivo = d.lucro >= 0

          return (
            <g key={`${d.ano}-${d.mes}`}>
              {/* Receita */}
              <rect
                x={cx - BAR_W * 1.5 - 2} y={H - hR}
                width={BAR_W} height={hR} rx={3}
                fill={CORES.receita} opacity={0.85}
              />
              {/* Despesa */}
              <rect
                x={cx - BAR_W / 2} y={H - hD}
                width={BAR_W} height={hD} rx={3}
                fill={CORES.despesa} opacity={0.85}
              />
              {/* Lucro — cresce para cima se positivo, para baixo se negativo */}
              <rect
                x={cx + BAR_W / 2 + 2}
                y={lucroPosivo ? H - hL : H}
                width={BAR_W} height={hL} rx={3}
                fill={CORES.lucro}
                opacity={lucroPosivo ? 0.85 : 0.6}
              />

              {/* Label do mês */}
              <text
                x={cx} y={H + H_NEG + 14}
                textAnchor="middle" fontSize={10}
                fill="rgba(255,255,255,0.45)" fontFamily="inherit"
              >
                {d.label}
              </text>

              {/* Tooltip simples: valor no topo da barra de receita */}
              {hR > 20 && (
                <text
                  x={cx - BAR_W * 1.5 - 2 + BAR_W / 2}
                  y={H - hR - 4}
                  textAnchor="middle" fontSize={8}
                  fill={CORES.receita} fontFamily="inherit" fontWeight={700}
                >
                  {brl(d.receita)}
                </text>
              )}
            </g>
          )
        })}

        {/* Legenda */}
        {(['receita', 'despesa', 'lucro'] as const).map((key, i) => (
          <g key={key} transform={`translate(${40 + i * 100}, ${SVG_H - 18})`}>
            <rect width={10} height={10} rx={2} fill={CORES[key]} />
            <text x={14} y={9} fontSize={10} fill="rgba(255,255,255,0.5)" fontFamily="inherit"
              style={{ textTransform: 'capitalize' }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
