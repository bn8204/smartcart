# GitLab CI/CD Deployment Checklist

## ✅ Pre-Deployment Setup Checklist

### Phase 1: Repository & Git Setup
- [ ] Clone repository locally or navigate to project directory
- [ ] Initialize git: `git init`
- [ ] Create initial commit with all project files
- [ ] Create GitLab account at https://gitlab.com
- [ ] Create new GitLab project named "smartcart"
- [ ] Add GitLab remote: `git remote add gitlab https://gitlab.com/YOUR_USERNAME/smartcart.git`
- [ ] Push all branches: `git push -u gitlab --all`
- [ ] Verify code appears in GitLab UI

### Phase 2: GitLab Runner Setup
- [ ] Download GitLab Runner for Windows
- [ ] Install runner: `.\gitlab-runner.exe install`
- [ ] Start runner service: `.\gitlab-runner.exe start`
- [ ] Go to GitLab project → **Settings → CI/CD → Runners**
- [ ] Copy registration token
- [ ] Register runner: `gitlab-runner register`
  - [ ] URL: `https://gitlab.com/`
  - [ ] Token: [paste copied token]
  - [ ] Description: `smartcart-docker-runner`
  - [ ] Executor: `docker`
  - [ ] Image: `node:18`
- [ ] Verify runner appears as "connected" in GitLab UI

### Phase 3: Environment Variables
- [ ] Go to GitLab project → **Settings → CI/CD → Variables**
- [ ] Add `DATABASE_URL` (Protected, Masked)
- [ ] Add `JWT_SECRET` (Protected, Masked)
- [ ] Add `NODE_ENV` (Protected)
- [ ] Add `API_PORT` (Protected)
- [ ] Add `REACT_APP_API_URL` (Protected)
- [ ] Verify variables are accessible in pipeline

### Phase 4: Repository Configuration
- [ ] Go to **Settings → Repository → Protected branches**
- [ ] Protect `master` branch:
  - [ ] Require CI pipeline to pass
  - [ ] Require approval from code owners (optional)
- [ ] Protect `develop` branch (optional)
- [ ] Set `master` as default branch

### Phase 5: Docker Configuration
- [ ] Verify Docker Desktop is installed
- [ ] Docker Desktop is running
- [ ] Docker has at least 4GB allocated memory
- [ ] Test: `docker run --rm hello-world` succeeds

## 📋 Initial Pipeline Trigger Checklist

### Before First Push
- [ ] `.gitlab-ci.yml` exists in repository root
- [ ] All three app directories exist:
  - [ ] `smartcart-backend/` with `package.json` & `src/` folder
  - [ ] `smartcart-frontend/` with `package.json` & `src/` folder
  - [ ] `smartcart-admin/` with `package.json` & `src/` folder
- [ ] All projects have `node_modules/` or `.gitignore` entries
- [ ] No uncommitted changes: `git status` shows clean
- [ ] Latest code committed: `git add . && git commit -m "Pre-deployment"`

### Trigger First Pipeline
- [ ] Push to develop: `git push gitlab develop`
- [ ] Monitor pipeline:
  - [ ] Go to **Build → Pipelines**
  - [ ] Pipeline appears and shows status
  - [ ] Backend build starts
  - [ ] Frontend build starts
  - [ ] Tests run
- [ ] Review logs for any errors

## 🏗️ Development Workflow Checklist

### When Starting New Feature
- [ ] Pull latest code: `git pull gitlab develop`
- [ ] Create feature branch: `git checkout -b feature/feature-name`
- [ ] Make code changes
- [ ] Test locally: `npm start`
- [ ] Commit: `git add . && git commit -m "Add feature"`
- [ ] Push: `git push gitlab feature/feature-name`
- [ ] Create Merge Request in GitLab UI
- [ ] Wait for pipeline to pass
- [ ] Request review (if team setting requires)
- [ ] Merge to develop when approved

## 🚀 Staging Deployment Checklist

### Before Releasing to Staging
- [ ] Code reviewed and approved
- [ ] All tests passing in pipeline
- [ ] Feature branch merged to develop
- [ ] Create merge request: develop → master
- [ ] Ensure pipeline passes on master
- [ ] All master pipeline jobs successful
- [ ] Get team approval to merge to master
- [ ] Merge to master/main
- [ ] Verify `deploy-staging` job completes
- [ ] Test staging environment thoroughly

### Validate Staging Deployment
- [ ] API responds to requests
- [ ] Frontend loads without errors
- [ ] Database connections working
- [ ] Admin dashboard accessible
- [ ] User workflows functional
- [ ] No console errors in browser
- [ ] No errors in server logs

