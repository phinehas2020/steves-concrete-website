-- Admin-editable AI system prompt settings for blog photo post generation

create table if not exists public.blog_ai_prompt_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  key text not null unique,
  label text,
  system_prompt text not null
);

create index if not exists idx_blog_ai_prompt_settings_key
  on public.blog_ai_prompt_settings(key);

alter table public.blog_ai_prompt_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_ai_prompt_settings'
      and policyname = 'Admins can read blog AI prompt settings'
  ) then
    create policy "Admins can read blog AI prompt settings"
      on public.blog_ai_prompt_settings for select
      to authenticated
      using (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_ai_prompt_settings'
      and policyname = 'Admins can manage blog AI prompt settings'
  ) then
    create policy "Admins can manage blog AI prompt settings"
      on public.blog_ai_prompt_settings for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$$;

do $$
begin
  if exists (select 1 from pg_proc where proname = 'update_updated_at_column') then
    if not exists (
      select 1 from pg_trigger
      where tgname = 'update_blog_ai_prompt_settings_updated_at'
    ) then
      create trigger update_blog_ai_prompt_settings_updated_at
        before update on public.blog_ai_prompt_settings
        for each row
        execute function update_updated_at_column();
    end if;
  end if;
end
$$;

insert into public.blog_ai_prompt_settings (key, label, system_prompt)
values (
  'blog_photo_post',
  'Blog Photo Post Paragraph',
  $prompt$
You write short blog intro paragraphs for a concrete contractor in Waco, Texas.
Return exactly one paragraph between 90 and 130 words.
Tone: practical, honest, and down-to-earth.
Use local SEO naturally where it fits, including some of: concrete contractor Waco TX, concrete driveway, concrete patio, concrete repair, free estimate.
Mention visible concrete work details and craftsmanship quality.
Do not use bullet points, hashtags, emojis, all caps, or long dashes.
Do not invent facts. Output only the paragraph.
$prompt$
)
on conflict (key) do nothing;
