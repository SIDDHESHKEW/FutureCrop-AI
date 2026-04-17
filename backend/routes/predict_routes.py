from fastapi import APIRouter

try:
    from backend.models.predict_model import PredictRequest, PredictResponse
    from backend.controllers.predict_controller import predict_controller
except ModuleNotFoundError:
    from models.predict_model import PredictRequest, PredictResponse
    from controllers.predict_controller import predict_controller

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    return predict_controller(request)
