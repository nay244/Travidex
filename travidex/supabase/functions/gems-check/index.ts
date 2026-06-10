import { createClient } from 'jsr:@supabase/supabase-js@2';

// Invoked by a Database Webhook on INSERT into gems (configure at deploy).
// v1 automated checks: (1) name/note profanity wordlist, (2) geo sanity — the
// gem must lie within 50 km of its city's center. Image-safety classification
// is deferred (needs an external classifier; see plan 7.6).
// Hard fail -> status='rejected' + rejection_reason + moderation_log row.
// Pass -> leave 'pending' for the moderator queue; log 'auto_checked'.

const BANNED = ['fuck', 'shit', 'bitch', 'cunt', 'nigger', 'faggot'];

function textViolation(...fields: (string | null)[]): boolean {
  const hay = fields.filter(Boolean).join(' ').toLowerCase();
  return BANNED.some(w => hay.includes(w));
}

Deno.serve(async (req) => {
  const auth = req.headers.get('Authorization') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  if (auth !== `Bearer ${serviceKey}`) return new Response('forbidden', { status: 403 });

  const payload = await req.json();
  const gem = payload.record ?? payload; // webhook wraps the row in `record`
  if (!gem?.id) return new Response('no gem', { status: 400 });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

  let reason: string | null = null;

  if (textViolation(gem.name, gem.note)) reason = 'text failed automated screening';

  if (!reason) {
    // Geo sanity: gem point within 50km of its city's center.
    const { data, error } = await admin.rpc('gem_geo_sane', { p_gem: gem.id, p_max_m: 50000 });
    if (error) return new Response('geo check failed', { status: 500 });
    if (data === false) reason = 'location is implausibly far from the claimed city';
  }

  if (reason) {
    const { error: upErr } = await admin
      .from('gems')
      .update({ status: 'rejected', rejection_reason: reason, reviewed_at: new Date().toISOString() })
      .eq('id', gem.id);
    if (upErr) return new Response('update failed', { status: 500 });
    await admin.from('moderation_log').insert({ gem_id: gem.id, actor: null, action: 'auto_reject', reason });
    return new Response('rejected');
  }

  await admin.from('moderation_log').insert({ gem_id: gem.id, actor: null, action: 'auto_checked', reason: null });
  return new Response('ok');
});
