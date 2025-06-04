#!/usr/bin/env node
import {createClient} from '@supabase/supabase-js';
import {spawn} from 'child_process';
import fs from 'fs/promises';

const supabaseUrl = 'https://ttuqputnayjfqwwdzorw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXFwdXRuYXlqZnF3d2R6b3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODYwOTYsImV4cCI6MjA2NDU2MjA5Nn0.fAiOkJf5a6qA5UXWLsB18kBxlYkxMTtGAuh9tVksefE';

// Simple CLI argument parsing
const command = process.argv[2]; // e.g. vitest
const userArgs = process.argv.slice(3); // e.g. run --foo

export async function main() {
  if (command !== 'vitest') {
    console.error('Only vitest command is supported');
    process.exit(1);
  }

  // 1. Run vitest with json reporter/output
  const vitestArgs = [
    'run',
    '--reporter=default',
    '--reporter=json',
    '--outputFile=vitest-report.json',
    ...userArgs,
  ];
  await new Promise<void>((resolve) => {
    const p = spawn('vitest', vitestArgs, {stdio: 'inherit'});
    p.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        // If code is non-zero, it likely means tests failed
        // We still want to upload the results in this case
        console.warn('Warning: Some tests failed, but uploading results anyway...');
        resolve();
      }
    });
  });

  // 2. Read & upload
  const report = JSON.parse(await fs.readFile('vitest-report.json', 'utf8'));
  const supabase = createClient(supabaseUrl, supabaseKey);
  const {data, error} = await supabase.from('test_runs').insert([{raw_json: report, run_at: new Date()}]);

  if (error) {
    console.error('Error uploading report:', error);
    process.exit(1);
  } else {
    console.log('CrackedMetrics: upload complete!', data);
    process.exit(0);
  }
}
main();
