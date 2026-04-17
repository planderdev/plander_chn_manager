import ClientForm from '@/components/ClientForm';
import { updateClientAction } from '@/actions/clients';
import { getClientOptions } from '@/actions/client-options';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { getI18n } from '@/lib/i18n/server';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = await getI18n();
  const { id } = await params;
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: client }, options, { data: admins }] = await Promise.all([
    sb.from('clients').select('*').eq('id', Number(id)).single(),
    getClientOptions(),
    sb.from('admins').select('id, name').order('name'),
  ]);
  if (!client) notFound();

  // 권한: owner 아니면 수정 페이지 자체 접근 차단
  if (client.owner_id && client.owner_id !== user.id) {
    redirect(`/campaigns/clients/${id}`);
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">{t('client.editTitle')}</h1>
      <ClientForm
        client={client}
        action={updateClientAction}
        options={options}
        admins={admins ?? []}
        currentUserId={user.id}
      />
    </div>
  );
}
