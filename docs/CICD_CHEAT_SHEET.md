# CI/CD Cheat Sheet

Quick reference for common CI/CD tasks and commands.

## 🎯 GitLab Pipeline Links

```
View Pipelines:    https://gitlab.com/your-org/smartcart/-/pipelines
View Deploy Jobs:  https://gitlab.com/your-org/smartcart/-/pipelines
View Variables:    https://gitlab.com/your-org/smartcart/-/settings/ci_cd
View Runners:      https://gitlab.com/your-org/smartcart/-/runners
```

## 🔧 Runner Management

### Check Runner Status
```bash
gitlab-runner verify          # Verify runner connection
gitlab-runner list            # List all configured runners
gitlab-runner --version       # Check runner version
```

### Restart Runner
```bash
# Windows (PowerShell)
Stop-Service gitlab-runner
Start-Service gitlab-runner

# Linux/Mac
sudo systemctl restart gitlab-runner
sudo service gitlab-runner restart
```

### View Runner Logs
```bash
gitlab-runner --debug run     # Run with debugging
tail -f /var/log/gitlab-runner/system.log  # View system logs
```

## 🚀 Pipeline Control

### Trigger Manual Pipeline
```bash
# Via GitLab CLI (if installed)
glab pipeline run

# Via Git push
git push origin branch-name   # Automatically triggers pipeline

# Via GitLab Web UI
# CI/CD → Pipelines → "Run pipeline" button
```

### Cancel Running Pipeline
```bash
# GitLab Web UI
# Pipelines → Your Pipeline → Click "Cancel"

# GitLab CLI
glab pipeline cancel
```

### View Pipeline Logs
```bash
# Via GitLab Web UI
# CI/CD → Pipelines → Job Name → Scroll to bottom

# Not available via CLI but can download artifacts
```

### Clear Cache
```bash
# Via GitLab Web UI
# Settings → CI/CD → Clear runner cache

# Via GitLab CLI
glab ci cache delete
```

## 📦 Build Commands

### Local Build Testing

```bash
# Backend
cd smartcart-backend
npm ci                        # Install exact dependencies
npm run build --if-present    # Build if script exists
npm run lint --if-present     # Run linter

# Frontend
cd smartcart-frontend
npm ci
npm run build                 # Always required for React
CI=false npm run build        # Build without CI restrictions

# Admin Dashboard
cd smartcart-admin
npm ci
npm run build
```

### Check Build Output
```bash
# Frontend/Admin
ls -lah smartcart-frontend/build/
du -sh smartcart-frontend/build/

# View index.html
head -50 smartcart-frontend/build/index.html
```

## 🧪 Testing

### Run Tests Locally
```bash
# Syntax check
npm run lint

# Unit tests
npm test

# Full validation
npm run build && npm test
```

### View Test Results
```bash
# GitLab Web UI
# Job → "Reports" section

# Artifacts
# Job → Download artifacts folder
```

## 🐳 Docker Commands

### Build Docker Images
```bash
# Backend
cd smartcart-backend
docker build -t smartcart-backend:latest .

# Frontend
cd smartcart-frontend
docker build -t smartcart-frontend:latest .

# Admin
cd smartcart-admin
docker build -t smartcart-admin:latest .
```

### Run Docker Containers
```bash
# Run all services
docker-compose up -d

# Run single service
docker-compose up -d mysql
docker-compose up -d backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Docker Debugging
```bash
# View running containers
docker ps

# See container logs
docker logs smartcart-backend
docker logs -f smartcart-frontend

# Execute command in container
docker exec smartcart-backend npm --version

# Interactive shell
docker exec -it smartcart-backend /bin/sh
```

## 📝 Git Workflow for Deployments

### Feature Development
```bash
# Create feature branch
git checkout -b feature/payment-module

# Work and commit
git add .
git commit -m "feat: Add payment processing"

# Push to create MR
git push -u origin feature/payment-module

# In GitLab: Create merge request
```

### Release to Staging
```bash
# Create release branch
git checkout -b release/v1.0.0

# Update versions
# Edit: smartcart-backend/package.json
# Edit: smartcart-frontend/package.json
# Edit: smartcart-admin/package.json
# Edit: CHANGELOG.md

# Commit changes
git add .
git commit -m "release: v1.0.0"

# Push and create MR to main
git push -u origin release/v1.0.0

# In GitLab: Create MR to "main", get 2 approvals, merge
```

### Deploy to Production
```bash
# After merging to main, go to:
# CI/CD → Pipelines → Find your pipeline

# Click "Play" button next to "deploy-production"
# Review and confirm deployment
```

## 📊 Environment Variables

### View Variables
```bash
# GitLab Web UI
# Settings → CI/CD → Variables

