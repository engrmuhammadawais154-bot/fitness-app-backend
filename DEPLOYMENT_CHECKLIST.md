# ✅ Deployment Checklist

## Before You Start
- [ ] Have a GitHub account (create at github.com)
- [ ] Have a Render account (create at render.com - free)
- [ ] Have Git installed on your computer

## Step 1: Push to GitHub (5 minutes)
```powershell
cd "d:\2025\fitness app\server"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fitness-app-backend.git
git push -u origin main
```

- [ ] Created GitHub repository
- [ ] Pushed server code to GitHub

## Step 2: Deploy to Render (3 minutes)
1. [ ] Logged into render.com
2. [ ] Created new Web Service
3. [ ] Connected GitHub repository
4. [ ] Set build command: `npm install`
5. [ ] Set start command: `npm start`
6. [ ] Clicked "Create Web Service"
7. [ ] Waited for deployment to finish
8. [ ] Copied my Render URL: `____________________________`

## Step 3: Update Frontend (2 minutes)
1. [ ] Opened `client/src/config.ts`
2. [ ] Changed `API_URL` to my Render URL
3. [ ] Ran `npm run build` in client folder
4. [ ] Ran `npx cap sync`

## Step 4: Build & Test APK (5 minutes)
1. [ ] Ran `npx cap open android`
2. [ ] Built APK in Android Studio
3. [ ] Installed APK on phone
4. [ ] Tested sign-up with real data
5. [ ] Tested login
6. [ ] Tested step tracking

## 🎉 Done!
- [ ] App works on my phone with live backend
- [ ] Can create account and login from anywhere
- [ ] Step tracking uses real device sensors
- [ ] All data syncs with cloud server

---

**My API URL:** _________________________________

**Deployment Date:** ___________________________

**Notes:** 
