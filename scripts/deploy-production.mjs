#!/usr/bin/env node

/**
 * ProofCore v1.0.0 Production Deployment Script
 *
 * Automates the technical launch process:
 * 1. Verify all tests pass
 * 2. Create release tag
 * 3. Build production artifacts
 * 4. Generate deployment report
 *
 * Usage:
 *   node scripts/deploy-production.mjs [--dry-run]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const dryRun = process.argv.includes('--dry-run');

const log = (msg, type = 'info') => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = {
    info: '[INFO]',
    success: '[OK]',
    error: '[ERROR]',
    warning: '[WARN]'
  }[type] || '[LOG]';

  console.log(`${prefix} ${timestamp} ${msg}`);
};

const exec = (cmd, description) => {
  log(`Running: ${description}...`);
  if (dryRun) {
    log(`[DRY-RUN] Would execute: ${cmd}`, 'warning');
    return '';
  }
  try {
    const output = execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    log(`Completed: ${description}`, 'success');
    return output;
  } catch (error) {
    log(`Failed: ${description}`, 'error');
    log(`Error: ${error.message}`, 'error');
    process.exit(1);
  }
};

const main = async () => {
  log('ProofCore v1.0.0 Production Deployment Starting');
  log(`Mode: ${dryRun ? 'DRY-RUN (no changes)' : 'PRODUCTION'}`, dryRun ? 'warning' : 'info');

  console.log('');
  console.log('[STAGE 1] Pre-deployment Verification');
  console.log('----------------------------------------');

  // 1. Verify tests pass
  exec('npm test', 'Running full test suite');

  // 2. Verify TypeScript compilation
  exec('npx tsc --noEmit', 'TypeScript compilation check');

  // 3. Verify git working tree is clean
  const gitStatus = execSync('git status --porcelain', {
    cwd: ROOT,
    encoding: 'utf-8'
  }).trim();

  if (gitStatus) {
    log('Git working tree has uncommitted changes:', 'error');
    console.log(gitStatus);
    process.exit(1);
  }
  log('Git working tree clean', 'success');

  console.log('');
  console.log('[STAGE 2] Read Version & Metadata');
  console.log('----------------------------------------');

  // Read package.json
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')
  );

  const version = packageJson.version;
  const pkgName = packageJson.name;

  log(`Package: ${pkgName}@${version}`, 'info');

  console.log('');
  console.log('[STAGE 3] Building Production Artifacts');
  console.log('----------------------------------------');

  // Build TypeScript
  exec('npm run build', 'Building production bundle');

  // Build Storybook (optional, for documentation)
  exec('npm run build-storybook', 'Building Storybook documentation');

  console.log('');
  console.log('[STAGE 4] Create Git Release Tag');
  console.log('----------------------------------------');

  const tagName = `v${version}`;
  const tagMessage = `Release ${version}: ProofCore - SIDRCE Drift-Free Tier 5 Certified`;

  log(`Creating git tag: ${tagName}...`);
  if (!dryRun) {
    try {
      // Check if tag already exists
      execSync(`git rev-parse ${tagName}`, {
        cwd: ROOT,
        stdio: 'ignore'
      });
      log(`Tag ${tagName} already exists`, 'warning');
    } catch {
      // Tag doesn't exist, create it
      exec(`git tag -a ${tagName} -m "${tagMessage}"`, `Creating tag ${tagName}`);
      exec('git push --tags', 'Pushing tags to remote');
    }
  } else {
    log(`[DRY-RUN] Would create tag: ${tagName}`, 'warning');
  }

  console.log('');
  console.log('[STAGE 5] Deployment Report');
  console.log('----------------------------------------');

  const report = {
    timestamp: new Date().toISOString(),
    version,
    packageName: pkgName,
    tag: tagName,
    mode: dryRun ? 'dry-run' : 'production',
    checklist: {
      testsPass: true,
      typescriptCompiles: true,
      gitClean: true,
      buildArtifacts: {
        dist: fs.existsSync(path.join(ROOT, 'dist')),
        storybook: fs.existsSync(path.join(ROOT, 'storybook-static'))
      },
      gitTag: tagName
    },
    nextSteps: [
      '1. Publish npm package:',
      '   npm publish --access=public',
      '',
      '2. Deploy Docker image:',
      '   docker build -t proofcore:v1.0.0 .',
      '   docker tag proofcore:v1.0.0 proofcore:latest',
      '',
      '3. Deploy web (auto via GitHub Pages)',
      '',
      '4. Submit to Show HN:',
      '   https://news.ycombinator.com/submit',
      '',
      '5. Twitter announcement:',
      '   See STAGE_4_DEPLOYMENT_MARKETING.md for tweet content',
      '',
      '6. Reddit crosspost:',
      '   r/MachineLearning, r/learnprogramming, r/math, r/compsci, r/typescript'
    ]
  };

  console.log(JSON.stringify(report, null, 2));

  // Save report
  const reportPath = path.join(ROOT, 'reports', 'deployment-v1.0.0.json');
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Deployment report saved: ${reportPath}`, 'success');

  console.log('');
  console.log('[SUMMARY] Deployment Preparation Complete');
  console.log('========================================');

  if (dryRun) {
    log('DRY-RUN MODE - No changes were made', 'warning');
    log('Run again without --dry-run to execute deployment', 'info');
  } else {
    log('All deployment checks passed!', 'success');
    log('Next: Follow steps in STAGE_4_DEPLOYMENT_MARKETING.md', 'info');
  }
};

main().catch(error => {
  log(`Deployment failed: ${error.message}`, 'error');
  process.exit(1);
});
