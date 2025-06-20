#!/usr/bin/env node
import {createClient} from '@supabase/supabase-js';
import chalk from 'chalk';
import {spawn} from 'child_process';
import 'dotenv/config';
import fs from 'fs/promises';

const SUPABASE_URL = ''
const SUPABASE_ANON_KEY = ''

const API_KEY = process.env.CRACKED_API_KEY; // Project API Key

/**
 * Run git commands and return stdout
 */
export async function runGit(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const git = spawn('git', args);
    let data = '';
    git.stdout.on('data', (chunk) => (data += chunk));
    git.on('close', (code) => {
      if (code === 0) resolve(data.trim());
      else reject(new Error(`git ${args.join(' ')} exited ${code}`));
    });
  });
}

/**
 * Main entrypoint for the CLI
 */
export async function main(): Promise<void> {
  if (!API_KEY) {
    console.error('Missing CRACKED_API_KEY env variable (project API key)');
    process.exit(1);
  }

  const command = process.argv[2];
  const userArgs = process.argv.slice(3);

  if (command !== 'vitest') {
    console.error('Only vitest command is supported');
    process.exit(1);
  }

  // Run vitest
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

  // Read report
  const report = JSON.parse(await fs.readFile('vitest-report.json', 'utf8'));
  const status = report.success ? 'passed' : 'failed';

  // Try git metadata
  let commit_hash: string | null = null;
  let branch: string | null = null;
  try {
    commit_hash = await runGit(['rev-parse', 'HEAD']);
    branch = await runGit(['rev-parse', '--abbrev-ref', 'HEAD']);
  } catch {
    console.warn('Failed to get git commit and branch');
  }

  const payload = {report, test_tool: 'vitest', commit_hash, branch, creator_type: 'ci', status};

  console.log('\n', chalk.bgCyan.white.bold(' ⬆ CRACKEDMETRICS ') + chalk.white(' Uploading report...'));

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const {error: uploadError} = await supabase.functions.invoke('write-report', {
    body: payload,
    headers: {Authorization: `Bearer ${API_KEY}`},
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
  }

  console.log('\n', chalk.bgGreen.white.bold(' ✔ CRACKEDMETRICS ') + chalk.white(' Upload complete!'), '\n');
  process.exit(0);
}

main();
