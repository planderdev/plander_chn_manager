import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { clientStatusLabel } from '@/lib/labels';
import MoneyText from '@/components/MoneyText';
import { getI18n } from '@/lib/i18n/server';
import { hasSupabaseEnv } from '@/lib/env';

export default async function ClientsPage() {
  const { locale, t } = await getI18n();
  if (!hasSupabaseEnv()) {
    const clients = [
      { id: 1, company_name: 'Shanghai Bloom Clinic', contact_person: 'Luna', phone: '138-0000-1200', status: 'active', contract_start: '2026-04-01', contract_end: '2026-06-30', contract_amount: 4500000 },
      { id: 2, company_name: 'Suzhou Tea House', contact_person: 'Wei', phone: '139-2222-3400', status: 'active', contract_start: '2026-04-10', contract_end: '2026-05-31', contract_amount: 1800000 },
      { id: 3, company_name: 'Hangzhou Skin Studio', contact_person: 'Ari', phone: '137-4545-8800', status: 'paused', contract_start: '2026-03-15', contract_end: '2026-05-15', contract_amount: 2300000 },
    ];
    return (
      <div className="p-4 md:p-8">
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"><div className="font-semibold">{t('demo.badge')}</div><div>{t('demo.sectionPreview')}</div></div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="text-2xl font-bold">{t('client.listTitle')}</h1>
          <div className="text-xs text-gray-500">{t('client.preContractPrefix')}<Link href="/sales" className="text-blue-600 hover:underline">{t('nav.salesManagement')}</Link>{t('client.preContractSuffix')}</div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto"><table className="w-full text-sm min-w-[900px]"><thead className="bg-gray-100 text-left"><tr><th className="p-3">{t('common.companyName')}</th><th className="p-3">{t('sales.owner')}</th><th className="p-3">{t('common.contact')}</th><th className="p-3">{t('common.status')}</th><th className="p-3">{t('dashboard.contractPeriod')}</th><th className="p-3">{t('clientForm.contractAmount')}</th></tr></thead><tbody>{clients.map((c: any) => <tr key={c.id} className="border-t"><td className="p-3 font-medium">{c.company_name}</td><td className="p-3">{c.contact_person}</td><td className="p-3">{c.phone}</td><td className="p-3">{clientStatusLabel(c.status, locale)}</td><td className="p-3">{c.contract_start} ~ {c.contract_end}</td><td className="p-3"><MoneyText value={c.contract_amount} /></td></tr>)}</tbody></table></div>
      </div>
    );
  }
  const sb = await createClient();
  const { data: clients } = await sb
    .from('clients')
    .select('*')
    .in('status', ['active', 'paused', 'ended'])
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{t('client.listTitle')}</h1>
        <div className="text-xs text-gray-500">
          {t('client.preContractPrefix')}
          <Link href="/sales" className="text-blue-600 hover:underline">{t('nav.salesManagement')}</Link>
          {t('client.preContractSuffix')}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">{t('common.companyName')}</th>
              <th className="p-3">{t('sales.owner')}</th>
              <th className="p-3">{t('common.contact')}</th>
              <th className="p-3">{t('common.status')}</th>
              <th className="p-3">{t('dashboard.contractPeriod')}</th>
              <th className="p-3">{t('clientForm.contractAmount')}</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">
                  <Link href={`/campaigns/clients/${c.id}`} className="text-blue-600 hover:underline">
                    {c.company_name}
                  </Link>
                </td>
                <td className="p-3">{c.contact_person ?? '-'}</td>
                <td className="p-3">{c.phone ?? '-'}</td>
                <td className="p-3">{clientStatusLabel(c.status, locale)}</td>
                <td className="p-3">{c.contract_start ?? '-'} ~ {c.contract_end ?? '-'}</td>
                <td className="p-3"><MoneyText value={c.contract_amount} /></td>
              </tr>
            ))}
            {!clients?.length && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">{t('client.none')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
