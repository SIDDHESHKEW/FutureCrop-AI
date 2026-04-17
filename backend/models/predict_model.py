from pydantic import BaseModel
from typing import List


class PredictRequest(BaseModel):
    region: str
    scenario: str
    genotypes: List[str]


class PredictionItem(BaseModel):
    id: str
    yield_estimate: float
    confidence: float


class PredictResponse(BaseModel):
    predictions: List[PredictionItem]
