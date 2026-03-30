# Epidemic Spread Prediction - Full Stack Application

A comprehensive data-driven web application for COVID-19 epidemic forecasting and risk assessment with an interactive dashboard.

## Features

✅ **30-Day Prediction Charts** - Line charts showing predicted cases with confidence intervals  
✅ **Risk Assessment** - High/Medium/Low risk scores for each region  
✅ **India Heatmap** - State-wise risk distribution with interactive visualization  
✅ **Country Selection** - Real-time predictions for 15+ countries  
✅ **Global Statistics** - Overview of epidemic metrics worldwide  
✅ **Modern UI** - Responsive design with maroon/coffee color scheme  

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **ML Pipeline**: scikit-learn, pandas, numpy
- **Server**: Uvicorn
- **Data**: Johns Hopkins data + local CSV

### Frontend  
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **Styling**: CSS3 with custom theme

## Project Structure

```
Epidemic_Spread_Prediction/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── requirements.txt         # Python dependencies
│   └── [imported ML pipeline]  # Existing epidemic_pipeline/
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── CountrySelector.tsx
│   │   │   ├── PredictionChart.tsx
│   │   │   ├── RiskScore.tsx
│   │   │   └── Heatmap.tsx
│   │   ├── styles/             # CSS files
│   │   │   ├── Shared.css
│   │   │   ├── Charts.css
│   │   │   ├── RiskScore.css
│   │   │   └── Heatmap.css
│   │   ├── api.ts              # API client
│   │   ├── App.tsx             # Main component
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.ts
├── epidemic_pipeline/          # Existing ML pipeline
├── requirements.txt            # Root requirements
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Step 1: Clone & Navigate
```bash
cd Epidemic_Spread_Prediction
```

### Step 2: Setup Backend

#### Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
pip install -r backend/requirements.txt
```

### Step 3: Setup Frontend

#### Install Node Dependencies
```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Start Backend Server
```bash
cd backend
python main.py

# OR with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: `http://localhost:8000`
API Docs:  `http://localhost:8000/docs`

### Terminal 2 - Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## API Endpoints

### Countries
```http
GET /countries
```
Returns list of available countries

### Predictions
```http
POST /predict?country=India&forecast_days=30&refresh_data=false
```
Get 30-day prediction for a country

### Heatmap
```http
GET /heatmap?country=India
```
Get state-wise heatmap data (India only)

### Risk Assessment
```http
GET /risk-assessment?top_n=10
```
Get risk assessment for top N countries

### Statistics
```http
GET /statistics
```
Get global statistics

## Configuration

### Backend (backend/main.py)
- Default port: `8000`
- CORS enabled for all origins
- Data refresh from Johns Hopkins: Optional

### Frontend (frontend/.env)
Create `.env` file if needed:
```
VITE_API_URL=http://localhost:8000
```

## Usage

1. **Select Country**: Use the sidebar dropdown to select a country
2. **View Predictions**: The 30-day forecast chart updates automatically
3. **Check Risk Level**: See color-coded risk badges (High/Medium/Low)
4. **Review Heatmap**: For India, view state-wide risk distribution
5. **Monitor Metrics**: Track current/predicted cases and growth rates

## Color Scheme

- **Primary Dark**: #561C24 (dark maroon)
- **Primary Mid**: #6D2932 (medium burgundy)
- **Primary Light**: #C7B7A3 (light taupe)
- **Cream**: #E8D8C4 (off-white)
- **Risk High**: #FF6B6B (red)
- **Risk Medium**: #FFD700 (gold)
- **Risk Low**: #90EE90 (light green)

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
python main.py              # Development server with reload
# API docs: http://localhost:8000/docs
```

## Deployment

### Deploy Backend (Render/Railway/Heroku)
```bash
# heroku.yml or Procfile
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Deploy Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy 'dist' folder
```

## Database & Data

- **Local Data**: `time_series_covid19_confirmed_global.csv`
- **Optional Live Data**: Johns Hopkins GitHub
- **Refresh Policy**: Manual via `refresh_data` parameter

## Performance Optimization

- Frontend:
  - Code splitting with Vite
  - Lazy loading of components
  - Memoization of expensive computations

- Backend:
  - Model caching
  - Efficient feature engineering
  - Vectorized operations with NumPy

## Known Limitations

- India heatmap shows synthetic distributed data
- Country list is pre-defined (can be expanded from CSV)
- Predictions use historical 7-day window
- No real-time data updates (manual refresh)

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Database integration (PostgreSQL)
- [ ] User authentication & saved predictions
- [ ] Email alerts for high-risk thresholds
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (LSTM, Prophet)
- [ ] International heatmaps
- [ ] Batch prediction scheduling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Contact & Support

- GitHub: https://github.com/KhushiD16/Epidemic_Spread_Prediction
- Issues: GitHub Issues
- Email: [your-email]

## Changelog

### v1.0.0 (Current)
- ✅ Initial full-stack release
- ✅ FastAPI backend implementation
- ✅ React TypeScript frontend
- ✅ Interactive charts with Recharts
- ✅ India state-wise heatmap
- ✅ Risk assessment system
