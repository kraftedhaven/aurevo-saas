# Deployment Guide — Aurevo SaaS

This guide explains how to deploy the Aurevo application to Vercel and configure the hybrid architecture (frontend on Vercel, backend on Manus WebDev).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Aurevo SaaS Application                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (React + Vite)          Backend (Express + tRPC) │
│  Deployed on: Vercel              Deployed on: Manus WebDev│
│  URL: aurevo.vercel.app           URL: aurevo-saas.manus... │
│                                                              │
│  ┌─────────────────────────┐      ┌──────────────────────┐ │
│  │ React Components        │      │ tRPC Routers         │ │
│  │ - CallConsole           │      │ - callConsole        │ │
│  │ - Home                  │      │ - tracker            │ │
│  │ - Dashboard             │      │ - benchmarks         │ │
│  │                         │      │ - objections         │ │
│  │ tRPC Client             │      │                      │ │
│  │ Tailwind CSS            │      │ Database (MySQL)     │ │
│  │ shadcn/ui Components    │      │ Drizzle ORM          │ │
│  └─────────────────────────┘      └──────────────────────┘ │
│           ↕                                ↕                 │
│        API Calls (tRPC)          Database Queries           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Prepare for Vercel Deployment

### 1.1 Create a Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account
- Authorize Vercel to access your GitHub repositories

### 1.2 Create a New Project on Vercel
1. Click "Add New..." → "Project"
2. Select your GitHub repository (`kraftedhaven/my-links` or your Aurevo repo)
3. Configure project settings:
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

### 1.3 Set Environment Variables in Vercel
In the Vercel project settings, add these environment variables:

```
VITE_APP_ID=<your-manus-app-id>
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_FRONTEND_FORGE_API_URL=<your-manus-api-url>
VITE_FRONTEND_FORGE_API_KEY=<your-manus-api-key>
VITE_ANALYTICS_ENDPOINT=<your-analytics-endpoint>
VITE_ANALYTICS_WEBSITE_ID=<your-analytics-id>
VITE_APP_TITLE=Aurevo
VITE_APP_LOGO=<your-logo-url>
```

**Note:** Get these values from your Manus WebDev project settings.

## Step 2: Configure Backend on Manus WebDev

The backend remains on Manus WebDev. Ensure:

1. **Backend URL is publicly accessible** (it should be by default)
2. **CORS is configured** to allow requests from your Vercel domain:
   - Vercel URL: `https://aurevo.vercel.app`
   - Manus WebDev URL: `https://3000-<your-project>.manus.computer`

3. **Environment variables are set** in Manus WebDev:
   - `DATABASE_URL`: MySQL connection string
   - `JWT_SECRET`: Session signing key
   - `VITE_APP_ID`: OAuth app ID
   - `OAUTH_SERVER_URL`: Manus OAuth endpoint

## Step 3: Connect Frontend to Backend

### 3.1 Update tRPC Client Configuration
In `client/src/lib/trpc.ts`, ensure the backend URL points to your Manus WebDev instance:

```typescript
const backendUrl = process.env.VITE_BACKEND_URL || 'https://3000-<your-project>.manus.computer';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${backendUrl}/api/trpc`,
      credentials: 'include',
    }),
  ],
});
```

### 3.2 Add Backend URL to Vercel Environment Variables
Add to Vercel project settings:
```
VITE_BACKEND_URL=https://3000-<your-project>.manus.computer
```

## Step 4: Deploy Frontend to Vercel

### 4.1 Push to GitHub
```bash
git add .
git commit -m "Setup Vercel deployment configuration"
git push origin main
```

### 4.2 Vercel Automatic Deployment
Once you push to `main`, Vercel automatically:
1. Clones your repository
2. Installs dependencies (`pnpm install`)
3. Builds the project (`pnpm build`)
4. Deploys to Vercel CDN

Your app will be live at: `https://aurevo.vercel.app`

### 4.3 Monitor Deployment
- Go to your Vercel project dashboard
- Click "Deployments" to see build logs
- Check "Analytics" for performance metrics

## Step 5: GitHub Actions CI/CD

The GitHub Actions workflow automatically:
1. **On PR:** Runs linting, type checking, and tests → Deploys preview to Vercel
2. **On Merge to Main:** Runs full test suite → Deploys production to Vercel

### 5.1 View CI/CD Status
- Go to your GitHub repository
- Click "Actions" tab
- See workflow runs and their status

### 5.2 Fix Failed Builds
If a build fails:
1. Check the GitHub Actions logs
2. Common issues:
   - Missing dependencies: `pnpm install`
   - Type errors: `pnpm check`
   - Linting errors: `pnpm format`
3. Fix locally and push again

## Step 6: Testing the Full Application

### 6.1 Test Frontend
```bash
# Locally
pnpm dev

# Visit http://localhost:5173
# Test all tabs and features
```

### 6.2 Test Backend
```bash
# Manus WebDev dev server
# Visit https://3000-<your-project>.manus.computer
# Check API endpoints via tRPC
```

### 6.3 Test Integration
1. Go to `https://aurevo.vercel.app`
2. Log in with Manus OAuth
3. Test each feature:
   - [ ] Call Console loads
   - [ ] Leak Calculator calculates correctly
   - [ ] Data saves to database
   - [ ] Tracker entries persist
   - [ ] Privacy blur toggle works
   - [ ] Session timer increments

## Troubleshooting

### Issue: "Failed to fetch from backend"
**Solution:** Check CORS configuration in Manus WebDev. Ensure your Vercel URL is whitelisted.

### Issue: "Vercel build fails with 'pnpm not found'"
**Solution:** Ensure `pnpm` is installed. Add to `package.json`:
```json
"packageManager": "pnpm@10.4.1+sha512..."
```

### Issue: "Environment variables not loading"
**Solution:** 
1. Verify variables are set in Vercel project settings
2. Redeploy after adding variables
3. Check `vercel.json` for correct env variable names

### Issue: "OAuth login redirects to wrong URL"
**Solution:** Update `VITE_OAUTH_PORTAL_URL` in Vercel to match your Manus OAuth endpoint.

## Monitoring & Maintenance

### Monitor Application Health
- **Vercel Dashboard:** Check deployment status, error logs, analytics
- **Manus WebDev Dashboard:** Monitor backend health, database queries
- **GitHub Actions:** Review CI/CD pipeline runs

### Update Dependencies
```bash
pnpm update
pnpm audit
git push origin main  # Triggers CI/CD
```

### Rollback Deployment
If something breaks:
1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

## Production Checklist

Before going live:
- [ ] All environment variables are set in Vercel
- [ ] Backend is accessible from Vercel URL
- [ ] CORS is properly configured
- [ ] SSL/TLS certificates are valid
- [ ] Database backups are configured
- [ ] Error monitoring is set up (Sentry, etc.)
- [ ] Analytics are tracking correctly
- [ ] All features tested end-to-end
- [ ] Performance is acceptable (Vercel Analytics)
- [ ] Security headers are configured

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | Free | Generous free tier for hobby projects |
| Manus WebDev (Backend) | ~$10-20/month | Autoscale tier, minimal usage |
| Domain | ~$12/year | Optional custom domain |
| **Total** | **~$10-20/month** | Very cost-effective |

## Next Steps

1. Set up Vercel project
2. Configure environment variables
3. Deploy frontend
4. Test integration with backend
5. Monitor GitHub Actions CI/CD
6. Iterate and improve based on feedback

---

For questions or issues, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Manus WebDev Documentation](https://manus.im/docs)
