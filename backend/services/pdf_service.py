import os
import re
import tempfile
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def _safe_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_-]+", "_", value.strip())
    return cleaned or "unknown"


def generate_pdf_report(
    region: str,
    scenario: str,
    crop: str,
    predictions: list[dict],
    best_genotype: str | None,
    shap_summary: list[dict],
) -> tuple[str, str]:
    if not predictions:
        raise ValueError("predictions cannot be empty")

    safe_region = _safe_name(region)
    safe_scenario = _safe_name(scenario)
    report_name = f"blueprint_{safe_region}_{safe_scenario}.pdf"
    output_path = os.path.join(tempfile.gettempdir(), report_name)

    best_prediction = max(predictions, key=lambda p: p.get("yield_estimate", 0))

    resolved_best_id = best_genotype or str(best_prediction.get("id", "-"))
    selected_prediction = next(
        (p for p in predictions if str(p.get("id", "")) == resolved_best_id),
        best_prediction,
    )

    yield_value = float(selected_prediction.get("yield_estimate", 0))
    confidence_value = float(selected_prediction.get("confidence", 0))

    styles = getSampleStyleSheet()
    heading = styles["Heading3"]
    body = styles["BodyText"]
    title = styles["Title"]

    story = [
        Paragraph("CropOracle Simulation Report", title),
        Spacer(1, 14),
        Paragraph("A. Input Details", heading),
        Spacer(1, 6),
        Paragraph(f"<b>Region:</b> {region}", body),
        Paragraph(f"<b>Scenario:</b> {scenario}", body),
        Paragraph(f"<b>Crop:</b> {crop}", body),
        Spacer(1, 14),
        Paragraph("B. Results", heading),
        Spacer(1, 6),
        Paragraph(f"<b>Best Crop:</b> {resolved_best_id}", body),
        Paragraph(f"<b>Yield:</b> {yield_value:.2f}", body),
        Paragraph(f"<b>Confidence:</b> {confidence_value:.2f}", body),
        Spacer(1, 14),
        Paragraph("C. AI Insights", heading),
        Spacer(1, 6),
        Paragraph("<b>Top factors:</b>", body),
    ]

    if shap_summary:
        for factor in shap_summary:
            name = str(factor.get("name", "Unknown"))
            impact = float(factor.get("impact", 0))
            story.append(Paragraph(f"{name} ({impact:+.2f})", body))
    else:
        story.append(Paragraph("No AI insight factors provided.", body))

    story.extend(
        [
            Spacer(1, 14),
            Paragraph("D. Recommendation", heading),
            Spacer(1, 6),
            Paragraph(
                "This crop is recommended due to strong resilience under selected climate conditions.",
                body,
            ),
            Spacer(1, 24),
            Paragraph("Verified by FarmerCrop AI", body),
        ]
    )

    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50)
    doc.build(story)
    return output_path, report_name
