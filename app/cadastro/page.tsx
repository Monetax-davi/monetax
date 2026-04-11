"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, [router]);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "Este email já está cadastrado."
        : "Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    if (data.user) {
      // Insert default categories
      await supabase.rpc("insert_default_categories", { p_user_id: data.user.id });
      router.replace("/onboarding");
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <title>Monetax — Confirme seu email</title>
        <style dangerouslySetInnerHTML={{ __html: `body{background:#030508;color:#fff;font-family:sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:#0a1628;border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:48px 40px;max-width:420px;text-align:center;margin:20px}.icon{font-size:48px;margin-bottom:16px}h2{font-size:22px;font-weight:700;margin-bottom:8px}p{color:rgba(255,255,255,.6);font-size:14px;line-height:1.6}a{color:#4d94ff;text-decoration:none}` }} />
      </head>
      <body>
        <div className="card">
          <div className="icon">📧</div>
          <h2>Confirme seu email</h2>
          <p>Enviamos um link de confirmação para <strong>{email}</strong>. Verifique sua caixa de entrada e clique no link para ativar sua conta.</p>
          <p style={{ marginTop: "20px" }}><a href="/login">Voltar ao login</a></p>
        </div>
      </body>
    </html>
  );

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Monetax — Criar conta grátis</title>
        <style dangerouslySetInnerHTML={{ __html: `
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:#030508;color:#fff;font-family:ui-sans-serif,system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;-webkit-font-smoothing:antialiased}
          .gbg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(26,108,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(26,108,255,.03) 1px,transparent 1px);background-size:68px 68px;mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,black 10%,transparent 80%)}
          .card{position:relative;z-index:2;background:#0a1628;border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:48px 40px;width:100%;max-width:420px;margin:20px}
          .logo{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;letter-spacing:-.5px;margin-bottom:36px;justify-content:center}
          .lhex{width:34px;height:34px;background:#1a6cff;clip-path:polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;box-shadow:0 0 20px rgba(26,108,255,.5)}
          h1{font-size:22px;font-weight:700;margin-bottom:8px;text-align:center}
          p.sub{color:rgba(255,255,255,.55);font-size:14px;text-align:center;margin-bottom:32px}
          .badge{display:inline-flex;align-items:center;gap:6px;background:rgba(0,214,143,.1);border:1px solid rgba(0,214,143,.3);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;color:#00d68f;margin-bottom:24px}
          label{display:block;font-size:13px;font-weight:600;color:rgba(255,255,255,.7);margin-bottom:6px}
          input{width:100%;background:#07101f;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px 16px;color:#fff;font-size:15px;outline:none;transition:border-color .2s;margin-bottom:20px}
          input:focus{border-color:#1a6cff}
          input::placeholder{color:rgba(255,255,255,.3)}
          .btn{width:100%;background:#1a6cff;color:#fff;font-size:15px;font-weight:700;padding:14px;border:none;border-radius:10px;cursor:pointer;transition:background .2s;margin-top:4px}
          .btn:hover{background:#4d94ff}
          .btn:disabled{opacity:.6;cursor:not-allowed}
          .error{background:rgba(255,68,68,.12);border:1px solid rgba(255,68,68,.3);border-radius:8px;padding:12px;font-size:13px;color:#ff6b6b;margin-bottom:20px;text-align:center}
          .links{text-align:center;margin-top:24px;font-size:14px;color:rgba(255,255,255,.55)}
          .links a{color:#4d94ff;text-decoration:none;font-weight:600}
          .terms{font-size:12px;color:rgba(255,255,255,.35);text-align:center;margin-top:16px;line-height:1.5}
          .terms a{color:rgba(255,255,255,.5)}
        ` }} />
      </head>
      <body>
        <div className="gbg" />
        <div className="card">
          <div className="logo">
            <div className="lhex">M</div>
            <span>Monetax</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span className="badge">✦ Grátis para sempre</span>
          </div>
          <h1 style={{ marginTop: "12px" }}>Crie sua conta</h1>
          <p className="sub">Sem cartão de crédito. Sem compromisso.</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleCadastro}>
            <label htmlFor="name">Seu nome</label>
            <input
              id="name"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Começar grátis →"}
            </button>
          </form>

          <div className="links">
            Já tem conta? <Link href="/login">Entrar</Link>
          </div>
          <p className="terms">
            Ao criar conta você concorda com os{" "}
            <a href="/termos">Termos de Uso</a> e a{" "}
            <a href="/privacidade">Política de Privacidade</a>
          </p>
        </div>
      </body>
    </html>
  );
}
