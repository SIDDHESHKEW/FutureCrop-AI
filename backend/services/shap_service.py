import numpy as np
from sklearn.linear_model import Ridge

try:
    import shap
except ModuleNotFoundError:
    shap = None


def generate_fake_snp_features(num_genotypes, num_features=10):
    return np.random.rand(num_genotypes, num_features)


def get_shap(genotype_id: str):
    print(f"Running SHAP for genotype_id={genotype_id}")

    # Simulate dataset
    num_genotypes = 5
    num_features = 10
    seed = sum(ord(c) for c in genotype_id)
    rng = np.random.default_rng(seed)

    X = rng.random((num_genotypes, num_features))
    y = rng.uniform(2.0, 6.0, num_genotypes)

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    # Deterministically map incoming genotype_id to a sample row.
    idx = seed % num_genotypes

    if shap is not None:
        explainer = shap.Explainer(model, X)
        shap_values = explainer(X)

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

    # Fallback when shap package is not installed.
    coeff = model.coef_
    centered = X[idx] - np.mean(X, axis=0)
    pseudo_contrib = coeff * centered

    feature_importance = []
    for i in range(num_features):
        feature_importance.append({
            "name": f"SNP_{i}",
            "importance_score": float(pseudo_contrib[i])
        })

    base_value = float(model.intercept_ + np.dot(np.mean(X, axis=0), coeff))

    return {
        "features": feature_importance,
        "base_value": base_value
    }


def run_shap(genotype_id: str):
    return get_shap(genotype_id)
