import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/monetax-LP-v4-corrigida__2_.html', permanent: false },
      { source: '/contato', destination: '/contato.html', permanent: false },
      { source: '/politica-de-privacidade', destination: '/politica-de-privacidade.html', permanent: false },
      { source: '/termos-de-uso', destination: '/termos-de-uso.html', permanent: false },
      { source: '/central-de-ajuda', destination: '/central-de-ajuda.html', permanent: false },
      { source: '/onboarding', destination: '/monetax-onboarding-quiz.html', permanent: false },
      { source: '/copiloto', destination: '/monetax-v4-copiloto.html', permanent: false },
    ]
  },
}

export default nextConfig
