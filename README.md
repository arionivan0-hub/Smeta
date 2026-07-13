# Smeta

Professional construction budget tool for Spain. Create, manage and export construction estimates following Spanish standards (PG-3 / RD 356/2019).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-green.svg)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)

## Features

- **228 catalog items** with real Spanish market prices (materials, labor, equipment)
- **3 estimate templates**: Casa Unifamiliar, Reforma Integral, Local Comercial
- **Inline editing** with real-time totals
- **PDF and Excel export**
- **Multi-language interface** (Spanish / Russian / English)
- **Collapsible sidebar** with responsive layout
- **Error logging** to files
- **27 automated tests**

## Quick Start

### Windows

Double-click `Smeta.bat` (production) or `start.bat` (development).

First run auto-installs dependencies and seeds the catalog.

### Manual

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python seed_catalog.py
python seed_templates.py

# Frontend
cd frontend
npm install
npm run build  # for production
npm run dev    # for development

# Start
cd backend
uvicorn main:app --reload --port 8000
```

Open `http://localhost:8000` (production) or `http://localhost:5173` (development).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend | Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2 |
| Database | SQLite (zero config) |
| Export | ReportLab (PDF), openpyxl (Excel) |
| i18n | react-i18next (ES/RU/EN) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/estimates/` | List estimates |
| POST | `/api/estimates/` | Create estimate |
| GET | `/api/estimates/{id}` | Get estimate with chapters and positions |
| PUT | `/api/estimates/{id}` | Update estimate |
| DELETE | `/api/estimates/{id}` | Delete estimate |
| POST | `/api/estimates/{id}/chapters` | Add chapter |
| POST | `/api/estimates/chapters/{id}/positions` | Add position |
| GET | `/api/catalog/` | List catalog items |
| GET | `/api/catalog/search?q=` | Search catalog |
| GET | `/api/templates/` | List templates |
| POST | `/api/templates/{id}/apply` | Apply template |
| GET | `/api/export/{id}/pdf` | Export as PDF |
| GET | `/api/export/{id}/excel` | Export as Excel |
| GET | `/api/logs` | View application logs |

## Project Structure

```
Smeta/
├── backend/
│   ├── main.py              # FastAPI app + static file serving
│   ├── database.py          # SQLAlchemy setup
│   ├── models/              # Database models
│   ├── routers/             # API routes
│   ├── schemas/             # Pydantic schemas
│   ├── seed_catalog.py      # Catalog seeder (228 items)
│   └── seed_templates.py    # Template seeder (3 templates)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   ├── services/        # API client
│   │   ├── i18n/            # Translations (ES/RU/EN)
│   │   └── types/           # TypeScript types
│   └── dist/                # Production build
├── logs/                    # Application logs
├── start.bat                # Development launcher
├── Smeta.bat                # Production launcher
└── data/                    # Initial catalog data
```

## Spanish Standards

The catalog follows PG-3 (Presupuesto General de la Construcción) structure:

| Group | Name | Items |
|-------|------|-------|
| 0 | Trabajos Preliminares | 9 |
| 1 | Demoliciones | 9 |
| 2 | Albañilería | 9 |
| 3 | Instalaciones | 17 |
| 4 | Acabados | 25 |
| 5 | Baño | 11 |
| 6 | Cocina | 12 |
| 7 | Mano de Obra | 29 |
| 8 | Maquinaria | 10 |
| 9 | Gastos Generales | 4 |
| 11-15 | Materiales | 93 |

## Development

```bash
# Run tests
cd frontend && npm test

# Build for production
cd frontend && npm run build

# View logs
cat logs/smeta.log
cat logs/errors.log
```

## License

MIT License - see [LICENSE](LICENSE) for details.
