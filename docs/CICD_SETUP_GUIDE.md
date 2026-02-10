# CI/CD Setup Guide - SmartCart E-Commerce

## Overview

This guide provides step-by-step instructions for setting up and managing the GitLab CI/CD pipeline for the SmartCart e-commerce application, which consists of three main components:

- **Backend**: Express.js API with Node.js
- **Frontend**: React customer application
- **Admin Dashboard**: React admin management interface

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    STAGES                                   │
├─────────────────────────────────────────────────────────────┤
│ BUILD          │ SECURITY      │ TEST            │ DEPLOY   │
├─────────────────────────────────────────────────────────────┤
│ backend-build  │code-quality   │backend-test     │deploy-dev│
│ frontend-build │dependency-    │frontend-test    │deploy-   │
│ admin-build    │check          │admin-test       │staging   │
│                │               │                 │deploy-   │
│                │               │                 │production│
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **GitLab Account** - Access to your project repository
2. **GitLab Runner** - Docker executor configured
3. **Node.js 18+** - Required for building applications
4. **Git** - For version control

## Initial Setup

### 1. GitLab Runner Configuration

#### For Linux/Mac:

```bash
# Install GitLab Runner
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | bash
sudo apt-get install gitlab-runner

# Register runner
gitlab-runner register \
  --url https://gitlab.com/ \
  --registration-token <YOUR_TOKEN> \
  --executor docker \
  --docker-image node:18 \
  --description "SmartCart CI/CD Runner"
```

#### For Windows (PowerShell):

```powershell
# Run the setup script
.\setup-gitlab-ci.ps1
```

### 2. Set Repository Variables

Navigate to **Settings → CI/CD → Variables** in your GitLab project and add:

```
DATABASE_URL=mysql://user:password@host:3306/smartcart
DATABASE_HOST=db.example.com
DATABASE_USER=smartcart_user
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=smartcart

BACKEND_PORT=5000
FRONTEND_PORT=3003
ADMIN_PORT=3002

NODE_ENV=production
```

### 3. Protect Sensitive Branches

Go to **Settings → Repository → Protected branches** and protect:
- `main` - Require review before merge
- `production` - Only allow force-push with maintainer role

## Pipeline Jobs

### Build Stage

#### backend-build
- Installs dependencies via `npm ci`
- Caches `node_modules` for faster builds
- Artifacts expire in 1 hour

#### frontend-build
- Builds React production bundle
- Runs `npm run build` with `CI=false`
- Artifacts include `build/` directory

#### admin-build
- Builds Admin Dashboard bundle
- Same process as frontend
- Separate cache key: `admin-${CI_COMMIT_REF_SLUG}`

### Security Stage

#### code-quality-check
- Validates code structure
- Checks for common issues
- Allows failure (informational only)

#### dependency-check
- Runs `npm audit` on all packages
- Checks for known vulnerabilities
- Warns about outdated dependencies

### Test Stage

#### backend-test
- Validates JavaScript syntax
- Checks for required files (app.js, server.js)
- Runs linters if available

#### frontend-test
- Validates React syntax
- Confirms build output exists
- Displays build size information

#### admin-test
- Validates admin dashboard code
- Confirms build artifacts are created
- Reports test results

### Deploy Stage

#### deploy-dev (Automatic on develop branch)
- Prepares all three applications
- Creates deployment package
- Ready for immediate testing

#### deploy-staging (Manual on main/master)
- Full staging environment deployment
- Can be manually triggered
- 3-day artifact retention

#### deploy-production (Manual only)
- Requires manual trigger on main/master
- Critical safety step
- 7-day artifact retention
- Includes deployment checklist

### Notify Stage

#### pipeline-success
- Sends success notification
- Displays pipeline summary
- Lists completed steps

#### pipeline-failure
- Sends failure notification
- Provides debugging information
- Links to pipeline logs

## Running the Pipeline

### Automatic Triggers

Pipeline automatically runs when:
- Code is pushed to `main`, `master`, or `develop` branches
- Merge request is created or updated
- Manual trigger via GitLab UI

### Manual Deployment

**To deploy to Staging:**
1. Go to CI/CD → Pipelines
2. Find pipeline on `main` or `master`
3. Click "Play" button next to `deploy-staging`

**To deploy to Production:**
1. Go to CI/CD → Pipelines
2. Find pipeline on `main` or `master`
3. Click "Play" button next to `deploy-production`
4. Review the deployment details
5. Confirm deployment

## Deployment Instructions

### Backend Deployment

