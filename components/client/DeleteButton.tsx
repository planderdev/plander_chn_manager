'use client';
import { deleteClientAction } from '@/actions/clients';
import { useI18n } from '@/lib/i18n/provider';
import FormStatusButton from '@/components/FormStatusButton';

export default function DeleteButton({ id, redirectTo = '/campaigns/clients' }: { id: number; redirectTo?: string }) {
  const { t } = useI18n();
  return (
    <form action={deleteClientAction.bind(null, id, redirectTo)}>
      <FormStatusButton
        pendingText={t('common.loading')}
        className="border border-red-500 text-red-500 px-6 py-2 rounded hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={(e) => { if (!confirm(t('delete.clientConfirm'))) e.preventDefault(); }}
      >
        {t('common.delete')}
      </FormStatusButton>
    </form>
  );
}
