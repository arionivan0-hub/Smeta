from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# Position schemas
class PositionBase(BaseModel):
    code: str
    description: str
    unit: str
    quantity: float = 0.0
    unit_price: float = 0.0
    total_price: float = 0.0
    catalog_item_id: Optional[int] = None
    order: int = 0


class PositionCreate(BaseModel):
    code: str
    description: str
    unit: str
    quantity: float = 0.0
    unit_price: float = 0.0
    total_price: float = 0.0
    catalog_item_id: Optional[int] = None
    order: int = 0


class PositionUpdate(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None
    catalog_item_id: Optional[int] = None
    order: Optional[int] = None


class PositionResponse(PositionBase):
    id: int
    chapter_id: int

    class Config:
        from_attributes = True


# Chapter schemas
class ChapterBase(BaseModel):
    code: str
    name: str
    order: int = 0


class ChapterCreate(BaseModel):
    code: str
    name: str
    order: int = 0


class ChapterUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    order: Optional[int] = None


class ChapterResponse(ChapterBase):
    id: int
    estimate_id: int
    positions: List[PositionResponse] = []

    class Config:
        from_attributes = True


# Estimate schemas
class EstimateBase(BaseModel):
    name: str
    project_name: str = ""
    client_name: str = ""
    location: str = ""
    status: str = "draft"
    currency: str = "EUR"


class EstimateCreate(EstimateBase):
    pass


class EstimateUpdate(BaseModel):
    name: Optional[str] = None
    project_name: Optional[str] = None
    client_name: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    currency: Optional[str] = None


class EstimateResponse(EstimateBase):
    id: int
    created_at: datetime
    updated_at: datetime
    chapters: List[ChapterResponse] = []

    class Config:
        from_attributes = True


class EstimateListResponse(BaseModel):
    id: int
    name: str
    project_name: str
    client_name: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Catalog schemas
class CatalogItemBase(BaseModel):
    code: str
    description: str
    unit: str
    category: str
    price: float = 0.0
    source: str = "custom"


class CatalogItemCreate(CatalogItemBase):
    pass


class CatalogItemUpdate(BaseModel):
    description: Optional[str] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    source: Optional[str] = None


class CatalogItemResponse(CatalogItemBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True


# Template schemas
class TemplateBase(BaseModel):
    name: str
    description: str = ""
    category: str = ""


class TemplateCreate(TemplateBase):
    chapters_json: list = []


class TemplateResponse(TemplateBase):
    id: int
    chapters_json: list
    created_at: datetime

    class Config:
        from_attributes = True
