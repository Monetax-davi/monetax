import { redirect } from 'next/navigation'

// /cadastro redireciona para /login?modo=cadastro (página unificada)
export default function CadastroPage() {
  redirect('/login?modo=cadastro')
}
