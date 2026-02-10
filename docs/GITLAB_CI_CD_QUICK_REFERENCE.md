# GitLab CI/CD Quick Commands & Troubleshooting

## 🚀 Quick Start Commands

### Initialize Repository & Push to GitLab
```powershell
# Navigate to project
cd c:\APPLICATION\E-com

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SmartCart Application"

# Add GitLab remote (replace USERNAME with your GitLab username)
git remote add gitlab https://gitlab.com/USERNAME/smartcart.git

# Verify remote
git remote -v

# Push to GitLab
git push -u gitlab master
git push -u gitlab --all
```

### Set Default Branch in GitLab
```bash
# If default branch is wrong, set it:
git branch -M main master  # Rename to master
git push -u gitlab master
```

## 🏃 Common Workflows

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push to develop branch
git push gitlab develop

# Monitor pipeline
# → Go to GitLab → Pipelines → watch build
```

### Merge to Staging
```bash
# Create merge request in GitLab UI
# → Go to GitLab → Merge Requests → New MR
# → From: develop → To: master
# → Get approved
# → Merge button

# Or command line:
git checkout master
git pull gitlab master
git merge develop
git push gitlab master
```

### Deploy to Production (Manual)
```bash
# After merge to master:
# 1. Go to GitLab project → Build → Pipelines
# 2. Find latest master pipeline
# 3. Click ▶ button on "deploy-production" job
# 4. Confirm deployment
```

## 🔧 Runner Management Commands

### Windows PowerShell (as Administrator)

```powershell
# Check runner status
gitlab-runner status

# Verify runner connection
gitlab-runner verify

# List all runners
gitlab-runner list

# Restart runner
gitlab-runner restart

# Stop runner
gitlab-runner stop

# Start runner
gitlab-runner start

# Uninstall runner
gitlab-runner uninstall
gitlab-runner stop
```

### Register a New Runner
```powershell
gitlab-runner register
# When prompted:
# - URL: https://gitlab.com/
# - Token: [from project Settings → CI/CD → Runners]
# - Description: smartcart-runner
# - Executor: docker
# - Image: node:18
# - Services: (leave blank)
```

## 📊 Pipeline Monitoring

### View Pipelines
- GitLab Project → **Build → Pipelines**
- Click green checkmark to see jobs
- Click job name to see detailed logs

### Check Job Logs
1. Go to Pipelines
2. Click pipeline ID
3. Click job name (backend-build, frontend-test, etc.)
4. Scroll through logs

### Download Artifacts
1. Go to Pipelines
2. Click pipeline
3. Click "Artifacts" dropdown
4. Download ZIP

## 🆘 Troubleshooting

### Issue: Runner Not Connecting
```powershell
# Check Docker is running
docker --version

# Verify runner status
gitlab-runner verify

# Check runner config
cat C:\GitLab-runner\config.toml

# Restart runner
gitlab-runner restart
```

### Issue: Build Fails with "Cannot find module"
```bash
# Check package-lock.json exists
ls smartcart-backend/package-lock.json

# Try deleting node_modules and reinstalling locally
cd smartcart-backend
rm -r node_modules
npm install

# Commit changes
git add package-lock.json
git commit -m "Update dependencies"
git push gitlab develop
```

### Issue: Docker Image Pull Timeout
```yaml
# Edit .gitlab-ci.yml and add timeout
backend-build:
  stage: build
  timeout: 30m  # ← Add this
  script:
    - ...
```

### Issue: Pipeline Timeout
```yaml
# Increase timeout:
default:
  timeout: 1h  # ← Add at top level

# Or for specific job:
frontend-build:
  timeout: 45m
```

### Issue: Pipeline Shows "Pending" for Hours
```powershell
# Runner might be down
gitlab-runner verify

# Check if Docker is running
docker ps

# Restart everything
gitlab-runner restart
```

### Issue: Frontend Build Fails - "Out of Memory"
```yaml
# Add memory limit to node process
frontend-build:
  script:
    - npm ci --memory-limit=2gb
    - npm run build
```

### Issue: MySQL Connection Error in Pipeline
```yaml
# Add service to job
backend-test:
  services:
    - mysql:8.0
  variables:
    MYSQL_ROOT_PASSWORD: root
    MYSQL_DATABASE: smartcart_db
```

## 📝 Environment Variables Reference

### Check Variables in Pipeline
```yaml
# Add this to any job to debug:
script:
  - echo "Database: $DATABASE_URL"
  - echo "Environment: $NODE_ENV"
  - echo "API URL: $REACT_APP_API_URL"
```

### Required Variables
| Variable | Where Set | Example |
|----------|-----------|---------|
| DATABASE_URL | GitLab Settings | mysql://root:password@localhost:3306/smartcart_db |
| JWT_SECRET | GitLab Settings | your-secret-key |
| NODE_ENV | GitLab Settings | production |
| REACT_APP_API_URL | GitLab Settings | https://api.example.com |

## 🔐 Security Best Practices

### Protect Sensitive Variables
1. Go to GitLab Project → **Settings → CI/CD → Variables**
2. Check **Protected** - variable only available on protected branches
3. Check **Masked** - variable value hidden in logs

### Limit Deployment Access
1. Go to **Settings → Repository → Protected branches**
2. Set who can push/merge:
   - Master: Only maintainers
   - Develop: Developers + Maintainers

### Manage Access Levels
- Owner - Full access
- Maintainer - Can merge, push
- Developer - Can push to non-protected branches
- Reporter - View only

## 📈 Performance Tips

### Speed Up Builds
```yaml
# 1. Use caching
cache:
  paths:
    - smartcart-backend/node_modules/
    - smartcart-frontend/node_modules/

# 2. Use --prefer-offline
script:
  - npm ci --prefer-offline

# 3. Set job timeout appropriately
timeout: 20m
```

### Reduce Artifact Size
```yaml
# 1. Don't store everything
artifacts:
  paths:
    - smartcart-frontend/build/
  expire_in: 1 hour  # Clean up old artifacts

# 2. Use exclude
artifacts:
  paths:
    - build/
  exclude:
    - build/**/*.map
```

## 🎯 Common Deployment Patterns

### Deploy on Every Push (Development)
```yaml
deploy-dev:
  only:
    - develop  # Auto-deploys when pushing to develop
```

### Deploy on Merge (Staging)
```yaml
deploy-staging:
  only:
    - master   # Auto-deploys when merged to master
```

### Manual Production Deploy
```yaml
deploy-production:
  when: manual  # Click play button in UI
```

## 📞 Help & Links

- **GitLab CI/CD Docs:** https://docs.gitlab.com/ee/ci/
- **Runner Documentation:** https://docs.gitlab.com/runner/
- **YAML Reference:** https://docs.gitlab.com/ee/ci/yaml/
- **Troubleshooting:** https://docs.gitlab.com/ee/ci/troubleshooting.html

## 💾 Git Commands Cheat Sheet

```bash
# Check status
git status

# See commit history
git log --oneline -10

# Create branch
git checkout -b feature/name

# Switch branch
git checkout develop

# Push to GitLab
git push gitlab develop

# Pull from GitLab
git pull gitlab develop

# View remotes
git remote -v

# Add remote
git remote add gitlab https://...

# Delete branch locally
git branch -d feature/name

# Delete branch on GitLab
git push gitlab --delete feature/name
```

---

**Last Updated:** February 10, 2026
