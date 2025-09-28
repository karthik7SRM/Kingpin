from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize VADER
analyzer = SentimentIntensityAnalyzer()

# Negative keywords with custom weights
negative_keywords = {
    "downfall": -0.5,
    "upset": -0.4,
    
    "flood": -0.9,
    "cyclone": -0.8,
    "hurricane": -0.9,
    "storm": -0.7,
    "earthquake": -0.9,
    "landslide": -0.7,
    "fire": -0.8,
    "explosion": -0.9,
    "shutdown": -0.8,
    "strike": -0.7,
    "protest": -0.6,
    "blockade": -0.8,
    "tariff": -0.6,
    "ban": -0.7,
    "shortage": -0.7,
    "delay": -0.6,
    "halt": -0.7,
    "disruption": -0.7,
    "conflict": -0.9,
    "war": -0.9,
    "sanction": -0.8,
    "outage": -0.7,
    "blackout": -0.7,
    "bankruptcy": -0.9,
    "insolvency": -0.9,
    "accident": -0.7,
    "recall": -0.6,
    
    # New supply chain specific negative keywords
    "shortfall": -0.7,
    "bottleneck": -0.6,
    "understock": -0.6,
    "oversupply": -0.5,
    "backlog": -0.6,
    "cancellation": -0.6,
    "fraud": -0.8,
    "recall": -0.7,
    "loss": -0.7,
    "slowdown": -0.6,
    "breach": -0.7,
    "violation": -0.6,
    "penalty": -0.6,
    "default": -0.8,
    "failure": -0.7,
    "corruption": -0.8,
    "mismanagement": -0.7,
    "complaint": -0.5,
    "dispute": -0.6,
    "breakdown": -0.7,
    "recurring_issue": -0.6,
    "lost": -0.8,
    "captured":-0.4
}


# Neutral keywords with weight 0
neutral_keywords = {
    "forecast": 0.0,
    "regulation": 0.0,
    "policy": 0.0,
    "inspection": 0.0,
    "maintenance": 0.0,
    "audit": 0.0,
    "testing": 0.0,
    "report": 0.0,
    "announcement": 0.0,
    "monitoring": 0.0,
    "shipment": 0.0,
    "update": 0.0,
    "review": 0.0,
    "stock": 0.0,
    "supply": 0.0,
    "delivery_schedule": 0.0,
    "transport": 0.0,
    "inventory": 0.0,
    "logistics": 0.0,
    "warehouse": 0.0,
    "cargo": 0.0,
    "tracking": 0.0,
    "procedure": 0.0,
    "guideline": 0.0,
    "standard": 0.0,
    "compliance": 0.0,
    "inspection_report": 0.0,
    "operation": 0.0,
    "route": 0.0,
    "documentation": 0.0,
    "schedule": 0.0,
    "coordination": 0.0,
    "monitor": 0.0,
    "shipment_status": 0.0,
    "inventory_level": 0.0
}

# Positive keywords with custom weights
positive_keywords = {
    "benefit": 0.8,
    "increase": 0.5,
    "happy": 0.5,
    "recovery": 0.7,
    "restored": 0.6,
    "stable": 0.6,
    "growth": 0.7,
    "expansion": 0.6,
    "boost": 0.6,
    "partnership": 0.5,
    "agreement": 0.5,
    "investment": 0.7,
    "upgrade": 0.6,
    "innovation": 0.6,
    "resilient": 0.8,
    "on-time": 0.7,
    "capacity": 0.5,
    "improvement": 0.6,
    "efficiency": 0.7,
    "delivery": 0.6,
    "optimization": 0.7,
    "automation": 0.6,
    "streamlined": 0.6,
    "expedited": 0.6,
    "flexible": 0.5,
    "robust": 0.7,
    "reliable": 0.7,
    "accelerated": 0.6,
    "on-schedule": 0.7,
    "cost-saving": 0.6,
    "profit": 0.7,
    "successful": 0.7,
    "enhanced": 0.6,
    "collaboration": 0.5,
    "scalable": 0.6,
    "resumption": 0.6,
    "steady": 0.6,
    "sustainable": 0.7,
    "availability": 0.6,
    "compliance": 0.5,
    "more payment":0.6,
}


def analyze_headline(headline: str):
    """
    Analyzes a headline and returns a compound sentiment score (-1 to 1)
    and a risk label: 'High Risk', 'Medium Risk', 'Low Risk'
    """
    score = analyzer.polarity_scores(headline)
    headline_lower = headline.lower()

    # Override with keyword weights if any match
    for word, weight in {**negative_keywords, **neutral_keywords, **positive_keywords}.items():
        if word in headline_lower:
            score['compound'] = weight
            break

    # Map compound score to risk
    if score['compound'] <= -0.2:
        risk_label = "High Risk"
    elif -0.2 < score['compound'] < 0.2:
        risk_label = "Medium Risk"
    else:
        risk_label = "Low Risk"

    return score['compound'], risk_label

# Example usage (can be removed if used only in Flask)
if __name__ == "__main__":
    test_headline = "Shipments are recovering and being stable"
    score, risk = analyze_headline(test_headline)
    print("Headline:", test_headline)
    print("Sentiment Score:", score)
    print("Predicted Risk:", risk)
