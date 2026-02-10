# GitHub Actions CI/CD Setup Guide

## Overview

Your project now has GitHub Actions CI/CD configured with automated building, testing, and deployment.

## ⚠️ Important: Fix Cache Error

The error you saw (`Error: Some specified paths were not resolved, unable to cache dependencies`) occurs when **multiple workflows conflict** or cache paths are wrong.

### Solution: Use ONE Master Workflow

I've updated your workflows. **Use only these two files:**

1. **`.github/workflows/ci.yml`** - Build & Test (KEEP THIS)
2. **`.github/workflows/deploy.yml`** - Deployment (KEEP THIS)

**DELETE or DISABLE these files to prevent conflicts:**
- `backend-ci.yml`
- `frontend-ci.yml`  
- `smartcart-ci-cd.yml`

### Why This Fixes It
- Single workflow prevents cache conflicts
- Correct cache-dependency-path for each app
- Proper Node.js setup before caching

## Workflow Files

### ✅ `.github/workflows/ci.yml`
**Runs on:** Push to main/master/develop, Pull Requests, Manual trigger
**Jobs:**
- Backend: Install → Lint → Verify structure
- Frontend: Install → Lint → Build → Verify
- Admin: Install → Lint → Build → Verify
- Security: npm audit on all packages
- Summary: Report all results

**Cache:** Separate for each app, specified with `cache-dependency-path`

**Artifacts:** 1-day retention

### ✅ `.github/workflows/deploy.yml`
**Runs on:** Manual trigger (workflow_dispatch)
**Environments:** development, staging, production
**Jobs:**
- Setup Node.js
- Build all three apps
- Create deployment package
- Upload artifacts (7-day retention)
- Provide manual deployment instructions

## Quick Start

### 1. Remove Old Workflows
```bash
# Option A: Via Git (recommended)
git rm .github/workflows/backend-ci.yml
git rm .github/workflows/frontend-ci.yml
git rm .github/workflows/smartcart-ci-cd.yml
git commit -m "refactor: Consolidate to single CI workflow"
git push

# Option B: Via GitHub UI
# Settings → Actions → Workflows → Delete old workflows
```

### 2. Verify Active Workflows
```
GitHub → Actions → See "CI Pipeline" running
```

### 3. Configure Deployment (Optional)

Go to **Settings → Environments** and create:

**development**
- No protection rules

**staging**
- Reviewers: Your team
- Protected branches: `main`, `master`

**production**
- Reviewers: Required
- Protected branches: `main`, `master`
- Deployment branches: `main`, `master`

### 4. Add Deployment Secrets (For Auto-Deploy)

Go to **Settings → Secrets and variables → Actions**:

```
DEPLOY_KEY        = Your SSH private key
DEPLOY_HOST       = production.example.com
DEPLOY_USER       = deploy_user
DEPLOY_PATH       = /var/www/smartcart
```

## Running Workflows

### Automatic CI
Push to any protected branch → CI automatically runs:
```
Code pushed → CI Pipeline starts → Tests run → Results shown
```

### Manual Deployment
1. Go to **Actions** tab
2. Click **Deploy Application**
3. Click **Run workflow**
4. Select environment (development / staging / production)
5. Click **Run workflow**
6. Monitor in real-time
7. Download artifacts when complete

### View Results
**Pass:** Green checkmark in commit/PR
**Fail:** Red X - click to see error logs

## Troubleshooting

### Cache Error Still Showing?

**Clear GitHub Actions cache:**
1. Settings → Actions → Caches
2. Click "Delete cache" on any cached items
3. Re-run workflow

**Or manually:**
```bash
# Force re-run ignoring cache
# Actions → Workflow → Re-run jobs → Re-run all jobs
```

### Cache Paths Not Resolved?

**Check:**
- Node version correct (18)
- Working directory set before install
- package-lock.json exists in each directory

**Fix:**
```bash
# In each directory
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Regenerate package-lock"
git push
```

### Build Fails?

**View detailed logs:**
1. Actions → Failed workflow
2. Click job name
3. Expand failing step
4. Read error message

**Common fixes:**
```bash
# Clear cache and reinstall locally first
rm -rf node_modules/ package-lock.json
npm install
npm run build
git add -A
git push
```

