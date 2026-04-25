// supabase/functions/plan-insights/index.ts
// Edge Function: insights avançados exclusivos para plano anual
// Validação de plano 100% server-side — nunca confia no frontend

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Extrair JWT do header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'missing_auth', message: 'Token de autenticação obrigatório.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Criar cliente com contexto do usuário (RLS ativo)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    // 3. Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Sessão inválida.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. VALIDAÇÃO DE PLANO NO BACKEND — nunca confia no frontend
    const { data: permission } = await supabase
      .rpc('can_access_feature', {
        p_user_id: user.id,
        p_feature: 'edge_fn_insights',
      })

    if (!permission?.allowed) {
      return new Response(
        JSON.stringify({
          error: 'plan_required',
          plan_required: 'annual',
          message: permission?.reason ?? 'Esta função requer o plano Anual.',
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 5. Buscar dados para gerar insights (só chega aqui se plano anual)
    const { data: stats } = await supabase.rpc('get_negocio_dashboard', {
      p_user_id: user.id,
    })

    const pl = stats?.pl ?? {}

    // 6. Gerar insights baseados nos dados reais
    const insights = generateInsights(pl)

    return new Response(
      JSON.stringify({
        success: true,
        plan: 'annual',
        insights,
        generated_at: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[plan-insights]', err)
    return new Response(
      JSON.stringify({ error: 'internal', message: 'Erro interno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateInsights(pl: Record<string, number>): string[] {
  const insights: string[] = []
  const receita  = pl.receita  ?? 0
  const despesa  = pl.despesa  ?? 0
  const lucro    = pl.lucro    ?? 0
  const margem   = pl.margem_pct ?? 0
  const crescRec = pl.crescimento_receita_pct

  if (receita === 0) {
    return ['Sem dados suficientes este mês para gerar previsões. Adicione transações para ativar os insights avançados.']
  }

  // Margem
  if (margem < 0)       insights.push(`⚠️ Margem negativa (${margem}%). Suas despesas superam a receita este mês. Priorize cortar custos variáveis.`)
  else if (margem < 15) insights.push(`📊 Margem de ${margem}% está abaixo do ideal. Negócios saudáveis operam acima de 20%.`)
  else if (margem >= 30) insights.push(`✅ Excelente margem de ${margem}%. Você está operando com eficiência acima da média.`)

  // Crescimento de receita
  if (crescRec !== null && crescRec !== undefined) {
    if (crescRec > 20)   insights.push(`🚀 Receita cresceu ${crescRec}% vs mês anterior. Momento ideal para reinvestir em aquisição.`)
    else if (crescRec < -10) insights.push(`📉 Receita caiu ${Math.abs(crescRec)}% vs mês anterior. Revise sua estratégia de vendas.`)
  }

  // Previsão simples (plano anual: acesso a lógica de projeção)
  if (receita > 0 && margem > 0) {
    const projecao = Math.round(receita * 1.05)
    insights.push(`📅 Previsão: mantendo o ritmo atual, sua receita projetada para o próximo mês é de R$ ${projecao.toLocaleString('pt-BR')}.`)
  }

  // Alerta de despesa alta
  if (despesa > receita * 0.8 && lucro >= 0) {
    insights.push(`🔍 Suas despesas representam ${Math.round(despesa/receita*100)}% da receita. Considere revisar custos fixos.`)
  }

  return insights.length > 0 ? insights : ['Seus números estão saudáveis. Continue monitorando semanalmente para manter a tendência.']
}
