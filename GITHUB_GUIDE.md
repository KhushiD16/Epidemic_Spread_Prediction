# GitHub Integration & Deployment Guide

## 📤 Push to GitHub

### Initial Setup

```bash
cd Epidemic_Spread_Prediction

# Configure git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add -A

# Initial commit
git commit -m "Add full-stack epidemic prediction application

- FastAPI backend with 6 REST endpoints
- React + TypeScript + Vite frontend
- Interactive charts with Recharts
- Risk scoring system
- India state-wise heatmap
- Responsive design with maroon/coffee theme
- Docker support for easy deployment
"

# Set up remote (if not already done)
git remote add origin https://github.com/KhushiD16/Epidemic_Spread_Prediction.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🔄 Daily Commits (Recommended Workflow)

### Daily Development Workflow

```bash
# Morning - Start work
git status

# During day - Commit changes regularly
git add <modified-files>
git commit -m "Feature: [Description of changes]"

# Evening - Push to GitHub
git push

# Check what changed
git log --oneline -10
```

### Commit Message Format

```
Type: Short description (50 chars max)

Detailed explanation of changes (optional)
- Feature or fix details
- What component changed
- Why the change was made
```

**Types**: Feature, Fix, Docs, Style, Refactor, Test, Chore

### Examples

```bash
# Feature commits
git commit -m "Feature: Add real-time data refresh for backend API"
git commit -m "Feature: Implement WebSocket support for live updates"
git commit -m "Feature: Add email alerts for high-risk threshold"

# Fix commits
git commit -m "Fix: Correct timezone handling in timestamp"
git commit -m "Fix: Resolve CORS issues with third-party API"

# Documentation commits
git commit -m "Docs: Update API documentation with examples"
git commit -m "Docs: Add deployment guide for AWS"

# Refactor commits
git commit -m "Refactor: Extract common styles to shared CSS module"
git commit -m "Refactor: Optimize prediction algorithm for faster computation"
```

---

## 🤖 GitHub Actions Workflow (CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests/ -v

  frontend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      - run: cd frontend && npm run lint

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run test

  docker-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/setup-buildx-action@v1
      - run: docker-compose build
```

---

## 📅 Daily Automation Script

Create `scripts/daily_commit.sh`:

```bash
#!/bin/bash

# Daily Commit Script - Add to cron
# Usage: 0 22 * * * /path/to/daily_commit.sh

cd /path/to/Epidemic_Spread_Prediction

# Get date
TODAY=$(date +%Y-%m-%d)

# Check if there are changes
if [[ -z $(git status -s) ]]; then
  echo "No changes to commit on $TODAY"
  exit 0
fi

# Add all changes
git add -A

# Get summary of changes
SUMMARY=$(git diff --cached --shortstat)

# Commit with timestamp
git commit -m "Daily update: $TODAY

$SUMMARY

Auto-committed by daily script"

# Push to GitHub
git push origin main

echo "✓ Daily commit completed on $TODAY"
```

### Schedule Daily Commits (Linux/macOS)

```bash
# Edit crontab
crontab -e

# Add this line (runs at 10 PM daily)
0 22 * * * /path/to/daily_commit.sh

# Or for Windows Task Scheduler:
# Create task: "Epidemic Daily Commit"
# Trigger: Daily at 22:00
# Action: Run python script
```

---

## 🌐 Continuous Deployment

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create epidemic-prediction-backend

# Add Procfile
echo "web: cd backend && uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configure environment
# Backend URL: https://epidemic-prediction-backend.herokuapp.com
```

---

## 📊 Tracking Changes

### View Commit History
```bash
git log --oneline -20
git log --graph --oneline --all
git log --pretty=format:"%h - %s (%an, %ar)"
```

### Compare Versions
```bash
git diff main..feature-branch
git diff HEAD~3 HEAD
git show <commit-hash>
```

### Create Release Tags
```bash
# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# List tags
git tag -l
```

---

## 📝 Branch Management

### Feature Branches
```bash
# Create feature branch
git checkout -b feature/add-websockets
git checkout -b feature/email-alerts

# Create bug fix branch
git checkout -b bugfix/cors-issue

# Merge back to main
git checkout main
git pull
git merge feature/add-websockets
git push origin main
```

### Pull Requests (GitHub)
1. Push feature branch: `git push origin feature/my-feature`
2. Go to GitHub → Create Pull Request
3. Add description
4. Request reviews
5. Merge when approved

---

## 🔐 GitHub Secrets (for CI/CD)

Add to repository Settings → Secrets:
```
DATABASE_URL = postgresql://...
API_KEY = your-api-key
EMAIL_PASSWORD = your-email-password
HEROKU_API_KEY = heroku-api-key
AWS_ACCESS_KEY = aws-key
AWS_SECRET_KEY = aws-secret
```

---

## 📈 GitHub Analytics

### Repository Stats
```bash
# Lines of code
git ls-files | xargs wc -l

# Top contributors
git shortlog -sn

# Most changed files
git log --name-only --oneline | grep -v '^$' | sort | uniq -c | sort -rn | head
```

---

## 🚀 Release Workflow

### Create Release
1. Update version in `package.json` and `setup.py`
2. Update `CHANGELOG.md`
3. Create tag: `git tag v1.1.0`
4. Push: `git push origin v1.1.0`
5. Go to GitHub → Releases → Create from tag
6. Add release notes

### Release Template
```markdown
## v1.1.0 - 2024-04-15

### New Features
- Real-time WebSocket support
- Email alerts for high-risk regions
- Advanced ML models (LSTM)

### Bug Fixes
- Fixed timezone issues
- Improved error messages

### Performance
- 30% faster predictions
- Reduced memory usage

### Breaking Changes
None

### Contributors
- @developer1
- @developer2
```

---

## 💾 Backup & Recovery

```bash
# Create backup
git clone --mirror https://github.com/KhushiD16/Epidemic_Spread_Prediction.git backup.git

# Restore from backup
git clone backup.git

# View lost commits
git reflog
git checkout <lost-commit>
```

---

## 📚 Best Practices

✅ **Commit Often**: Small, logical commits are easier to track
✅ **Write Good Messages**: Descriptive messages help future developers
✅ **Push Regularly**: Don't let changes pile up
✅ **Review Before Committing**: Check what you're committing
✅ **Use Branches**: Keep main branch stable
✅ **Never Force Push**: Especially on main branch
✅ **Keep Secrets Safe**: Use .gitignore and environment variables

---

## 🔗 Useful Links

- GitHub Repository: https://github.com/KhushiD16/Epidemic_Spread_Prediction
- GitHub Docs: https://docs.github.com
- Git Guide: https://git-scm.com/doc
- Heroku Deployment: https://devcenter.heroku.com
- Vercel Deployment: https://vercel.com/docs

---

## ✅ Ready to Push

All code is production-ready. First push:

```bash
git add -A
git commit -m "Initial commit: Full-stack epidemic prediction application"
git push -u origin main
```

Then set up:
- GitHub Actions CI/CD
- Daily commit automation
- Automatic deployments
- Release management

Happy coding! 🚀
