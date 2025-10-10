#!/usr/bin/env node

/**
 * Secret Detection Script
 * Checks for accidentally staged secrets before commit
 * 
 * Usage: node scripts/check-secrets.js
 * Or add as pre-commit hook with husky
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Patterns that indicate secrets
const SECRET_PATTERNS = [
  // API Keys
  /(?:api[_-]?key|apikey)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{32,})['"]?/gi,
  
  // Firebase
  /AIza[0-9A-Za-z_\-]{35}/g,
  /"private_key":\s*"-----BEGIN PRIVATE KEY-----/g,
  
  // Generic tokens
  /(?:token|secret|password)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
  
  // AWS
  /AKIA[0-9A-Z]{16}/g,
  
  // SendGrid
  /SG\.[a-zA-Z0-9_\-]{22}\.[a-zA-Z0-9_\-]{43}/g,
];

// Files that should never be committed
const FORBIDDEN_FILES = [
  '.env.local',
  '.env.production',
  /.*-firebase-adminsdk-.*\.json$/,
  /serviceAccount.*\.json$/,
  /credentials\/.*\.json$/,
  /.*\.pem$/,
  /.*\.key$/,
];

console.log('🔍 Checking for secrets...\n');

try {
  // Get list of staged files
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean);

  if (stagedFiles.length === 0) {
    console.log('✅ No files staged for commit\n');
    process.exit(0);
  }

  console.log(`📝 Checking ${stagedFiles.length} staged file(s)...\n`);

  let foundSecrets = false;
  let forbiddenFound = false;

  // Check each staged file
  for (const file of stagedFiles) {
    // Check if file should never be committed
    for (const forbidden of FORBIDDEN_FILES) {
      if (typeof forbidden === 'string' && file === forbidden) {
        console.error(`❌ FORBIDDEN FILE: ${file}`);
        console.error(`   This file should NEVER be committed!\n`);
        forbiddenFound = true;
      } else if (forbidden instanceof RegExp && forbidden.test(file)) {
        console.error(`❌ FORBIDDEN FILE: ${file}`);
        console.error(`   This file matches forbidden pattern: ${forbidden}\n`);
        forbiddenFound = true;
      }
    }

    // Check file contents for secret patterns
    try {
      const filePath = path.join(process.cwd(), file);
      
      // Skip if file doesn't exist (deleted file)
      if (!fs.existsSync(filePath)) continue;
      
      // Skip binary files
      const stat = fs.statSync(filePath);
      if (stat.size > 1024 * 1024) continue; // Skip files > 1MB
      
      const content = fs.readFileSync(filePath, 'utf-8');
      
      for (const pattern of SECRET_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          console.error(`❌ POTENTIAL SECRET in ${file}:`);
          matches.slice(0, 3).forEach(match => {
            const preview = match.substring(0, 50) + (match.length > 50 ? '...' : '');
            console.error(`   ${preview}`);
          });
          console.error('');
          foundSecrets = true;
        }
      }
    } catch (error) {
      // Ignore files we can't read
    }
  }

  if (forbiddenFound || foundSecrets) {
    console.error('\n🚨 SECURITY ISSUE DETECTED!\n');
    console.error('To fix:');
    console.error('  1. Unstage files: git reset HEAD <file>');
    console.error('  2. Remove secrets from code');
    console.error('  3. Add secrets to .env.local or credentials/');
    console.error('  4. Add pattern to .gitignore if needed\n');
    process.exit(1);
  }

  console.log('✅ No secrets detected! Safe to commit.\n');
  process.exit(0);

} catch (error) {
  console.error('Error running secret check:', error.message);
  // Don't block commit on script error
  process.exit(0);
}

