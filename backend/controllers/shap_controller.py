from services.shap_service import run_shap


def shap_controller(genotype_id: str):
    return run_shap(genotype_id)
