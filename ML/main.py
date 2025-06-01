import os
from flask import Flask, request
import tensorflow as tf
import joblib
from dotenv import load_dotenv
from controller.process_journal import process_journal

load_dotenv()

app = Flask(__name__)

# Load Keras model dan scaler
model = tf.keras.models.load_model('model/model_month.h5') 
scaler = joblib.load('model/scaler.pkl')

# Daftar kategori
categories = ['Rent', 'Loan_Repayment', 'Insurance', 'Groceries', 'Transport',
              'Eating_Out', 'Entertainment', 'Utilities', 'Healthcare', 'Education']

@app.route('/journal', methods=['POST'])
def journal_route():
    return process_journal(request, model, scaler, categories)

# add new route for new model with example like below
# @app.route('/new route', methods=['POST'])
# def new_route():
#     return new_controller(request, model, scaler, categories)

if __name__ == '__main__':
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
        print(f"{methods:10s} {rule.endpoint:20s} -> {rule.rule}")

    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5000))
    app.run(host=host, port=port, debug=False)