import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

/** Inlined at build time from next.config `basePath`; used so metadata icons resolve under the subpath. */
const basePath = process.env.__NEXT_ROUTER_BASEPATH ?? ''

function metadataBaseUrl(): URL {
  const publicSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const origin =
    publicSite ??
    (process.env.VERCEL_URL != null
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT ?? 3000}`)
  return new URL(`${basePath}/`, origin)
}

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const metadataBase = metadataBaseUrl()
/** Absolute URL so the favicon works with `basePath` (e.g. `/lpg/logologin.jpeg`, not `/logologin.jpeg`). */
const faviconUrl = new URL('logologin.jpeg', metadataBase).href

export const metadata: Metadata = {
  metadataBase,
  title: 'Lesson Plan Generator V4',
  description: 'AI-powered interactive lesson planning with teacher-in-the-loop workflow',
  generator: 'v0.app',
  icons: {
    icon: [{ url: faviconUrl, type: 'image/jpeg' }],
    apple: faviconUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
