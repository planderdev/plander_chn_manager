import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { fullKR } from '@/lib/datetime';
import { channelLabel, contactStatusLabel } from '@/lib/labels';
import ChannelIcon from '@/components/ChannelIcon';
import { progressStatusColor, progressStatusLabel } from '@/lib/schedule-status';
import { getI18n } from '@/lib/i18n/server';

export default async function InfluencerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { t, locale } = await getI18n();
  const sb = await createClient();
  const { data: i } = await sb.from('influencers').select('*').eq('id', Number(id)).single();
  if (!i) notFound();

  // 이 인플루언서의 스케줄도 같이
  const { data: schedules } = await sb.from('schedules')
    .select('*, clients(company_name), posts(post_url, settlement_status)')
    .eq('influencer_id', Number(id))
    .order('scheduled_at', { ascending: false });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">@{i.handle}</h1>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-sm font-semibold border-b border-gray-300 pb-1">{t('common.basicInfo')}</h2>
        <Row label={t('influencerForm.channel')} value={<div className="flex items-center gap-2"><ChannelIcon channel={i.channel} size={22} /><span>{channelLabel(i.channel, locale)}</span></div>} />
        <Row label={t('postForm.handle')} value={`@${i.handle}`} />
        <Row label={t('influencer.followers')} value={i.followers?.toLocaleString() ?? 0} />
        <Row label={t('postForm.accountLink')} value={
          i.account_url
            ? <a href={i.account_url} target="_blank" className="inline-block bg-blue-50 border border-blue-300 rounded px-3 py-1 text-blue-700 hover:bg-blue-100">{t('influencer.openAccount')}</a>
            : '-'
        } />
        <Row label={t('common.memo')} value={i.memo ?? '-'} />
        <Row label={t('influencer.contactStatus')} value={contactStatusLabel(i.contact_status, locale)} />
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-3">
        <h2 className="text-sm font-semibold border-b border-gray-300 pb-1">{t('common.managementInfo')}</h2>
        <Row label={t('postForm.nameEn')} value={i.name_en ?? '-'} />
        <Row label={t('postForm.bankBranch')} value={[i.bank_name, i.branch_name].filter(Boolean).join(' / ') || '-'} />
        <Row label={t('postForm.accountNumber')} value={i.account_number ?? '-'} />
        <Row label={t('common.phone')} value={i.phone ?? '-'} />
        <Row label={t('common.address')} value={[i.postal_code, i.prefecture, i.city, i.street].filter(Boolean).join(' ') || '-'} />
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-semibold border-b border-gray-300 pb-2 mb-3">{t('nav.scheduleManagement')}</h2>
        {schedules?.length ? (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr><th className="pb-2">{t('schedule.datetime')}</th><th className="pb-2">{t('common.companyName')}</th><th className="pb-2">{t('common.status')}</th></tr>
            </thead>
            <tbody>
              {schedules.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2">{s.scheduled_at ? fullKR(s.scheduled_at) : t('schedule.dateFlexible')}</td>
                  <td className="py-2">{s.clients?.company_name}</td>
                  <td className="py-2">
                    <span className={progressStatusColor(s.progress_status)}>{progressStatusLabel(s.progress_status, locale)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-gray-400 text-sm">{t('dashboard.noSchedules')}</p>}
      </section>

      <div className="flex gap-3">
        <Link href={`/influencers/${i.id}/edit`}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">{t('common.edit')}</Link>
        <BackButton />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <div className="text-xs text-gray-500 sm:w-24 sm:flex-shrink-0">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
