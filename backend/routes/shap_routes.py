from fastapi import APIRouter

try:
    from backend.controllers.shap_controller import shap_controller
except ModuleNotFoundError:
    from controllers.shap_controller import shap_controller

router = APIRouter()


@router.get("/shap/{genotype_id}")
def get_shap(genotype_id: str):
    return shap_controller(genotype_id)