## 🎯 Production Deployment Checklist

### Pre-Production Requirements
- [ ] Feature tested and validated in staging
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] All required environment variables configured
- [ ] SSL/TLS certificates valid
- [ ] Load balancer configured
- [ ] Monitoring and alerting enabled
- [ ] Error tracking (Sentry/similar) configured
- [ ] Deployment window scheduled
- [ ] Team notified of deployment

### Production Deployment Steps
- [ ] Code merged to master
- [ ] Master pipeline passes successfully
- [ ] Go to **Build → Pipelines** in GitLab
- [ ] Find latest master pipeline
- [ ] Click ▶ button on `deploy-production` job
- [ ] Confirm production deployment
- [ ] Monitor deployment progress
- [ ] Wait for `deploy-production` job to complete

### Post-Deployment Validation
- [ ] Verify application is running
- [ ] Test critical user flows:
  - [ ] User login works
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout process
  - [ ] Admin dashboard accessible
- [ ] Check server logs for errors
- [ ] Monitor error tracking service
- [ ] Monitor application performance metrics
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Document any issues found

## 🔄 Regular Maintenance Checklist

### Weekly
- [ ] Review pipeline trends
- [ ] Check for failed builds
- [ ] Monitor runner performance
- [ ] Review error logs
- [ ] Cleanup stale branches

### Monthly
- [ ] Update dependencies: `npm outdated`
- [ ] Review and rotate secrets
- [ ] Analyze CI/CD performance
- [ ] Update documentation
- [ ] Test disaster recovery/rollback

### Quarterly
- [ ] Review security settings
- [ ] Audit access permissions
- [ ] Update GitLab Runner
- [ ] Review and optimize build times
- [ ] Plan infrastructure updates

## 🆘 Emergency Procedures

### If Pipeline is Stuck
- [ ] Check runner status: `gitlab-runner verify`
- [ ] Check Docker: `docker ps`
- [ ] Restart runner: `gitlab-runner restart`
- [ ] Check GitLab status page
- [ ] Contact GitLab support if needed

### If Deployment Fails
- [ ] Check deployment logs for error message
- [ ] Verify environment variables
- [ ] Check database connectivity
- [ ] Verify file permissions
- [ ] Try deploying to dev/staging first
- [ ] Rollback to previous version if needed

### If Production is Down
- [ ] Immediate notification to team
- [ ] Check error logs for root cause
- [ ] Prepare rollback if needed
- [ ] Execute rollback: redeploy previous working version
- [ ] Verify functionality restored
- [ ] Document incident
- [ ] Schedule post-mortem analysis

## 📊 Success Indicators

### Pipeline is Working When:
- [x] Commits trigger pipelines automatically
- [x] Build stage completes in 5-10 minutes
- [x] Test stage completes in 2-5 minutes
- [x] Deploy stage shows deployment status
- [x] All jobs show green checkmarks
- [x] Artifacts are available for download
- [x] Logs are clear and informative

### Runner is Healthy When:
- [x] Status shows "online" or "connected"
- [x] Available under project settings
- [x] Takes less than 30 seconds to pick up jobs
- [x] Successfully runs various Docker images
- [x] No timeout or resource issues

### Deployment is Successful When:
- [x] Environment shows as "available" in GitLab
- [x] Application responds to HTTP requests
- [x] Database queries return results
- [x] No error messages in logs
- [x] All features working as expected
- [x] Performance metrics are normal

## 🔗 Key Links

| Item | Link |
|------|------|
| GitLab Project | https://gitlab.com/YOUR_USERNAME/smartcart |
| Pipelines | https://gitlab.com/YOUR_USERNAME/smartcart/-/pipelines |
| CI/CD Settings | https://gitlab.com/YOUR_USERNAME/smartcart/-/settings/ci_cd |
| Runners | https://gitlab.com/YOUR_USERNAME/smartcart/-/settings/ci_cd/runners |
| Environments | https://gitlab.com/YOUR_USERNAME/smartcart/-/deployments/environments |

## 📞 Support Resources

- **GitLab Docs:** https://docs.gitlab.com/ee/ci/
- **Runner Docs:** https://docs.gitlab.com/runner/
- **Docker Hub:** https://hub.docker.com/
- **Node.js:** https://nodejs.org/
- **MySQL:** https://www.mysql.com/

---

**Deployment Status:** Ready for Implementation ✅
**Last Updated:** February 10, 2026
**Version:** 1.0
