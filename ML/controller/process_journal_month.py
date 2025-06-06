import numpy as np
from flask import request, jsonify

def saran_tabungan(user_data, categories):
    income = user_data['Income']
    total_pengeluaran = sum([user_data.get(cat, 0) for cat in categories])
    pengeluaran_pct = total_pengeluaran / income

    if pengeluaran_pct >= 0.9:
        saving_pct = 0.05
    elif pengeluaran_pct >= 0.8:
        saving_pct = 0.10
    elif pengeluaran_pct >= 0.7:
        saving_pct = 0.15
    else:
        saving_pct = 0.20

    saran_tabungan_nominal = saving_pct * income
    saran_text = (
        "💰 Saran Menabung/Investasi:\n"
        f"• Berdasarkan pengeluaranmu saat ini ({pengeluaran_pct*100:.1f}%), "
        f"disarankan menabung sekitar {int(saving_pct*100)}% dari income.\n"
        f"• Idealnya kamu sisihkan: Rp{int(saran_tabungan_nominal):,}"
    )
    return saran_text

def process_journal_month(request, model, scaler, categories):
    try:
        journal_entry = request.json.get('journal_entry')

        if not journal_entry or 'Income' not in journal_entry:
            return jsonify({'error': 'Invalid journal_entry or missing Income'}), 400

        income = journal_entry['Income']
        user_data = {cat: journal_entry.get(cat, 0) for cat in categories}
        user_data['Income'] = income

        user_prop = np.array([user_data[cat] / income for cat in categories]).reshape(1, -1)
        user_scaled = scaler.transform(user_prop)
        pred_scaled = model.predict(user_scaled)
        pred_prop = scaler.inverse_transform(pred_scaled)
        rekomendasi_nominal = pred_prop.flatten() * income

        feedback_list = []
        threshold_nominal = 50000
        for i, cat in enumerate(categories):
            user_pct = user_prop[0, i] * 100
            rec_pct = pred_prop[0, i] * 100
            gap_nominal = (pred_prop[0, i] - user_prop[0, i]) * income

            if gap_nominal > threshold_nominal:
                feedback = f"• Pengeluaranmu untuk {cat} cukup rendah ({user_pct:.1f}% vs saran {rec_pct:.1f}%). Boleh dipertimbangkan naik hingga Rp{int(rekomendasi_nominal[i]):,}."
            elif gap_nominal < -threshold_nominal:
                feedback = f"• Kamu terlalu banyak mengeluarkan uang di {cat} ({user_pct:.1f}% vs saran {rec_pct:.1f}%). Idealnya kamu bisa hemat sekitar Rp{int(abs(gap_nominal)):,}."
            else:
                feedback = f"• Pengeluaranmu untuk {cat} sudah sesuai saran."
            feedback_list.append(feedback)

        rekomendasi = {
            cat: int(nominal)
            for cat, nominal in zip(categories, rekomendasi_nominal)
            if nominal >= threshold_nominal
        }

        saran_text = saran_tabungan(user_data, categories)

        return jsonify({
            'success': 'Journal is valid',
            'recommendation': rekomendasi,
            'feedback': feedback_list,
            'saran_tabungan': saran_text
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500