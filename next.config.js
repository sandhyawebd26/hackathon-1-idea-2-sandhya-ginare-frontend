/** @type {import('next').NextConfig} */
function pickEnv(...names) {
  for (const name of names) {
    const value = process.env[name]
    if (value && String(value).trim()) return String(value).trim()
  }
  return undefined
}

// Browser auth needs NEXT_PUBLIC_* at build time. Vercel "Config" keys may use NEXT_* — map them here.
const publicSupabaseUrl = pickEnv(
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_SUPABASE_URL',
  'SUPABASE_URL',
)
const publicSupabaseAnon = pickEnv(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
)
const publicUseFixture = pickEnv('NEXT_PUBLIC_USE_FIXTURE', 'NEXT_USE_FIXTURE')

module.exports = {
  env: {
    ...(publicSupabaseUrl ? { NEXT_PUBLIC_SUPABASE_URL: publicSupabaseUrl } : {}),
    ...(publicSupabaseAnon ? { NEXT_PUBLIC_SUPABASE_ANON_KEY: publicSupabaseAnon } : {}),
    ...(publicUseFixture ? { NEXT_PUBLIC_USE_FIXTURE: publicUseFixture } : {}),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ]
  }
}
