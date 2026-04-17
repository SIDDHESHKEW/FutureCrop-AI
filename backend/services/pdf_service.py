import os
import re
import tempfile
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def _safe_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_-]+", "_", value.strip())
    return cleaned or "unknown"


def generate_pdf_report(region: str, scenario: str, predictions: list[dict]) -> tuple[str, str]:
    if not predictions:
        raise ValueError("predictions cannot be empty")

    safe_region = _safe_name(region)
    safe_scenario = _safe_name(scenario)
    report_name = f"report_{safe_region}_{safe_scenario}.pdf"
    output_path = os.path.join(tempfile.gettempdir(), report_name)

    best_prediction = max(predictions, key=lambda p: p.get("yield_estimate", 0))

    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    y = height - 60

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, y, "CropOracle Simulation Report")
    y -= 30

    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Region: {region}")
    y -= 18
    c.drawString(50, y, f"Scenario: {scenario}")
    y -= 28

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "Genotype")
    c.drawString(230, y, "Yield")
    c.drawString(340, y, "Confidence")
    y -= 8
    c.line(50, y, 530, y)
    y -= 18

    for item in predictions:
        if y < 80:
            c.showPage()
            y = height - 60
            c.setFont("Helvetica-Bold", 11)
            c.drawString(50, y, "Genotype")
            c.drawString(230, y, "Yield")
            c.drawString(340, y, "Confidence")
            y -= 8
            c.line(50, y, 530, y)
            y -= 18

        genotype_id = str(item.get("id", "-"))
        yield_estimate = float(item.get("yield_estimate", 0))
        confidence = float(item.get("confidence", 0))
        is_best = genotype_id == str(best_prediction.get("id", ""))

        if is_best:
            c.setFillColorRGB(0.9, 1.0, 0.9)
            c.rect(46, y - 4, 488, 16, fill=1, stroke=0)
            c.setFillColorRGB(0, 0, 0)

        c.setFont("Helvetica", 11)
        c.drawString(50, y, genotype_id)
        c.drawString(230, y, f"{yield_estimate:.2f}")
        c.drawString(340, y, f"{confidence:.2f}")
        y -= 18

    y -= 12
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, f"Best genotype: {best_prediction.get('id', '-')}")

    c.save()
    return output_path, report_name