# Environment vars in pipeline
# Job logs will show echoed values (if not masked)
```

### Common Variables
```bash
# Check if variable is set in pipeline
echo $DATABASE_HOST
echo $DATABASE_USER
echo $BACKEND_PORT
echo $NODE_ENV
```

### Add Variable
```
Settings → CI/CD → Variables → Add variable
Name: DATABASE_HOST
Value: db.example.com
Scope: All
Protect: Yes (for prod)
Mask: Yes (for secrets)
```

## 🔐 Secrets Management

### Mask Variables
```
Settings → CI/CD → Variables → Check "Mask variable"
# Hides value in logs
```

### Example Secret Variables
```
DATABASE_PASSWORD    (MASK)
JWT_SECRET          (MASK)
API_KEY             (MASK)
PAYMENT_API_SECRET  (MASK)
```

## 🚨 Deployment Commands

### Manual Deployment via Web
```
1. CI/CD → Pipelines
2. Find pipeline on main/master
3. Click "Play" button next to desired job
4. Wait for completion
5. Check logs for status
```

### Check Deployment Status
```bash
# SSH to server
ssh user@production-server

# Check running processes
ps aux | grep node
pm2 list

# Check logs
pm2 logs smartcart-api
tail -f /var/log/nginx/access.log

# Verify services running
curl http://localhost:5000/health
curl http://localhost:3003
curl http://localhost:3002
```

### Rollback Deployment
```bash
# 1. Get previous artifact from GitLab
# CI/CD → Pipelines → Find previous pipeline → Download artifacts

# 2. Stop current services
ssh user@production
pm2 stop smartcart-api
pm2 stop smartcart-frontend

# 3. Restore from backup
cp -r /backup/smartcart-backend/* /var/www/smartcart-backend/

# 4. Restart services
pm2 start smartcart-api
pm2 start smartcart-frontend
```

## 🔍 Troubleshooting Commands

### Check Dependencies
```bash
npm outdated              # See outdated packages
npm audit                 # Check security issues
npm audit fix             # Auto-fix issues
npm list                  # Show dependency tree
npm ls --depth=0         # Show only direct dependencies
```

### Clear Cache and Reinstall
```bash
rm -rf node_modules/
rm package-lock.json
npm install
```

### Test Database Connection
```bash
# Test MySQL connection
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD -D $DATABASE_NAME

# Inside MySQL
SHOW DATABASES;
USE smartcart;
SHOW TABLES;
SELECT COUNT(*) FROM products;
```

### Clear GitLab Cache
```bash
# Via Web UI
Settings → CI/CD → Clear runner caches

# This clears: npm cache, build artifacts
```

## 📈 Performance Tuning

### Faster Builds
```yaml
# In .gitlab-ci.yml
variables:
  FF_USE_FASTZIP: "true"        # Fast compression
  CACHE_COMPRESSION_LEVEL: "fastest"
```

### Shorter Install Times
```bash
# Use --prefer-offline
npm ci --prefer-offline

# Use npx for one-time runs
npx some-package --arg1
```

## 📋 Pre-Deployment Checklist

```bash
# 1. Code review
git log --oneline -5              # View recent commits

# 2. Test locally
npm test
npm run build

# 3. Check dependencies
npm audit --production

# 4. Database backup
mysqldump -u user -p database > backup.sql

# 5. Environment setup
cp .env.example .env
# Edit .env with production values

# 6. Final test
docker-compose up -d
curl http://localhost:5000/health
curl http://localhost:3003
```

## 🎯 One-Line Commands

```bash
# Build and test all
for dir in smartcart-backend smartcart-frontend smartcart-admin; do echo "=== $dir ===" && cd $dir && npm ci && npm run build && cd ..; done

# View all env files
grep -r "REACT_APP\|NODE_ENV\|DATABASE" smartcart-*/

# Find all package.json files
find . -name "package.json" -type f

# Check node version everywhere
for dir in smartcart-backend smartcart-frontend smartcart-admin; do echo "$dir:"; cat $dir/package.json | grep '"node"'; done

# Calculate total package size
du -sh smartcart-*/node_modules/ | tail -1
```

## 📱 Mobile/Quick Reference

### Three Most Common Tasks

**1. Check Pipeline Status**
```
GitLab → CI/CD → Pipelines → Click pipeline
```

**2. Deploy to Staging**
```
GitLab → CI/CD → Pipelines → Click "Play" on deploy-staging
```

**3. Check Build Errors**
```
Pipelines → Failing Job → Scroll to bottom of logs
```

### Top 5 Error Fixes
```bash
# 1. npm install failed
npm ci --legacy-peer-deps

# 2. Build timeout
# Increase timeout in .gitlab-ci.yml

# 3. Cache issue
# Settings → CI/CD → Clear runner caches

# 4. Database error
mysql -h $HOST -u $USER -p < smartcart-backend/setup.sql

# 5. Environment variable missing
# Settings → CI/CD → Variables → Add variable
```

## 🔗 Related Files

Key files to reference:
- `.gitlab-ci.yml` - Pipeline configuration
- `docker-compose.yml` - Local dev setup
- `.env.example` - Environment template
- `setup-gitlab-ci.sh` - Runner setup script
- `docs/CICD_*` - Full documentation

## 📞 Quick Help

**Pipeline won't start?**
→ Check runner status: `gitlab-runner verify`

**Build failing?**
→ Check logs in GitLab, search the error in docs

**Want to deploy?**
→ Go to Pipelines, click "Play" on deploy job

**Something unclear?**
→ Read `docs/CICD_TROUBLESHOOTING.md`

---

**Version**: 1.0
**Last Updated**: February 2026
**Print this page for quick reference!**

For detailed help, see `docs/CICD_QUICK_START.md` or `docs/CICD_TROUBLESHOOTING.md`
