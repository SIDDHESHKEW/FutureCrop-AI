from pydantic import BaseModel
from typing import List


class ShapFeatureItem(BaseModel):
    name: str
    importance_score: float


class ShapResponse(BaseModel):
    base_value: float
    features: List[ShapFeatureItem]
