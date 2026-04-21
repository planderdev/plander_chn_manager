import type { Locale } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/config';
import type { ProgressStatus } from '@/types/db';

export type ScheduleStatus = 'reserved' | 'upload_pending' | 'settlement_pending' | 'done';

type SchedulePost = { post_url?: string | null; settlement_status?: string | null };

export function getScheduleStatus(
  scheduledAt: string | null | undefined,
  posts: SchedulePost[] | SchedulePost | null | undefined,
  progressStatus?: ProgressStatus | null
): ScheduleStatus {
  if (progressStatus === 'uploaded') return 'done';
  if (progressStatus === 'upload_waiting') return 'upload_pending';
  if (progressStatus === 'recruiting' || progressStatus === 'recruited' || progressStatus === 'preparing') return 'reserved';

  const postList = Array.isArray(posts) ? posts : posts ? [posts] : [];

  const hasUrl = postList.some(p => p.post_url && p.post_url.trim() !== '');
  if (hasUrl) return 'done';

  if (!scheduledAt) return 'reserved';

  const isPast = new Date(scheduledAt) < new Date();
  return isPast ? 'upload_pending' : 'reserved';
}

export function statusLabel(s: ScheduleStatus, locale: Locale = 'ko'): string {
  switch (s) {
    case 'reserved': return translate(locale, 'schedule.reserved');
    case 'upload_pending': return translate(locale, 'schedule.upload_pending');
    case 'settlement_pending': return translate(locale, 'schedule.settlement_pending');
    case 'done': return translate(locale, 'schedule.done');
  }
}

export function progressStatusLabel(s: ProgressStatus | null | undefined, locale: Locale = 'ko'): string {
  return translate(locale, `progress.${s ?? 'recruiting'}`);
}

export function progressStatusColor(s: ProgressStatus | null | undefined): string {
  switch (s) {
    case 'uploaded': return 'text-green-600';
    case 'upload_waiting': return 'text-red-500';
    case 'delayed': return 'text-orange-600';
    case 'canceled': return 'text-gray-500';
    case 'preparing': return 'text-blue-600';
    case 'recruited': return 'text-indigo-600';
    case 'recruiting':
    default: return 'text-amber-600';
  }
}

export function statusColor(s: ScheduleStatus): string {
  switch (s) {
    case 'reserved': return 'text-orange-500';
    case 'upload_pending': return 'text-red-500';
    case 'settlement_pending': return 'text-red-500';
    case 'done': return 'text-green-600';
  }
}
