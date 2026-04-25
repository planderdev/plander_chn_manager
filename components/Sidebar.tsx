'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { localeLabels } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/provider';
import { usePresentation } from '@/lib/presentation-context';
import FormStatusButton from '@/components/FormStatusButton';

export default function Sidebar({
  userName, signOutAction,
}: { userName: string; signOutAction?: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();

  // 페이지 이동하면 자동으로 모바일 메뉴 닫기
  const close = () => setOpen(false);

  function handleLocaleChange(nextLocale: 'ko' | 'zh') {
    if (nextLocale === locale) return;
    setLocale(nextLocale);
    router.refresh();
  }

  const { presenting, toggle } = usePresentation();

  return (
    <>
      {/* 모바일 상단바 */}
      <header className="md:hidden bg-black text-white flex items-center justify-between px-4 h-14 sticky top-0 z-30">
        <div className="w-8" />
        <Logo className="h-4 w-auto text-white" />
        <button onClick={() => setOpen(true)} aria-label={t('language.switch')} className="text-2xl w-8 text-right">☰</button>
      </header>

      {/* 어두운 배경 (모바일에서 메뉴 열렸을 때) */}
      {open && (
        <div onClick={close}
          className="md:hidden fixed inset-0 bg-black/50 z-40" />
      )}

      {/* 사이드바 본체 */}
      <aside className={`
        bg-black text-white p-4 flex flex-col
        fixed md:sticky top-0 left-0 h-screen w-64 z-50
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:w-56
      `}>
        <div className="flex items-center justify-between mb-6">
          <div className="mb-6">
            <Logo className="h-4 w-auto text-white" />
          </div>
          <button onClick={close} className="md:hidden text-2xl" aria-label={t('common.cancel')}>✕</button>
        </div>

        <nav className="space-y-1 text-sm flex-1 overflow-y-auto">
          <NavLink href="/dashboard" pathname={pathname} onClick={close}>{t('nav.dashboard')}</NavLink>
          <Section>{t('nav.sales')}</Section>
          <NavLink href="/sales" pathname={pathname} onClick={close}>{t('nav.salesManagement')}</NavLink>
          <Section>{t('nav.campaign')}</Section>
          <NavLink href="/campaigns/clients" pathname={pathname} onClick={close}>{t('nav.clientInfo')}</NavLink>
          <NavLink href="/campaigns/schedules" pathname={pathname} onClick={close}>{t('nav.scheduleManagement')}</NavLink>
          <Section>{t('nav.influencer')}</Section>
          <NavLink href="/influencers" pathname={pathname} onClick={close}>{t('nav.influencerList')}</NavLink>
          <NavLink href="/influencers/posts" pathname={pathname} onClick={close}>{t('nav.postSettlement')}</NavLink>
          <NavLink href="/campaigns/completed" pathname={pathname} onClick={close}>{t('nav.completedPosts')}</NavLink>
          <Section>{t('nav.extras')}</Section>
          <NavLink href="/extras/stats" pathname={pathname} onClick={close}>{t('nav.report')}</NavLink>
          <NavLink href="/extras/reports" pathname={pathname} onClick={close}>{t('nav.reportExport')}</NavLink>
        </nav>
          <div className="mt-3 mb-2 w-full rounded border border-gray-700 bg-transparent">
            <div className="flex items-center gap-1 px-2 py-2">
              <span className="px-1 text-xs font-medium text-gray-400">{t('language.switch')}</span>
              {(['ko', 'zh'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleLocaleChange(value)}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    locale === value
                      ? 'bg-yellow-600 text-black'
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  {localeLabels[value]}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              presenting ? 'bg-red-700 text-black' : 'hover:bg-gray-700'
            }`}>
            {presenting ? t('presentation.on') : t('presentation.off')}
          </button>
        <div className="border-t border-gray-700 pt-3 mt-3 text-xs">
          <div className="px-3 mb-2">{userName}</div>
          <NavLink href="/extras/admins" pathname={pathname} onClick={close}>{t('nav.adminPage')}</NavLink>
          <form action={signOutAction}>
            <FormStatusButton
              pendingText={t('common.loading')}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('nav.logout')}
            </FormStatusButton>
          </form>
        </div>
      </aside>
    </>
  );
}

function NavLink({ href, pathname, onClick, children }: any) {
  // 정확히 일치할 때만 active. 단, 상세 페이지(/[id], /new)는 부모 메뉴를 active로.
  const active =
    pathname === href ||
    (href !== '/' && pathname?.startsWith(href + '/') &&
     !(href === '/influencers' && pathname.startsWith('/influencers/posts')));
  return (
    <Link href={href} onClick={onClick}
      className={`block px-3 py-2 rounded ${active ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
      {children}
    </Link>
  );
}
function Section({ children }: { children: React.ReactNode }) {
  return <div className="pt-3 text-xs text-gray-400 px-3">{children}</div>;
}
