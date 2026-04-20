import numpy as np
from umap import UMAP

_reducer = UMAP(n_components=2, random_state=42)
_fitted = False

def fit_transform(vectors: list[list[float]]) -> list[tuple[float, float]]:
  global _fitted
  X = np.array(vectors)
  coords = _reducer.fit_transform(X)
  _fitted = True
  return [(float(x), float(y)) for x, y in coords]

def is_fitted() -> bool:
  return _fitted
