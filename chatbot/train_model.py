"""Train a disease prediction model from symptom datasets.

This script expects CSV files containing symptom/disease records.
Each row should represent a patient case, with a disease label and binary or categorical symptom columns.

If `--inputs` is not provided, it will attempt to load all `.csv` files under `chatbot/data/`.

Example usage:
    python train_model.py --inputs data1.csv data2.csv data3.csv --label-column disease

Output:
    - `disease_model.pkl` (pickle file containing trained model, label encoder, and feature list)
    - `disease_model_features.json` (list of feature names used by the model)
"""

import argparse
import json
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


def normalize_value(v):
    if pd.isna(v):
        return 0

    if isinstance(v, (int, float)):
        return 1 if v != 0 else 0

    v = str(v).strip().lower()
    if v in {'1', 'yes', 'y', 'true', 't'}:
        return 1
    if v in {'0', 'no', 'n', 'false', 'f', ''}:
        return 0

    # Treat any non-empty string as present symptom
    return 1


def normalize_symptom_name(symptom: str) -> str:
    """Normalize symptom text into a column-friendly name."""
    name = str(symptom).strip().lower()
    name = name.replace('/', ' ').replace('-', ' ').replace('\n', ' ')
    name = ''.join(c if c.isalnum() or c.isspace() else ' ' for c in name)
    name = '_'.join(name.split())
    return name or 'unknown'


def find_label_column(df: pd.DataFrame, preferred: str):
    candidates = [preferred, preferred.lower(), preferred.capitalize(), preferred.upper()]
    candidates += ['disease', 'diseases', 'Disease', 'Diseases', 'label', 'Label']
    for c in candidates:
        if c in df.columns:
            return c
    return None


def expand_symptom_list_column(df: pd.DataFrame, col_name: str):
    """Expand a text column of comma-separated symptoms into binary columns."""
    df[col_name] = df[col_name].fillna('').astype(str)
    symptom_sets = df[col_name].apply(lambda s: {normalize_symptom_name(x) for x in s.split(',') if x.strip()})
    all_symptoms = sorted({sym for s in symptom_sets for sym in s if sym})

    for sym in all_symptoms:
        df[sym] = symptom_sets.apply(lambda s: 1 if sym in s else 0)

    return df, all_symptoms


def load_and_prepare(csv_paths, label_column):
    # Load and combine datasets (keeping one per path)
    dfs = []
    for p in csv_paths:
        df = pd.read_csv(p)

        label_col = find_label_column(df, label_column)
        if not label_col:
            raise ValueError(
                f"Label column '{label_column}' not found in {p}. Available columns: {list(df.columns)}"
            )
        if label_col != label_column:
            df = df.rename(columns={label_col: label_column})

        # Expand a 'Symptoms' / 'symptoms' list column to binary columns
        for sym_col in ['Symptoms', 'symptoms', 'Symptom', 'symptom']:
            if sym_col in df.columns and df[sym_col].dtype == object:
                df, expanded = expand_symptom_list_column(df, sym_col)
                # Drop the original text column after expanding
                df = df.drop(columns=[sym_col])
                break

        # Drop obvious non-symptom columns if present
        for drop_col in ['Patient_ID', 'patient_id', 'Age', 'age', 'Gender', 'gender', 'Symptom_Count', 'symptom_count']:
            if drop_col in df.columns:
                df = df.drop(columns=[drop_col])

        dfs.append(df)

    full = pd.concat(dfs, ignore_index=True, sort=False)

    # Determine feature columns (all except label)
    feature_cols = [c for c in full.columns if c != label_column]

    # Normalize symptom columns to binary 0/1
    for col in feature_cols:
        full[col] = full[col].apply(normalize_value)

    # Fill missing values (including columns missing due to dataset differences)
    full[feature_cols] = full[feature_cols].fillna(0)

    # Drop any rows without a label
    full = full.dropna(subset=[label_column])

    X = full[feature_cols].astype(int)
    y = full[label_column].astype(str).str.strip()

    return X, y, feature_cols


def main():
    parser = argparse.ArgumentParser(description='Train a disease prediction model from symptom datasets.')
    parser.add_argument('--inputs', nargs='*', help='Paths to the CSV files to merge. If omitted, will use chatbot/data/*.csv if available.')
    parser.add_argument('--label-column', default='disease', help='Column name for the disease label.')
    parser.add_argument('--output', default='chatbot/disease_model.pkl', help='Output model filename.')
    parser.add_argument('--features', default='chatbot/disease_model_features.json', help='Output JSON file for feature list.')
    parser.add_argument('--test-size', type=float, default=0.2, help='Fraction of data to use for validation.')
    parser.add_argument('--random-state', type=int, default=42, help='Random state for reproducible training.')
    parser.add_argument('--n-estimators', type=int, default=100, help='Number of trees in the Random Forest.')
    parser.add_argument('--max-depth', type=int, default=16, help='Maximum depth for each tree.')
    parser.add_argument('--max-samples', type=float, default=0.7, help='Fraction of samples to use for each tree (0-1).')
    parser.add_argument('--n-jobs', type=int, default=1, help='Number of parallel jobs for training (1 = single-threaded).')

    args = parser.parse_args()

    if args.inputs and len(args.inputs) > 0:
        csv_paths = [Path(p) for p in args.inputs]
    else:
        # Default to data folder inside chatbot
        data_dir = Path(__file__).resolve().parent / 'data'
        csv_paths = sorted(data_dir.glob('*.csv'))
        if not csv_paths:
            raise RuntimeError('No input files provided and no CSVs found in chatbot/data. Provide input paths with --inputs.')
        print(f"ℹ️ No --inputs provided, using datasets: {[p.name for p in csv_paths]}")

    print('🔁 Loading datasets...')
    X, y, feature_cols = load_and_prepare(csv_paths, args.label_column)

    print(f'✅ Loaded {len(X)} rows with {len(feature_cols)} symptom features.')

    print('🧠 Encoding labels...')
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    print('📊 Splitting into train/validation sets...')
    # Only stratify if every class has at least 2 samples (required by sklearn)
    class_counts = pd.Series(y_encoded).value_counts()
    stratify = y_encoded if (class_counts >= 2).all() else None
    if stratify is None:
        print('⚠️ Stratified split disabled because some classes have only a single sample.')

    X_train, X_val, y_train, y_val = train_test_split(
        X, y_encoded, test_size=args.test_size, random_state=args.random_state, stratify=stratify
    )

    print('🌲 Training Random Forest classifier...')
    model = RandomForestClassifier(
        n_estimators=args.n_estimators,
        max_depth=args.max_depth,
        max_samples=args.max_samples,
        n_jobs=args.n_jobs,
        random_state=args.random_state,
    )
    model.fit(X_train, y_train)

    train_acc = model.score(X_train, y_train)
    val_acc = model.score(X_val, y_val)

    print(f'✅ Training accuracy: {train_acc:.3f} | Validation accuracy: {val_acc:.3f}')

    output_path = Path(args.output)
    print(f'💾 Saving model to {output_path.resolve()}')
    joblib.dump(
        {
            'model': model,
            'label_encoder': label_encoder,
            'features': feature_cols,
        },
        output_path,
    )

    features_path = Path(args.features)
    print(f'💾 Saving feature list to {features_path.resolve()}')
    features_path.write_text(json.dumps(feature_cols, indent=2))

    print('✅ Done. Use `predict.py` to load the model and make predictions.')


if __name__ == '__main__':
    main()
