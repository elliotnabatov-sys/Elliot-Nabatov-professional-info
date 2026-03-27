# Elliot Nabatov — Personal Site

## Deploy to Vercel (free, ~10 minutes)

### Step 1: Get an Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Go to **API Keys** → **Create Key**
4. Copy the key — you'll need it in Step 4
5. Add a credit card and load at least $5 in credits (you'll use cents per month for this site)

### Step 2: Push this project to GitHub
1. Go to https://github.com and create a new **private** repository (name it anything, e.g. `my-site`)
2. Download and install Git if you don't have it: https://git-scm.com
3. Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd path/to/this/folder
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Connect to Vercel
1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New → Project**
3. Import the repository you just created
4. Leave all build settings as default — Vercel auto-detects Vite
5. Click **Deploy**

### Step 4: Add your API key
1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

### Step 5: Get your link
Your site is live at `https://your-project-name.vercel.app` — share this with recruiters.

---

## Customizing the site
- **Email / LinkedIn URL:** Edit `src/App.jsx` and search for `elliotnabatov@gmail.com` and `linkedin.com/in/elliotnabatov`
- **AI agent knowledge:** Edit the `SYSTEM_PROMPT` string in `api/chat.js`
- **Content / text:** Everything is in `src/App.jsx`

After any changes: commit and push to GitHub — Vercel auto-redeploys within ~30 seconds.

```bash
git add .
git commit -m "update content"
git push
```
