from pydantic import BaseModel
from typing import List


class PredictRequest(BaseModel):
    region: str
    scenario: str
    soil: str | None = None
    genotypes: List[str]


class PredictionItem(BaseModel):
    id: str
    yield_estimate: float
    confidence: float


class PredictResponse(BaseModel):
    predictions: List[PredictionItem]
