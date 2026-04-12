/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/monetax-LP-v4-corrigida__2_.html' },
        { source: '/contato', destination: '/contato.html' },
        { source: '/politica-de-privacidade', destination: '/politica-de-privacidade.html' },
        { source: '/termos-de-uso', destination: '/termos-de-uso.html' },
        { source: '/central-de-ajuda', destination: '/central-de-ajuda.html' },
        { source: '/onboarding', destination: '/monetax-onboarding-quiz.html' },
        { source: '/copiloto', destination: '/monetax-v4-copiloto.html' },
      ],
    }
  },
}

module.exports = nextConfig
