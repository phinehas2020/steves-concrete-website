-- Allow service_role and anon to insert leads (for API endpoint)
-- service_role should bypass RLS, but this ensures inserts work
create policy "Allow lead inserts"
  on public.leads for insert
  to anon, service_role
  with check (true);
