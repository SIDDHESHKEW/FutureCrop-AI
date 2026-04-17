try:
    from backend.services.pdf_service import generate_pdf_report
except ModuleNotFoundError:
    from services.pdf_service import generate_pdf_report


def generate_pdf_controller(request):
    predictions = [p.model_dump() for p in request.predictions]
    return generate_pdf_report(
        region=request.region,
        scenario=request.scenario,
        predictions=predictions,
    )
