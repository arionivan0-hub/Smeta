from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import CatalogItem
from schemas.estimate import CatalogItemCreate, CatalogItemUpdate, CatalogItemResponse

router = APIRouter(prefix="/api/catalog", tags=["catalog"])

CATEGORIES = {
    "0": "Trabajos Preliminares",
    "1": "Demoliciones",
    "2": "Albañilería",
    "3": "Instalaciones",
    "4": "Acabados",
    "5": "Baño",
    "6": "Cocina",
    "7": "Mano de Obra",
    "8": "Maquinaria",
    "9": "Gastos Generales",
    "11": "Material Eléctrico",
    "12": "Material Fontanería",
    "13": "Material de Obra",
    "14": "Material Pintura",
    "15": "Material Cerámica",
}


@router.get("/", response_model=List[CatalogItemResponse])
def list_catalog(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 500,
    db: Session = Depends(get_db),
):
    query = db.query(CatalogItem)
    if category:
        query = query.filter(CatalogItem.category == category)
    if search:
        query = query.filter(
            CatalogItem.description.ilike(f"%{search}%") |
            CatalogItem.code.ilike(f"%{search}%")
        )
    return query.offset(skip).limit(limit).all()


@router.get("/search", response_model=List[CatalogItemResponse])
def search_catalog(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    items = db.query(CatalogItem).filter(
        CatalogItem.description.ilike(f"%{q}%") |
        CatalogItem.code.ilike(f"%{q}%")
    ).limit(20).all()
    return items


@router.get("/categories")
def list_categories():
    return CATEGORIES


@router.get("/{item_id}", response_model=CatalogItemResponse)
def get_catalog_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Catalog item not found")
    return item


@router.post("/", response_model=CatalogItemResponse)
def create_catalog_item(item: CatalogItemCreate, db: Session = Depends(get_db)):
    existing = db.query(CatalogItem).filter(CatalogItem.code == item.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Item with this code already exists")
    db_item = CatalogItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.put("/{item_id}", response_model=CatalogItemResponse)
def update_catalog_item(item_id: int, update: CatalogItemUpdate, db: Session = Depends(get_db)):
    item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Catalog item not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    item.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_catalog_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Catalog item not found")
    db.delete(item)
    db.commit()
    return {"detail": "Catalog item deleted"}


@router.post("/bulk", response_model=List[CatalogItemResponse])
def bulk_create_catalog(items: List[CatalogItemCreate], db: Session = Depends(get_db)):
    created = []
    for item in items:
        existing = db.query(CatalogItem).filter(CatalogItem.code == item.code).first()
        if not existing:
            db_item = CatalogItem(**item.model_dump())
            db.add(db_item)
            created.append(db_item)
    db.commit()
    for item in created:
        db.refresh(item)
    return created
