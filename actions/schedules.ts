'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
  const { error } = await sb.from('schedules').insert(payload);
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
  const { error } = await sb.from('schedules').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/campaigns/schedules');
  redirect('/campaigns/schedules');
}
