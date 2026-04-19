import librosa
import numpy as np

def extract_features(file_path: str) -> np.ndarray:
  y, sr = librosa.load(file_path, sr=22050, mono=True, duration=30)
  mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
  return np.concatenate([mfcc.mean(axis=1), mfcc.std(axis=1)])
