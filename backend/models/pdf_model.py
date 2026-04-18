from typing import List

from pydantic import BaseModel, Field


class FeatureItem(BaseModel):
    name: str
    impact: float


class GeneratePdfRequest(BaseModel):
    region: str
    scenario: str
    crop: str
    yield_value: float = Field(alias="yield")
    confidence: float
    temperature: str
    rainfall: str
    co2: str
    features: List[FeatureItem]
    hash: str
