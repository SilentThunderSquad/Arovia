# Arovia Chatbot / Disease Prediction

This folder contains the Python scripts used to train a disease prediction model from symptom datasets and to run inference from Node.js.

## Setup (Python)

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate it:

- Windows:
  ```powershell
  .\.venv\Scripts\Activate.ps1
  ```
- macOS/Linux:
  ```bash
  source .venv/bin/activate
  ```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Training the model

Place your CSV files under `chatbot/data/` (the repo already includes the provided datasets).

Then run:

```bash
python train_model.py
```

The script will automatically load all `.csv` files from `chatbot/data/` and train a model.

If you want to specify inputs explicitly:

```bash
python train_model.py --inputs chatbot/data/Healthcare.csv chatbot/data/disease_prediction.csv --label-column Disease
```

This will create:

- `disease_model.pkl` (the trained model bundle)
- `disease_model_features.json` (the ordered feature names used for prediction)

## Running prediction

You can run the prediction script directly:

```bash
echo '{"symptoms": {"fever": 1, "nausea": 0, "fatigue": 1}}' | python predict.py
```

The script outputs JSON containing the predicted disease, possible causes, precautions, and a recommended specialist.

## Integration with Node.js

The Express API endpoint `/predict` calls `predict.py` and returns the prediction plus matching doctors from MongoDB.

Ensure the Python environment is available on the server and the model file exists at `chatbot/disease_model.pkl`.
