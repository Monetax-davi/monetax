import Link from 'next/link'
export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Moneta<span style={{ color: '#1a6cff' }}>X</span></div>
        <p style={{ color: '#8899bb', marginBottom: 20 }}>Página em construção.</p>
        <Link href="/" style={{ color: '#4d8fff', textDecoration: 'none', fontSize: 14 }}>← Voltar</Link>
      </div>
    </div>
  )
}
