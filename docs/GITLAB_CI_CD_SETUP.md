# GitLab CI/CD Setup Guide

## Overview
This guide helps you set up CI/CD pipelines in GitLab for the SmartCart e-commerce application.

## Prerequisites
- GitLab account with admin access
- Project repository migrated to GitLab
- GitLab Runner configured (Docker)
- Git CLI installed

## Step 1: Move Repository to GitLab

### Option A: Mirror from GitHub
```bash
# Clone the GitHub repo
git clone --mirror https://github.com/bn8204/smartcart.git smartcart.git

# Push to GitLab
cd smartcart.git
git push --mirror https://gitlab.com/your-username/smartcart.git

# Clean up
cd ..
rm -rf smartcart.git
```

### Option B: Add GitLab as Remote
```bash
cd /c/APPLICATION/E-com

# Add GitLab remote
git remote add gitlab https://gitlab.com/your-username/smartcart.git

# Push to GitLab
git push -u gitlab payment-cancellation-fix
git push -u gitlab master
git push -u gitlab develop
```

## Step 2: Set Up GitLab Runner

### Install GitLab Runner
```bash
# On Windows PowerShell (as Administrator)
$url = "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe"
Invoke-WebRequest -Uri $url -OutFile gitlab-runner.exe
.\gitlab-runner.exe install
.\gitlab-runner.exe start

# Or on Linux/Mac
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | bash
sudo apt-get install gitlab-runner
sudo gitlab-runner start
```

### Register Runner
```bash
# Register new runner
gitlab-runner register

# You'll be prompted for:
# - GitLab instance URL: https://gitlab.com/
# - Runner token: (get from GitLab project settings)
# - Runner description: smartcart-runner
# - Runner executor: docker
# - Docker image: node:18
```

## Step 3: Configure Project Settings

### In GitLab Project Dashboard:

1. **Go to Settings → CI/CD → Variables**
   - Add secret variables for:
     ```
     DATABASE_URL=mysql://user:password@localhost/smartcart_db
     API_KEY=your_api_key
     NODE_ENV=production
     ```

2. **Go to Settings → CI/CD → Runners**
   - Verify your runner is registered and active

3. **Go to Settings → Repository**
   - Protect branches (master, main)
   - Require CI/CD pipeline to pass before merging

## Step 4: Configure Pipeline

The `.gitlab-ci.yml` file is already in the repository with:

### Stages:
1. **build** - Install dependencies
2. **test** - Run tests and validation
3. **deploy** - Deploy to dev/staging/prod

### Jobs:

#### Backend:
- `backend-build`: Installs Node dependencies
- `backend-test`: Runs linting and validation

#### Frontend:
- `frontend-build`: Builds React application
- `frontend-test`: Validates build output

#### Deployment:
- `deploy-dev`: Auto-deploys on develop branch
- `deploy-staging`: Auto-deploys on master/main
- `deploy-production`: Manual trigger only

## Step 5: Commit and Push

```bash
cd /c/APPLICATION/E-com

# Commit GitLab CI config
git add .gitlab-ci.yml
git commit -m "feat: Add GitLab CI/CD pipeline configuration"

# Push to GitLab
git push gitlab payment-cancellation-fix
git push gitlab master
```

## Step 6: Verify Pipeline

1. Go to **Build → Pipelines** in GitLab
2. Click on a pipeline to see jobs
3. Watch real-time logs for each job

## Deployment Environments

### Development
- **Trigger**: Every push to `develop` branch
- **URL**: http://dev.example.com
- **Actions**: Auto-deploys

### Staging
- **Trigger**: Every push to `master`/`main` branch
- **URL**: http://staging.example.com
- **Actions**: Auto-deploys

### Production
- **Trigger**: Manual trigger only
- **URL**: http://example.com
- **Requirements**: 
  - Must be on master/main branch
  - All tests must pass
  - Manual approval in GitLab UI

## Manual Deployment to Production

1. Go to **Build → Pipelines**
2. Find the pipeline for master/main
3. Click the play button (▶) next to `deploy-production` job
4. Confirm in the modal

## Environment Variables

Set these in **Settings → CI/CD → Variables**:

```
DATABASE_URL=mysql://root:password@localhost:3306/smartcart_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=3003
API_BASE_URL=http://localhost:3000/api
```

## Monitoring & Logs

### View Logs:
1. **Build → Jobs** - See individual job logs
2. **Build → Pipelines** - See pipeline status
3. **Monitor → Error Tracking** - See application errors

### Notifications:
Go to **Settings → Integrations** to configure:
- Slack notifications
- Email alerts
- Webhook notifications

## Troubleshooting

### Pipeline Fails
1. Check **Build → Jobs** for error logs
2. Common issues:
   - Missing runner (verify in Settings → Runners)
   - Invalid `.gitlab-ci.yml` syntax (validate at `.gitlab/pipeline-editor`)
   - Missing environment variables (add in Settings → Variables)

### Runner Not Showing Up
```bash
# Check runner status
gitlab-runner status

# Restart runner
gitlab-runner restart

# Re-register runner
gitlab-runner register
```

### Deployment Issues
1. Check runner has access to deployment server
2. Verify SSH keys configured in GitLab
3. Check environment variables are set

## Sample Commands for Deployment Servers

After pipeline deploys, on your server:

```bash
# Backend
cd /opt/smartcart/smartcart-backend
npm install
npm start

# Frontend
cd /opt/smartcart/smartcart-frontend/build
# Serve with nginx, Apache, or node static server
npx serve -s build -l 3003
```

## Security Best Practices

1. ✓ Use protected branches - Require CI/CD to pass
2. ✓ Use environment variables - Never hardcode secrets
3. ✓ Restrict runner access - Use specific tags
4. ✓ Review merge requests - Require approvals
5. ✓ Audit logs - Monitor who made changes
6. ✓ Lock production deployments - Manual trigger only

## Next Steps

1. Migrate repository to GitLab
2. Register GitLab Runner
3. Push code with `.gitlab-ci.yml`
4. Verify pipelines run automatically
5. Configure environment-specific variables
6. Set up deployment servers
7. Monitor pipeline executions

## Support

- GitLab Docs: https://docs.gitlab.com/ee/ci/
- Runner Docs: https://docs.gitlab.com/runner/
- CI/CD Examples: https://gitlab.com/gitlab-examples
