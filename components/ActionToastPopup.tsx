'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

const toastKeys = {
  created: 'feedback.created',
  saved: 'feedback.saved',
  deleted: 'feedback.deleted',
  completed: 'feedback.completed',
} as const;

export default function ActionToastPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const toast = searchParams.get('toast');
  const [open, setOpen] = useState(false);

  const message = useMemo(() => {
    if (!toast || !(toast in toastKeys)) return '';
    return t(toastKeys[toast as keyof typeof toastKeys]);
  }, [t, toast]);

  useEffect(() => {
    if (!message) return;
    setOpen(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('toast');
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [message, pathname, router, searchParams]);

  if (!open || !message) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="text-base font-semibold text-gray-900">{message}</div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded bg-black px-4 py-2 text-sm text-white"
          >
            {t('common.ok')}
          </button>
        </div>
      </div>
    </div>
  );
}
