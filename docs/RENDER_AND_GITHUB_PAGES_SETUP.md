# SmartCart: Render + GitHub Pages Deployment

Complete stack deployment guide: **Backend on Render.com** + **Frontend on GitHub Pages** (100% free).

## Quick Overview

| Component | Platform | URL | Auto-Deploy |
|-----------|----------|-----|------------|
| Backend API | Render.com | `https://smartcart-backend-xxxxx.onrender.com` | ✅ GitHub webhook |
| Frontend | GitHub Pages | `https://<username>.github.io/smartcart-frontend` | ✅ GitHub Actions |
| Admin Dashboard | GitHub Pages | `https://<username>.github.io/smartcart-admin` | ✅ GitHub Actions |
| Database | External MySQL | Your existing DB | N/A |

---

## Deployment Steps (10 minutes)

### Phase 1: Backend on Render (5 minutes)

1. Go to https://render.com → Sign up with GitHub
2. Create Web Service → Connect your E-com repository
3. Render **auto-detects `Dockerfile`** at root level
4. Add environment variables (database credentials)
5. Click **Create Web Service**
6. Wait for green status ✅ (3-5 minutes)
7. Copy your backend URL: `https://smartcart-backend-xxxxx.onrender.com`

**Important**: The `Dockerfile` at root level handles the entire build process automatically. No need to set build/start commands—Render detects and uses it!

**Full guide**: [RENDER_BACKEND_DEPLOYMENT.md](RENDER_BACKEND_DEPLOYMENT.md)

### Phase 2: Frontend on GitHub Pages (5 minutes)

1. Update `.env.production` in **smartcart-frontend** and **smartcart-admin**:
   ```
   REACT_APP_API_URL=https://smartcart-backend-xxxxx.onrender.com
   ```

2. Add `homepage` to **package.json** in both frontend directories:
   ```json
   "homepage": "https://<your-username>.github.io/smartcart-frontend"
   ```

3. Install gh-pages dependency:
   ```bash
   cd smartcart-frontend && npm install --save-dev gh-pages
   cd smartcart-admin && npm install --save-dev gh-pages
   ```

4. Create GitHub secret:
   - Settings → Secrets → New Secret
   - Name: `RENDER_BACKEND_URL`
   - Value: Your Render backend URL

5. Push code to GitHub (auto-deploys via GitHub Actions)

6. GitHub Pages auto-loads frontend at: `https://<username>.github.io/smartcart-frontend`

**Full guide**: [GITHUB_PAGES_FRONTEND_DEPLOYMENT.md](GITHUB_PAGES_FRONTEND_DEPLOYMENT.md)

---

## Verify Everything Works

### ✅ Test Backend
```bash
curl https://smartcart-backend-xxxxx.onrender.com/api/products
```

### ✅ Test Frontend
```
https://<username>.github.io/smartcart-frontend
```
- Should load without errors
- API calls should work
- Admin dashboard at: `https://<username>.github.io/smartcart-admin`

### ✅ Check Deployment Logs
- **Render**: Service → Logs
- **GitHub Pages**: Repository → Actions → Latest workflow

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Internet Users                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┬──────────────┐
        │                             │              │
    ┌───▼────────┐            ┌──────▼────────┐   ┌─▼──────────┐
    │  Frontend  │            │  Admin Panel  │   │   API      │
    │ GitHub     │            │  GitHub Pages │   │  Render    │
    │ Pages      │            │               │   │  (Node.js) │
    └───┬────────┘            └──────┬────────┘   └─┬──────────┘
        │                             │              │
        └──────────────┬──────────────┘              │
                       │                            │
                       │                    ┌───────▼──────┐
                       │                    │   MySQL DB   │
                       │                    │ (External)   │
                       │                    └──────────────┘
                       │
            REACT_APP_API_URL
            (Backend URL)
