# CI/CD Troubleshooting Guide

## Quick Diagnosis

Before diving into solutions, gather information:

1. Go to CI/CD → Pipelines in GitLab
2. Click the failing pipeline ID
3. Click the failing job name
4. Scroll to the bottom of the job log

## Common Issues and Solutions

### 1. Build Stage Issues

#### Problem: "npm ERR! ERESOLVE unable to resolve dependency tree"

**Cause**: Incompatible package versions

**Solutions**:
```bash
# Option 1: Use legacy peer deps
npm install --legacy-peer-deps

# Option 2: Update package-lock.json
rm package-lock.json
npm install

# Option 3: Use exact versions
npm install --save-exact
```

**In GitLab CI**, add to `.gitlab-ci.yml`:
```yaml
before_script:
  - npm config set legacy-peer-deps true
```

#### Problem: "npm ERR! code E404 Not Found"

**Cause**: Package doesn't exist or is misspelled

**Solutions**:
1. Check package name on npm.js.com
2. Verify correct spelling in package.json
3. Update npm registry:
```bash
npm config set registry https://registry.npmjs.org/
```

#### Problem: Build takes too long (>10 minutes)

**Cause**: Network issues, slow npm registry, or large dependencies

**Solutions**:

Option 1: Use npm cache
```yaml
cache:
  paths:
    - node_modules/
  key: ${CI_COMMIT_REF_SLUG}
```

Option 2: Increase timeout
```yaml
timeout: 30m
```

Option 3: Use faster npm source
```yaml
before_script:
  - npm config set registry https://registry.npmmirror.com
```

### 2. Test Stage Issues

#### Problem: "Build directory exists but is empty"

**Cause**: React build didn't run or failed silently

**Solutions**:

Check build script:
```bash
cd smartcart-frontend
CI=false npm run build
```

Verify React dependencies:
```bash
npm install react react-dom react-scripts
```

Clear build artifacts:
```bash
rm -rf build/
npm run build
```

In `.gitlab-ci.yml`:
```yaml
script:
  - npm run build || { echo "Build failed"; exit 1; }
```

#### Problem: "Tests fail but locally they pass"

**Cause**: Environment differences

**Solutions**:

1. Check Node version:
```bash
npm --version
node --version
```

2. Verify in CI:
```yaml
script:
  - node --version
  - npm --version
  - npm test
```

3. Share environment variables:
```yaml
script:
  - export CI=false
  - npm test
```

#### Problem: Linter errors fail the build

**Cause**: Code doesn't meet linting standards

**View errors**:
```bash
npm run lint -- --format=json | head -100
```

**Fix automatically** (if supported):
```bash
npm run lint -- --fix
npm run build
```

**In GitLab, allow failure**:
```yaml
allow_failure: true
```

### 3. Deployment Issues

#### Problem: "Deployment package prepared but nothing deployed"

**Cause**: Manual deployment not triggered

**Solution**:
1. Go to CI/CD → Pipelines
2. Find pipeline on main/master
3. Click "Play" button next to deploy job
4. Monitor logs in real-time

#### Problem: Artifacts not found or expired

**Cause**: Artifacts didn't get created or expired

**Check artifact settings**:
```yaml
artifacts:
  paths:
    - smartcart-backend/node_modules/
    - smartcart-frontend/build/
  expire_in: 1 hour  # Change this
```

**View artifacts**:
1. Go to CI/CD → Pipelines → Job
2. Click "View latest artifact"

**Extend expiration**:
```yaml
expire_in: 7 days  # For production
```

#### Problem: "Can't SSH to deployment server"

**Check permissions**:
```bash
# On CI runner
ssh -i ~/.ssh/deploy_key user@server "echo 'Connection OK'"
```

**Solutions**:
1. Add server's SSH key to GitLab
2. Check firewall rules
3. Verify SSH key permissions (700 for dir, 600 for file)
4. Check known_hosts

#### Problem: Database connection fails during deployment

**Check connectivity**:
```bash
# In deployment script
mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD -e "SELECT 1"
```

**Debug**:
```yaml
script:
  - echo "Testing DB connection..."
  - mysql -h $DATABASE_HOST -u $DATABASE_USER -p$DATABASE_PASSWORD -e "SELECT VERSION()"
  - npm start
```

### 4. Runner Issues

#### Problem: "runner not available"

**Check runner status**:
```bash
gitlab-runner verify
```

**Restart runner**:

Windows (PowerShell):
```powershell
Stop-Service gitlab-runner
Start-Service gitlab-runner
```

Linux:
```bash
sudo systemctl restart gitlab-runner
gitlab-runner status
```

#### Problem: "Timeout while waiting for runner"

**Cause**: Runner is busy or crashed

**Solutions**:

1. Increase timeout:
```yaml
timeout: 1h
```

2. Check runner resources:
```bash
gitlab-runner list
```

3. Restart runner:
```bash
gitlab-runner restart
```

4. View runner logs:
```bash
gitlab-runner -debug run
```

#### Problem: "Runner cannot access Docker"

**Check Docker daemon**:
```bash
docker ps
```

**Fix access**:

