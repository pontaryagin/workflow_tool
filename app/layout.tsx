import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NavigationMenuDemo } from "./navbar"
import { getCurrentUser } from "./auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Workflow Builder",  // Task Stream
  description: "Workflow build tool",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()
  return (
    <html lang="ja">
      <body className={ inter.className }>
        <NavigationMenuDemo { ...{ currentUser } }></NavigationMenuDemo>
        { children }
      </body>
    </html>
  )
}
