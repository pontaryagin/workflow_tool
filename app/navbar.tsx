"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { cookies } from "next/headers"
import { User, findUniqueUser } from "@/lib/model"
import { redirect, usePathname } from "next/navigation"
import { getCurrentUser, logout } from "./auth"

export function DropdownMenuCheckboxes({ currentUser }: { currentUser: User }) {
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge>{ currentUser.id }</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <button onClick={ () => logout() } className="focus-visible:ring-0 w-full text-left">
            Logout
          </button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}

export const NavigationMenuDemo = ({ currentUser }: { currentUser: User | Error | null }) => {
  const pathname = usePathname()
  if (pathname == "/login") {
    return null
  }
  if (currentUser == null) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`)
  }
  if (currentUser instanceof Error) {
    return <main className="p-12">
      <div>{ currentUser.message }. Please register your account</div>
    </main>
  }
  return (
    <header className="sticky top-0 z-50 bg-background/95 flex justify-between border-b border-border/60">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={ navigationMenuTriggerStyle() }>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/workflows" legacyBehavior passHref>
              <NavigationMenuLink className={ navigationMenuTriggerStyle() }>
                Workflows
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="justify-self-right">
        <NavigationMenuList>
          <NavigationMenuItem >
            <div className="px-4 py-2">
              <DropdownMenuCheckboxes { ...{ currentUser } } />
            </div>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