On Linux:
```bash
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner
```

### 5. Environment Variable Issues

#### Problem: "Variable is empty in pipeline"

**Cause**: Variable not set or scoped incorrectly

**Check variables**:
1. Settings → CI/CD → Variables
2. Verify scope (All, Protected only, etc.)
3. Check if branch name matches

**Test variable**:
```yaml
script:
  - echo "DATABASE_HOST=$DATABASE_HOST"
  - echo "NODE_ENV=$NODE_ENV"
```

#### Problem: "Secret values visible in logs"

**Cause**: Logging sensitive data

**Solutions**:

1. Mask variables in settings:
   - Settings → CI/CD → Variables
   - Check "Mask variable"

2. Avoid logging in scripts:
```bash
# BAD
echo "Password is: $PASSWORD"

# GOOD
echo "Configuration loaded"
```

### 6. Network Issues

#### Problem: "Connection timeout to registry"

**Cause**: npm registry unreachable

**Solutions**:

```bash
# Change registry
npm config set registry https://registry.npmmirror.com

# Or in .npmrc
registry=https://registry.npmmirror.com
```

**In GitLab CI**:
```yaml
before_script:
  - npm config set registry https://registry.npmmirror.com
```

#### Problem: "CORS errors in browser"

**Check backend**:
```yaml
CORS_ORIGIN: "http://localhost:3003,http://localhost:3002"
```

**Fix headers**:
```javascript
// In backend
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true
}));
```

### 7. Performance Issues

#### Problem: "Pipeline takes 15+ minutes"

**Optimization**:

1. **Enable fast compression**:
```yaml
variables:
  FF_USE_FASTZIP: "true"
```

2. **Parallel jobs**:
```yaml
# Instead of sequential
# backend-build, frontend-build, admin-build
# Run all at once (they don't depend on each other)
```

3. **Reduce cache size**:
```yaml
cache:
  paths:
    - node_modules/  # Skip if not needed
```

4. **Skip unnecessary steps**:
```yaml
script:
  - npm install  # Only if needed
  - npm run build
```

### 8. Security Issues

#### Problem: "Vulnerability found in npm audit"

**Identify issues**:
```bash
npm audit --json | jq '.metadata | .vulnerabilities'
```

**Fix**:
```bash
# For fixable vulnerabilities
npm audit fix

# For interactive fix
npm audit fix --audit-level=moderate
```

**In deployment**:
```yaml
security-scan:
  script:
    - npm audit --audit-level=moderate
  allow_failure: true
```

#### Problem: "Exposed secrets in code"

**Check for secrets**:
```bash
grep -r "password\|token\|secret\|key" src/ -i
```

**Solutions**:
1. Move to environment variables
2. Add to `.gitignore`
3. Rotate compromised secrets

### 9. Advanced Debugging

#### Enable verbose logging:

```yaml
variables:
  CI_DEBUG_TRACE: "false"  # Set to "true" to enable (careful with secrets!)

before_script:
  - set -x  # Print each command
```

#### Run job interactively:
```bash
gitlab-runner debug run
```

#### Inspect artifacts:
```bash
cd /builds/project/smartcart-frontend
ls -la build/
cat build/index.html | head -20
```

#### Check network:
```yaml
script:
  - apt-get update && apt-get install -y curl
  - curl -v https://registry.npmjs.org
  - nslookup registry.npmjs.org
```

## Prevention Strategies

### 1. Pre-commit Hooks
```bash
# Install husky
npm install husky --save-dev
npx husky install

# Add hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### 2. Branch Protection
- Require status checks
- Require code review
- Dismiss stale reviews

### 3. Regular Maintenance
```bash
# Weekly
npm outdated
npm audit

# Monthly
npm update
git prune
```

### 4. Documentation
- Keep `.env.example` updated
- Document custom scripts
- Maintain CHANGELOG

## Getting Help

### Information to provide:
1. Pipeline ID (e.g., `#12345`)
2. Job name and full error
3. Recent changes to code
4. Environment details (Node version, etc.)

### Useful commands for reporting:
```bash
# Collect debug info
node --version > debug.txt
npm --version >> debug.txt
npm list >> debug.txt
env | grep -E "NODE|CI|DATABASE" >> debug.txt
```

### Contact Support:
1. GitLab Docs: https://docs.gitlab.com/ee/ci/troubleshooting.html
2. Runner Issues: https://docs.gitlab.com/runner/troubleshooting/
3. npm Help: https://docs.npmjs.com/

## Checklist for New Developers

When setting up CI/CD for first time:

- [ ] Clone repository
- [ ] Install Node 18+
- [ ] Run `npm install` in each directory
- [ ] Create `.env` files from examples
- [ ] Test local build: `npm run build`
- [ ] Verify database connection
- [ ] Create GitLab account
- [ ] Register runner
- [ ] Add environment variables to GitLab
- [ ] Create feature branch
- [ ] Push code and monitor first pipeline
- [ ] Read CICD_SETUP_GUIDE.md
- [ ] Ask team for questions

---

**Troubleshooting Guide Version**: 1.0
**Last Updated**: February 2026
**Status**: Complete
