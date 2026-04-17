'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n/provider';
import { localeLabels } from '@/lib/i18n/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex justify-end">
          <div className="rounded-full border border-gray-300 bg-white p-1 shadow-sm">
            {(['ko', 'zh'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLocale(value)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  locale === value ? 'bg-black text-white' : 'text-gray-700'
                }`}
              >
                {localeLabels[value]}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">{t('login.title')}</h1>
        <input
          type="email" placeholder={t('login.email')} value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2" required
        />
        <input
          type="password" placeholder={t('login.password')} value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2" required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          {t('login.submit')}
        </button>
        </form>
      </div>
    </div>
  );
}
