# SmartCart Frontend Deployment on GitHub Pages

Deploy SmartCart frontend and admin dashboard to GitHub Pages (free hosting with auto-deployment).

## Prerequisites

- GitHub account and repository
- SmartCart code pushed to GitHub
- Backend deployed on Render (get the API URL)
- Node.js and npm installed locally

## Step 1: Configure Frontend Environment

### Update `.env.production` file

Create or update files in your frontend and admin directories:

**smartcart-frontend/.env.production**:
```
REACT_APP_API_URL=https://smartcart-backend-xxxxx.onrender.com
REACT_APP_ENV=production
```

**smartcart-admin/.env.production**:
```
REACT_APP_API_URL=https://smartcart-backend-xxxxx.onrender.com
REACT_APP_ENV=production
```

Replace `smartcart-backend-xxxxx.onrender.com` with your actual Render backend URL.

## Step 2: Update package.json for GitHub Pages

### Frontend (smartcart-frontend/package.json)

Add homepage and deploy scripts:

```json
{
  "name": "smartcart-frontend",
  "version": "1.0.0",
  "homepage": "https://<your-github-username>.github.io/smartcart-frontend",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.x.x",
    "react-dom": "^18.x.x"
  },
  "devDependencies": {
    "gh-pages": "^5.0.0"
  }
}
```

### Admin Dashboard (smartcart-admin/package.json)

```json
{
  "name": "smartcart-admin",
  "version": "1.0.0",
  "homepage": "https://<your-github-username>.github.io/smartcart-admin",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.x.x",
    "react-dom": "^18.x.x"
  },
  "devDependencies": {
    "gh-pages": "^5.0.0"
  }
}
```

**Important**: Replace `<your-github-username>` with your actual GitHub username.

## Step 3: Create GitHub Actions Workflow (Auto-Deploy)

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
      - master
    paths:
      - 'smartcart-frontend/**'
      - '.github/workflows/deploy-frontend.yml'
  workflow_dispatch:

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install frontend dependencies
        working-directory: smartcart-frontend
        run: npm install --legacy-peer-deps

      - name: Build frontend
        working-directory: smartcart-frontend
        env:
          CI: false
          REACT_APP_API_URL: ${{ secrets.RENDER_BACKEND_URL }}
        run: npm run build

      - name: Deploy to GitHub Pages
        working-directory: smartcart-frontend
        run: npm run deploy
        env:
          github-token: ${{ secrets.GITHUB_TOKEN }}

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install admin dependencies
        working-directory: smartcart-admin
        run: npm install --legacy-peer-deps

      - name: Build admin dashboard
        working-directory: smartcart-admin
        env:
          CI: false
          REACT_APP_API_URL: ${{ secrets.RENDER_BACKEND_URL }}
        run: npm run build

      - name: Deploy admin to GitHub Pages
        working-directory: smartcart-admin
        run: npm run deploy
        env:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Step 4: Add GitHub Secret

1. Go to GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `RENDER_BACKEND_URL`
4. Value: `https://smartcart-backend-xxxxx.onrender.com` (your Render backend URL)
5. Click **Add secret**

This keeps your backend URL secure and allows the GitHub Actions workflow to use it during build.

## Step 5: Install gh-pages Package (Local Setup)

If you want to deploy manually from your computer:

```bash
# Navigate to frontend directory
cd smartcart-frontend

# Install gh-pages dependency
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

Repeat for admin dashboard:
```bash
cd smartcart-admin
npm install --save-dev gh-pages
npm run deploy
```

## Step 6: Enable GitHub Pages

1. Go to GitHub Repository → **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**
3. Click **Save**

## Step 7: Access Your Applications

After deployment succeeds:

**Frontend**:
```
https://<your-github-username>.github.io/smartcart-frontend
```

**Admin Dashboard**:
```
https://<your-github-username>.github.io/smartcart-admin
```

**Backend API** (from Render):
```
https://smartcart-backend-xxxxx.onrender.com/api/...
```

---

## Testing Deployment

### Test Frontend
```bash
# Local testing before deployment
cd smartcart-frontend
npm run build
npm start

