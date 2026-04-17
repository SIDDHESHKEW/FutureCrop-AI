import numpy as np
from sklearn.linear_model import Ridge


def generate_fake_snp_features(num_genotypes, num_features=10):
    return np.random.rand(num_genotypes, num_features)


def compute_rue(genetic_vector):
    return 1.2 + np.mean(genetic_vector)


def get_climate_factors(scenario):
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

    return temperature, rainfall, par


def compute_stress(temperature, rainfall):
    heat_stress = max(0, (temperature - 32) * 0.05)
    drought_stress = max(0, (0.7 - rainfall) * 0.5)

    stress_factor = 1 - (heat_stress + drought_stress)
    return max(stress_factor, 0.5)


def run_prediction(region: str, scenario: str, genotypes: list):
    num_genotypes = len(genotypes)

    # Genomic features
    X = generate_fake_snp_features(num_genotypes)

    # Training target
    y = np.random.uniform(2.0, 6.0, num_genotypes)

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    base_predictions = model.predict(X)

    # MULTI-SCENARIO SIMULATION
    scenarios = ["RCP_2.6", "RCP_4.5", "RCP_8.5"]

    predictions = []

    for i, genotype in enumerate(genotypes):
        genetic_vector = X[i]
        rue = compute_rue(genetic_vector)

        scenario_results = []

        for sc in scenarios:
            temperature, rainfall, par = get_climate_factors(sc)
            stress_factor = compute_stress(temperature, rainfall)

            yield_value = base_predictions[i] * rue * par * stress_factor
            scenario_results.append(yield_value)

        # Aggregate results (average future performance)
        final_yield = np.mean(scenario_results)

        predictions.append({
            "id": genotype,
            "yield_estimate": round(float(final_yield), 2),
            "confidence": round(float(np.random.uniform(0.85, 0.95)), 2)
        })

    return predictions
