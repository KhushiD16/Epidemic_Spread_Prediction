import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Load dataset
df = pd.read_csv("time_series_covid19_confirmed_global.csv")

# Drop unnecessary columns
df = df.drop(['Province/State', 'Lat', 'Long'], axis=1)

# Group by country
df = df.groupby("Country/Region").sum()

# Select one country (example: India)
country = "India"
data = df.loc[country]

# Convert to dataframe
data = pd.DataFrame(data)
data.columns = ['Cases']

# Add days column
data['Days'] = np.arange(len(data))

# Prepare data
X = data[['Days']]
y = data['Cases']

# Train model
model = LinearRegression()
model.fit(X, y)

# Predict next 30 days
future_days = pd.DataFrame({'Days': np.arange(len(data), len(data) + 30)})
predictions = model.predict(future_days)

# Print a quick preview of forecast values in the terminal
forecast_preview = future_days.copy()
forecast_preview['Predicted Cases'] = predictions.astype(int)
print("Next 10-day forecast:")
print(forecast_preview.head(10).to_string(index=False))

# Plot results
plt.figure(figsize=(10,5))
plt.plot(data['Days'], y, label="Actual Cases")
plt.plot(future_days['Days'], predictions, label="Predicted Cases", linestyle='dashed')
plt.legend()
plt.title(f"COVID Prediction for {country}")
plt.xlabel("Days")
plt.ylabel("Cases")

# Save chart so it can be viewed even without a GUI display
output_file = "covid_prediction_india.png"
plt.tight_layout()
plt.savefig(output_file, dpi=150)
print(f"\nSaved plot to: {output_file}")
plt.show()