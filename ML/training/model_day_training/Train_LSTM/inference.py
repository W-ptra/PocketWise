import joblib
import numpy as np
import pandas as pd
from datetime import timedelta

# Load model dan scaler
model_data = joblib.load('model_day_LSTM.pkl')
lstm_model = model_data['regression']
clf = model_data['classification']
scaler = model_data['scaler']

window_size = 7

def create_lstm_sequences(data, window_size):
    """
    Membuat sequences input untuk LSTM dari data 1 dimensi.
    """
    sequences = []
    for i in range(len(data) - window_size):
        seq = data[i:i + window_size]
        sequences.append(seq)
    return np.array(sequences)

def predict_next_week_expense(daily_df, model, scaler, window_size=7):
    recent_expense = daily_df['total_expense'].values[-window_size:]
    normalized_input = scaler.transform(recent_expense.reshape(-1, 1)).flatten()

    predictions = []
    current_input = normalized_input.copy()

    for _ in range(7):  # prediksi 7 hari ke depan
        input_seq = np.array(current_input[-window_size:]).reshape((1, window_size, 1))
        next_pred = model.predict(input_seq, verbose=0)[0][0]
        predictions.append(next_pred)
        current_input = np.append(current_input, next_pred)

    predictions_rescaled = scaler.inverse_transform(np.array(predictions).reshape(-1, 1)).flatten()
    last_date = daily_df['date'].max()
    pred_dates = [last_date + timedelta(days=i+1) for i in range(7)]

    return pd.DataFrame({
        'date': pred_dates,
        'predicted_expense': predictions_rescaled
    })

def generate_classification_data(daily_df, y_pred_rescaled, y_actual_rescaled, threshold=0.35):
    data = []
    for i in range(len(y_pred_rescaled)):
        pred = y_pred_rescaled[i]
        actual = y_actual_rescaled[i]
        diff = actual - pred
        pct = diff / pred if pred != 0 else 0

        if pct > threshold:
            label = 'Boros'
        elif pct < -threshold:
            label = 'Hemat'
        else:
            label = 'Normal'

        idx = i + window_size  # offset window size

        row = {
            'predicted_expense': pred,
            'actual_expense': actual,
            'diff': diff,
            'pct_diff': pct,
            'rolling_7d_mean': daily_df.loc[idx, 'rolling_7d_mean'],
            'weekly_expense': daily_df.loc[idx, 'weekly_expense'],
            'weekly_expense_change_pct': daily_df.loc[idx, 'weekly_expense_change_pct'],
            'weekday': daily_df.loc[idx, 'weekday'],
            'is_weekend': daily_df.loc[idx, 'is_weekend'],
        }
        data.append(row)

    df_cls = pd.DataFrame(data)
    return df_cls

def classify_expense(df_cls, clf):
    feature_cols = ['predicted_expense', 'actual_expense', 'diff', 'pct_diff',
                    'rolling_7d_mean', 'weekly_expense', 'weekly_expense_change_pct',
                    'weekday', 'is_weekend']
    X_cls = df_cls[feature_cols]
    y_pred = clf.predict(X_cls)
    return y_pred

if __name__ == "__main__":
    # Contoh: load daily_df
    daily_df = pd.read_csv('daily_df.csv', parse_dates=['date'])

    # Prediksi minggu depan
    pred_df = predict_next_week_expense(daily_df, lstm_model, scaler, window_size)

    # Buat data klasifikasi berdasarkan prediksi dan aktual (sesuaikan panjang y_actual_rescaled)
    y_actual_rescaled = daily_df['total_expense'].values[window_size:]
    y_pred_rescaled = scaler.inverse_transform(lstm_model.predict(
        create_lstm_sequences(scaler.transform(daily_df['total_expense'].values.reshape(-1,1)).flatten(), window_size).reshape(-1, window_size, 1)
    )).flatten()

    df_cls = generate_classification_data(daily_df, y_pred_rescaled, y_actual_rescaled)

    # Prediksi label klasifikasi (Boros/Hemat/Normal)
    y_cls_pred = classify_expense(df_cls, clf)
    df_cls['predicted_label'] = y_cls_pred

    # Cetak hasil prediksi minggu depan dan klasifikasi
    print("Prediksi pengeluaran minggu depan:")
    print(pred_df)

    print("\nContoh hasil klasifikasi pengeluaran:")
    print(df_cls[['date', 'predicted_expense', 'actual_expense', 'predicted_label']].head())
