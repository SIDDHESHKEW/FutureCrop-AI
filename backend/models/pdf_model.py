from pydantic import BaseModel
from typing import List


class PdfPredictionItem(BaseModel):
    id: str
    yield_estimate: float
    confidence: float


class GeneratePdfRequest(BaseModel):
    region: str
    scenario: str
    predictions: List[PdfPredictionItem]
