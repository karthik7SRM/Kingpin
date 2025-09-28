from flask import Flask, render_template, request, jsonify
from sentiment_model import analyze_headline
from xgb_model import predict_risk

app = Flask(__name__)

# ------------------------------
# Utility function for safe int
# ------------------------------
def safe_int(val, default=0):
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

# ------------------------------
# Routes
# ------------------------------
@app.route("/")
def index():
    return render_template("dashboard.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Endpoint for headline sentiment analysis.
    Returns: headline, sentiment score, and risk label.
    """
    try:
        data = request.json
        if not data or "headline" not in data:
            return jsonify({"error": "Missing 'headline' in request"}), 400

        headline = str(data["headline"]).strip()
        if not headline:
            return jsonify({"error": "Headline cannot be empty"}), 400

        score, risk_label = analyze_headline(headline)

        return jsonify({
            "headline": headline,
            "score": score,
            "risk": risk_label
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint for supplier risk prediction using XGBoost.
    Returns: supplier, city, feature values, and risk level (Low/Medium/High)
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body is empty"}), 400

        supplier = str(data.get("Supplier", "")).strip()
        city = str(data.get("City", "")).strip()
        if not supplier or not city:
            return jsonify({"error": "Supplier and City are required"}), 400

        num_delays = safe_int(data.get("Num_Delays"))
        num_quality = safe_int(data.get("Quality_Issues"))
        avg_leadtime = safe_int(data.get("Avg_Lead_Time"))

        # Use your trained XGBoost model
        risk_level = predict_risk(supplier, city, num_delays, num_quality, avg_leadtime)

        return jsonify({
            "supplier": supplier,
            "city": city,
            "num_delays": num_delays,
            "num_quality_issues": num_quality,
            "avg_leadtime": avg_leadtime,
            "risk_level": risk_level
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------
# Run App
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True)
