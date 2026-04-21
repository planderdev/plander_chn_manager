'use client';

import Link from 'next/link';
import DeleteButton from './DeleteButton';
import { shortKR, todayKR, ymdKR } from '@/lib/datetime';
import { useI18n } from '@/lib/i18n/provider';
import type { Schedule } from '@/types/db';
import { progressStatusColor, progressStatusLabel } from '@/lib/schedule-status';

export default function ListView({ schedules }: { schedules: Schedule[] }) {
  const today = todayKR();
  const { t, locale } = useI18n();

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">{t('schedule.datetime')}</th>
            <th className="p-3">{t('common.status')}</th>
            <th className="p-3">{t('common.companyName')}</th>
            <th className="p-3">{t('scheduleForm.handle')}</th>
            <th className="p-3">{t('schedule.accountLink')}</th>
            <th className="p-3">{t('schedule.manage')}</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => {
            const isPast = s.scheduled_at ? ymdKR(s.scheduled_at).localeCompare(today) < 0 : false;
            const rowClass = isPast ? 'bg-gray-100 text-gray-500' : '';
            return (
              <tr key={s.id} className={`border-t ${rowClass}`}>
                <td className="p-3 font-medium">{s.scheduled_at ? shortKR(s.scheduled_at) : t('schedule.dateFlexible')}</td>
                <td className="p-3">
                  <span className={progressStatusColor(s.progress_status)}>{progressStatusLabel(s.progress_status, locale)}</span>
                </td>
                <td className="p-3">{s.clients?.company_name ?? '-'}</td>
                <td className="p-3">
                  <Link href={`/influencers/${s.influencer_id}`} className="text-blue-600 hover:underline">
                    @{s.influencers?.handle}
                  </Link>
                </td>
                <td className="p-3">
                  {s.influencers?.account_url && (
                    <a href={s.influencers.account_url} target="_blank" className="text-blue-600 hover:underline">{t('common.link')}</a>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <Link href={`/campaigns/schedules/${s.id}`} className="text-blue-600">{t('common.edit')}</Link>
                  <DeleteButton id={s.id} />
                </td>
              </tr>
            );
          })}
          {!schedules.length && (
            <tr><td colSpan={6} className="p-8 text-center text-gray-400">{t('dashboard.noSchedules')}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
