import {createClient} from '@supabase/supabase-js';

import type {Database} from './types.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
} as const;

console.log('[write-report] Started!');

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: CORS_HEADERS});
  }

  try {
    // Extract and validate API key
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      throw new Error('Missing API key');
    }

    // Initialize Supabase admin client with service role
    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Validate API key (must exist and be active)
    const {data: apiKeyData, error: apiKeyError} = await supabaseAdmin
      .from('api_keys')
      .select('id, tenant_id, project_id, status')
      .eq('key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      throw new Error('Invalid API key');
    }
    if (apiKeyData.status !== 'active') {
      throw new Error('API key is revoked');
    }

    // Optionally update last_used_at
    await supabaseAdmin
      .from('api_keys')
      .update({last_used_at: new Date().toISOString()})
      .eq('id', apiKeyData.id);

    // Parse and validate report payload
    const {report, test_tool, commit_hash, branch, creator_id, creator_type, duration, status} =
      await req.json();

    // Minimal field validation
    if (!report) throw new Error('Missing report');
    if (!test_tool) throw new Error('Missing test_tool');
    if (!status) throw new Error('Missing status');

    // Insert test run
    const {error: insertError} = await supabaseAdmin.from('reports').insert([
      {
        tenant_id: apiKeyData.tenant_id,
        project_id: apiKeyData.project_id,
        test_tool,
        run_at: new Date().toISOString(),
        raw_json: report,
        commit_hash,
        branch,
        creator_id,
        creator_type: creator_type || 'ci',
        duration,
        status,
      },
    ]);

    if (insertError) {
      throw new Error(`Failed to insert report: ${insertError.message}`);
    }

    return new Response(JSON.stringify({success: true}), {
      headers: {...CORS_HEADERS, 'Content-Type': 'application/json'},
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.log('[write-report]', errorMessage);
    return new Response(JSON.stringify({error: errorMessage}), {
      headers: {...CORS_HEADERS, 'Content-Type': 'application/json'},
      status: 400,
    });
  }
});

console.log('[write-report] Stopped!');
