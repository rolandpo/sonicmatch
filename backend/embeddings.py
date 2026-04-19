import numpy as np
import joblib
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

_model = None

def model_exists() -> bool:
  return Path("pca_model.joblib").exists()

def _load():
  global _model
  if _model is None:
    _model = joblib.load("pca_model.joblib")
  return _model

def transform(raw_features: np.ndarray) -> np.ndarray:
  m = _load()
  scaled = m["scaler"].transform(raw_features.reshape(1, -1))
  return m["pca"].transform(scaled).flatten()

def fit_and_save(features: list[np.ndarray]):
  global _model
  X = np.array(features)
  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)
  pca = PCA(n_components=40)
  pca.fit(X_scaled)
  _model = {"scaler": scaler, "pca": pca}
  joblib.dump(_model, "pca_model.joblib")
