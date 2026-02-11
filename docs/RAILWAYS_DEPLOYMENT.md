# SmartCart Deployment on Railways

This guide walks you through deploying SmartCart to Railway.app after CI has passed.

## Prerequisites

- Railway.app account (sign up at https://railway.app)
- GitHub/GitLab repository connected to Railway
- CI pipeline passing (as indicated by successful GitHub Actions or GitLab CI)
- Environment variables configured

## Step 1: Connect Repository to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub** or **Deploy from GitLab**
4. Authorize Railway to access your repository
5. Select the `E-com` repository
6. Select the `master` or `main` branch for production deployment

## Step 2: Configure Environment Variables

Railway will automatically deploy based on your `Procfile` and `railway.json`. Configure these Railway variables:

### Railway Project Settings → Variables

Add the following environment variables:

```
NODE_ENV=production
PORT=8000
MYSQL_TCP_HOST=<your-mysql-service-hostname>
MYSQL_TCP_PORT=3306
MYSQL_USER=<your-database-user>
MYSQL_PASSWORD=<your-database-password>
MYSQL_DBNAME=smartcart_db
```

## Step 3: Add MySQL Database Service (Optional)

If you want to use Railway's MySQL service:

1. In your Railway project, click **+ Add Service**
2. Select **MySQL**
3. Railway will automatically set the connection variables
4. Your app will automatically detect and use these variables

Alternatively, you can use your existing external MySQL database by setting the connection variables above.

## Step 4: Deploy

### Automatic Deployment (Recommended)
- Railway automatically deploys when you push to `master` or `main` branch
- Monitor deployment status in the Railway dashboard

### Manual Deployment
```bash
# Install Railway CLI (optional, for manual deployments)
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway deploy
```

## Step 5: Access Your Application

After deployment succeeds:

- **Backend API**: Available at the Railway-assigned domain (shown in dashboard)
- **Frontend**: Set the `REACT_APP_API_URL` environment variable to your backend URL
- **Admin Dashboard**: Available at `/admin` path (if configured)

## Deployment Details

### Build & Start Commands

The `Procfile` specifies:
```
web: cd smartcart-backend && npm install --legacy-peer-deps && npm start
```

The `railway.json` specifies:
```json
{
  "deploy": {
    "startCommand": "cd smartcart-backend && npm install --legacy-peer-deps && npm start"
  }
}
```

### Key Flags Explained

- **`--legacy-peer-deps`**: Allows npm to install packages with peer dependency conflicts (required for this project)
- **`npm start`**: Runs the backend server using the `start` script from `package.json`

## Monitoring & Logs

1. Navigate to your Railway project dashboard
2. Click on the `web` service
3. View real-time logs in the **Logs** tab
4. Set up alerts/notifications as needed

## Troubleshooting

### Deployment Fails
- Check the build logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure `Procfile` and `railway.json` are in the root directory

### Application Won't Start
- Review error logs in Railway dashboard
- Check if database connection variables are correct
- Verify MySQL database is accessible and running

### Performance Issues
- Scale up the Railway plan if needed
- Check database query performance
- Monitor CPU and memory usage in the dashboard

## CI/CD Integration

After successful CI pipeline (#13), the deployment to Railways is triggered automatically:

1. **GitHub Actions**: 
   - CI pipeline runs and validates code
   - Successful tests → Railways webhook triggered
   - Automatic deployment to staging/production

2. **GitLab CI**:
   - Pipeline stages: build → security → test → deploy
   - Manual deployment to production available via `deploy-production` job

## Rollback Procedure

If deployment has issues:

1. In Railway dashboard, go to **Deployments**
2. Select the previous successful deployment
3. Click **Redeploy** to rollback
4. Monitor logs to verify rollback success

## Next Steps

1. ✅ Verify backend API is responding
2. ✅ Update frontend `.env` with backend API URL
3. ✅ Deploy frontend to Vercel/Netlify
4. ✅ Test complete user flows
5. ✅ Monitor error logs for 15 minutes after deployment
6. ✅ Set up production monitoring and alerts

## Railway CLI Commands (Optional)

```bash
# View deployment logs
railway logs

# View environment variables
railway variables

# Set environment variable
railway variables set KEY=value

# View deployment status
railway status

# Open project in browser
railway open
```

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Pricing](https://railway.app/pricing)
- [Railway Support](https://railway.app/support)

---

**Deployment Date**: February 11, 2026  
**Pipeline Version**: CI #13, Deploy #16  
**Commit**: 84d55cb