# Visit: http://localhost:3000
```

### Test API Connection
```javascript
// In your React component
fetch('https://smartcart-backend-xxxxx.onrender.com/api/products')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## Troubleshooting

### GitHub Pages Shows 404

**Problem**: Pages not found
**Solution**:
1. Check Settings → Pages → Source is `gh-pages` branch
2. Verify `homepage` in package.json is correct
3. Run: `npm run build` && `npm run deploy` locally

### API Calls Failing (CORS Error)

**Problem**: Frontend can't call backend API
**Solution**:
1. Verify backend CORS is configured
2. Check `REACT_APP_API_URL` environment variable is set
3. Ensure backend URL in GitHub secret is correct
4. Backend must have: `cors({ origin: 'https://yourusername.github.io' })`

### Build Fails in GitHub Actions

**Problem**: Workflow fails during build
**Solution**:
1. Check workflow logs: Repository → Actions → Latest workflow
2. Look for error messages in build step
3. Verify `.env.production` files have correct variables
4. Ensure `--legacy-peer-deps` flag is in npm install

### Blank Page After Deployment

**Problem**: Page loads but shows nothing
**Solution**:
1. Open DevTools → Console for errors
2. Check Network tab for failed API calls
3. Verify backend is running and accessible
4. Check `REACT_APP_API_URL` is correctly set

---

## Manual Deployment

If GitHub Actions auto-deploy isn't working:

```bash
# Frontend
cd smartcart-frontend
npm install --legacy-peer-deps
npm run build
npm run deploy

# Admin
cd smartcart-admin
npm install --legacy-peer-deps
npm run build
npm run deploy
```

---

## Update Backend URL

If you need to change backend URL later:

**Option 1: GitHub Secret**
1. Settings → Secrets → Edit `RENDER_BACKEND_URL`
2. Update to new Render URL
3. Re-run GitHub Actions workflow

**Option 2: Rebuild and Deploy**
```bash
cd smartcart-frontend
REACT_APP_API_URL=https://new-backend-url.onrender.com npm run deploy
```

---

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `REACT_APP_API_URL` | `https://smartcart-backend-xxxxx.onrender.com` | Backend API URL |
| `REACT_APP_ENV` | `production` | Environment type |
| `CI` | `false` | Disable CI warnings during build |

---

## Performance Tips

### 1. Enable Caching
Add to `.github/workflows/deploy-frontend.yml`:
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'
```

### 2. Minimize Build Size
In frontend code:
```javascript
// Use lazy loading
const AdminPage = lazy(() => import('./pages/Admin'));

// Compress images
// Remove unused dependencies
```

### 3. GitHub Pages Limits
- Max 1GB per repository
- 10 builds per hour
- Best for SPAs (single-page apps)

---

## Advanced: Custom Domain

To use custom domain (optional):

1. Get domain from GoDaddy, Namecheap, etc.
2. GitHub Pages Settings → Custom domain → Enter domain
3. Update DNS records at registrar to point to GitHub Pages
4. GitHub auto-creates SSL certificate

---

## API Calls Pattern

**Recommended approach in React**:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

---

## Deployment Checklist

- [ ] `.env.production` files created with correct API URL
- [ ] `homepage` in package.json updated with GitHub username
- [ ] `gh-pages` dependency added to package.json
- [ ] `.github/workflows/deploy-frontend.yml` created
- [ ] `RENDER_BACKEND_URL` GitHub secret configured
- [ ] GitHub Pages enabled (Source: gh-pages branch)
- [ ] First manual deployment successful
- [ ] Frontend loads and connects to backend
- [ ] Admin dashboard loads
- [ ] API calls working without CORS errors

---

## Next Steps

1. ✅ Deploy frontend to GitHub Pages
2. ✅ Verify both frontend and admin dashboard load
3. ✅ Test API calls to Render backend
4. ✅ Monitor browser console for errors
5. ✅ Check Render logs for backend issues
6. ✅ Test complete user workflows
7. ✅ Set up monitoring/alerts

---

**Frontend URL**: `https://<username>.github.io/smartcart-frontend`  
**Admin URL**: `https://<username>.github.io/smartcart-admin`  
**Backend URL**: Replace with your Render.com backend URL  
**Deployment Date**: February 11, 2026
