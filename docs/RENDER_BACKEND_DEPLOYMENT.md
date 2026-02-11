# SmartCart Backend Deployment on Render.com

Deploy the SmartCart backend API to Render.com (free hosting with auto-deployments).

## Prerequisites

- Render.com account (free sign-up at https://render.com)
- GitHub repository with SmartCart code pushed
- CI pipeline passed (GitHub Actions #13)
- MySQL database (external or Render PostgreSQL)

## Step 1: Sign Up on Render

1. Go to https://render.com
2. Click **Sign Up**
3. Choose **Sign up with GitHub** (easiest option)
4. Authorize Render to access your GitHub repositories
5. Complete your profile

## Step 2: Create Web Service on Render

1. In Render Dashboard, click **New +**
2. Select **Web Service**
3. Select **Deploy existing repository**
4. Find and select your `E-com` repository
5. Click **Connect**

### Configure Web Service Settings

**Name**: `smartcart-backend` (or your preferred name)

**Environment**: Docker (auto-detected from Dockerfile)

**Instance Type**: `Free` (recommended for testing)

**Auto-Deploy**: `Yes` (deploys on push to main/master)

**Build Details** (Render will auto-detect):
- **Dockerfile**: Found at root level → Render uses this automatically
- **Build Command**: Not needed (Docker handles it)
- **Start Command**: Not needed (Docker entrypoint handles it)

### What Dockerfile Does

The root-level `Dockerfile`:
1. Uses Node.js 18 Alpine image (lightweight)
2. Installs dependencies with `--legacy-peer-deps` flag
3. Copies only necessary backend files
4. Runs health checks
5. Starts the backend server automatically

No additional configuration needed!

## Step 3: Set Environment Variables

In the Render service settings, go to **Environment** and add:

### Database Configuration
```
MYSQL_TCP_HOST=<your-mysql-host>
MYSQL_TCP_PORT=3306
MYSQL_USER=<your-user>
MYSQL_PASSWORD=<your-password>
MYSQL_DBNAME=smartcart_db
```

### Application Settings
```
NODE_ENV=production
PORT=10000
```

### CORS Configuration (for frontend on GitHub Pages)
```
CORS_ORIGIN=https://<your-github-username>.github.io
```

## Step 4: Deploy

1. Click **Create Web Service**
2. Render automatically builds and deploys your backend
3. Deployment typically takes **3-5 minutes**
4. Monitor progress in the **Logs** tab

Once deployment succeeds, you'll see a green status and a unique URL:
```
https://smartcart-backend-xxxxx.onrender.com
```

## Step 5: Verify Backend is Running

Test your API endpoint:

```bash
curl https://smartcart-backend-xxxxx.onrender.com/api/health
```

Or access in browser (adjust to your routes):
```
https://smartcart-backend-xxxxx.onrender.com/api/products
```

## Step 6: Update Frontend Configuration

In your frontend `.env.production` (or frontend code):

```
REACT_APP_API_URL=https://smartcart-backend-xxxxx.onrender.com
```

Update all API calls to use this URL:
```javascript
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
```

---

## Troubleshooting

### Service Won't Start
- **Check Logs**: Go to **Logs** tab and look for errors
- **Verify package.json**: Ensure `"main": "src/server.js"` is correct
- **Check start script**: Verify `smartcart-backend/package.json` has `"start"` script

**Fix**:
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### Database Connection Fails
- Verify environment variables match your database credentials
- Check if database is accessible from internet (no firewall blocking)
- For external MySQL, whitelist Render IP: `0.0.0.0/0` (or specific IP from logs)

### Cold Start Issues
- Render free tier may have brief delays on first request
- Add retry logic in frontend for failed API calls
- Consider upgrading to paid plan for instant response

### 502 Bad Gateway Error
- Service likely crashed - check logs for errors
- Review error logs and fix issues
- Manually redeploy by clicking **Manual Deploy**

---

## Auto-Deployment from GitHub

After initial setup, Render automatically deploys when you:

1. Push to `main` or `master` branch
2. GitHub sends webhook to Render
3. Render rebuilds and deploys automatically

**To disable auto-deploy**:
- Go to Service Settings → Auto-Deploy → Toggle Off

---

## Manual Deployment

To force redeploy without pushing code:

1. Go to your Render service
2. Click **Manual Deploy**
3. Select branch (main/master)
4. Click **Deploy**

---

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `MYSQL_TCP_HOST` | `db.example.com` | MySQL server hostname |
| `MYSQL_TCP_PORT` | `3306` | MySQL port |
| `MYSQL_USER` | `admin` | Database username |
| `MYSQL_PASSWORD` | `secure_pass` | Database password |
| `MYSQL_DBNAME` | `smartcart_db` | Database name |
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `10000` | Server port (Render assigns) |
| `CORS_ORIGIN` | `https://user.github.io` | Frontend URL for CORS |

---

## Important Notes

### Free Tier Limitations
- ✅ Supports auto-deploys from Git
- ⚠️ May spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down adds 30-second delay
- ✅ Good for MVP/testing
- Upgrade to paid plan ($7/month) for always-on service

### For Always-On Service
If you need consistent uptime:
1. Go to Plan → Select **Starter ($7/month)**
2. Service will always be active
3. Still gets free GitHub-powered auto-deploys

---

## Monitoring & Logs

**View logs**:
1. Go to your service page
2. Click **Logs** tab
3. See real-time output

**Set up alerts** (paid feature):
- Monitor service health
- Get notifications on crashes
- Track performance metrics

---

## Database Options

### Option A: External MySQL
Use your existing MySQL database (recommended for free tier):
- Set `MYSQL_TCP_HOST`, credentials, etc.
- Database must be accessible from internet

### Option B: PostgreSQL on Render (Free)
Render offers free PostgreSQL:
1. New → PostgreSQL
2. Render creates free database
3. Copy connection string from Internal Database URL
4. Update backend code to use PostgreSQL instead of MySQL

---

## CORS Configuration

Important for frontend on GitHub Pages to call backend:

**In your backend (if using Express)**:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));
```

**Environment variable**:
```
CORS_ORIGIN=https://yourusername.github.io
```

---

## Next Steps

1. ✅ Deploy backend on Render
2. ✅ Copy backend URL (e.g., `https://smartcart-backend-xxxxx.onrender.com`)
3. → Go to [GITHUB_PAGES_FRONTEND_DEPLOYMENT.md](GITHUB_PAGES_FRONTEND_DEPLOYMENT.md)
4. → Deploy frontend to GitHub Pages with backend URL
5. ✅ Test full stack integration
6. ✅ Monitor logs for any issues

---

## Quick Reference

| Action | Steps |
|--------|-------|
| **View Logs** | Service → Logs |
| **Redeploy** | Service → Manual Deploy |
| **Change Env Vars** | Service → Environment |
| **Check Status** | Service Dashboard |
| **Copy API URL** | Service URL or Custom Domain |

---

## Upgrade to Paid Plan

When you're ready for production:

1. Service Settings → Plan
2. Select **Starter** ($7/month) or higher
3. Benefits:
   - Always-on (no sleep)
   - Dedicated resources
   - Priority support
   - More environment variables

---

**Notes**:
- 🔗 Backend URL: `https://smartcart-backend-xxxxx.onrender.com`
- 📱 Frontend URL: `https://yourusername.github.io`
- 🚀 Deployment Date: February 11, 2026
- 📊 CI Pipeline: #13, Deploy: #16
