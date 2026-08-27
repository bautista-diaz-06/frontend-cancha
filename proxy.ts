import type { NextRequest } from "next/server"
import { auth0 } from "@/lib/auth0"

// Monta automáticamente /auth/login, /auth/logout, /auth/callback y
// /auth/profile, y refresca la cookie de sesión en cada request.
export async function proxy(request: NextRequest) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-light-32x32.png|icon-dark-32x32.png|apple-icon.png|manifest.webmanifest).*)",
  ],
}