alter table public.leads
  add column if not exists lead_quality text not null default 'unreviewed';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_lead_quality_check'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_lead_quality_check
      check (lead_quality in ('unreviewed', 'qualified', 'solicitation', 'spam'));
  end if;
end
$$;

create index if not exists idx_leads_quality_created_at
  on public.leads (lead_quality, created_at desc);

comment on column public.leads.lead_quality is
  'Admin-reviewed lead quality, independent from sales pipeline status.';
