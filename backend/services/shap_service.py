import numpy as np
import shap
from sklearn.linear_model import Ridge


def generate_fake_snp_features(num_genotypes, num_features=10):
    return np.random.rand(num_genotypes, num_features)


def run_shap(genotype_id: str):
    # Simulate dataset
    num_genotypes = 5
    num_features = 10

    X = generate_fake_snp_features(num_genotypes, num_features)
    y = np.random.uniform(2.0, 6.0, num_genotypes)

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    # SHAP explainer
    explainer = shap.Explainer(model, X)
    shap_values = explainer(X)

    # Pick first genotype (demo purpose)
    idx = 0

    feature_importance = []
    for i in range(num_features):
        feature_importance.append({
            "name": f"SNP_{i}",
            "importance_score": float(shap_values.values[idx][i])
        })

    return {
        "features": feature_importance,
        "base_value": float(shap_values.base_values[idx])
    }
