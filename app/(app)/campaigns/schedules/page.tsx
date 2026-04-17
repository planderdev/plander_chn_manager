import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ScheduleView from '@/components/schedule/ScheduleView';
import { getI18n } from '@/lib/i18n/server';
import { hasSupabaseEnv } from '@/lib/env';

export default async function SchedulesPage() {
  const { t } = await getI18n();
  if (!hasSupabaseEnv()) {
    const schedules = [
      { id: 1, scheduled_at: '2026-04-20T14:00:00+09:00', memo: 'XHS 뷰티 촬영', clients: { company_name: 'Shanghai Bloom Clinic' }, influencers: { handle: 'linzi_daily', account_url: 'https://www.xiaohongshu.com/user/profile/linzi_daily' }, posts: [] },
      { id: 2, scheduled_at: '2026-04-21T11:00:00+09:00', memo: '따중디엔핑 매장 리뷰', clients: { company_name: 'Suzhou Tea House' }, influencers: { handle: 'momo_foodnote', account_url: '' }, posts: [{ post_url: null, settlement_status: 'pending' }] },
      { id: 3, scheduled_at: '2026-04-12T13:00:00+09:00', memo: '도우인 숏폼 업로드', clients: { company_name: 'Hangzhou Skin Studio' }, influencers: { handle: 'xiao_homevibe', account_url: 'https://www.douyin.com/user/xiao_homevibe' }, posts: [{ post_url: 'https://douyin.com/video/mock', settlement_status: 'done' }] },
    ];
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"><div className="font-semibold">{t('demo.badge')}</div><div>{t('demo.sectionPreview')}</div></div>
        <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{t('nav.scheduleManagement')}</h1><Link href="/campaigns/schedules/new" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">{t('common.create')}</Link></div>
        <ScheduleView schedules={schedules as any} />
      </div>
    );
  }
  const sb = await createClient();

  const { data: schedules } = await sb.from('schedules')
    .select('*, clients(company_name), influencers(handle, account_url)')
    .order('scheduled_at', { ascending: false });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('nav.scheduleManagement')}</h1>
        <Link href="/campaigns/schedules/new"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          {t('common.create')}
        </Link>
      </div>

      <ScheduleView schedules={(schedules ?? []) as any} />
    </div>
  );
}
