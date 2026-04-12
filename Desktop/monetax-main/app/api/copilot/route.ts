import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { message, user_id, history } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get user financial context
  const [{ data: profile }, { data: transactions }, { data: debts }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user_id).single(),
    supabase.from("transactions").select("*").eq("user_id", user_id).order("date", { ascending: false }).limit(20),
    supabase.from("debts").select("*").eq("user_id", user_id),
  ]);

  const totalIncome = transactions?.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0) ?? 0;
  const totalExpense = transactions?.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) ?? 0;
  const totalDebt = debts?.reduce((s, d) => s + d.current_balance, 0) ?? 0;

  const systemPrompt = `Você é o Copiloto Financeiro da Monetax — um assistente de IA especializado em finanças pessoais para brasileiros, usando o Método C.D.F. (Controle, Direção, Fortuna).

Contexto do usuário:
- Nome: ${profile?.name ?? "usuário"}
- Plano: ${profile?.plan ?? "free"}
- Fase C.D.F.: ${profile?.cdf_phase ?? "controle"}
- Receita mensal declarada: R$ ${profile?.monthly_income?.toFixed(2) ?? "0,00"}
- Total de receitas (histórico): R$ ${totalIncome.toFixed(2)}
- Total de gastos (histórico): R$ ${totalExpense.toFixed(2)}
- Saldo atual: R$ ${(totalIncome - totalExpense).toFixed(2)}
- Dívidas totais: R$ ${totalDebt.toFixed(2)}

Responda de forma direta, prática e motivadora. Use linguagem informal e próxima. Seja específico com números quando relevante. Máximo 3 parágrafos curtos por resposta.`;

  const messages = [
    ...(history ?? []),
    { role: "user", content: message }
  ];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Desculpe, não consegui processar sua mensagem.";

    // Save to DB
    if (user_id) {
      await supabase.from("copilot_messages").insert([
        { user_id, role: "user", content: message },
        { user_id, role: "assistant", content: reply },
      ]);
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Copiloto temporariamente indisponível. Tente novamente." });
  }
}
