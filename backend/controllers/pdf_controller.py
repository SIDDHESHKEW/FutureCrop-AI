try:
    from backend.services.pdf_service import generate_pdf_report
except ModuleNotFoundError:
    from services.pdf_service import generate_pdf_report


def generate_pdf_controller(request):
    predictions = [p.model_dump() for p in request.predictions]
    shap_summary = [s.model_dump() for s in request.shapSummary]
    return generate_pdf_report(
        region=request.region,
        scenario=request.scenario,
        crop=request.crop,
        predictions=predictions,
        best_genotype=request.bestGenotype,
        shap_summary=shap_summary,
    )
