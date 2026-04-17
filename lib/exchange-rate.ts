import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/env';

export const DEFAULT_CNY_TO_KRW_RATE = 200;
export const DEFAULT_EXCHANGE_POLICY_LABEL = '100 CNY = 20,000 KRW';

export async function getCnyToKrwRate() {
  if (!hasSupabaseEnv()) {
    return DEFAULT_CNY_TO_KRW_RATE;
  }

  const sb = await createClient();
  const { data } = await sb
    .from('app_settings')
    .select('value')
    .eq('key', 'cny_to_krw_rate')
    .single();

  const parsed = Number(data?.value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_CNY_TO_KRW_RATE;
  }

  return parsed;
}

export function formatExchangePolicy(rate: number) {
  const hundredCny = rate * 100;
  return `100 CNY = ${hundredCny.toLocaleString()} KRW`;
}
