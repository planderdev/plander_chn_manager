'use client';
import { deletePostAction } from '@/actions/posts';
import { useI18n } from '@/lib/i18n/provider';
import FormStatusButton from '@/components/FormStatusButton';

export default function DeleteButton({ id, redirectTo = '/influencers/posts' }: { id: number; redirectTo?: string }) {
  const { t } = useI18n();
  return (
    <form action={deletePostAction.bind(null, id, redirectTo)}>
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
