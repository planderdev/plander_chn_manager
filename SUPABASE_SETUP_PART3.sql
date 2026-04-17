alter table public.admins enable row level security;
alter table public.app_settings enable row level security;
alter table public.client_options enable row level security;
alter table public.clients enable row level security;
alter table public.influencers enable row level security;
alter table public.schedules enable row level security;
alter table public.posts enable row level security;
alter table public.post_metrics_history enable row level security;
alter table public.reports enable row level security;

drop policy if exists "authenticated full access admins" on public.admins;
create policy "authenticated full access admins"
on public.admins
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access app_settings" on public.app_settings;
create policy "authenticated full access app_settings"
on public.app_settings
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access client_options" on public.client_options;
create policy "authenticated full access client_options"
on public.client_options
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access clients" on public.clients;
create policy "authenticated full access clients"
on public.clients
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access influencers" on public.influencers;
create policy "authenticated full access influencers"
on public.influencers
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access schedules" on public.schedules;
create policy "authenticated full access schedules"
on public.schedules
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access posts" on public.posts;
create policy "authenticated full access posts"
on public.posts
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access post_metrics_history" on public.post_metrics_history;
create policy "authenticated full access post_metrics_history"
on public.post_metrics_history
for all to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full access reports" on public.reports;
create policy "authenticated full access reports"
on public.reports
for all to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values
  ('contracts', 'contracts', false),
  ('payments', 'payments', false),
  ('reports', 'reports', false)
on conflict (id) do nothing;

drop policy if exists "authenticated bucket access contracts" on storage.objects;
create policy "authenticated bucket access contracts"
on storage.objects
for all to authenticated
using (bucket_id = 'contracts')
with check (bucket_id = 'contracts');

drop policy if exists "authenticated bucket access payments" on storage.objects;
create policy "authenticated bucket access payments"
on storage.objects
for all to authenticated
using (bucket_id = 'payments')
with check (bucket_id = 'payments');

drop policy if exists "authenticated bucket access reports" on storage.objects;
create policy "authenticated bucket access reports"
on storage.objects
for all to authenticated
using (bucket_id = 'reports')
with check (bucket_id = 'reports');

insert into public.app_settings (key, value)
values
  ('apify_actor_id', 'apify~instagram-post-scraper'),
  ('cny_to_krw_rate', '200')
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into public.client_options (kind, value)
values
  ('category', '뷰티'),
  ('category', '식음료'),
  ('category', '라이프스타일'),
  ('sales_region', '상하이'),
  ('sales_region', '베이징'),
  ('sales_region', '광저우'),
  ('product', '샤오홍슈 체험단'),
  ('product', '도우인 숏폼'),
  ('product', '따중디엔핑 매장 홍보')
on conflict (kind, value) do nothing;
