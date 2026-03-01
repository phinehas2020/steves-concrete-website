-- Tighten lead ingestion so only server-side inserts are allowed.
drop policy if exists "Allow lead inserts" on public.leads;

create policy "Service role can insert leads"
  on public.leads for insert
  to service_role
  with check (true);

-- Support fast anti-spam checks in the API.
create index if not exists idx_leads_created_at
  on public.leads (created_at desc);

create index if not exists idx_leads_ip_created_at
  on public.leads (ip, created_at desc)
  where ip is not null;

create index if not exists idx_leads_phone_created_at
  on public.leads (phone, created_at desc);

create index if not exists idx_leads_email_created_at
  on public.leads (email, created_at desc)
  where email is not null;
