#!/usr/bin/env node

/**
 * Firebase Setup Script for The Gilded Shear
 * 
 * This script helps automate the Firebase project setup process.
 * Run with: node scripts/setup-firebase.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Script for The Gilded Shear\n');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('npx firebase-tools --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is available');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI not found. Installing...');
    try {
      execSync('npm install -g firebase-tools', { stdio: 'inherit' });
      console.log('✅ Firebase CLI installed successfully');
      return true;
    } catch (installError) {
      console.log('❌ Failed to install Firebase CLI');
      return false;
    }
  }
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is available');
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI not found. Installing...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installed successfully');
      return true;
    } catch (installError) {
      console.log('❌ Failed to install Vercel CLI');
      return false;
    }
  }
}

// Create credentials directory
function createCredentialsDir() {
  const credsDir = path.join(process.cwd(), 'credentials');
  if (!fs.existsSync(credsDir)) {
    fs.mkdirSync(credsDir);
    console.log('✅ Created credentials directory');
  } else {
    console.log('✅ Credentials directory exists');
  }
}

// Display next steps
function displayNextSteps() {
  console.log('\n🚀 Next Steps:');
  console.log('1. Login to Firebase: npx firebase-tools login');
  console.log('2. Create project: npx firebase-tools projects:create the-gilded-shear-prod');
  console.log('3. Initialize Firebase: npx firebase-tools init');
  console.log('4. Login to Vercel: vercel login');
  console.log('5. Link project: vercel link');
  console.log('6. Follow the detailed guide: docs-private/FIREBASE_SETUP_GUIDE.md');
  console.log('\n📚 Full setup guide available at: docs-private/FIREBASE_SETUP_GUIDE.md');
}

// Main execution
function main() {
  console.log('Checking prerequisites...\n');
  
  const firebaseOk = checkFirebaseCLI();
  const vercelOk = checkVercelCLI();
  
  if (!firebaseOk || !vercelOk) {
    console.log('\n❌ Setup incomplete. Please install missing tools manually.');
    process.exit(1);
  }
  
  createCredentialsDir();
  
  console.log('\n✅ All prerequisites met!');
  displayNextSteps();
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { checkFirebaseCLI, checkVercelCLI, createCredentialsDir };
