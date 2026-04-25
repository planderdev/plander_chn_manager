import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOutAction } from '@/actions/auth';
import Sidebar from '@/components/Sidebar';
import { PresentationProvider } from '@/lib/presentation-context';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Plander",
    template: "%s | Plander",
  },
  description: "Plander multilingual marketing management system",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/login');

  const { data: admin } = await sb.from('admins').select('name, title').eq('id', user.id).single();
  const userName = admin?.title ? `${admin.title} ${admin.name}` : (admin?.name ?? user.email ?? '');

  return (
    <PresentationProvider>
      <div className="min-h-screen overflow-x-hidden md:flex">
        <Sidebar userName={userName} signOutAction={signOutAction} />
        <main className="flex-1 min-w-0 overflow-x-hidden bg-gray-50">{children}</main>
      </div>
    </PresentationProvider>
  );
}
