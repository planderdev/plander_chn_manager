import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type ActionToast = 'created' | 'saved' | 'deleted' | 'completed';

export function withToast(path: string, toast: ActionToast) {
  const url = new URL(path, 'http://local');
  url.searchParams.set('toast', toast);
  return `${url.pathname}${url.search}`;
}

export function redirectWithToast(path: string, toast: ActionToast): never {
  redirect(withToast(path, toast));
}

export async function redirectBackWithToast(fallbackPath: string, toast: ActionToast): Promise<never> {
  const headerStore = await headers();
  const referer = headerStore.get('referer');

  if (referer) {
    try {
      const url = new URL(referer);
      redirect(withToast(`${url.pathname}${url.search}`, toast));
    } catch {
      redirectWithToast(fallbackPath, toast);
    }
  }

  redirectWithToast(fallbackPath, toast);
}
