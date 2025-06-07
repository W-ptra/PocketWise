from flask import request, jsonify
import pandas as pd

def process_lifestyle_classification_model(request, model, preprocessor, categories):
    try:
        journal = request.json.get('journal_entry')

        if not journal or 'Income' not in journal:
            return jsonify({'error': 'Missing Income or journal_entry'}), 400

        # Ambil dan proses Income
        income = float(str(journal.get('Income', 0)).replace(',', ''))

        # Hitung Total Expenses dari semua kategori pengeluaran
        total_expenses = 0
        for field in categories:
            val = float(str(journal.get(field, 0)).replace(',', ''))
            total_expenses += val

        # Hitung rasio pengeluaran terhadap pendapatan
        if income == 0:
            return jsonify({'error': 'Income must be greater than 0'}), 400
        expense_income_ratio = total_expenses / income

        # Buat DataFrame input
        input_df = pd.DataFrame([{
            'Income': income,
            'Total_Expenses': total_expenses,
            'Expense_Income_Ratio': expense_income_ratio
        }])

        # Preprocessing dan prediksi
        transformed = preprocessor.transform(input_df)
        prediction = model.predict(transformed)[0]

        return jsonify({
            "success": True,
            "prediction": prediction
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
