try:
    from backend.services.pdf_service import generate_blueprint_pdf
except ModuleNotFoundError:
    from services.pdf_service import generate_blueprint_pdf


def generate_pdf_controller(request):
    features = [item.model_dump() for item in request.features][:3]
    while len(features) < 3:
        features.append({"name": "N/A", "impact": 0.0})

    recommendation = (
        f"Prioritize {request.crop} in {request.region} under {request.scenario}. "
        "Use heat and drought adaptive genotypes to stabilize yield under projected forcing."
    )

    payload = {
        "region": request.region,
        "scenario": request.scenario,
        "crop": request.crop,
        "yield": request.yield_value,
        "confidence": request.confidence,
        "temperature": request.temperature,
        "rainfall": request.rainfall,
        "co2": request.co2,
        "features": features,
        "recommendation": recommendation,
        "hash": request.hash,
    }
    return generate_blueprint_pdf(payload)
