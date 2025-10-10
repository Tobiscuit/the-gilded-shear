# 🔐 Credentials Directory

**⚠️ WARNING: This folder contains sensitive files that must NEVER be committed to git!**

---

## 📁 Expected Files

### Firebase Service Account Key
```
credentials/firebase-admin-sdk.json
```

**How to get it:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save as `firebase-admin-sdk.json` in this folder

**Used for:** Cloud Functions admin operations

---

### SendGrid API Key (Optional: Store in .env instead)
```
credentials/sendgrid-key.txt
```

**How to get it:**
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Settings → API Keys → Create API Key
3. Select "Full Access"
4. Save the key in this file

**Alternative:** Store in `.env.local` as `SENDGRID_API_KEY`

---

## 🛡️ Security Best Practices

### ✅ DO:
- Keep this folder on your local machine only
- Use environment variables when possible (`.env.local`)
- Rotate keys if accidentally exposed
- Use Firebase Secret Manager for Cloud Functions in production
- Share credentials via password managers (1Password, LastPass)

### ❌ DON'T:
- Never commit files from this folder
- Never share via Slack, email, or messaging
- Never screenshot or copy-paste in public channels
- Never check in "temporarily" (even in branches)

---

## 🔄 Key Rotation

If a key is compromised:

### Firebase Service Account
1. Go to Firebase Console → IAM & Admin → Service Accounts
2. Delete the compromised key
3. Generate a new key
4. Update this file and redeploy Cloud Functions

### SendGrid API Key
1. Go to SendGrid → API Keys
2. Delete the old key
3. Create a new one
4. Update `.env.local` or this folder
5. Redeploy

---

## 🔍 Verifying Security

Run this command to ensure no secrets are staged:

```bash
git status
git diff --cached
```

If you see files from this folder, **DO NOT COMMIT**:

```bash
git reset HEAD credentials/
```

---

## 📝 Current Files (Example)

```
credentials/
├── .gitkeep                      ✅ Tracked
├── README.md                     ✅ Tracked (instructions only)
├── firebase-admin-sdk.json       ❌ Ignored (sensitive!)
└── sendgrid-key.txt              ❌ Ignored (sensitive!)
```

---

**Last Updated**: October 10, 2025  
**Security Status**: All sensitive files properly ignored ✅

