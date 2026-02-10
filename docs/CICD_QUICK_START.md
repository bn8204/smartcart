# CI/CD Quick Start Checklist

## Pre-Deployment Setup (First Time Only)

### Local Development Setup

- [ ] Clone repository: `git clone <repository-url>`
- [ ] Navigate to project: `cd c:\APPLICATION\E-com`
- [ ] Copy environment templates:
  ```bash
  cp smartcart-backend/.env.example smartcart-backend/.env
  cp smartcart-frontend/.env.example smartcart-frontend/.env
  cp smartcart-admin/.env.example smartcart-admin/.env
  ```
- [ ] Update `.env` files with your actual configuration values
- [ ] Review backend configuration in `smartcart-backend/.env`
- [ ] Review frontend configuration in `smartcart-frontend/.env`
- [ ] Review admin configuration in `smartcart-admin/.env`

### GitLab Setup

- [ ] Create GitLab account (if not already done)
- [ ] Create new project in GitLab
- [ ] Push code to GitLab repository
- [ ] Note the project ID and URL

### GitLab Runner Configuration

#### Windows Setup
- [ ] Download and install GitLab Runner
- [ ] Run `setup-gitlab-ci.ps1` script
- [ ] Follow interactive prompts
- [ ] Verify runner is registered:
  ```bash
  gitlab-runner list
  ```

#### Linux/Mac Setup
- [ ] Run `./setup-gitlab-ci.sh`
- [ ] Follow interactive prompts
- [ ] Start runner: `gitlab-runner start`

### GitLab Project Configuration

1. **Navigate to Project Settings**
   - [ ] Go to Settings → CI/CD → Variables
   - [ ] Add the following variables:

   ```
   DATABASE_HOST = your-db-host
   DATABASE_USER = smartcart_user
   DATABASE_PASSWORD = (secure password)
   DATABASE_NAME = smartcart
   BACKEND_PORT = 5000
   FRONTEND_PORT = 3003
   ADMIN_PORT = 3002
   NODE_ENV = production
   ```

2. **Protect Branches**
   - [ ] Go to Settings → Repository → Protected branches
   - [ ] Protect `main` branch: Require 1 approval
   - [ ] Protect `master` branch: Require 1 approval
   - [ ] Keep `develop` branch accessible

3. **Enable Deploy Keys** (for server access)
   - [ ] Add SSH keys: Settings → Deploy Keys
   - [ ] Add runner's public key for server access

### Database Setup

**Option 1: Local Development with Docker**
```bash
# Start MySQL container
docker-compose up -d mysql

# Initialize database
cd smartcart-backend
mysql -h 127.0.0.1 -u smartcart_user -p smartcart < setup.sql
```

**Option 2: Remote Database**
- [ ] Create database on remote server
- [ ] Load `smartcart-backend/setup.sql` schema
- [ ] Create user with appropriate permissions
- [ ] Verify connection from GitLab runner

### Nginx Configuration (Optional but Recommended)

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name smartcart.example.com;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name admin.smartcart.example.com;
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
    }
}
```

## First Pipeline Run

### Step 1: Prepare Code
```bash
# Create a feature branch
git checkout -b feature/initial-deploy

