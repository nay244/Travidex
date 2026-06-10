// supabase/functions/moderate/index.ts
// Admin-only moderation tool. Invoked by a trusted admin with the service-role key, e.g.:
//   supabase functions invoke moderate --no-verify-jwt \
//     --header "Authorization: Bearer <SERVICE_ROLE_KEY>" \
//     --body '{"submissionId":"...","action":"approve"}'
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Admin-only: require the service-role key as bearer. Regular user JWTs cannot moderate.
  const auth = req.headers.get('Authorization') ?? '';
  if (auth !== `Bearer ${serviceKey}`) {
    return new Response('forbidden', { status: 403 });
  }

  const { submissionId, action, reason, moderator } = await req.json();

  if (action !== 'approve' && action !== 'reject') {
    return new Response('bad action', { status: 400 });
  }

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

  const { data: sub, error: e1 } = await admin
    .from('community_submissions').select('*').eq('id', submissionId).single();
  if (e1 || !sub) return new Response('not found', { status: 404 });

  if (action === 'approve') {
    const { data: maxRow } = await admin
      .from('sights').select('dex_no').eq('city_id', sub.city_id)
      .order('dex_no', { ascending: false }).limit(1).maybeSingle();
    const nextDex = (maxRow?.dex_no ?? 0) + 1;
    const { error: insertError } = await admin.from('sights').insert({
      city_id: sub.city_id, dex_no: nextDex, name: sub.name, type_tags: sub.type_tags,
      about: sub.about, hint: sub.hint, access: sub.access, size: sub.size, busyness: sub.busyness,
      reference_photo: sub.reference_photo, location: sub.location, source: 'community',
    });
    if (insertError) return new Response('failed to insert sight', { status: 500 });
    const { error: updateError } = await admin.from('community_submissions')
      .update({ status: 'approved', reviewed_at: new Date().toISOString(), moderated_by: moderator ?? null })
      .eq('id', submissionId);
    if (updateError) return new Response('failed to update submission', { status: 500 });
  } else {
    const { error: updateError } = await admin.from('community_submissions')
      .update({ status: 'rejected', reject_reason: reason ?? null, reviewed_at: new Date().toISOString(), moderated_by: moderator ?? null })
      .eq('id', submissionId);
    if (updateError) return new Response('failed to update submission', { status: 500 });
  }
  return new Response('ok');
});
