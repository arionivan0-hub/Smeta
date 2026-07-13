import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal, Base
from models import EstimateTemplate

Base.metadata.create_all(bind=engine)

TEMPLATES = [
    {
        "name": "Casa Unifamiliar",
        "description": "Vivienda nueva con acabados completos",
        "category": "residencial",
        "chapters_json": [
            {
                "code": "0", "name": "Trabajos Preliminares", "order": 0,
                "positions": [
                    {"code": "0-001", "description": "Senalizacion y balizamiento", "unit": "ud", "quantity": 1, "unit_price": 350},
                    {"code": "0-003", "description": "Limpieza del terreno", "unit": "m2", "quantity": 200, "unit_price": 6.50},
                ]
            },
            {
                "code": "1", "name": "Demoliciones", "order": 1,
                "positions": [
                    {"code": "1-001", "description": "Demolicion de tabiques (mat + MO)", "unit": "m2", "quantity": 50, "unit_price": 25},
                    {"code": "1-009", "description": "Vaciado de escombros a contenedor (MO)", "unit": "m3", "quantity": 50, "unit_price": 45},
                ]
            },
            {
                "code": "2", "name": "Estructura y Albanileria", "order": 2,
                "positions": [
                    {"code": "2-001", "description": "Tabique de ladrillo hueco (mat + MO)", "unit": "m2", "quantity": 40, "unit_price": 50},
                    {"code": "2-003", "description": "Enfoscado interior satinado (mat + MO)", "unit": "m2", "quantity": 150, "unit_price": 22},
                    {"code": "2-005", "description": "Falso techo de yeso laminado (mat + MO)", "unit": "m2", "quantity": 120, "unit_price": 45},
                    {"code": "2-006", "description": "Solado ceramico (mat + MO)", "unit": "m2", "quantity": 100, "unit_price": 38},
                ]
            },
            {
                "code": "3", "name": "Instalaciones", "order": 3,
                "positions": [
                    {"code": "3-001", "description": "Renovacion completa instalacion electrica (mat + MO)", "unit": "m2", "quantity": 120, "unit_price": 45},
                    {"code": "3-010", "description": "Renovacion fontaneria completa (mat + MO)", "unit": "m2", "quantity": 120, "unit_price": 38},
                    {"code": "3-026", "description": "Caldera de gas (suministro + instalacion)", "unit": "ud", "quantity": 1, "unit_price": 2500},
                    {"code": "3-027", "description": "Radiador de aluminio (suministro + colocacion)", "unit": "ud", "quantity": 8, "unit_price": 380},
                ]
            },
            {
                "code": "4", "name": "Acabados", "order": 4,
                "positions": [
                    {"code": "4-001", "description": "Pintura interior 2 manos (mat + MO)", "unit": "m2", "quantity": 350, "unit_price": 14},
                    {"code": "4-010", "description": "Baldosa ceramica suelo basica (mat + MO)", "unit": "m2", "quantity": 80, "unit_price": 38},
                    {"code": "4-030", "description": "Puerta interior de paso completa (mat + MO)", "unit": "ud", "quantity": 6, "unit_price": 350},
                    {"code": "4-040", "description": "Ventana aluminio doble cristal RPT (mat + MO)", "unit": "m2", "quantity": 25, "unit_price": 280},
                ]
            },
        ]
    },
    {
        "name": "Reforma Integral",
        "description": "Remodelacion completa de vivienda",
        "category": "reforma",
        "chapters_json": [
            {
                "code": "0", "name": "Trabajos Preliminares", "order": 0,
                "positions": [
                    {"code": "0-003", "description": "Limpieza y preparacion del terreno", "unit": "m2", "quantity": 70, "unit_price": 6.50},
                ]
            },
            {
                "code": "1", "name": "Demoliciones", "order": 1,
                "positions": [
                    {"code": "1-001", "description": "Demolicion de tabiques (mat + MO)", "unit": "m2", "quantity": 20, "unit_price": 25},
                    {"code": "1-002", "description": "Retirada de azulejos y revestimientos (MO)", "unit": "m2", "quantity": 30, "unit_price": 16},
                    {"code": "1-003", "description": "Retirada de pavimento (MO)", "unit": "m2", "quantity": 40, "unit_price": 12},
                    {"code": "1-009", "description": "Vaciado de escombros a contenedor (MO)", "unit": "m3", "quantity": 8, "unit_price": 45},
                ]
            },
            {
                "code": "2", "name": "Albanileria", "order": 2,
                "positions": [
                    {"code": "2-002", "description": "Tabique de yeso laminado doble placa (mat + MO)", "unit": "m2", "quantity": 20, "unit_price": 42},
                    {"code": "2-003", "description": "Enfoscado interior satinado (mat + MO)", "unit": "m2", "quantity": 80, "unit_price": 22},
                    {"code": "2-005", "description": "Falso techo de yeso laminado (mat + MO)", "unit": "m2", "quantity": 30, "unit_price": 45},
                ]
            },
            {
                "code": "3", "name": "Instalaciones", "order": 3,
                "positions": [
                    {"code": "3-001", "description": "Renovacion completa instalacion electrica (mat + MO)", "unit": "m2", "quantity": 70, "unit_price": 45},
                    {"code": "3-010", "description": "Renovacion fontaneria completa (mat + MO)", "unit": "m2", "quantity": 70, "unit_price": 38},
                ]
            },
            {
                "code": "4", "name": "Acabados", "order": 4,
                "positions": [
                    {"code": "4-001", "description": "Pintura interior 2 manos (mat + MO)", "unit": "m2", "quantity": 180, "unit_price": 14},
                    {"code": "4-010", "description": "Baldosa ceramica suelo basica (mat + MO)", "unit": "m2", "quantity": 40, "unit_price": 38},
                    {"code": "4-011", "description": "Azulejo ceramico pared basico (mat + MO)", "unit": "m2", "quantity": 30, "unit_price": 40},
                    {"code": "4-020", "description": "Pavimento laminado basico (mat + MO)", "unit": "m2", "quantity": 60, "unit_price": 28},
                    {"code": "4-030", "description": "Puerta interior de paso completa (mat + MO)", "unit": "ud", "quantity": 4, "unit_price": 350},
                ]
            },
        ]
    },
    {
        "name": "Local Comercial",
        "description": "Acondicionamiento de local comercial",
        "category": "comercial",
        "chapters_json": [
            {
                "code": "0", "name": "Trabajos Preliminares", "order": 0,
                "positions": [
                    {"code": "0-003", "description": "Limpieza y preparacion del terreno", "unit": "m2", "quantity": 100, "unit_price": 6.50},
                ]
            },
            {
                "code": "1", "name": "Demoliciones y vaciado", "order": 1,
                "positions": [
                    {"code": "1-001", "description": "Demolicion de tabiques (mat + MO)", "unit": "m2", "quantity": 15, "unit_price": 25},
                    {"code": "1-009", "description": "Vaciado de escombros a contenedor (MO)", "unit": "m3", "quantity": 5, "unit_price": 45},
                ]
            },
            {
                "code": "2", "name": "Estructura y Albanileria", "order": 2,
                "positions": [
                    {"code": "2-002", "description": "Tabique de yeso laminado doble placa (mat + MO)", "unit": "m2", "quantity": 40, "unit_price": 42},
                ]
            },
            {
                "code": "3", "name": "Instalaciones", "order": 3,
                "positions": [
                    {"code": "3-001", "description": "Renovacion completa instalacion electrica (mat + MO)", "unit": "m2", "quantity": 100, "unit_price": 45},
                    {"code": "3-010", "description": "Renovacion fontaneria completa (mat + MO)", "unit": "m2", "quantity": 100, "unit_price": 38},
                ]
            },
            {
                "code": "4", "name": "Acabados", "order": 4,
                "positions": [
                    {"code": "4-001", "description": "Pintura interior 2 manos (mat + MO)", "unit": "m2", "quantity": 200, "unit_price": 14},
                    {"code": "4-010", "description": "Baldosa ceramica suelo basica (mat + MO)", "unit": "m2", "quantity": 50, "unit_price": 38},
                    {"code": "4-040", "description": "Ventana aluminio doble cristal RPT (mat + MO)", "unit": "m2", "quantity": 12, "unit_price": 280},
                ]
            },
        ]
    },
]

db = SessionLocal()
try:
    for tmpl in TEMPLATES:
        existing = db.query(EstimateTemplate).filter(EstimateTemplate.name == tmpl["name"]).first()
        if not existing:
            db.add(EstimateTemplate(**tmpl))
    db.commit()
    print(f"Templates seeded: {len(TEMPLATES)}")
finally:
    db.close()
