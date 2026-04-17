from fastapi import APIRouter

try:
    from backend.models.shap_model import ShapResponse
    from backend.controllers.shap_controller import shap_controller
except ModuleNotFoundError:
    from models.shap_model import ShapResponse
    from controllers.shap_controller import shap_controller

router = APIRouter()


@router.get("/shap/{genotype_id}", response_model=ShapResponse)
def get_shap(genotype_id: str):
    print(f"SHAP request received for genotype_id={genotype_id}")
    return shap_controller(genotype_id)
