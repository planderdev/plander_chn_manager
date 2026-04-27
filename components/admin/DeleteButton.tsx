'use client';

import { deleteAdminAction } from '@/actions/admins';
import { useI18n } from '@/lib/i18n/provider';
import FormStatusButton from '@/components/FormStatusButton';

export default function DeleteButton({
  id,
  redirectTo = '/extras/admins',
}: {
  id: string;
  redirectTo?: string;
}) {
  const { t } = useI18n();

  return (
    <form action={deleteAdminAction.bind(null, id, redirectTo)} className="inline">
      <FormStatusButton
        pendingText={t('common.loading')}
        className="text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={(e) => { if (!confirm(t('delete.confirm'))) e.preventDefault(); }}
      >
        {t('common.delete')}
      </FormStatusButton>
    </form>
  );
}
