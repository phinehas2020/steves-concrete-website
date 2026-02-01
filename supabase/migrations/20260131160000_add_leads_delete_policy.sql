-- Allow admins to delete leads
create policy "Admins can delete leads"
  on public.leads for delete
  to authenticated
  using (public.is_admin());
