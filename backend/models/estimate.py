from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Estimate(Base):
    __tablename__ = "estimates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    project_name = Column(String, default="")
    client_name = Column(String, default="")
    location = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String, default="draft")  # draft, active, archived
    currency = Column(String, default="EUR")

    chapters = relationship("Chapter", back_populates="estimate", cascade="all, delete-orphan")


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    estimate_id = Column(Integer, ForeignKey("estimates.id"), nullable=False)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    order = Column(Integer, default=0)

    estimate = relationship("Estimate", back_populates="chapters")
    positions = relationship("Position", back_populates="chapter", cascade="all, delete-orphan")


class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    code = Column(String, nullable=False)
    description = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    quantity = Column(Float, default=0.0)
    unit_price = Column(Float, default=0.0)
    total_price = Column(Float, default=0.0)
    catalog_item_id = Column(Integer, ForeignKey("catalog_items.id"), nullable=True)
    order = Column(Integer, default=0)

    chapter = relationship("Chapter", back_populates="positions")
    catalog_item = relationship("CatalogItem", back_populates="positions")


class CatalogItem(Base):
    __tablename__ = "catalog_items"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, default=0.0)
    source = Column(String, default="custom")
    last_updated = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)

    positions = relationship("Position", back_populates="catalog_item")


class EstimateTemplate(Base):
    __tablename__ = "estimate_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    category = Column(String, default="")
    chapters_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
