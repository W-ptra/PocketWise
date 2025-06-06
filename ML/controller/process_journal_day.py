import pandas as pd
import numpy as np
from flask import jsonify

def predict_expense_controller(journal_entry, model, scaler_expense, scaler_weekday, scaler_day, scaler_month, scaler_flag):
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

        window_size = 7
        if len(daily_expense) < window_size:
            return jsonify({'error': f'At least {window_size} records are required'}), 400

        X_input = daily_expense[features].iloc[:window_size].values
        X_input = np.expand_dims(X_input, axis=0)

        pred_scaled = model.predict(X_input)[0][0]
        pred_real = scaler_expense.inverse_transform([[pred_scaled]])[0][0]

        return jsonify({
            'prediction_text': f"Predicted Total Expense for Tomorrow: Rp {pred_real:,.0f}",
            'message': "It is recommended to keep your spending below this predicted amount to stay on budget."
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
