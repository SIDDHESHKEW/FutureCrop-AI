from pydantic import BaseModel, Field
from typing import List


class PdfPredictionItem(BaseModel):
    id: str
    yield_estimate: float
    confidence: float


class PdfShapSummaryItem(BaseModel):
    name: str
    impact: float


class GeneratePdfRequest(BaseModel):
    region: str
    scenario: str
    predictions: List[PdfPredictionItem]
    crop: str = "N/A"
    bestGenotype: str | None = None
    shapSummary: List[PdfShapSummaryItem] = Field(default_factory=list)
