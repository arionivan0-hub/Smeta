from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import io

from database import get_db
from models import Estimate, Chapter, Position
from schemas.estimate import EstimateResponse

router = APIRouter(prefix="/api", tags=["import-export"])


@router.get("/export/{estimate_id}/excel")
def export_excel(estimate_id: int, db: Session = Depends(get_db)):
    from openpyxl import Workbook
    from openpyxl.styles import Font, Alignment, Border, Side, PatternFill

    estimate = db.query(Estimate).filter(Estimate.id == estimate_id).first()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")

    wb = Workbook()
    ws = wb.active
    ws.title = "Presupuesto"

    header_font = Font(bold=True, size=12)
    title_font = Font(bold=True, size=14)
    thin_border = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin"),
    )

    ws.merge_cells("A1:F1")
    ws["A1"] = f"PRESUPUESTO: {estimate.name}"
    ws["A1"].font = title_font

    ws["A2"] = f"Proyecto: {estimate.project_name}"
    ws["A3"] = f"Cliente: {estimate.client_name}"
    ws["A4"] = f"Ubicación: {estimate.location}"
    ws["A5"] = f"Fecha: {datetime.now().strftime('%d/%m/%Y')}"

    headers = ["Código", "Descripción", "Unidad", "Cantidad", "Precio Unitario (€)", "Importe (€)"]
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=7, column=col, value=header)
        cell.font = header_font
        cell.border = thin_border
        cell.fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
        cell.font = Font(bold=True, color="FFFFFF")

    row = 8
    total_general = 0

    for chapter in estimate.chapters:
        ws.merge_cells(f"A{row}:F{row}")
        ws.cell(row=row, column=1, value=f"{chapter.code} - {chapter.name}")
        ws.cell(row=row, column=1).font = Font(bold=True, size=11)
        ws.cell(row=row, column=1).fill = PatternFill(start_color="D9E2F3", end_color="D9E2F3", fill_type="solid")
        for col in range(1, 7):
            ws.cell(row=row, column=col).border = thin_border
        row += 1

        chapter_total = 0
        for position in chapter.positions:
            ws.cell(row=row, column=1, value=position.code).border = thin_border
            ws.cell(row=row, column=2, value=position.description).border = thin_border
            ws.cell(row=row, column=3, value=position.unit).border = thin_border
            ws.cell(row=row, column=4, value=position.quantity).border = thin_border
            ws.cell(row=row, column=5, value=position.unit_price).border = thin_border
            ws.cell(row=row, column=5).number_format = '#,##0.00'
            ws.cell(row=row, column=6, value=position.total_price).border = thin_border
            ws.cell(row=row, column=6).number_format = '#,##0.00'
            chapter_total += position.total_price
            row += 1

        ws.cell(row=row, column=5, value="Total capítulo:").font = Font(bold=True)
        ws.cell(row=row, column=6, value=chapter_total).font = Font(bold=True)
        ws.cell(row=row, column=6).number_format = '#,##0.00'
        total_general += chapter_total
        row += 2

    row += 1
    ws.cell(row=row, column=5, value="TOTAL GENERAL:").font = Font(bold=True, size=12)
    ws.cell(row=row, column=6, value=total_general).font = Font(bold=True, size=12)
    ws.cell(row=row, column=6).number_format = '#,##0.00'

    for col_letter in ['A', 'B', 'C', 'D', 'E', 'F']:
        ws.column_dimensions[col_letter].width = 20

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    filename = f"presupuesto_{estimate.name.replace(' ', '_')}.xlsx"
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/export/{estimate_id}/pdf")
def export_pdf(estimate_id: int, db: Session = Depends(get_db)):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm

    estimate = db.query(Estimate).filter(Estimate.id == estimate_id).first()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")

    output = io.BytesIO()
    doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=2 * cm, leftMargin=2 * cm,
                            topMargin=2 * cm, bottomMargin=2 * cm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(name="Title", parent=styles["Title"], fontSize=16, spaceAfter=12)
    normal_style = ParagraphStyle(name="Normal", parent=styles["Normal"], fontSize=9)
    bold_style = ParagraphStyle(name="Bold", parent=styles["Normal"], fontSize=9, fontName="Helvetica-Bold")

    elements = []

    elements.append(Paragraph(f"PRESUPUESTO: {estimate.name}", title_style))
    elements.append(Paragraph(f"Proyecto: {estimate.project_name}", normal_style))
    elements.append(Paragraph(f"Cliente: {estimate.client_name}", normal_style))
    elements.append(Paragraph(f"Ubicación: {estimate.location}", normal_style))
    elements.append(Paragraph(f"Fecha: {datetime.now().strftime('%d/%m/%Y')}", normal_style))
    elements.append(Spacer(1, 1 * cm))

    table_data = [["Código", "Descripción", "Unidad", "Cant.", "P.U. (€)", "Importe (€)"]]
    total_general = 0

    for chapter in estimate.chapters:
        chapter_total = sum(p.total_price for p in chapter.positions)
        table_data.append([f"{chapter.code} - {chapter.name}", "", "", "", "", f"{chapter_total:,.2f}"])
        for position in chapter.positions:
            table_data.append([
                position.code,
                position.description,
                position.unit,
                f"{position.quantity:,.2f}",
                f"{position.unit_price:,.2f}",
                f"{position.total_price:,.2f}",
            ])
        total_general += chapter_total

    table_data.append(["", "", "", "", "TOTAL GENERAL:", f"{total_general:,.2f}"])

    table = Table(table_data, colWidths=[2.5 * cm, 6 * cm, 1.5 * cm, 1.5 * cm, 2.5 * cm, 2.5 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4472C4")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ALIGN", (3, 0), (-1, -1), "RIGHT"),
        ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#D9E2F3")),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
    ]))

    elements.append(table)
    doc.build(elements)

    output.seek(0)
    filename = f"presupuesto_{estimate.name.replace(' ', '_')}.pdf"
    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.post("/import/excel")
async def import_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    from openpyxl import load_workbook

    content = await file.read()
    wb = load_workbook(io.BytesIO(content), read_only=True)
    ws = wb.active

    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        raise HTTPException(status_code=400, detail="Empty file")

    headers = [str(h).lower() if h else "" for h in rows[0]]
    column_mapping = {}
    for i, h in enumerate(headers):
        if "codigo" in h or "code" in h:
            column_mapping["code"] = i
        elif "descripcion" in h or "description" in h:
            column_mapping["description"] = i
        elif "unidad" in h or "unit" in h:
            column_mapping["unit"] = i
        elif "cantidad" in h or "quantity" in h:
            column_mapping["quantity"] = i
        elif "precio" in h or "price" in h:
            column_mapping["unit_price"] = i

    if "code" not in column_mapping or "description" not in column_mapping:
        raise HTTPException(status_code=400, detail="Could not identify required columns (code, description)")

    preview = []
    for row in rows[1:11]:
        def get_val(key, default=""):
            idx = column_mapping.get(key)
            if idx is not None and idx < len(row):
                return row[idx] or default
            return default

        preview.append({
            "code": str(get_val("code")),
            "description": str(get_val("description")),
            "unit": str(get_val("unit", "ud")),
            "quantity": float(get_val("quantity", 0) or 0),
            "unit_price": float(get_val("unit_price", 0) or 0),
        })

    return {
        "filename": file.filename,
        "total_rows": len(rows) - 1,
        "columns_found": {k: headers[v] for k, v in column_mapping.items()},
        "preview": preview,
    }
