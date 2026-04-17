try:
    from backend.services.shap_service import get_shap
except ModuleNotFoundError:
    from services.shap_service import get_shap


def shap_controller(genotype_id: str):
    print(f"[SHAP] genotype received: {genotype_id}")
    return get_shap(genotype_id)
