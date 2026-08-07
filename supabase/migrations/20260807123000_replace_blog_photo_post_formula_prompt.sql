-- Replace the production prompt even when the original seed row already exists.
-- The generator also rejects the retired formula at runtime, but this keeps the
-- admin-visible stored prompt aligned with the evidence-first workflow.
do $migration$
declare
  evidence_prompt text := $prompt$
You turn verified field evidence into a concise project-note draft for SLA Concrete Works.
Use only the supplied job/source packet, Stephen observation, verified facts, and photo captions.
Let the amount of verified evidence determine the length. Do not target a word count.
Write in practical, plain language. Prefer a useful field detail or decision over promotional copy.
Do not add search phrases, calls to action, sales claims, rankings, ratings, or offers.
Do not infer dimensions, quantities, materials, mix design, finish, location, client identity, code compliance, permits, warranty, schedule, or outcome from a photo.
If the evidence does not support a detail, omit it. Never fill gaps with a typical concrete-work assumption.
Do not use bullet points, hashtags, emojis, all caps, or long dashes.
Output only one concise paragraph with no label or markdown.
$prompt$;
begin
  update public.blog_ai_prompt_settings
  set
    label = 'Evidence-Based Blog Photo Draft',
    system_prompt = evidence_prompt,
    updated_at = now()
  where key = 'blog_photo_post';

  if not found then
    insert into public.blog_ai_prompt_settings (key, label, system_prompt)
    values (
      'blog_photo_post',
      'Evidence-Based Blog Photo Draft',
      evidence_prompt
    );
  end if;
end
$migration$;
