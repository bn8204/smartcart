# GitLab CI/CD - Your Action Plan

## 🎯 What You Need to Do Now

Follow these steps in order to get your application deployed to GitLab CI/CD.

---

## ⏱️ Timeline: 60 Minutes (Estimated)

### Phase 1: Account & Project Setup (10 minutes)

#### Step 1: Create GitLab Account
- [ ] Go to https://gitlab.com
- [ ] Click "Sign up" or sign in if you have account
- [ ] Verify your email address
- [ ] Complete account setup

#### Step 2: Create GitLab Project
- [ ] In GitLab dashboard, click **"+ New project"**
- [ ] Select **"Create blank project"**
- [ ] Fill in details:
  - Project name: `smartcart`
  - Visibility: **Private** (recommended)
- [ ] Click **"Create project"**
- [ ] Copy the project URL: `https://gitlab.com/YOUR_USERNAME/smartcart.git`

---

### Phase 2: Push Your Code (10 minutes)

#### Step 3: Add GitLab Remote
Open PowerShell and run:
```powershell
cd c:\APPLICATION\E-com

# Replace YOUR_USERNAME with your actual GitLab username
git remote add gitlab https://gitlab.com/YOUR_USERNAME/smartcart.git

# Verify it was added
git remote -v
```

#### Step 4: Push Code to GitLab
```powershell
# Push all branches and tags
git push -u gitlab --all
git push -u gitlab --tags

# Verify in GitLab UI - you should see all code there
```

---

### Phase 3: Install GitLab Runner (15 minutes)

#### Step 5: Download & Install GitLab Runner
**Run PowerShell as Administrator** and execute:
```powershell
# Download GitLab Runner
$url = "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe"
Invoke-WebRequest -Uri $url -OutFile gitlab-runner.exe

# Install as Windows service
.\gitlab-runner.exe install

# Start the service
.\gitlab-runner.exe start

# Verify installation
gitlab-runner --version
```

#### Step 6: Register GitLab Runner
**Still in PowerShell as Administrator**:
```powershell
gitlab-runner register
```

When prompted, fill in with these values:
```
Enter the GitLab instance URL: https://gitlab.com/

Enter the registration token: [PASTE TOKEN FROM STEP 7]

Enter a description for the runner: smartcart-docker-runner

Enter tags for the runner: docker

Enter the executor: docker

Enter the default Docker image: node:18

Enter the Docker privileged mode: true
```

#### Step 7: Get Registration Token
Before running `gitlab-runner register`:
1. Go to your GitLab project
2. Navigate to **Settings → CI/CD → Runners**
3. You'll see a "Registration token"
4. Copy it
5. Paste it in the `gitlab-runner register` command above

---

### Phase 4: Configure Environment Variables (10 minutes)

#### Step 8: Add Environment Variables
In GitLab project:
1. Go to **Settings → CI/CD → Variables**
2. Click **"Add variable"** for each:

```
Variable Name: DATABASE_URL
Variable Value: mysql://root:password@localhost:3306/smartcart_db
☑ Protected   ☑ Masked

Variable Name: JWT_SECRET
Variable Value: your-secret-key-here
☑ Protected   ☑ Masked

Variable Name: NODE_ENV
Variable Value: production
☑ Protected   ☐ Masked

Variable Name: API_PORT
Variable Value: 5000
☑ Protected   ☐ Masked

Variable Name: REACT_APP_API_URL
Variable Value: http://localhost:5000
☑ Protected   ☐ Masked
```

**Note:** Check the checkboxes as shown above

---

### Phase 5: Configure Repository (5 minutes)

#### Step 9: Protect Branches
1. In GitLab project, go to **Settings → Repository**
2. Under "Protected branches", click "Add protection"
3. Select branch: **master**
4. Enable:
   - ☑ Require a successful CI pipeline
   - ☑ Require all conversations to be resolved
5. Click "Protect"

---

### Phase 6: Trigger Your First Pipeline (10 minutes)

#### Step 10: Push Code to Trigger Pipeline
```powershell
cd c:\APPLICATION\E-com

# Make a test commit
git add .
git commit --allow-empty -m "Trigger CI/CD pipeline"

# Push to develop to trigger pipeline
git push gitlab develop
```

