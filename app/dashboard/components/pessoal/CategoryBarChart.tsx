// app/dashboard/components/pessoal/CategoryBarChart.tsx
// Gráfico de barras horizontal em SVG puro — sem dependências externas

import type { CategoryData } from '@/lib/types/dashboard'

interface Props {
  categories: CategoryData[]
}

// Formata valor em BRL de forma simples
function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function CategoryBarChart({ categories }: Props) {
  if (categories.length === 0) return null

  const BAR_HEIGHT   = 28
  const BAR_GAP      = 20
  const LABEL_WIDTH  = 110
  const VALUE_WIDTH  = 72
  const CHART_WIDTH  = 280
  const TOTAL_WIDTH  = LABEL_WIDTH + CHART_WIDTH + VALUE_WIDTH + 16
  const SVG_HEIGHT   = categories.length * (BAR_HEIGHT + BAR_GAP) + 8

  const maxTotal = Math.max(...categories.map(c => c.total), 1)

  return (
    <svg
      viewBox={`0 0 ${TOTAL_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="Gráfico de categorias de gasto"
    >
      {categories.map((cat, i) => {
        const y       = i * (BAR_HEIGHT + BAR_GAP)
        const barW    = (cat.total / maxTotal) * CHART_WIDTH
        const barColor = cat.color || '#1a6cff'
        const bgColor  = `${barColor}22`

        return (
          <g key={cat.name}>
            {/* Ícone + nome */}
            <text
              x={0}
              y={y + BAR_HEIGHT / 2 + 1}
              dominantBaseline="middle"
              fontSize={13}
              fill="rgba(255,255,255,0.55)"
              fontFamily="inherit"
            >
              {cat.icon}
            </text>
            <text
              x={22}
              y={y + BAR_HEIGHT / 2 + 1}
              dominantBaseline="middle"
              fontSize={12}
              fill="rgba(255,255,255,0.75)"
              fontFamily="inherit"
            >
              {cat.name.length > 11 ? cat.name.slice(0, 10) + '…' : cat.name}
            </text>

            {/* Trilho da barra */}
            <rect
              x={LABEL_WIDTH}
              y={y}
              width={CHART_WIDTH}
              height={BAR_HEIGHT}
              rx={6}
              fill={bgColor}
            />

            {/* Barra preenchida */}
            <rect
              x={LABEL_WIDTH}
              y={y}
              width={Math.max(barW, 4)}
              height={BAR_HEIGHT}
              rx={6}
              fill={barColor}
              opacity={0.85}
            />

            {/* Percentual dentro da barra */}
            {barW > 36 && (
              <text
                x={LABEL_WIDTH + barW - 8}
                y={y + BAR_HEIGHT / 2 + 1}
                dominantBaseline="middle"
                textAnchor="end"
                fontSize={11}
                fontWeight={700}
                fill="#fff"
                fontFamily="inherit"
              >
                {cat.percentage}%
              </text>
            )}

            {/* Valor à direita */}
            <text
              x={TOTAL_WIDTH}
              y={y + BAR_HEIGHT / 2 + 1}
              dominantBaseline="middle"
              textAnchor="end"
              fontSize={12}
              fontWeight={600}
              fill="rgba(255,255,255,0.9)"
              fontFamily="inherit"
            >
              {formatBRL(cat.total)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
