'use client';
import { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths } from 'date-fns';
import type { Schedule } from '@/types/db';
import { ymdKR, todayKR, timeKR, compareDayKR } from '@/lib/datetime';
import Link from 'next/link';
import { deleteScheduleAction } from '@/actions/schedules';
import { useI18n } from '@/lib/i18n/provider';
import { progressStatusLabel } from '@/lib/schedule-status';
import FormStatusButton from '@/components/FormStatusButton';

export default function CalendarView({ schedules }: { schedules: Schedule[] }) {
  const [cursor, setCursor] = useState(new Date());
  const [modalDay, setModalDay] = useState<string | null>(null);
  const { t, locale } = useI18n();

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

  const byDay = new Map<string, Schedule[]>();
  for (const s of schedules) {
    if (!s.scheduled_at) continue;
    const key = ymdKR(s.scheduled_at);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(s);
  }

  const modalItems = modalDay ? byDay.get(modalDay) ?? [] : [];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCursor(addMonths(cursor, -1))} className="px-3 py-1 border border-gray-400 rounded">◀</button>
        <h2 className="text-lg font-bold">{format(cursor, locale === 'zh' ? 'yyyy年 M月' : 'yyyy년 M월')}</h2>
        <button onClick={() => setCursor(addMonths(cursor, 1))} className="px-3 py-1 border border-gray-400 rounded">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-300">
        {(locale === 'zh' ? ['日','一','二','三','四','五','六'] : ['일','월','화','수','목','금','토']).map((d) => (
          <div key={d} className="bg-gray-100 p-2 text-center text-xs font-semibold">{d}</div>
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const items = byDay.get(key) ?? [];
          const dim = !isSameMonth(day, cursor);
        
          const today = todayKR();
          const cmp = key.localeCompare(today);
          const isToday = cmp === 0;
          const isPast = cmp < 0;
        
          // 칩 색 결정
          let chipClass = 'bg-purple-100 text-purple-900';   // 미래 = 연보라
          if (isToday) chipClass = 'bg-yellow-200 text-yellow-900';  // 오늘 = 노랑
          else if (isPast) chipClass = 'bg-gray-200 text-gray-700';  // 과거 = 회색
        
          return (
            <button type="button" key={key}
              onClick={() => items.length > 0 && setModalDay(key)}
              className={`bg-white hover:bg-blue-50 p-1 min-h-[80px] text-left ${dim ? 'opacity-40' : ''}`}>
              <div className={`text-xs ${isToday ? 'font-bold text-blue-700' : ''}`}>{format(day, 'd')}</div>
              <div className="space-y-0.5 mt-1">
                {items.slice(0, 3).map((s) => (
                  <div key={s.id} className={`text-[10px] rounded px-1 truncate ${chipClass}`}>
                    {s.scheduled_at ? timeKR(s.scheduled_at) : t('schedule.dateFlexible')} @{s.influencers?.handle}
                  </div>
                ))}
                {items.length > 3 && <div className="text-[10px] text-gray-500">+{items.length - 3}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* 모달 */}
      {modalDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setModalDay(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold">{t('schedule.daySchedule', { date: modalDay })}</h3>
              <button onClick={() => setModalDay(null)} className="text-2xl leading-none">✕</button>
            </div>
            <div className="p-4 space-y-2">
              {modalItems.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded p-3 text-sm">
                  <Link href={`/campaigns/schedules/${s.id}`} className="block hover:bg-gray-50">
                    <div className="font-semibold">{s.scheduled_at ? timeKR(s.scheduled_at) : t('schedule.dateFlexible')}</div>
                    <div>@{s.influencers?.handle}</div>
                    <div className="text-gray-600">{s.clients?.company_name}</div>
                    <div className="text-xs text-gray-500">{progressStatusLabel(s.progress_status, locale)}</div>
                  </Link>
                <div className="flex justify-end mt-2">
                  <form action={deleteScheduleAction.bind(null, s.id, '/campaigns/schedules')}>
                    <FormStatusButton
                      pendingText={t('common.loading')}
                      className="text-xs text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={(e) => {
                        if (!confirm(t('calendar.deleteConfirm'))) e.preventDefault();
                        else setModalDay(null);
                      }}
                    >
                      {t('common.delete')}
                    </FormStatusButton>
                  </form>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
