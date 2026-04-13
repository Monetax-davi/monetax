# MonetaX — Deploy no Vercel (3 comandos)

## PRÉ-REQUISITO: Configurar URL de callback no Supabase

Acesse: https://supabase.com/dashboard/project/osvnganjualyvhpghkem/auth/url-configuration

Em **Redirect URLs**, adicione:
```
https://monetax.com.br/auth/callback
```
Salve e pronto.

---

## Deploy via terminal (3 comandos)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Entrar na pasta deste ZIP (descompactado)
cd monetax-site-deploy

# 3. Deploy production direto (vai pedir login na primeira vez)
vercel --prod
```

Na primeira vez, o Vercel pergunta:
- "Set up and deploy?" → **Y**
- "Which scope?" → monetax-davi's projects
- "Link to existing project?" → **Y**
- "Project name?" → **monetax**

Pronto. Acesse https://monetax.com.br ✅

---

## Estrutura do site

| URL              | Arquivo                    | Função                              |
|------------------|----------------------------|-------------------------------------|
| /                | index.html                 | Landing page                        |
| /auth            | auth/index.html            | Login, cadastro, recuperar senha    |
| /auth/callback   | auth/callback.html         | Callback OAuth Google / email       |
| /onboarding      | onboarding/index.html      | Quiz inicial (protegido)            |
| /app             | app/index.html             | Copiloto IA (protegido)             |
| /privacidade     | privacidade/index.html     | Política de privacidade             |
| /termos          | termos/index.html          | Termos de uso                       |
| /ajuda           | ajuda/index.html           | Central de ajuda                    |
| /contato         | contato/index.html         | Página de contato                   |

## Fluxo do usuário

LP → /auth (cadastro) → email confirmation → /auth/callback → /onboarding → /app