#### Step 11: Watch Pipeline Run
1. Go to your GitLab project
2. Click **Build → Pipelines**
3. You should see a new pipeline running!
4. Click on the pipeline ID to see detailed logs
5. Watch jobs execute:
   - backend-build ⏳
   - frontend-build ⏳
   - backend-test ⏳
   - frontend-test ⏳
   - deploy-dev ⏳

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] GitLab account created
- [ ] smartcart project visible in GitLab
- [ ] All code pushed to GitLab
- [ ] GitLab Runner installed and running
- [ ] Runner shows as "online" in GitLab
- [ ] Environment variables configured
- [ ] master/main branch protected
- [ ] Pipeline triggered successfully
- [ ] All build jobs passed ✅
- [ ] All test jobs passed ✅
- [ ] Deployment prepared ✅

---

## 🎯 Next: Development Workflow

Once everything is set up, here's how to work:

### For New Features
```powershell
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Add feature: description"

# Push to trigger pipeline
git push gitlab feature/my-feature

# Create Merge Request in GitLab UI
# 1. Go to project → Merge Requests
# 2. Click "New merge request"
# 3. From: feature/my-feature → To: develop
# 4. Create and wait for pipeline to pass
# 5. Get approved and merge
```

### For Releases to Staging
```powershell
# After merge requests approved and merged to develop

# Switch to master/main
git checkout master

# Create merge request: develop → master
# 1. In GitLab UI, create new MR
# 2. From: develop → To: master
# 3. Get approval and merge
# 4. Pipeline auto-triggers
# 5. Auto-deploys to staging!
```

### For Production Releases
```
1. Ensure code is merged to master
2. Go to GitLab project
3. Build → Pipelines
4. Find latest master pipeline
5. Click ▶ button on "deploy-production"
6. Confirm deployment
7. Monitor the logs
8. Test production environment
```

---

## 📞 Troubleshooting During Setup

### Problem: "Cannot find gitlab-runner.exe"
**Solution:** Run PowerShell as Administrator and stay in the directory where you downloaded it

### Problem: "gitlab-runner register" fails
**Solution:** 
1. Make sure runner is installed: `gitlab-runner install`
2. Make sure it's running: `gitlab-runner start`
3. Copy the correct token from GitLab Settings → CI/CD → Runners

### Problem: "Pipeline doesn't start after push"
**Solution:**
1. Check runner status: `gitlab-runner verify`
2. Ensure Docker is running
3. Wait 1-2 minutes
4. If still stuck, restart runner: `gitlab-runner restart`

### Problem: "Build hangs or times out"
**Solution:**
1. Check Docker Desktop has enough memory (4GB+)
2. Wait longer (first build takes 5-10 minutes)
3. Check logs in GitLab UI

---

## 📚 Documentation Guide

### Your main resources:

1. **GITLAB_DEPLOYMENT_SUMMARY.md** - Overview
2. **GITLAB_DEPLOYMENT_IMPLEMENTATION.md** - Complete details
3. **GITLAB_CI_CD_QUICK_REFERENCE.md** - Daily commands
4. **GITLAB_DEPLOYMENT_CHECKLIST.md** - Pre-deployment checks
5. **GITLAB_ADVANCED_CONFIGURATION.md** - Advanced features

**Start with:** GITLAB_DEPLOYMENT_SUMMARY.md

---

## ⏰ Timeline Check

- [ ] 0-10 min: GitLab account & project created
- [ ] 10-20 min: Code pushed to GitLab
- [ ] 20-35 min: GitLab Runner installed & registered
- [ ] 35-45 min: Environment variables configured
- [ ] 45-55 min: Branches protected
- [ ] 55-65 min: First pipeline triggered & validated

---

## 🎊 You're All Set!

Once the first pipeline completes successfully, your CI/CD is live!

You can now:
- ✅ Push code and auto-run tests
- ✅ Deploy to development automatically
- ✅ Deploy to staging automatically
- ✅ Deploy to production manually

---

## 💡 Pro Tips

1. **Keep this file handy** while setting up
2. **Take screenshots** of error messages if you get stuck
3. **Check logs in GitLab** for detailed error information
4. **Don't be afraid to retry** - most issues are temporary
5. **Be patient** - first pipeline run takes 10-15 minutes

---

## 🆘 Got Stuck?

### Check these in order:
1. Review the relevant section in this document
2. Check `GITLAB_CI_CD_QUICK_REFERENCE.md` for your issue
3. Review the detailed guide: `GITLAB_DEPLOYMENT_IMPLEMENTATION.md`
4. Check GitLab status: https://status.gitlab.com/
5. Ask in GitLab community or StackOverflow

---

## 🚀 Ready?

Start with **Step 1** above and follow through to completion!

**Total time:** 60 minutes  
**Difficulty:** Easy to Medium  
**Result:** Fully automated CI/CD pipeline ✅

Let's deploy! 🎯

---

**Last Updated:** February 10, 2026
**Version:** Quick Action Plan v1.0
