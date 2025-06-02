```python
import joblib
import pandas as pd
import numpy as np

# Load model bundle
bundle = joblib.load("model_bundle.pkl")

model_pred = bundle["model_prediksi"]
model_clf = bundle["model_klasifikasi"]
scaler = bundle["scaler"]
imputer = bundle["imputer"]
label_encoder = bundle["label_encoder"]
metadata = bundle["metadata"]

# Parameters
window_size = metadata["window_size"]
forecast_horizon = metadata["forecast_horizon"]

# Load data terbaru
df = pd.read_csv("daily_expense.csv", parse_dates=["Date"])
df.sort_values("Date", inplace=True)

# Pastikan jumlah data mencukupi
if len(df) < window_size:
    raise ValueError("Data terlalu sedikit untuk membentuk window.")

# Ambil window terakhir
selected_features = metadata["selected_features"]
window = df[selected_features].iloc[-window_size:].values

# Preprocessing
window_flat = window.reshape(1, -1)
window_flat = imputer.transform(window_flat)
window_flat = scaler.transform(window_flat)

# Prediksi regresi (pengeluaran 7 hari ke depan)
predicted_expenses = model_pred.predict(window_flat)

# Prediksi klasifikasi perilaku (hemat/boros/balance)
avg_last14 = df["Normalized_Expense"].iloc[-window_size:].mean()
avg_pred7 = predicted_expenses.mean()
ratio = avg_pred7 / avg_last14

if ratio > 1.1:
    label = "Boros"
elif ratio < 0.9:
    label = "Hemat"
else:
    label = "Balance"

# Alternatif (gunakan model klasifikasi langsung jika input-nya tersedia)
# X_window_clf = <ekstrak fitur window untuk klasifikasi>
# pred_class = model_clf.predict(X_window_clf)
# label = label_encoder.inverse_transform(pred_class)[0]

# Output
print("📈 Prediksi Pengeluaran 7 Hari ke Depan:")
print(np.round(predicted_expenses.flatten(), 2))

print("\n📊 Klasifikasi Perilaku:")
print(label)
