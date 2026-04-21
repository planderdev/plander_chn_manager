alter table public.clients
  add column if not exists monthly_management_fee numeric(14, 2);

alter table public.schedules
  add column if not exists progress_status text not null default 'recruiting';

alter table public.schedules
  alter column scheduled_at drop not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'schedules_progress_status_check'
  ) then
    alter table public.schedules
      add constraint schedules_progress_status_check
      check (progress_status in (
        'recruiting',
        'recruited',
        'preparing',
        'upload_waiting',
        'uploaded',
        'delayed',
        'canceled'
      ));
  end if;
end $$;

update public.schedules
set progress_status = 'uploaded'
where progress_status = 'recruiting'
  and exists (
    select 1
    from public.posts
    where posts.schedule_id = schedules.id
      and posts.post_url is not null
      and btrim(posts.post_url) <> ''
  );

update public.schedules
set progress_status = 'upload_waiting'
where progress_status = 'recruiting'
  and scheduled_at is not null
  and scheduled_at < now()
  and not exists (
    select 1
    from public.posts
    where posts.schedule_id = schedules.id
      and posts.post_url is not null
      and btrim(posts.post_url) <> ''
  );
