from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from models import CompanySettings

router = APIRouter(prefix="/api/settings", tags=["settings"])


class CompanySettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    nif: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None


class CompanySettingsResponse(BaseModel):
    id: int
    company_name: str
    nif: str
    address: str
    phone: str
    email: str
    website: str

    class Config:
        from_attributes = True


@router.get("/company", response_model=CompanySettingsResponse)
def get_company_settings(db: Session = Depends(get_db)):
    settings = db.query(CompanySettings).first()
    if not settings:
        settings = CompanySettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.put("/company", response_model=CompanySettingsResponse)
def update_company_settings(update: CompanySettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(CompanySettings).first()
    if not settings:
        settings = CompanySettings()
        db.add(settings)

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)
    return settings
