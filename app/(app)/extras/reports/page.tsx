import { createClient } from '@/lib/supabase/server';
import { generateReportAction } from '@/actions/reports';
import DownloadButton from '@/components/report/DownloadButton';
import DeleteButton from '@/components/report/DeleteButton';
import SubmitButton from '@/components/SubmitButton';
import { getI18n } from '@/lib/i18n/server';
import { hasSupabaseEnv } from '@/lib/env';


export default async function ReportsPage() {
  const { t, locale } = await getI18n();
  if (!hasSupabaseEnv()) {
    const clients = [{ id: 1, company_name: 'Shanghai Bloom Clinic' }, { id: 2, company_name: 'Suzhou Tea House' }];
    const reports = [
      { id: 1, clients: { company_name: 'Shanghai Bloom Clinic' }, year_month: '2026-04', file_name: 'shanghai-bloom-2026-04.pdf', created_at: '2026-04-16T10:00:00+09:00' },
      { id: 2, clients: { company_name: 'Suzhou Tea House' }, year_month: '2026-04', file_name: 'suzhou-tea-2026-04.pdf', created_at: '2026-04-17T09:30:00+09:00' },
    ];
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"><div className="font-semibold">{t('demo.badge')}</div><div>{t('demo.sectionPreview')}</div></div>
        <h1 className="text-2xl font-bold">{t('reports.manageTitle')}</h1>
        <section><h2 className="text-lg font-semibold mb-3">{t('reports.new')}</h2><form className="bg-white p-6 rounded-lg shadow flex flex-wrap gap-4 items-end max-w-2xl"><div className="flex-1 min-w-[200px]"><label className="text-sm block mb-1 font-medium">{t('reports.company')}</label><select className="w-full border border-gray-400 rounded p-2"><option value="">{t('reports.select')}</option>{clients.map((c) => <option key={c.id}>{c.company_name}</option>)}</select></div><div><label className="text-sm block mb-1 font-medium">{t('reports.month')}</label><input type="month" className="border border-gray-400 rounded p-2" /></div><SubmitButton>{t('reports.create')}</SubmitButton></form></section>
        <section><h2 className="text-lg font-semibold mb-3">{t('reports.generated')}</h2><div className="bg-white rounded-lg shadow overflow-x-auto"><table className="w-full text-sm min-w-[600px]"><thead className="bg-gray-100 text-left"><tr><th className="p-3">{t('common.companyName')}</th><th className="p-3">{t('reports.month')}</th><th className="p-3">{t('reports.fileName')}</th><th className="p-3">{t('report.createdAt')}</th><th className="p-3">{t('schedule.manage')}</th></tr></thead><tbody>{reports.map((r: any) => <tr key={r.id} className="border-t"><td className="p-3">{r.clients.company_name}</td><td className="p-3">{r.year_month}</td><td className="p-3">{r.file_name}</td><td className="p-3">{new Date(r.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'ko-KR')}</td><td className="p-3 space-x-3"><span className="text-blue-600">{t('common.download')}</span><span className="text-red-500">{t('common.delete')}</span></td></tr>)}</tbody></table></div></section>
      </div>
    );
  }
  const sb = await createClient();
  const [{ data: clients }, { data: reports }] = await Promise.all([
    sb.from('clients').select('id, company_name').order('company_name'),
    sb.from('reports').select('*, clients(company_name)').order('created_at', { ascending: false }),
  ]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold">{t('reports.manageTitle')}</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">{t('reports.new')}</h2>
        <form action={generateReportAction} className="bg-white p-6 rounded-lg shadow flex flex-wrap gap-4 items-end max-w-2xl">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm block mb-1 font-medium">{t('reports.company')}</label>
            <select name="client_id" required className="w-full border border-gray-400 rounded p-2">
              <option value="">{t('reports.select')}</option>
              {clients?.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1 font-medium">{t('reports.month')}</label>
            <input type="month" name="year_month" required className="border border-gray-400 rounded p-2" />
          </div>
          <SubmitButton>{t('reports.create')}</SubmitButton>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">{t('reports.generated')}</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">{t('common.companyName')}</th>
                <th className="p-3">{t('reports.month')}</th>
                <th className="p-3">{t('reports.fileName')}</th>
                <th className="p-3">{t('report.createdAt')}</th>
                <th className="p-3">{t('schedule.manage')}</th>
              </tr>
            </thead>
            <tbody>
              {reports?.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.clients?.company_name}</td>
                  <td className="p-3">{r.year_month}</td>
                  <td className="p-3">{r.file_name}</td>
                  <td className="p-3">{new Date(r.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'ko-KR')}</td>
                  <td className="p-3 space-x-3">
                    <DownloadButton filePath={r.file_path} />
                    <DeleteButton id={r.id} />
                  </td>
                </tr>
              ))}
              {!reports?.length && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">{t('reports.none')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
