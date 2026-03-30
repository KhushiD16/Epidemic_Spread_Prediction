# Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Windows Users

```bash
# 1. Run the setup script (PowerShell or CMD)
setup.bat

# 2. In Terminal 1: Start Backend
venv\Scripts\activate.bat
python backend\main.py

# 3. In Terminal 2: Start Frontend
cd frontend
npm run dev
```

### macOS/Linux Users

```bash
# 1. Run the setup script
bash setup.sh

# 2. In Terminal 1: Start Backend
source venv/bin/activate
python backend/main.py

# 3. In Terminal 2: Start Frontend
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📊 Dashboard Overview

1. **Header**: Global statistics (total cases, active countries)
2. **Sidebar**: Country/Region selector dropdown
3. **Risk Score Card**: 
   - Current risk level (High/Medium/Low)
   - Current cases
   - 7-day growth rate
   - 30-day prediction
   - Expected change in cases

4. **Prediction Chart**: 
   - 30-day forecast line chart
   - Confidence intervals (upper/lower bounds)
   - Peak cases and final prediction displayed

5. **Heatmap** (India only):
   - State-wise risk distribution
   - Color-coded by risk level
   - Case counts and risk scores
   - Regional statistics

## 🎨 Features Walkthrough

### Select a Country
- Click the dropdown in the sidebar
- Choose from 15+ countries
- Predictions update automatically

### Read the Risk Assessment
- **High Risk** (Red): Immediate action recommended
- **Medium Risk** (Yellow): Monitor closely
- **Low Risk** (Green): Standard protocols sufficient

### Interpret the Chart
- X-axis: Days into forecast
- Y-axis: Number of cases
- Shaded area: Confidence interval
- Line: Most likely prediction

### Explore India Heatmap
- Each cell = one state/region
- Darker = higher risk
- Hover cells for details
- Summary statistics at bottom

## 🔗 API Endpoints

### Test in Browser or curl

```bash
# Get available countries
curl http://localhost:8000/countries

# Get prediction for India
curl "http://localhost:8000/predict?country=India&forecast_days=30"

# Get India heatmap
curl "http://localhost:8000/heatmap?country=India"

# Get risk assessment
curl "http://localhost:8000/risk-assessment?top_n=5"

# Get statistics
curl http://localhost:8000/statistics

# View interactive API docs
# Visit: http://localhost:8000/docs
```

## ⚙️ Configuration

### Change Backend Port
Edit `backend/main.py` last lines:
```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)  # Change 8000 to 3000
```

### Change Frontend Port
Edit `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Change 5173 to 3000
  }
})
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 8000 is in use: `netstat -an | findstr :8000`
- Install missing dependencies: `pip install -r requirements.txt`
- Verify Python version: `python --version` (need 3.10+)

### Frontend won't start
- Check if port 5173 is in use: `netstat -an | findstr :5173`
- Install dependencies: `npm install`
- Clear cache: `npm run build && npm run dev`

### API requests fail
- Backend must be running first
- Check http://localhost:8000/health returns `{"status": "healthy"}`
- Check CORS is enabled in `backend/main.py`

### No data shows in dashboard
- Ensure backend is running
- Wait 2-3 seconds for data to load
- Check browser console (F12) for errors
- Verify country spelling matches dropdown

## 📁 Important Files

- `backend/main.py` - FastAPI server
- `frontend/src/App.tsx` - Main React component
- `frontend/src/api.ts` - API client functions
- `frontend/src/components/` - React components
- `epidemic_pipeline/` - ML prediction models

## 📚 Documentation

- Full README: `FULLSTACK_README.md`
- API Docs: http://localhost:8000/docs
- Component Documentation: See JSDoc comments in `.tsx` files

## 🚢 Deployment

See `FULLSTACK_README.md` for deployment instructions on:
- Heroku
- Render
- Railway
- Vercel (Frontend)
- Netlify (Frontend)

## 💡 Tips

1. Keep terminal windows open to see logs
2. Frontend hot-reloads on code changes (no restart needed)
3. Backend auto-reloads with `--reload` flag
4. Check API docs at http://localhost:8000/docs for all endpoints
5. Use browser DevTools (F12) for debugging

## 🎓 Learning Resources

- Vite + React: https://vitejs.dev
- FastAPI: https://fastapi.tiangolo.com
- Recharts: https://recharts.org
- TypeScript: https://www.typescriptlang.org

## 📞 Need Help?

- Check the main `FULLSTACK_README.md`
- Look at component prop types in `.tsx` files
- Check backend logs in terminal
- Verify API response in browser Network tab (F12)

---

**Happy forecasting! 📊**
