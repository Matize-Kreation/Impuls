// D:\Matize\Matize-Kreation\Impuls\Impuls-local\app\layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { MastersphereProvider } from "../components/MastersphereContext"

export const metadata: Metadata = {
  title: "Impuls System",
  description: "Meditativer Webraum zur Selbstreflexion",
  generator: "v0.app",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        <MastersphereProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </MastersphereProvider>
      </body>
    </html>
  )
}