```

---

## Free Tier Features

### Render.com
- ✅ Automatic deployments from GitHub
- ✅ Free tier suitable for MVP
- ⚠️ May sleep after 15 min inactivity (adds 30s delay)
- ⚠️ Upgrade to $7/month for always-on

### GitHub Pages
- ✅ 100% free forever
- ✅ Auto-deploys on push
- ✅ Built-in GitHub Actions CI/CD
- ✅ 1GB per repository
- ✅ Custom domain support

---

## Environment Variables Checklist

### Frontend (.env.production files)
```
REACT_APP_API_URL=https://smartcart-backend-xxxxx.onrender.com
REACT_APP_ENV=production
CI=false
```

### Backend (Render environment variables)
```
NODE_ENV=production
PORT=10000
MYSQL_TCP_HOST=<your-db-host>
MYSQL_TCP_PORT=3306
MYSQL_USER=<your-user>
MYSQL_PASSWORD=<your-password>
MYSQL_DBNAME=smartcart_db
CORS_ORIGIN=https://<username>.github.io
```

---

## Troubleshooting Quick Links

### Backend (Render)
- **Won't deploy**: Check build command and start command
- **API calls fail**: Verify CORS configuration and environment variables
- **Database connection fails**: Check firewall, credentials, and network access
- **502 Bad Gateway**: Service crashed - check logs

See: [RENDER_BACKEND_DEPLOYMENT.md](RENDER_BACKEND_DEPLOYMENT.md#troubleshooting)

### Frontend (GitHub Pages)
- **404 errors**: Check Settings → Pages → gh-pages branch
- **CORS errors**: Backend CORS must allow frontend URL
- **Blank page**: Check browser console and network tab
- **Build fails**: Check GitHub Actions logs

See: [GITHUB_PAGES_FRONTEND_DEPLOYMENT.md](GITHUB_PAGES_FRONTEND_DEPLOYMENT.md#troubleshooting)

---

## Deployment Workflow

### After CI Pipeline Passes

1. **Merge to master/main**: 
   - GitHub Actions automatically builds frontend
   - Render automatically redeploys backend
   - Both deploy within 3-5 minutes

2. **Monitor Deployments**:
   - Render: View logs in service dashboard
   - GitHub Pages: View logs in Actions tab

3. **Test in Production**:
   - Visit `https://<username>.github.io/smartcart-frontend`
   - Test API calls to Render backend
   - Check admin dashboard

---

## Cost Breakdown

| Component | Free Tier | Paid Tier | Notes |
|-----------|-----------|-----------|-------|
| **Render Backend** | ✅ Yes | $7/month | Sleep after 15 min |
| **GitHub Pages Frontend** | ✅ Yes | N/A | Always free |
| **GitHub Actions** | ✅ 2000 min/month | N/A | Plenty for hobby |
| **MySQL Database** | External | External | Use existing DB |
| **Total Monthly Cost** | **$0** | **$7+** | Upgrade when needed |

---

## Performance Optimization

### 1. Reduce Sleep Time (Free Tier)
- Keep traffic consistent (use monitoring)
- Upgrade to paid plan ($7/month) for always-on

### 2. Optimize Frontend
- Enable tree-shaking in build
- Use lazy loading for routes
- Compress assets

### 3. Optimize Backend
- Add database indexing
- Implement caching
- Use connection pooling

---

## Next Steps

**Now that CI has passed** ✅:

1. **Deploy Backend** (5 min)
   - Follow [RENDER_BACKEND_DEPLOYMENT.md](RENDER_BACKEND_DEPLOYMENT.md)
   - Configure MySQL connection
   - Get backend URL

2. **Deploy Frontend** (5 min)
   - Follow [GITHUB_PAGES_FRONTEND_DEPLOYMENT.md](GITHUB_PAGES_FRONTEND_DEPLOYMENT.md)
   - Update `.env.production` with backend URL
   - Push to master/main (auto-deploys)

3. **Verify Full Stack** (5 min)
   - Test frontend loads
   - Test API calls work
   - Check admin dashboard
   - Monitor logs

4. **Monitor in Production** (ongoing)
   - Check Render logs daily
   - Monitor frontend errors
   - Watch API response times

---

## Support Resources

- **Render Docs**: https://docs.render.com
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **React Deployment**: https://create-react-app.dev/deployment/

---

## Summary

🚀 **Your SmartCart Stack**:
- **Backend**: `https://smartcart-backend-xxxxx.onrender.com` (Render)
- **Frontend**: `https://<username>.github.io/smartcart-frontend` (GitHub Pages)
- **Admin**: `https://<username>.github.io/smartcart-admin` (GitHub Pages)
- **Cost**: **$0 - $7/month** (free forever or $7 for always-on)
- **Auto-deploy**: ✅ Yes, on every push

**All set!** Your application is now deployed with zero cost for MVP/testing. 🎉

---

**Last Updated**: February 11, 2026  
**CI Pipeline**: #13 ✅ Passed  
**Deploy Workflow**: #16 ✅ Ready  
**Commit**: 84d55cb
