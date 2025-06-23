import { NextRequest, NextResponse } from 'next/server';

// Routes publiques (accessibles sans authentification)
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/otp',
  '/auth/create-entreprise',
];

// Routes protégées (accessibles seulement si l'utilisateur est connecté)
const protectedRoutes = ['/admin'];

export default function middleware(req: NextRequest) {
  // Récupérer le token dans les cookies du navigateur
  const token = req.cookies.get('accesstoken')?.value;
  const { pathname } = req.nextUrl;
  console.log('Pathname:', pathname);

  // Vérifier si la route actuelle est une route d'authentification
  const isAuthRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Vérifier si la route actuelle est une route protégée
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si l'utilisateur n'est PAS connecté (pas de token)
  if (!token) {
    // S'il essaie d'accéder à une route protégée, le rediriger vers login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    // Sinon, laisser passer (il peut accéder aux routes publiques/auth)
    return NextResponse.next();
  }

  // Si l'utilisateur EST connecté (a un token)
  if (token) {
    // S'il essaie d'accéder aux pages d'authentification, le rediriger vers admin
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    // Sinon, laisser passer (il peut accéder aux routes protégées)
    return NextResponse.next();
  }

  // Par défaut, laisser passer
  return NextResponse.next();
}

// Configuration du matcher pour spécifier sur quelles routes le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
