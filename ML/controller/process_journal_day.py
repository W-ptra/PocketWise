import pandas as pd
import numpy as np
from flask import request,jsonify

TIME_CATEGORY_TO_DAY = {
    "week": 7,
    "month": 30,
    "year": 365
}

MINIMUM_DATA_ENTRY = 7

def predict_expense_controller(days, journal_entry, model, scaler_expense, scaler_weekday, scaler_day, scaler_month, scaler_flag):
    try:
        daily_expense = pd.DataFrame(journal_entry)

        daily_expense['has_expense'] = (daily_expense['Total_Expense'] > 0).astype(int)
        daily_expense['Date'] = pd.to_datetime(daily_expense['Date'])
        daily_expense['weekday'] = daily_expense['Date'].dt.weekday
        daily_expense['is_weekend'] = daily_expense['weekday'].isin([5, 6]).astype(int)
        daily_expense['day_of_month'] = daily_expense['Date'].dt.day
        daily_expense['month'] = daily_expense['Date'].dt.month
        holidays = pd.to_datetime(['2024-01-01', '2024-12-25'])
        daily_expense['is_holiday'] = daily_expense['Date'].isin(holidays).astype(int)

        daily_expense['weekday_scaled'] = scaler_weekday.transform(daily_expense[['weekday']])
        daily_expense['day_of_month_scaled'] = scaler_day.transform(daily_expense[['day_of_month']])
        daily_expense['month_scaled'] = scaler_month.transform(daily_expense[['month']])
        daily_expense['Total_Expense_scaled'] = scaler_expense.transform(daily_expense[['Total_Expense']])
        daily_expense['has_expense_scaled'] = scaler_flag.transform(daily_expense[['has_expense']])

        daily_expense['lag_1'] = daily_expense['Total_Expense_scaled'].shift(1).fillna(0)
        daily_expense['lag_2'] = daily_expense['Total_Expense_scaled'].shift(2).fillna(0)
        daily_expense['lag_3'] = daily_expense['Total_Expense_scaled'].shift(3).fillna(0)
        daily_expense['ma_3'] = daily_expense['Total_Expense_scaled'].rolling(window=3).mean().fillna(0)

        features = [
            'Total_Expense_scaled', 'has_expense_scaled', 'weekday_scaled',
            'is_weekend', 'day_of_month_scaled', 'month_scaled', 'is_holiday',
            'lag_1', 'lag_2', 'lag_3', 'ma_3'
        ]

        window_size = MINIMUM_DATA_ENTRY

        if len(daily_expense) < window_size:
            return jsonify({'error': f'At least {window_size} records are required'}), 400

        X_data = daily_expense[features].values.tolist()
        predictions_scaled = []

        for _ in range(days):  # predict for 7 future days
            X_input = np.array(X_data[-window_size:]).reshape(1, window_size, -1)
            pred_scaled = model.predict(X_input)[0][0]
            predictions_scaled.append(pred_scaled)

            last_row = X_data[-1]

            new_total_scaled = pred_scaled
            new_has_expense_scaled = scaler_flag.transform([[1 if pred_scaled > 0 else 0]])[0][0]
            new_lag_1 = last_row[0]
            new_lag_2 = X_data[-2][0]
            new_lag_3 = X_data[-3][0]
            new_ma_3 = np.mean([new_lag_1, new_lag_2, new_lag_3])

            new_row = [
                new_total_scaled,
                new_has_expense_scaled,
                last_row[2],  # weekday_scaled (optional: bisa kamu update sesuai hari ke depan)
                last_row[3],  # is_weekend
                last_row[4],  # day_of_month_scaled
                last_row[5],  # month_scaled
                last_row[6],  # is_holiday
                new_lag_1, new_lag_2, new_lag_3, new_ma_3
            ]
            X_data.append(new_row)

        predictions_real = scaler_expense.inverse_transform(np.array(predictions_scaled).reshape(-1, 1)).flatten().tolist()
        formatted_preds = [f"Hari ke-{i+1}: Rp {val:,.0f}" for i, val in enumerate(predictions_real)]

        return jsonify({
            'predicted_expense_next_7_days': formatted_preds,
            'raw_values': [round(val, 2) for val in predictions_real],
            'message': 'Berikut prediksi total pengeluaran selama 7 hari ke depan. Gunakan ini untuk merencanakan anggaran harian Anda.'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_journal_day(model_day, scaler_expense, scaler_weekday, scaler_day, scaler_month, scaler_flag):
    time = request.args.get('time')

    if not time:
        return jsonify({'error': 'time is required'}), 400

    time = time.strip().lower()

    if time not in TIME_CATEGORY_TO_DAY:
        return jsonify({'error': 'time must be either week, month, or year'}), 400

    day = TIME_CATEGORY_TO_DAY[time]

    journal_entry = request.json.get('journal_entry')
    if not journal_entry:
        return jsonify({'error': 'No journal_entry data provided'}), 400
    
    return predict_expense_controller(
        day,journal_entry, model_day, scaler_expense, scaler_weekday, scaler_day, scaler_month, scaler_flag
    )