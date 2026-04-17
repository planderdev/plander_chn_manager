import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer';
import path from 'path';
import { translate, type Locale } from '@/lib/i18n/config';

Font.register({
  family: 'NotoKR',
  src: path.join(process.cwd(), 'public/fonts/NotoSansKR-Regular.ttf'),
});

const s = StyleSheet.create({
  page: { padding: 36, fontFamily: 'NotoKR', fontSize: 9 },  // 한 사이즈 줄임
  h1: { fontSize: 18, marginBottom: 6 },
  sub: { fontSize: 10, color: '#555', marginBottom: 12 },
  box: { border: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 },
  row: { flexDirection: 'row', borderBottom: 1, borderColor: '#eee', paddingVertical: 6 },
  head: { backgroundColor: '#eee', fontWeight: 'bold' as any },
  cName: { width: '16%' },
  cChannel: { width: '10%' },
  cDate: { width: '12%' },
  cUpload: { width: '12%' },
  cStatus: { width: '8%' },
  cNum: { width: '10.5%', textAlign: 'right' as any },
});

export function ReportDoc({ client, month, schedules, thisHist, prevHist, prevMonth, locale = 'ko' }: any) {
  const histMap = new Map<number, any>();
  for (const h of thisHist) histMap.set(h.post_id, h);
  const prevMap = new Map<number, any>();
  for (const h of prevHist) prevMap.set(h.post_id, h);

  const sumKey = (arr: any[], k: string) => arr.reduce((a, r) => a + (r[k] ?? 0), 0);
  const tv = sumKey(thisHist, 'views');
  const tl = sumKey(thisHist, 'likes');
  const tc = sumKey(thisHist, 'comments');
  const ts = sumKey(thisHist, 'shares');
  const pv = sumKey(prevHist, 'views');
  const pl = sumKey(prevHist, 'likes');
  const pc = sumKey(prevHist, 'comments');
  const ps = sumKey(prevHist, 'shares');

  const fmt = (cur: number, prev: number) => {
    if (prev === 0) {
      return cur > 0
        ? translate(locale as Locale, 'report.prevIncrease', { value: cur.toLocaleString() })
        : '-';
    }
    const diff = cur - prev;
    const pct = ((diff / prev) * 100).toFixed(1);
    return `${diff >= 0 ? '+' : ''}${diff.toLocaleString()} (${pct}%)`;
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>{client.company_name} - {month} {translate(locale as Locale, 'report.monthlyReport')}</Text>
        <Text style={s.sub}>{translate(locale as Locale, 'report.manager')}: {client.contact_person ?? '-'} · {translate(locale as Locale, 'report.contact')}: {client.phone ?? '-'}</Text>

        <View style={s.box}>
          <Text>{translate(locale as Locale, 'report.totalSchedules')}: {schedules.length}</Text>
          <Text>{translate(locale as Locale, 'report.totalViews')}: {tv.toLocaleString()}   {translate(locale as Locale, 'report.totalLikes')}: {tl.toLocaleString()}   {translate(locale as Locale, 'report.totalComments')}: {tc.toLocaleString()}   {translate(locale as Locale, 'report.totalShares')}: {ts.toLocaleString()}</Text>
          <Text>{translate(locale as Locale, 'report.prevMonthComparison', { prevMonth })} - {translate(locale as Locale, 'report.totalViews')} {fmt(tv, pv)}   {translate(locale as Locale, 'report.totalLikes')} {fmt(tl, pl)}</Text>
        </View>

        <View style={[s.row, s.head]}>
          <Text style={s.cName}>{translate(locale as Locale, 'common.influencer')}</Text>
          <Text style={s.cChannel}>{translate(locale as Locale, 'report.channel')}</Text>
          <Text style={s.cDate}>{translate(locale as Locale, 'report.shootDate')}</Text>
          <Text style={s.cUpload}>{translate(locale as Locale, 'report.uploadDate')}</Text>
          <Text style={s.cStatus}>{translate(locale as Locale, 'report.upload')}</Text>
          <Text style={s.cNum}>{translate(locale as Locale, 'report.totalViews')}</Text>
          <Text style={s.cNum}>{translate(locale as Locale, 'report.totalLikes')}</Text>
          <Text style={s.cNum}>{translate(locale as Locale, 'report.totalComments')}</Text>
          <Text style={s.cNum}>{translate(locale as Locale, 'report.totalShares')}</Text>
        </View>
        {schedules.map((s2: any) => {
          const p = s2.posts?.find((p: any) => p.post_url);
          const uploaded = !!p;
          const h = p ? histMap.get(p.id) : null;
          const d = new Date(s2.scheduled_at);
          const dateStr = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
          const uploadStr = p?.uploaded_on
            ? p.uploaded_on.replaceAll('-','/')
            : '-';
          return (
            <View key={s2.id} style={s.row}>
              <Text style={s.cName}>@{s2.influencers?.handle}</Text>
              <Text style={s.cChannel}>{s2.influencers?.channel ?? '-'}</Text>
              <Text style={s.cDate}>{dateStr}</Text>
              <Text style={s.cUpload}>{uploadStr}</Text>
              <Text style={s.cStatus}>{uploaded ? 'O' : 'X'}</Text>
              <Text style={s.cNum}>{(h?.views ?? 0).toLocaleString()}</Text>
              <Text style={s.cNum}>{(h?.likes ?? 0).toLocaleString()}</Text>
              <Text style={s.cNum}>{(h?.comments ?? 0).toLocaleString()}</Text>
              <Text style={s.cNum}>{(h?.shares ?? 0).toLocaleString()}</Text>
            </View>
          );
        })}
        {/* ... 기존 테이블 행들 ... */}

        {/* 하단 통계 */}
        <View style={[s.box, { marginTop: 16 }]}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' as any, marginBottom: 6 }}>
            {month} {translate(locale as Locale, 'report.monthlyStats')}
          </Text>
          <Text>{translate(locale as Locale, 'report.visitingInfluencers')}: {schedules.length}</Text>
          <Text>{translate(locale as Locale, 'report.uploadCompleted')}: {schedules.filter((s: any) => s.posts?.some((p: any) => p.post_url)).length}</Text>
          <Text>{translate(locale as Locale, 'report.totalViews')}: {tv.toLocaleString()} {fmt(tv, pv)}</Text>
          <Text>{translate(locale as Locale, 'report.totalLikes')}: {tl.toLocaleString()} {fmt(tl, pl)}</Text>
          <Text>{translate(locale as Locale, 'report.totalComments')}: {tc.toLocaleString()} {fmt(tc, pc)}</Text>
          <Text>{translate(locale as Locale, 'report.totalShares')}: {ts.toLocaleString()} {fmt(ts, ps)}</Text>
        </View>

        {/* 생성일 */}
        <Text style={{ fontSize: 9, color: '#888', textAlign: 'right' as any, marginTop: 12 }}>
          {translate(locale as Locale, 'report.createdAt')}: {new Date().toLocaleString(locale === 'zh' ? 'zh-CN' : 'ko-KR', { timeZone: 'Asia/Seoul' })}
        </Text>
      </Page>
    </Document>
  );
}

export async function generateReportPdf(data: any): Promise<Buffer> {
  return await renderToBuffer(<ReportDoc {...data} />) as Buffer;
}
