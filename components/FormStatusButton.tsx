'use client';

import type { MouseEventHandler, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { useI18n } from '@/lib/i18n/provider';

export default function FormStatusButton({
  children,
  pendingText,
  className = '',
  onClick,
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={onClick}
      className={className}
    >
      {pending ? (pendingText ?? t('common.loading')) : children}
    </button>
  );
}
