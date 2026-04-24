// lib/types/autonomo.ts

export interface CaixaBloco {
  total: number
  count: number
  paid: number
  pending: number
}

export interface ServicosIndicadores {
  total_services: number
  total_clients: number
  top_service: {
    name: string
    count: number
    total: number
  } | null
}

export interface AutonomoTransacao {
  id: string
  amount: number
  paid: boolean
  date: string
  description: string | null
  client_name: string | null
  service_name: string | null
  service_price: number | null
}

export interface AutonomoDashboard {
  hoje:     CaixaBloco
  semana:   CaixaBloco
  servicos: ServicosIndicadores
  ultimas:  AutonomoTransacao[]
}
