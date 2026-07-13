# Contributing to Smeta

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Make your changes
5. Run tests (`cd frontend && npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

```bash
# Clone
git clone https://github.com/your-username/Smeta.git
cd Smeta

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed_catalog.py
python seed_templates.py

# Frontend
cd ../frontend
npm install

# Start development
cd ../backend
uvicorn main:app --reload --port 8000
# In another terminal:
cd frontend && npm run dev
```

## Code Style

- Python: Follow PEP 8
- TypeScript: Use ESLint defaults
- Commit messages: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)

## Testing

```bash
cd frontend
npm test
```

## Areas for Contribution

- [ ] BC3 (FIEBDC-3) export format
- [ ] Verifactu electronic invoicing
- [ ] User authentication
- [ ] Multi-user support
- [ ] Version history
- [ ] More catalog items
- [ ] Docker support
