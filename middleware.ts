// middleware.ts - Version corrigée
import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired } from './helpers/token-expried';

// Routes qui nécessitent une authentification
const protectedRoutes = ['/admin'];

// Routes publiques (connexion, inscription, etc.)
const publicRoutes = ['/auth/login', '/auth/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si la route actuelle est protégée
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Si c'est une route protégée, vérifier l'authentification
  if (isProtectedRoute) {
    // Récupérer le token depuis les cookies personnalisés
    const authToken = request.cookies.get('auth-token');
    const authStatus = request.cookies.get('auth-status');
    console.log(authToken, authStatus);

    console.log('🔍 Vérification auth:', {
      pathname,
      hasAuthToken: !!authToken,
      hasAuthStatus: !!authStatus,
      authStatusValue: authStatus?.value,
    });

    if (!authToken || !authStatus || authStatus.value !== 'authenticated') {
      console.log('❌ Redirection vers login - pas de token ou statut');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Vérifier si le token est expiré
      if (isTokenExpired(authToken.value)) {
        console.log('❌ Token expiré, redirection vers login');
        // Token expiré, supprimer les cookies et rediriger
        const response = NextResponse.redirect(
          new URL('/auth/login', request.url)
        );
        response.cookies.delete('auth-token');
        response.cookies.delete('auth-status');
        return response;
      }

      console.log('✅ Token valide, accès autorisé');
    } catch (error) {
      console.log('❌ Erreur validation token:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages publiques comme login
  if (
    isPublicRoute &&
    (pathname === '/auth/login' || pathname === '/auth/register')
  ) {
    const authToken = request.cookies.get('auth-token');
    const authStatus = request.cookies.get('auth-status');

    if (authToken && authStatus && authStatus.value === 'authenticated') {
      try {
        // Vérifier si le token n'est pas expiré
        if (!isTokenExpired(authToken.value)) {
          console.log('✅ Utilisateur connecté, redirection vers admin');
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } catch (error) {
        // Ignorer les erreurs de parsing pour les routes publiques
        console.log('⚠️ Erreur parsing token sur route publique:', error);
      }
    }
  }

  return NextResponse.next();
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
