# GitLab CI/CD Deployment Implementation Guide

## ✅ What's Already Configured

Your project already has:
- `.gitlab-ci.yml` with complete pipeline configuration
- Build stages for backend and frontend
- Test stages with validation
- Deployment stages for dev, staging, and production
- Setup scripts for automation

## 📋 Complete Implementation Steps

### Step 1: Prepare Your Local Repository

```bash
cd c:\APPLICATION\E-com

# Initialize git if not already done
git init

# Check git status
git status

# Add all files (if fresh repo)
git add .
git commit -m "Initial commit: SmartCart e-commerce application"
```

### Step 2: Create GitLab Project

1. Go to https://gitlab.com/
2. Sign in with your account (create account if needed)
3. Click **+ New project/repository**
4. Choose **Create blank project**
5. Fill in:
   - Project name: `smartcart`
   - Project slug: `smartcart` (auto-filled)
   - Visibility: **Private** (recommended)
6. Click **Create project**

### Step 3: Add GitLab Remote & Push Code

```bash
cd c:\APPLICATION\E-com

# Add GitLab remote
git remote add gitlab https://gitlab.com/<YOUR_USERNAME>/smartcart.git

# Verify remote was added
git remote -v

# Push all branches
git branch -M main master  # Ensure default branch
git push -u gitlab master
git push -u gitlab --all
```

**Replace `<YOUR_USERNAME>` with your actual GitLab username**

### Step 4: Install & Configure GitLab Runner

#### On Windows (PowerShell as Administrator):

```powershell
# Download and install GitLab Runner
$url = "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe"
Invoke-WebRequest -Uri $url -OutFile gitlab-runner.exe

# Install as service
.\gitlab-runner.exe install
.\gitlab-runner.exe start

# Verify installation
gitlab-runner --version
```

#### Get Registration Token:

1. Go to your GitLab project
2. Navigate to **Settings → CI/CD → Runners**
3. Copy the **Registration token** (not the runner token)

#### Register GitLab Runner:

```powershell
gitlab-runner register
```

When prompted, enter:
- **GitLab instance URL:** `https://gitlab.com/`
- **Registration token:** [Paste from Step 4 above]
- **Runner description:** `smartcart-docker-runner`
- **Tags:** `docker` (important!)
- **Executor:** `docker`
- **Default image:** `node:18`
- **Privileged containers:** `true`
- **Docker volumes:** `/cache`

#### Verify Runner:

```powershell
gitlab-runner verify
gitlab-runner list
```

### Step 5: Configure Project Environment Variables

1. Go to GitLab Project → **Settings → CI/CD → Variables**
2. Click **Add variable** for each:

| Variable | Value | Protected | Masked |
|----------|-------|-----------|--------|
| `DATABASE_URL` | `mysql://root:password@localhost:3306/smartcart_db` | Yes | Yes |
| `JWT_SECRET` | `your-secret-key-here` | Yes | Yes |
| `NODE_ENV` | `production` | No | No |
| `API_PORT` | `5000` | No | No |
| `REACT_APP_API_URL` | `http://localhost:5000` | No | No |

**Note:** Don't use `localhost` for deployment URLs—use actual domain/IP

### Step 6: Set Up Branch Protections

1. Go to **Settings → Repository → Protected branches**
2. Under "Protect a branch", select **master**
3. Enable:
   - ✓ Require a successful CI pipeline
   - ✓ Require all conversations to be resolved
   - ✓ Require approval from code owners (optional)

### Step 7: Verify Pipeline Configuration

Your `.gitlab-ci.yml` includes:

**Build Stage:**
- Backend build (installs dependencies)
- Frontend build (creates production build)

**Test Stage:**
- Backend validation
- Frontend validation

**Deploy Stage:**
- Development (auto-deploys from `develop` branch)
- Staging (auto-deploys from `master`/`main`)
- Production (manual trigger from `master`/`main`)

### Step 8: Trigger Your First Pipeline

```bash
cd c:\APPLICATION\E-com

# Make a test commit
git add .
git commit --allow-empty -m "Trigger CI/CD pipeline"

# Push to trigger pipeline
git push gitlab master
```

Watch the pipeline:
1. Go to GitLab project → **Build → Pipelines**
2. Click the pipeline ID to view details
3. Monitor job status in real-time

## 🔧 File Structure for Deployment

Ensure your project has this structure:

```
c:\APPLICATION\E-com\
├── .gitlab-ci.yml              ✓ (already present)
├── smartcart-backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── config/
│   └── .env.example
├── smartcart-frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── smartcart-admin/
│   ├── package.json
│   ├── public/
│   └── src/
└── .gitignore
```

## 📦 Required .gitignore

Create `.gitignore` if not present:

```
node_modules/
npm-debug.log*
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
build/
dist/
.vscode/
.idea/
*.log
.DS_Store
coverage/
.gitlab-ci.yml.bak
```

## 🚀 Deployment Workflow

### Development Workflow
```
1. Push to develop branch
2. Pipeline automatically triggers
3. Build & test runs
4. Auto-deploys to development
```

### Staging Workflow
```
1. Create merge request from develop → master
2. Code review & approval
3. Merge to master
4. Pipeline triggers automatically
5. Tests run
6. Auto-deploys to staging
```

### Production Workflow
```
1. Merge request approved on master
2. Go to Build → Pipelines
3. Find latest master pipeline
4. Click ▶ (Play button) on deploy-production job
5. Confirm deployment
6. Monitor logs
```

## 🔍 Monitoring & Debugging

### View Pipeline Status
- GitLab Project → **Build → Pipelines**
- Real-time job logs
- Artifact downloads

### Common Issues & Solutions

**Issue:** Runner not connecting
```bash
# Check runner status
gitlab-runner verify

# Restart runner
gitlab-runner restart
```

**Issue:** Pipeline fails on Docker image pull
```bash
# Check Docker installation (Windows)
docker --version

# Ensure Docker Desktop is running
```

**Issue:** Build times out
- Increase timeout in `.gitlab-ci.yml` with `timeout: 1h`
- Use Docker layer caching

**Issue:** Environment variables not loaded
- Go to **Settings → CI/CD → Variables**
- Verify variable names match exactly
- Check if Protected/Masked settings are correct

## 📊 Pipeline Stages Explained

| Stage | Purpose | Triggers |
|-------|---------|----------|
| **build** | Install deps, prepare artifacts | All branches |
| **test** | Lint, validate, file checks | After build succeeds |
| **deploy** | Deploy to dev/staging/prod | After tests pass |

## ✨ Next Steps

1. **Backend Requirements:** Create `.env` file in `smartcart-backend/`
   ```
   DATABASE_URL=mysql://root:password@localhost:3306/smartcart_db
   JWT_SECRET=your-secret
   API_PORT=5000
   NODE_ENV=production
   ```

2. **Frontend Requirements:** Create `.env` in `smartcart-frontend/`
   ```
   REACT_APP_API_URL=http://your-domain:5000
   ```

3. **Database Setup:** Ensure MySQL is running and accessible
   ```bash
   mysql -u root -p < smartcart-backend/setup.sql
   ```

4. **Test Locally First:**
   ```bash
   cd smartcart-backend
   npm install
   npm start
   
   # In another terminal
   cd smartcart-frontend
   npm install
   npm start
   ```

## 📞 Need Help?

- GitLab Documentation: https://docs.gitlab.com/ee/ci/
- Runner Configuration: https://docs.gitlab.com/runner/
- CI/CD Pipelines: https://docs.gitlab.com/ee/ci/quick_start/

---

**Status:** Ready for deployment ✅
**Last Updated:** February 10, 2026
