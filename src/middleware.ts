import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Si viene con token en URL, dejar pasar (la página lo procesará)
  const tokenInUrl = searchParams.get('token');
  if (tokenInUrl) {
    return NextResponse.next();
  }

  // El middleware no puede acceder a localStorage (es server-side)
  // La verificación de autenticación se hace en el cliente (AuthProvider)
  // Solo dejamos pasar todas las requests

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
