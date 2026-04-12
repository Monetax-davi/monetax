import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Páginas legais servem os HTMLs completos
        { source: '/privacidade',               destination: '/politica-de-privacidade.html' },
        { source: '/politica-de-privacidade',   destination: '/politica-de-privacidade.html' },
        { source: '/termos',                    destination: '/termos-de-uso.html' },
        { source: '/termos-de-uso',             destination: '/termos-de-uso.html' },
        { source: '/contato',                   destination: '/contato.html' },
        { source: '/central-de-ajuda',          destination: '/central-de-ajuda.html' },
        { source: '/copiloto',                  destination: '/monetax-v4-copiloto.html' },
        // /  e /onboarding agora servem as páginas React (removidos os rewrites antigos)
      ],
    }
  },
}

export default nextConfig
