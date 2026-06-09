import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: userData, error } = await admin.auth.getUser(token);
  if (error || !userData.user) return new Response('unauthorized', { status: 401 });

  await admin.auth.admin.deleteUser(userData.user.id); // cascades via FKs
  return new Response('ok');
});
