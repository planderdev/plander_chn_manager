type Props = { channel: string; size?: number };

export default function ChannelIcon({ channel, size = 18 }: Props) {
  const c = (channel || '').toLowerCase();
  const badge = (label: string, className: string) => (
    <span
      className={`inline-flex items-center justify-center rounded-full text-[10px] font-bold text-white ${className}`}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      {label}
    </span>
  );

  if (c === 'xiaohongshu') return badge('红', 'bg-rose-500');
  if (c === 'dianping') return badge('点', 'bg-amber-500');
  if (c === 'douyin') return badge('抖', 'bg-slate-800');

  return badge('?', 'bg-gray-300');
}
