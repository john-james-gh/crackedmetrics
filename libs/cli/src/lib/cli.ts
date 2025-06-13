#!/usr/bin/env node
import {createClient} from '@supabase/supabase-js';
import chalk from 'chalk';
import {spawn} from 'child_process';
import 'dotenv/config';
import fs from 'fs/promises';

const SUPABASE_URL = 'https://ttuqputnayjfqwwdzorw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dXFwdXRuYXlqZnF3d2R6b3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODYwOTYsImV4cCI6MjA2NDU2MjA5Nn0.fAiOkJf5a6qA5UXWLsB18kBxlYkxMTtGAuh9tVksefE';
const API_KEY = process.env.CRACKED_API_KEY; // Project API Key

if (!API_KEY) {
  console.error('Missing CRACKED_API_KEY env variable (project API key)');
  process.exit(1);
}

const command = process.argv[2];
const userArgs = process.argv.slice(3);

async function main() {
  if (command !== 'vitest') {
    console.error('Only vitest command is supported');
    process.exit(1);
  }

  // Run vitest and write report
  const vitestArgs = [
    'run',
    '--reporter=default',
    '--reporter=json',
    '--outputFile=vitest-report.json',
    ...userArgs,
  ];
  await new Promise<void>((resolve) => {
    const p = spawn('vitest', vitestArgs, {stdio: 'inherit'});
    p.on('close', () => resolve());
  });

  // Read JSON report
  const report = JSON.parse(await fs.readFile('vitest-report.json', 'utf8'));
  const status = report.success ? 'passed' : 'failed';

  // Optionally grab git commit and branch
  let commit_hash = null,
    branch = null;
  try {
    commit_hash = (await runGit(['rev-parse', 'HEAD'])).trim();
    branch = (await runGit(['rev-parse', '--abbrev-ref', 'HEAD'])).trim();
  } catch {
    console.warn('Failed to get git commit and branch');
  }

  // Prepare payload
  const payload = {
    report,
    test_tool: 'vitest',
    commit_hash,
    branch,
    creator_type: 'ci', // always 'ci' if using project key
    status,
    // duration if you want to extract from report
  };

  console.log('\n', chalk.bgCyan.white.bold(' ⬆ CRACKEDMETRICS ') + chalk.white(' Uploading report...'));

  // Invoke Edge Function with Supabase Client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const {error: uploadError} = await supabase.functions.invoke('write-report', {
    body: payload,
    headers: {
      Authorization: `Bearer ${API_KEY}`, // Pass project API key for your backend to validate
    },
  });

  if (uploadError) {
    console.error(
      '\n',
      chalk.bgRed.white.bold(' ✖ CRACKEDMETRICS ') + chalk.white(' Upload failed!'),
      '\n',
      uploadError,
      '\n',
    );
    process.exit(1);
  } else {
    console.log(
      '\n',
      chalk.bgGreen.white.bold(' ✔ CRACKEDMETRICS ') + chalk.white(' Upload complete!'),
      '\n',
    );
    process.exit(0);
  }
}

async function runGit(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const git = spawn('git', args);
    let data = '';
    git.stdout.on('data', (chunk) => (data += chunk));
    git.on('close', (code) => {
      if (code === 0) resolve(data);
      else reject();
    });
  });
}
main();
