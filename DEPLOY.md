# Deploy Smeta to Railway

## Prerequisites

1. GitHub account with Smeta repository
2. Railway account (https://railway.app) - free tier available

## Steps

### 1. Connect GitHub

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `arionivan0-hub/Smeta`
4. Railway will auto-detect Python and start building

### 2. Configure

Railway auto-detects the project. The `railway.json` config handles everything.

### 3. Deploy

Railway automatically:
- Installs Python dependencies
- Builds frontend (`npm run build`)
- Starts the server

### 4. Get URL

After deployment, click **Settings** → **Networking** → **Generate Domain**

Your app will be at something like: `https://smeta-xxx.up.railway.app`

## Environment Variables (optional)

In Railway dashboard → Variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | Server port (auto-set by Railway) |

## Limitations (free tier)

- **500 hours/month** of runtime
- **SQLite is ephemeral** - data resets on redeploy
- Sleeps after 15 min of inactivity (cold start ~30s)

## For persistent data

Upgrade to paid plan and switch to PostgreSQL:

```python
# In database.py, change:
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smeta.db")
```

## Manual deploy (CLI)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## Docker deploy (alternative)

```bash
# Build
docker build -t smeta .

# Run
docker run -p 8000:8000 smeta
```
