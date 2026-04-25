'use client';
import { deleteReportAction } from '@/actions/reports';
import { useI18n } from '@/lib/i18n/provider';
import FormStatusButton from '@/components/FormStatusButton';

export default function DeleteButton({ id, redirectTo = '/extras/reports' }: { id: number; redirectTo?: string }) {
  const { t } = useI18n();
  return (
    <form action={deleteReportAction.bind(null, id, redirectTo)}>
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
