import random


def run_prediction(region: str, scenario: str, genotypes: list):
    predictions = []

    for genotype in genotypes:
        base_yield = random.uniform(2.0, 6.0)

        if "8.5" in scenario:
            climate_factor = 0.7
        elif "4.5" in scenario:
            climate_factor = 0.85
        else:
            climate_factor = 1.0

        final_yield = base_yield * climate_factor

        predictions.append({
            "id": genotype,
            "yield_estimate": round(final_yield, 2),
            "confidence": round(random.uniform(0.75, 0.95), 2)
        })

    return predictions
