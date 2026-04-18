import numpy as np
from sklearn.linear_model import Ridge


def generate_fake_snp_features(num_genotypes, num_features=10):
    return np.random.rand(num_genotypes, num_features)


def compute_rue(genetic_vector):
    return 1.2 + np.mean(genetic_vector)


def normalize_soil(soil: str | None) -> str:
    if not soil:
        return "default"
    return soil.strip().lower()


def get_soil_adjustments(soil: str | None):
    normalized = normalize_soil(soil)

    # Values are tuned for simulation behavior, not agronomic calibration.
    if any(token in normalized for token in ["black", "clay", "loam", "alluvial"]):
        return -0.3, 0.08, 0.03
    if any(token in normalized for token in ["sandy", "sand", "laterite", "gravel"]):
        return 0.2, -0.1, -0.03
    if any(token in normalized for token in ["saline", "alkaline", "acidic", "rocky"]):
        return 0.4, -0.12, -0.05

    return 0.0, 0.0, 0.0


def get_climate_factors(scenario, soil: str | None = None):
    if "8.5" in scenario:
        temperature = 38
        rainfall = 0.4
        par = 0.8
    elif "4.5" in scenario:
        temperature = 34
        rainfall = 0.6
        par = 0.9
    else:
        temperature = 30
        rainfall = 0.8
        par = 1.0

    temp_delta, rainfall_delta, par_delta = get_soil_adjustments(soil)
    temperature += temp_delta
    rainfall = min(max(rainfall + rainfall_delta, 0.2), 1.2)
    par = min(max(par + par_delta, 0.6), 1.1)

    return temperature, rainfall, par


def compute_stress(temperature, rainfall):
    heat_stress = max(0, (temperature - 32) * 0.05)
    drought_stress = max(0, (0.7 - rainfall) * 0.5)
    return max(1 - (heat_stress + drought_stress), 0.5)


def run_prediction(region: str, scenario: str, genotypes: list, soil: str | None = None):
    num_genotypes = len(genotypes)

    # Genomic features
    X = generate_fake_snp_features(num_genotypes)

    # Simulated training data
    y = np.random.uniform(2.0, 6.0, num_genotypes)

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    base_predictions = model.predict(X)

    # USE ACTUAL SCENARIO FROM REQUEST
    temperature, rainfall, par = get_climate_factors(scenario, soil)
    stress_factor = compute_stress(temperature, rainfall)

    predictions = []

    for i, genotype in enumerate(genotypes):
        genetic_vector = X[i]
        rue = compute_rue(genetic_vector)

        final_yield = base_predictions[i] * rue * par * stress_factor

        predictions.append({
            "id": genotype,
            "yield_estimate": round(float(final_yield), 2),
            "confidence": round(float(np.random.uniform(0.85, 0.95)), 2)
        })

    return predictions
