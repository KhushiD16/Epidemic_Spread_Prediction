from __future__ import annotations

from dataclasses import dataclass

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error


@dataclass
class ModelBundle:
    name: str
    model: object


def split_train_test(df, test_size: float = 0.2):
    split_idx = int(len(df) * (1 - test_size))
    train = df.iloc[:split_idx].copy()
    test = df.iloc[split_idx:].copy()
    return train, test


def fit_and_select_model(train_df, test_df, feature_cols):
    models = {
        "linear_regression": LinearRegression(),
        "random_forest": RandomForestRegressor(
            n_estimators=300,
            max_depth=12,
            random_state=42,
            n_jobs=-1,
        ),
    }

    best_name = None
    best_model = None
    best_mae = float("inf")

    x_train = train_df[feature_cols]
    y_train = train_df["Cases"]
    x_test = test_df[feature_cols]
    y_test = test_df["Cases"]

    for name, model in models.items():
        model.fit(x_train, y_train)
        preds = model.predict(x_test)
        mae = mean_absolute_error(y_test, preds)
        if mae < best_mae:
            best_mae = mae
            best_name = name
            best_model = model

    return ModelBundle(name=best_name, model=best_model), best_mae
