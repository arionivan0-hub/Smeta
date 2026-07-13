from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Estimate, Chapter, Position
from schemas.estimate import (
    EstimateCreate, EstimateUpdate, EstimateResponse, EstimateListResponse,
    ChapterCreate, ChapterUpdate, ChapterResponse,
    PositionCreate, PositionUpdate, PositionResponse,
)

router = APIRouter(prefix="/api/estimates", tags=["estimates"])


@router.get("/", response_model=List[EstimateListResponse])
def list_estimates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    estimates = db.query(Estimate).offset(skip).limit(limit).all()
    return estimates


@router.post("/", response_model=EstimateResponse)
def create_estimate(estimate: EstimateCreate, db: Session = Depends(get_db)):
    db_estimate = Estimate(**estimate.model_dump())
    db.add(db_estimate)
    db.commit()
    db.refresh(db_estimate)
    return db_estimate


@router.get("/{estimate_id}", response_model=EstimateResponse)
def get_estimate(estimate_id: int, db: Session = Depends(get_db)):
    estimate = db.query(Estimate).filter(Estimate.id == estimate_id).first()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return estimate


@router.put("/{estimate_id}", response_model=EstimateResponse)
def update_estimate(estimate_id: int, update: EstimateUpdate, db: Session = Depends(get_db)):
    estimate = db.query(Estimate).filter(Estimate.id == estimate_id).first()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(estimate, key, value)
    db.commit()
    db.refresh(estimate)
    return estimate


@router.delete("/{estimate_id}")
def delete_estimate(estimate_id: int, db: Session = Depends(get_db)):
    estimate = db.query(Estimate).filter(Estimate.id == estimate_id).first()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    db.delete(estimate)
    db.commit()
    return {"detail": "Estimate deleted"}


# Chapter endpoints
@router.get("/{estimate_id}/chapters", response_model=List[ChapterResponse])
def list_chapters(estimate_id: int, db: Session = Depends(get_db)):
    chapters = db.query(Chapter).filter(Chapter.estimate_id == estimate_id).order_by(Chapter.order).all()
    return chapters


@router.post("/{estimate_id}/chapters", response_model=ChapterResponse)
def create_chapter(estimate_id: int, chapter: ChapterCreate, db: Session = Depends(get_db)):
    db_chapter = Chapter(**chapter.model_dump())
    db_chapter.estimate_id = estimate_id
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter


@router.put("/chapters/{chapter_id}", response_model=ChapterResponse)
def update_chapter(chapter_id: int, update: ChapterUpdate, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(chapter, key, value)
    db.commit()
    db.refresh(chapter)
    return chapter


@router.delete("/chapters/{chapter_id}")
def delete_chapter(chapter_id: int, db: Session = Depends(get_db)):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    db.delete(chapter)
    db.commit()
    return {"detail": "Chapter deleted"}


# Position endpoints
@router.get("/chapters/{chapter_id}/positions", response_model=List[PositionResponse])
def list_positions(chapter_id: int, db: Session = Depends(get_db)):
    positions = db.query(Position).filter(Position.chapter_id == chapter_id).order_by(Position.order).all()
    return positions


@router.post("/chapters/{chapter_id}/positions", response_model=PositionResponse)
def create_position(chapter_id: int, position: PositionCreate, db: Session = Depends(get_db)):
    db_position = Position(**position.model_dump())
    db_position.chapter_id = chapter_id
    db_position.total_price = db_position.quantity * db_position.unit_price
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position


@router.put("/positions/{position_id}", response_model=PositionResponse)
def update_position(position_id: int, update: PositionUpdate, db: Session = Depends(get_db)):
    position = db.query(Position).filter(Position.id == position_id).first()
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(position, key, value)
    if update.quantity is not None or update.unit_price is not None:
        position.total_price = position.quantity * position.unit_price
    db.commit()
    db.refresh(position)
    return position


@router.delete("/positions/{position_id}")
def delete_position(position_id: int, db: Session = Depends(get_db)):
    position = db.query(Position).filter(Position.id == position_id).first()
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    db.delete(position)
    db.commit()
    return {"detail": "Position deleted"}
