import os
from flask import Flask, jsonify, request
import tensorflow as tf
import joblib
from dotenv import load_dotenv
from controller.process_journal_month import process_journal_month
from controller.process_journal_day import process_journal_day

load_dotenv()

app = Flask(__name__)

# load month model
model_month = tf.keras.models.load_model('model/model_month.h5') 
scaler_month_month = joblib.load('model/scaler.pkl')

# load day model
model_day = tf.keras.models.load_model('model/model_day_LSTM/model_pengeluaran.h5', compile=False)
scaler_expense = joblib.load('model/model_day_LSTM/scaler_expense.pkl')
scaler_weekday = joblib.load('model/model_day_LSTM/scaler_weekday.pkl')
scaler_day = joblib.load('model/model_day_LSTM/scaler_day.pkl')
scaler_month_day = joblib.load('model/model_day_LSTM/scaler_month.pkl')
scaler_flag = joblib.load('model/model_day_LSTM/scaler_flag.pkl')

categories = ['Rent', 'Loan_Repayment', 'Insurance', 'Groceries', 'Transport',
              'Eating_Out', 'Entertainment', 'Utilities', 'Healthcare', 'Education']

@app.route('/journal/month', methods=['POST'])
def journal_route_month():
    return process_journal_month(request, model_month, scaler_month_month, categories)

@app.route('/journal/day', methods=['POST'])
def journal_route_day():
    return process_journal_day(model_day, scaler_expense, scaler_weekday, scaler_day, scaler_month_day, scaler_flag)

if __name__ == '__main__':
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
        print(f"{methods:10s} {rule.endpoint:20s} -> {rule.rule}")

    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5000))
    app.run(host=host, port=port, debug=False)