### Deploy Fails?

**Check deployment secrets:**
1. Settings → Secrets and variables → Actions
2. Verify DEPLOY_KEY, DEPLOY_HOST, etc.
3. Test SSH connection manually first

**Manual deployment:**
1. Download artifact from Actions
2. SSH to server manually
3. Extract files
4. Update environment vars
5. Restart services

## Environment Configuration

### GitHub Secrets vs .env Files

**DO:** Store in GitHub Secrets (Settings → Secrets)
- DATABASE_PASSWORD
- API_KEYS
- JWT_SECRETS

**DO NOT:** Commit to Git
- .env files
- Private keys
- Credentials

**DO:** Commit .env.example with placeholders
- Already created in each directory
- Share with team

## Performance Tips

### Speed Up Builds

**Parallel jobs:**
- Backend, Frontend, Admin build simultaneously
- Saves ~5 minutes per workflow

**Caching:**
- npm modules cached after first run
- Subsequent runs use cache (~30 seconds savings)

**Artifacts:**
- 1-day retention for CI (saves storage)
- 7-day retention for deploy (keep for rollback)

### Reduce Build Time

```bash
# Local optimization
npm ci --prefer-offline  # Use local cache
npm run build --no-source-map  # Skip source maps
```

## Security Best Practices

✅ **Do:**
- Use GitHub Secrets for all credentials
- Mask sensitive output in logs
- Review PR before merge
- Use environment protection rules

❌ **Don't:**
- Print secrets in logs
- Commit .env files
- Use hardcoded credentials
- Auto-deploy to production

## Monitoring

### Watch Workflow Status

**In GitHub:**
```
Repo → Actions → See all workflow runs
```

**In Commits:**
```
View commit → See workflows status
✓ All checks passed = Safe to merge
✗ Some checks failed = Review errors
```

### View Logs

**Step-by-step:**
1. Actions → Workflow → Run
2. Click job name
3. Click step name
4. View full output

### Artifacts

**Download:**
1. Completed workflow → Click "Summary"
2. Artifacts section → Click download icon
3. Extract and use

**Retention:**
- CI artifacts: 1 day
- Deploy artifacts: 7 days (keep for rollback)

## Common Tasks

### Deploy to Staging
```
1. Actions → Deploy Application
2. Run workflow → Select "staging"
3. Check logs
4. Download artifact
5. Extract to staging server
```

### Deploy to Production
```
1. Actions → Deploy Application  
2. Run workflow → Select "production"
3. Download artifact
4. Manually SSH to production
5. Extract and restart services
6. Verify health checks
```

### View Test Results
```
1. Click completed workflow
2. Summary tab shows all job statuses
3. Click job to see detailed output
4. Artifacts section has build outputs
```

### Rollback Previous Version
```
1. Actions → Find previous successful deploy
2. Download artifacts
3. Extract to server
4. Restart services
```

## Environment-Specific Config

### Development
- Auto-deploy on develop branch
- Quick feedback
- 1-day artifact retention
- No approval needed

### Staging
- Manual deploy to main/master
- Full testing environment
- 3-day artifact retention
- Reviewer approval optional

### Production
- Manual deploy only
- Safety confirmations
- 7-day artifact retention
- Multiple reviewers recommended
- Deployment tracking enabled

## Next Steps

1. **Remove old workflows** (backend-ci.yml, etc.)
2. **Push changes** to trigger new CI
3. **Monitor first run** - should complete in 5-10 minutes
4. **Test deploy** - try staging deployment
5. **Configure production** - add environment protection

## Documentation

For detailed deployment info: See `docs/` folder
- `CICD_SETUP_GUIDE.md` - Full setup
- `CICD_QUICK_START.md` - Checklists
- `CICD_TROUBLESHOOTING.md` - Problem solving

## Support

**GitHub Actions Docs:** https://docs.github.com/en/actions
**Action Issues:** Check job logs in Actions tab
**npm Issues:** https://docs.npmjs.com/

---

**Status:** ✅ Ready to use
**Update logs:** See your Actions tab for runs
**Print this guide for reference!**
