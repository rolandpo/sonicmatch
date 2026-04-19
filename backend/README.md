#stack

fastapi — web framework for api endpoints                          
uvicorn — server that runs FastAPI
qdrant-client — Python SDK to talk to your Qdrant instance
librosa — audio processing, used for MFCC extraction
scikit-learn — PCA and StandardScaler
numpy — array math, used throughout the pipeline
joblib — saves/loads the fitted PCA model to disk
python-multipart — lets FastAPI parse file uploads (MP3s)

#audio processing

librosa.load - reads audio file, resample to 22050 Hz, converts to mono, take first 30s

librosa.feature.mfcc - compute 40 mel-frequency cepstral coefficients across time frames, timbral texture

np.concatenate - convert mfcc output to flat 80-dimensional vector

mean - average texture

std - standard deviation, variance over time

#embedding

transform - normalises and applies pca to reduce 80d vector to 40d vector, converts 1d array to 2d row

fit_and_save - takes a list of 80d vectors, fits scaler and pca, saves to disk and caches in memory
