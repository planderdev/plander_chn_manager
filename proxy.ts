import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasSupabaseEnv } from '@/lib/env';

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const supabaseReady = hasSupabaseEnv();

  // Allow the shell UI to render before the new Supabase project is connected.
  if (!supabaseReady) {
    const demoAllowedPaths = new Set([
      '/login',
      '/dashboard',
      '/sales',
      '/campaigns/clients',
      '/campaigns/schedules',
      '/campaigns/completed',
      '/influencers',
      '/influencers/posts',
      '/extras/stats',
      '/extras/reports',
      '/extras/admins',
    ]);

    if (path === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!demoAllowedPaths.has(path)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isLogin = path.startsWith('/login');
  const isPublic = path === '/login';

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (user && (isLogin || path === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
