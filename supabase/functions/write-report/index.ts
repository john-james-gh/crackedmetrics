import {createClient} from 'jsr:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
} as const;

console.log('Function "write-report" up and running!');

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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Validate API key and get tenant ID
    const {data: apiKeyData, error: apiKeyError} = await supabaseAdmin
      .from('api_keys')
      .select('tenant_id')
      .eq('key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      throw new Error('Invalid API key');
    }

    const {tenant_id} = apiKeyData;

    // Process and store the report
    const {report} = await req.json();

    const {error: insertError} = await supabaseAdmin.from('test_runs').insert([
      {
        tenant_id,
        raw_json: report,
        run_at: new Date().toISOString(),
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

    return new Response(JSON.stringify({error: errorMessage}), {
      headers: {...CORS_HEADERS, 'Content-Type': 'application/json'},
      status: 400,
    });
  }
});