```bash
# 1. SSH into your server
ssh user@production-server

# 2. Navigate to application directory
cd /var/www/smartcart

# 3. Stop current services
pm2 stop smartcart-api

# 4. Copy new backend code
cp -r /tmp/deploy-prod/smartcart-backend/* ./

# 5. Install dependencies
cd smartcart-backend
npm ci --production

# 6. Update database (if needed)
npm run migrate

# 7. Start application
npm start
```

### Frontend Deployment

```bash
# 1. Copy frontend build
cp -r /tmp/deploy-prod/frontend-build /var/www/smartcart/frontend

# 2. Update web server configuration
# Serve from /var/www/smartcart/frontend with port 3003
sudo systemctl restart nginx

# 3. Or with Apache
# Configure virtual host for port 3003
sudo systemctl restart apache2
```

### Admin Dashboard Deployment

```bash
# 1. Copy admin build
cp -r /tmp/deploy-prod/admin-build /var/www/smartcart/admin

# 2. Update web server
# Serve from /var/www/smartcart/admin with port 3002
sudo systemctl restart nginx
```

## Environment Setup

Create `.env` files in each directory:

### smartcart-backend/.env

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_HOST=db.example.com
DATABASE_USER=smartcart_user
DATABASE_PASSWORD=secure_password
DATABASE_NAME=smartcart
DATABASE_PORT=3306

# CORS
CORS_ORIGIN=https://smartcart.example.com

# JWT (if used)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
```

### smartcart-frontend/.env

```env
REACT_APP_API_URL=https://api.smartcart.example.com
REACT_APP_ADMIN_URL=https://admin.smartcart.example.com
REACT_APP_ENV=production
```

### smartcart-admin/.env

```env
REACT_APP_API_URL=https://api.smartcart.example.com
REACT_APP_ENV=production
```

## Troubleshooting

### Common Issues

**Pipeline fails at dependency installation:**
```bash
# Clear cache manually
# Go to CI/CD → Pipelines → 
# Pipelines → Clear runner caches
```

**Build fails with "Build directory missing":**
```bash
# Ensure build script is configured
cd smartcart-frontend
npm run build

cd ../smartcart-admin
npm run build
```

**Deployment package not found:**
- Check artifact expiration settings
- Verify build completed successfully
- Review job dependencies

### Viewing Logs

1. Go to CI/CD → Pipelines
2. Click pipeline ID
3. Click on job name
4. Scroll to see full output

## Best Practices

1. **Commit Messages**: Write clear, descriptive messages
   ```
   feat: Add payment processing module
   fix: Resolve user authentication issue
   docs: Update API documentation
   ```

2. **Branch Protection**: Require reviews before merging
   - All tests must pass
   - Minimum 2 approvals for production

3. **Security**:
   - Never commit `.env` files
   - Use GitLab secrets for sensitive data
   - Regularly update dependencies
   - Run security scans

4. **Performance**:
   - Monitor pipeline duration
   - Cache dependencies aggressively
   - Remove unused artifacts
   - Parallel job execution when possible

5. **Documentation**:
   - Keep deployment guide updated
   - Document custom scripts
   - Comment complex logic
   - Maintain change log

## Advanced Configuration

### Custom Docker Images

Create custom images for faster builds:

```dockerfile
# Dockerfile.ci
FROM node:18
RUN npm install -g npm@latest
WORKDIR /app
COPY . .
RUN npm ci
```

### Scheduled Deployments

Add scheduled pipeline in **CI/CD → Schedules**:
- Automatic nightly builds
- Weekly security scans
- Monthly full deployments

### Webhook Integration

Configure webhooks to:
- Notify Slack on deployment
- Update Jira tickets
- Send email notifications
- Trigger external systems

## Success Metrics

Monitor pipeline health:

- **Build Time**: Target < 5 minutes
- **Test Coverage**: Maintain > 80%
- **Deployment Frequency**: Weekly to production
- **Mean Time to Recovery**: < 1 hour
- **Change Failure Rate**: < 15%

## Support

For issues or questions:
1. Check GitLab documentation: https://docs.gitlab.com/ee/ci/
2. Review job logs
3. Verify runner configuration
4. Check variable settings
5. Contact DevOps team

## References

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [GitLab Runner Installation](https://docs.gitlab.com/runner/install/)
- [YAML Syntax Reference](https://docs.gitlab.com/ee/ci/yaml/)
- [Best Practices](https://docs.gitlab.com/ee/ci/pipelines/pipeline_security.html)

---

**Last Updated**: February 2026
**Version**: 1.0
