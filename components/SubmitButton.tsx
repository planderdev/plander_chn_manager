'use client';
import { useI18n } from '@/lib/i18n/provider';
import FormStatusButton from '@/components/FormStatusButton';

export default function SubmitButton({ children, pendingText }: any) {
  const { t } = useI18n();
  const label = children ?? t('common.save');
  const loading = pendingText ?? t('common.loading');
  return (
    <FormStatusButton
      pendingText={loading}
      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {label}
    </FormStatusButton>
  );  
}
