from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import EstimateTemplate, Estimate, Chapter, Position
from schemas.estimate import TemplateCreate, TemplateResponse

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("/", response_model=List[TemplateResponse])
def list_templates(db: Session = Depends(get_db)):
    return db.query(EstimateTemplate).all()


@router.get("/{template_id}", response_model=TemplateResponse)
def get_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(EstimateTemplate).filter(EstimateTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.post("/", response_model=TemplateResponse)
def create_template(template: TemplateCreate, db: Session = Depends(get_db)):
    db_template = EstimateTemplate(**template.model_dump())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


@router.delete("/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(EstimateTemplate).filter(EstimateTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    db.delete(template)
    db.commit()
    return {"detail": "Template deleted"}


@router.post("/{template_id}/apply")
def apply_template(template_id: int, name: str, db: Session = Depends(get_db)):
    template = db.query(EstimateTemplate).filter(EstimateTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    estimate = Estimate(name=name, project_name=name)
    db.add(estimate)
    db.flush()

    for ch_data in template.chapters_json:
        chapter = Chapter(
            estimate_id=estimate.id,
            code=ch_data.get("code", ""),
            name=ch_data.get("name", ""),
            order=ch_data.get("order", 0),
        )
        db.add(chapter)
        db.flush()

        for pos_data in ch_data.get("positions", []):
            position = Position(
                chapter_id=chapter.id,
                code=pos_data.get("code", ""),
                description=pos_data.get("description", ""),
                unit=pos_data.get("unit", "ud"),
                quantity=pos_data.get("quantity", 0),
                unit_price=pos_data.get("unit_price", 0),
                total_price=pos_data.get("quantity", 0) * pos_data.get("unit_price", 0),
            )
            db.add(position)

    db.commit()
    db.refresh(estimate)
    return {"detail": "Template applied", "estimate_id": estimate.id}
