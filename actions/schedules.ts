'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function isMissingProgressColumn(error: any) {
  const message = String(error?.message ?? '');
  return error?.code === '42703'
    || error?.code === 'PGRST204'
    || message.includes('progress_status')
    || message.includes('schema cache');
}

function withoutProgressStatus<T extends Record<string, any>>(payload: T) {
  const { progress_status: _progressStatus, ...rest } = payload;
  return rest;
}

export async function createScheduleAction(fd: FormData) {
  const sb = await createClient();
  const clientId = Number(fd.get('client_id'));
  const influencerId = Number(fd.get('influencer_id'));
  if (!clientId || !influencerId) throw new Error('업체와 인플루언서를 선택해주세요');
  const payload = {
    scheduled_at: String(fd.get('scheduled_at') || '') || null,
    client_id: clientId,
    influencer_id: influencerId,
    progress_status: String(fd.get('progress_status') || 'recruiting') as any,
    memo: String(fd.get('memo') || '') || null,
  };
  let { error } = await sb.from('schedules').insert(payload);
  if (error && isMissingProgressColumn(error)) {
    const retry = await sb.from('schedules').insert(withoutProgressStatus(payload));
    error = retry.error;
  }
  if (error) throw new Error(error.message);
  revalidatePath('/campaigns/schedules');
  redirect('/campaigns/schedules');
}

export async function deleteScheduleAction(id: number) {
  'use server';
  const sb = await createClient();
  const { error } = await sb.from('schedules').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/campaigns/schedules');
}

export async function updateScheduleAction(fd: FormData) {
  const sb = await createClient();
  const id = Number(fd.get('id'));
  const clientId = Number(fd.get('client_id'));
  const influencerId = Number(fd.get('influencer_id'));
  if (!clientId || !influencerId) throw new Error('업체와 인플루언서를 선택해주세요');
  const payload = {
    scheduled_at: String(fd.get('scheduled_at') || '') || null,
    client_id: clientId,
    influencer_id: influencerId,
    progress_status: String(fd.get('progress_status') || 'recruiting') as any,
    memo: String(fd.get('memo') || '') || null,
  };
  let { error } = await sb.from('schedules').update(payload).eq('id', id);
  if (error && isMissingProgressColumn(error)) {
    const retry = await sb.from('schedules').update(withoutProgressStatus(payload)).eq('id', id);
    error = retry.error;
  }
  if (error) throw new Error(error.message);
  revalidatePath('/campaigns/schedules');
  redirect('/campaigns/schedules');
}
