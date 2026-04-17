from backend.services.predict_service import run_prediction


def predict_controller(request):
    result = run_prediction(
        region=request.region,
        scenario=request.scenario,
        genotypes=request.genotypes
    )

    return {"predictions": result}
