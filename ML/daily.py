import os
from flask import Flask, request, jsonify
import tensorflow as tf
import joblib
from dotenv import load_dotenv
from controller.process_journal_day import predict_expense_controller

load_dotenv()

app = Flask(__name__)

model = tf.keras.models.load_model('model/model_day_LSTM/model_pengeluaran.h5', compile=False)
scaler_expense = joblib.load('model/model_day_LSTM/scaler_expense.pkl')
scaler_weekday = joblib.load('model/model_day_LSTM/scaler_weekday.pkl')
scaler_day = joblib.load('model/model_day_LSTM/scaler_day.pkl')
scaler_month = joblib.load('model/model_day_LSTM/scaler_month.pkl')
scaler_flag = joblib.load('model/model_day_LSTM/scaler_flag.pkl')

@app.route('/journal', methods=['POST'])
def journal_route():
    journal_entry = request.json.get('journal_entry')
    if not journal_entry:
        return jsonify({'error': 'No journal_entry data provided'}), 400
    
    return predict_expense_controller(
        journal_entry, model, scaler_expense, scaler_weekday, scaler_day, scaler_month, scaler_flag
    )

if __name__ == '__main__':
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
        print(f"{methods:10s} {rule.endpoint:20s} -> {rule.rule}")

    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5000))
    app.run(host=host, port=port, debug=False)
