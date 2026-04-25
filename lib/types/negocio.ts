// lib/types/negocio.ts

export interface PLMes {
  // Mês atual
  receita: number
  despesa: number
  lucro: number
  margem_pct: number
  total_transacoes: number
  // Mês anterior
  receita_anterior: number
  despesa_anterior: number
  lucro_anterior: number
  // Variações
  crescimento_receita_pct: number | null
  crescimento_lucro_pct: number | null
}

export interface GraficoPonto {
  ano: number
  mes: number
  label: string
  receita: number
  despesa: number
  lucro: number
}

export interface NegocioDashboard {
  pl: PLMes
  grafico: GraficoPonto[]
}
