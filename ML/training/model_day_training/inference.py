import joblib
import numpy as np
import pandas as pd
from datetime import datetime

# === Load model bundle ===
models_bundle = joblib.load("model_day.pkl")

regressor = models_bundle["regressor"]
classifier = models_bundle["classifier"]
imputer = models_bundle["imputer"]
scaler = models_bundle["scaler"]
label_encoder = models_bundle["label_encoder"]
metadata = models_bundle["metadata"]

window_size = metadata["window_size"]
forecast_horizon = metadata["forecast_horizon"]
selected_features = metadata["feature_names"]

# === Fungsi untuk ekstrak fitur statistik ===
def extract_stat_features(X_windows):
    stats = []
    for w in X_windows:
        stat_features = []
        for col in range(w.shape[1]):
            stat_features.extend([
                np.mean(w[:, col]),
                np.std(w[:, col]),
                np.max(w[:, col]),
                np.min(w[:, col]),
            ])
        stats.append(stat_features)
    return np.array(stats)

# === Fungsi untuk membuat data window dan melakukan inferensi ===
def predict_from_latest_data(df: pd.DataFrame):
    df = df.copy()
    
    # Pastikan kolom waktu dalam datetime
    df["Date"] = pd.to_datetime(df["Date"])
    df.sort_values("Date", inplace=True)
    df.reset_index(drop=True, inplace=True)

    # Ambil data window terakhir (window_size hari)
    latest_window = df[selected_features].iloc[-window_size:].values
    if latest_window.shape[0] < window_size:
        raise ValueError(f"Data kurang dari {window_size} hari, tidak bisa prediksi.")

    latest_window = latest_window.reshape(1, window_size, len(selected_features))

    # Statistik
    stat_features = extract_stat_features(latest_window)

    # Temporal (mengambil hari, minggu, bulan dari hari terakhir window)
    last_date = df["Date"].iloc[-1]
    temporal = np.array([[last_date.day, last_date.isocalendar()[1], last_date.month]])

    # Flatten window dan gabungkan semua
    window_flat = latest_window.reshape(1, -1)
    full_features = np.hstack([window_flat, stat_features, temporal])

    # Imputasi dan scaling
    full_features = imputer.transform(full_features)
    full_features = scaler.transform(full_features)

    # === Prediksi klasifikasi ===
    class_pred_encoded = classifier.predict(full_features)[0]
    class_pred_label = label_encoder.inverse_transform([class_pred_encoded])[0]

    # === Prediksi pengeluaran (7 hari ke depan) ===
    reg_pred = regressor.predict(full_features).flatten()

    return {
        "klasifikasi": class_pred_label,
        "prediksi_pengeluaran": reg_pred
    }

# === Contoh penggunaan ===
if __name__ == "__main__":
    # Ganti ini dengan path ke file kamu
    data = pd.read_csv("Daily Household Transaction.csv")

    result = predict_from_latest_data(data)

    print("📊 Hasil Prediksi:")
    print(f"Perilaku Finansial: {result['klasifikasi']}")
    print("Prediksi Pengeluaran 7 Hari ke Depan (ter-normalisasi):")
    for i, val in enumerate(result["prediksi_pengeluaran"], 1):
        print(f"Hari ke-{i}: {val:.4f}")
