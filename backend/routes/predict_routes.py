from fastapi import APIRouter
from backend.models.predict_model import PredictRequest, PredictResponse
from backend.controllers.predict_controller import predict_controller

router = APIRouter()


@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    return predict_controller(request)
