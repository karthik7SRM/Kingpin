import pandas as pd
import numpy as np
import xgboost as xgb

# ----------------------------
# 1. Simulated data
# ----------------------------
np.random.seed(42)
suppliers = [f'Supplier{i}' for i in range(1, 6)]
cities = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Kolkata', 
          'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh']
n_rows = 500

df = pd.DataFrame({
    'Supplier': np.random.choice(suppliers, n_rows),
    'City': np.random.choice(cities, n_rows),
    'Num_Delays': np.random.poisson(2, n_rows),
    'Num_Quality_Issues': np.random.poisson(1, n_rows),
    'Avg_LeadTime': np.random.randint(3, 15, n_rows)
})

# ----------------------------
# 2. Risk assignment
# ----------------------------
def assign_risk(row):
    score = row['Num_Delays'] + 2 * row['Num_Quality_Issues'] + row['Avg_LeadTime'] / 5
    if score > 7: return 2   # High
    elif score > 4: return 1 # Medium
    else: return 0           # Low

df['Risk_Num'] = df.apply(assign_risk, axis=1)

# ----------------------------
# 3. Manual encoding
# ----------------------------
supplier_map = {s: i for i, s in enumerate(suppliers)}
city_map = {c: i for i, c in enumerate(cities)}

df['Supplier'] = df['Supplier'].map(supplier_map)
df['City'] = df['City'].map(city_map)

X = df[['Supplier', 'City', 'Num_Delays', 'Num_Quality_Issues', 'Avg_LeadTime']]
y = df['Risk_Num']

# ----------------------------
# 4. Train XGBoost
# ----------------------------
dtrain = xgb.DMatrix(X, label=y)
params = {
    'objective': 'multi:softmax',
    'num_class': 3,
    'max_depth': 5,
    'eta': 0.3,
    'seed': 42
}
bst = xgb.train(params, dtrain, num_boost_round=200)

# ----------------------------
# 5. Prediction function
# ----------------------------
def predict_risk(supplier, city, num_delays, num_quality, avg_leadtime):
    if supplier not in supplier_map or city not in city_map:
        raise ValueError("Supplier or City not recognized.")

    input_df = pd.DataFrame({
        'Supplier': [supplier_map[supplier]],
        'City': [city_map[city]],
        'Num_Delays': [num_delays],
        'Num_Quality_Issues': [num_quality],
        'Avg_LeadTime': [avg_leadtime]
    })
    dmatrix = xgb.DMatrix(input_df)
    class_index = int(bst.predict(dmatrix)[0])
    return {0: 'Low', 1: 'Medium', 2: 'High'}[class_index]
