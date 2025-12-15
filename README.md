# Weather API

A weather forecast API built with Express, TypeScript, PostgreSQL, and Knex.

## Requirements

- Node.js >= 18
- PostgreSQL
- Yarn
- **OpenWeatherMap One Call API 3.0** (requires One Call API 3.0 subscription but there's free daily limit)

## Setup

```bash
# Copy environment file and add your API key
cp .env.example .env

# Edit `.env` with your values:
OPENWEATHER_API_KEY=your_api_key_here

# Start development server
docker compose up
```

## API Endpoints

### GET /forecast

Get 3-day forecast or retrieve saved forecast.

```bash
# Get forecast from API
curl "http://localhost:3000/forecast?city=fresno&state=california"

# Get saved forecast by date
curl "http://localhost:3000/forecast?city=fresno&state=california&date=1702598400000"
```

### POST /forecast

Save a forecast to the database.

```bash
curl -X POST "http://localhost:3000/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 36.7378,
    "long": -119.7871,
    "date": "1702598400000",
    "location": ["Fresno", "California"],
    "tempFarenheit": 55,
    "tempCelsius": 13,
    "humidity": 65,
    "windSpeed": 8,
    "dailySummary": "scattered clouds"
  }'
```
