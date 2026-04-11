#!/usr/bin/env bash
set -e

echo ""
echo "🚀 MonetaX Deploy Script"
echo "========================"
echo ""

# 1. Verificar se está no repositório certo
if [ ! -f "package.json" ]; then
  echo "❌ Execute este script dentro da pasta do projeto MonetaX"
  exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🏗️  Testando build..."
npm run build

echo ""
echo "📤 Fazendo commit e push para o GitHub..."
git add -A
git commit -m "feat: auth flow funcional — login, cadastro, onboarding, dashboard routing

- Nova tela /login estilo onboarding (dark, animated, toggle login/cadastro)
- /onboarding: 3 steps (objetivo, renda, fase CDF) com save no Supabase
- /dashboard: layout com sidebar, cards de resumo financeiro
- middleware.ts: proteção de rotas, redirect por onboarding_completed
- /auth/callback: exchange code e roteamento pós-auth
- Landing Page: botões CTA → /login?modo=cadastro
- Botão 'Ir para o meu dashboard →' visível para usuários logados
- .env.production: vars públicas do Supabase embutidas no build"
git push

echo ""
echo "✅ Deploy enviado! A Vercel vai buildar em ~30 segundos."
echo ""
echo "🔗 Acompanhe em: https://vercel.com/monetax-davis-projects/monetax"
echo "🌐 Produção:      https://monetax.vercel.app"
echo ""
echo "⚠️  PASSO FINAL (manual - 30 segundos):"
echo "   Supabase → Authentication → URL Configuration"
echo "   Adicione em 'Redirect URLs':"
echo "   https://monetax.vercel.app/auth/callback"
echo "   Link: https://supabase.com/dashboard/project/osvnganjualyvhpghkem/auth/url-configuration"
echo ""