# Make a small change (or just commit as-is)
git commit --allow-empty -m "feat: Initial CI/CD pipeline setup"
git push -u origin feature/initial-deploy
```

### Step 2: Monitor Pipeline
- [ ] Go to CI/CD → Pipelines in GitLab
- [ ] Click on your pipeline
- [ ] Monitor build jobs:
  - [ ] backend-build (should take 1-3 minutes)
  - [ ] frontend-build (should take 2-5 minutes)
  - [ ] admin-build (should take 2-5 minutes)

### Step 3: Review Test Results
- [ ] Verify backend-test passes
- [ ] Verify frontend-test passes
- [ ] Verify admin-test passes
- [ ] Review security checks output

### Step 4: Create Merge Request
- [ ] Create merge request to `develop`
- [ ] Ensure all tests pass
- [ ] Get approval from another developer
- [ ] Merge code to `develop`
- [ ] Verify dev deployment succeeds

## Regular Operations

### Deploying to Staging

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update Version Numbers**
   - [ ] Update `package.json` versions in all three apps
   - [ ] Update `docs/CHANGELOG.md`

3. **Create Merge Request to Main**
   - [ ] Create MR from release branch
   - [ ] Get reviews
   - [ ] Merge to `main`

4. **Trigger Staging Deployment**
   - [ ] Go to CI/CD → Pipelines
   - [ ] Find your pipeline on `main`
   - [ ] Click "Play" on `deploy-staging` job
   - [ ] Monitor deployment logs

5. **Test Staging Environment**
   - [ ] Test core functionality
   - [ ] Test user workflows
   - [ ] Verify database migrations
   - [ ] Check API endpoints

### Deploying to Production

**Safety Checklist Before Production:**
- [ ] All tests passing in main
- [ ] Code reviewed by at least 2 people
- [ ] Staging environment tested
- [ ] Database backups created
- [ ] Rollback plan documented
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured

1. **Trigger Production Deployment**
   - [ ] Go to CI/CD → Pipelines on `main`
   - [ ] Click "Play" on `deploy-production` job
   - [ ] Confirm deployment trigger

2. **Post-Deployment**
   - [ ] Monitor error logs
   - [ ] Test critical workflows
   - [ ] Verify all three apps working
   - [ ] Check database integrity
   - [ ] Monitor system performance

3. **Rollback (if needed)**
   - [ ] Stop running services
   - [ ] Restore from previous artifact
   - [ ] Restart services
   - [ ] Verify functionality

## Troubleshooting

### Runner Not Connected
```bash
# Check runner status
gitlab-runner verify

# Restart runner
gitlab-runner restart

# View logs
gitlab-runner --debug run
```

### Build Failures

**Check logs:**
1. Go to CI/CD → Pipelines
2. Click failing job
3. Scroll to bottom for error output

**Common fixes:**
- Clear cache: Settings → CI/CD → Clear runner caches
- Check dependencies: `npm ci` in each directory
- Verify Node version: Should be 18+
- Check database connection
- Review environment variables

### Database Connection Issues
```bash
# Test connection
mysql -h host -u user -p -D database

# Check MySQL logs
docker logs smartcart-mysql

# Reset database
mysql -u root -p < smartcart-backend/setup.sql
```

### Deployment Package Missing
- [ ] Check artifact retention settings
- [ ] Verify build completed successfully
- [ ] Review deploy job dependencies
- [ ] Check free disk space on runner

## Maintenance

### Weekly Tasks
- [ ] Review pipeline run times
- [ ] Check security scan results
- [ ] Monitor error logs
- [ ] Update dependencies: `npm outdated`

### Monthly Tasks
- [ ] Run full security audit: `npm audit`
- [ ] Review and rotate credentials
- [ ] Clean up old artifacts
- [ ] Update documentation

### Quarterly Tasks
- [ ] Update Node.js version if needed
- [ ] Review deployment strategy
- [ ] Plan infrastructure improvements
- [ ] Conduct security review

## Helpful Commands

```bash
# Test local build
npm run build

# Run local tests
npm run test

# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Install specific version
npm install package@1.2.3

# Clean installation
npm ci
```

## Getting Help

1. **GitLab Documentation**: https://docs.gitlab.com/ee/ci/
2. **Runner Docs**: https://docs.gitlab.com/runner/
3. **Common Issues**: See CICD_SETUP_GUIDE.md
4. **Project Logs**: CI/CD → Pipelines → Job logs
5. **Team Chat**: Slack/Teams for quick questions

## Success Criteria

When your pipeline is working correctly, you should see:

✅ All three apps building successfully
✅ Tests passing consistently  
✅ Security scans completing
✅ Deployments to dev/staging working
✅ Production deployment available
✅ Clear success/failure notifications
✅ Build times < 10 minutes total
✅ No unexpected errors in logs

---

**Document Version**: 1.0
**Last Updated**: February 2026
**Status**: Ready for Deployment
