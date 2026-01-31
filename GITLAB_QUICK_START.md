# Quick Start: GitLab CI/CD Setup

## TL;DR - 5 Minutes Setup

### 1. Create GitLab Project
- Go to https://gitlab.com/projects/new
- Create new project: `smartcart`
- Click "Create project"

### 2. Run Setup Script (Windows)
```powershell
# Open PowerShell as Administrator, then:
cd C:\APPLICATION\E-com
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\setup-gitlab-ci.ps1
```

The script will:
- ✓ Add GitLab remote
- ✓ Push all branches to GitLab
- ✓ Display setup instructions

### 3. Install GitLab Runner (Windows)
```powershell
# As Administrator:
$url = "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe"
Invoke-WebRequest -Uri $url -OutFile gitlab-runner.exe
.\gitlab-runner.exe install
.\gitlab-runner.exe start
```

### 4. Register Runner
```powershell
gitlab-runner register
```

When prompted:
```
GitLab instance URL: https://gitlab.com/
Registration token: [Get from GitLab project Settings → CI/CD → Runners]
Runner description: smartcart-runner
Runner executor: docker
Docker image: node:18
```

### 5. Add Environment Variables
In GitLab project: **Settings → CI/CD → Variables**

Add:
- `DATABASE_URL` = `mysql://root:password@localhost:3306/smartcart_db`
- `JWT_SECRET` = your secret key
- `NODE_ENV` = production

### 6. Verify
- Go to GitLab project → **Build → Pipelines**
- Push a commit to trigger pipeline
- Watch it build and deploy automatically! 🚀

---

## Manual Commands (if you prefer)

### Add GitLab Remote
```bash
cd C:\APPLICATION\E-com
git remote add gitlab https://gitlab.com/YOUR_USERNAME/smartcart.git
```

### Push Code
```bash
git push -u gitlab --all
git push -u gitlab --tags
```

### Check Current Status
```bash
git remote -v
git branch -a
```

---

## What Happens After Setup

### On Push to Develop
- ✓ Backend tests run
- ✓ Frontend builds
- ✓ Auto-deploy to Dev environment

### On Push to Master/Main
- ✓ Backend tests run
- ✓ Frontend builds
- ✓ Auto-deploy to Staging environment

### Production Deployment
- Go to **Build → Pipelines**
- Click play button ▶ next to `deploy-production`
- Confirm deployment

---

## Troubleshooting

### Runner Won't Register
```bash
# Check if runner is running
gitlab-runner status

# Restart
gitlab-runner restart
```

### Pipeline Not Starting
1. Check runner is registered: **Settings → CI/CD → Runners**
2. Verify runner is online (green dot)
3. Check `.gitlab-ci.yml` exists in repo root
4. Try pushing a commit: `git commit --allow-empty -m "trigger pipeline"`

### Deploy Failed
1. Check job logs: **Build → Jobs**
2. Verify environment variables are set
3. Check database connection
4. Review error messages

---

## File Structure After Setup

```
.gitlab-ci.yml                    ← Pipeline configuration
GITLAB_CI_CD_SETUP.md            ← Detailed setup guide  
setup-gitlab-ci.sh               ← Linux/Mac setup script
setup-gitlab-ci.ps1              ← Windows setup script
.github/workflows/               ← GitHub Actions (also configured)

smartcart-backend/
  package.json
  src/
    app.js
    server.js
    ...

smartcart-frontend/
  package.json
  src/
    App.js
    ...
```

---

## Next Steps

1. ✅ Code synced to GitHub: https://github.com/bn8204/smartcart
2. ⏳ Code ready for GitLab: Run setup script
3. ⏳ CI/CD pipeline running: Configure runner
4. ⏳ Auto-deployments: Add environment variables
5. ⏳ Production ready: Manual deployments

---

## Support

- **GitLab Docs**: https://docs.gitlab.com/ee/ci/
- **Runner Setup**: https://docs.gitlab.com/runner/install/
- **CI/CD Examples**: https://gitlab.com/gitlab-examples
- **Troubleshooting**: See `GITLAB_CI_CD_SETUP.md`

---

## Summary

Your repository is ready with:
- ✅ GitHub (fully synced): https://github.com/bn8204/smartcart.git
- ✅ GitHub Actions CI/CD configured
- ✅ GitLab CI/CD configured (.gitlab-ci.yml)
- ✅ Setup scripts for easy migration

**Just run the setup script and follow the prompts!** 🎯
