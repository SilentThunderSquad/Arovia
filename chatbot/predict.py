"""Load a trained disease model and predict based on a symptom vector.

The script reads a JSON object from STDIN with shape:
    { "symptoms": { "fever": 1, "cough": 0, ... } }

It prints a JSON object to STDOUT with keys:
    disease, causes, precautions, specialist

Example:
    echo '{"symptoms": {"fever": 1, "cough": 0}}' | python predict.py
"""

import json
import sys
from pathlib import Path

import joblib

MODEL_PATH = Path(__file__).resolve().parent / 'disease_model.pkl'

# Mapping of diseases to basic advice and specialist
DISEASE_INFO = {
    'Common Cold': {
        'causes': ['Viral infection (rhinovirus)', 'Weak immune response'],
        'precautions': ['Rest well', 'Drink plenty of fluids', 'Use saline nasal sprays'],
        'specialist': 'General Physician',
    },
    'Flu': {
        'causes': ['Influenza virus infection'],
        'precautions': ['Stay hydrated', 'Take rest', 'Use fever reducers'],
        'specialist': 'General Physician',
    },
    'Migraine': {
        'causes': ['Genetics', 'Stress', 'Hormonal changes'],
        'precautions': ['Reduce screen time', 'Stay hydrated', 'Practice relaxation'],
        'specialist': 'Neurologist',
    },
    'Gastritis': {
        'causes': ['Stomach lining inflammation', 'Spicy food', 'Stress'],
        'precautions': ['Avoid irritants', 'Eat small meals', 'Stay hydrated'],
        'specialist': 'Gastroenterologist',
    },
    'Asthma': {
        'causes': ['Airway inflammation', 'Allergens', 'Exercise'],
        'precautions': ['Avoid triggers', 'Use inhaler as prescribed', 'Monitor air quality'],
        'specialist': 'Pulmonologist',
    },
    'Chest Pain': {
        'causes': ['Muscle strain', 'Heart related issues', 'Acid reflux'],
        'precautions': ['Rest', 'Avoid heavy lifting', 'Seek immediate help if severe'],
        'specialist': 'Cardiologist',
    },
    'Skin Rash': {
        'causes': ['Allergic reaction', 'Infection', 'Dry skin'],
        'precautions': ['Avoid irritants', 'Use gentle cleansers', 'Moisturize regularly'],
        'specialist': 'Dermatologist',
    },
}


def load_input():
    raw = sys.stdin.read().strip()
    if not raw:
        raise ValueError('No input received. Provide JSON via stdin.')
    payload = json.loads(raw)
    if 'symptoms' not in payload or not isinstance(payload['symptoms'], dict):
        raise ValueError('Payload must include a "symptoms" object.')
    return payload['symptoms']


def main():
    symptoms = load_input()

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f'Model not found at {MODEL_PATH}. Run train_model.py first.')

    bundle = joblib.load(MODEL_PATH)
    model = bundle.get('model')
    label_encoder = bundle.get('label_encoder')
    features = bundle.get('features')

    # Build feature vector in correct order
    features = list(features or [])
    vector = [int(bool(symptoms.get(f, 0))) for f in features]

    pred_idx = model.predict([vector])[0]
    disease = label_encoder.inverse_transform([pred_idx])[0]

    info = DISEASE_INFO.get(disease, {})

    output = {
        'disease': disease,
        'causes': info.get('causes', ['Not enough data to infer causes.']),
        'precautions': info.get('precautions', ['Please consult a specialist.']),
        'specialist': info.get('specialist', 'General Physician'),
    }

    sys.stdout.write(json.dumps(output))


if __name__ == '__main__':
    main()
