import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DeleteButton from '@/components/post/DeleteButton';
import { getI18n } from '@/lib/i18n/server';
import { autoCreatePostsFromPastSchedules } from '@/actions/posts';

export default async function PostsPage() {
  const { t } = await getI18n();
  await autoCreatePostsFromPastSchedules();  // ← 페이지 진입 시 자동 변환

  const sb = await createClient();
  const { data: posts } = await sb
    .from('posts')
    .select('*, clients(company_name), influencers(handle)')
    .order('updated_at', { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{t('posts.title')}</h1>
        <div className="flex gap-2">
          <Link href="/influencers/posts/new" className="bg-black text-white px-4 py-2 rounded">{t('posts.new')}</Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">{t('common.companyName')}</th>
              <th className="p-3">{t('common.influencer')}</th>
              <th className="p-3">{t('common.post')}</th>
              <th className="p-3">{t('postForm.uploadedOn')}</th>
              <th className="p-3">{t('schedule.manage')}</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.clients?.company_name ?? '-'}</td>
                <td className="p-3">
                  <Link href={`/influencers/${p.influencer_id}`} className="text-blue-600 hover:underline">
                    @{p.influencers?.handle}
                  </Link>
                </td>
                <td className="p-3">
                  {p.post_url
                    ? <a href={p.post_url} target="_blank" className="text-blue-600 hover:underline">{t('common.link')}</a>
                    : <span className="text-gray-400">{t('posts.uploaded')}</span>}
                </td>
                <td className="p-3">{p.uploaded_on ?? '-'}</td>
                <td className="p-3 space-x-2">
                  <Link href={`/influencers/posts/${p.id}`} className="text-blue-600">{t('common.edit')}</Link>
                  <DeleteButton id={p.id} />
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">{t('posts.none')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
