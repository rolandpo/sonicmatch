#audio processing

librosa.load - reads audio file, resample to 22050 Hz, converts to mono, take first 30s

librosa.feature.mfcc - compute 40 mel-frequency cepstral coefficients across time frames, timbral texture

np.concatenate - convert mfcc output to flat 80-dimensional vector

mean - average texture

std - standard deviation, variance over time

#embedding

transform - normalises and applies pca to reduce 80d vector to 40d vector, converts 1d array to 2d row

fit_and_save - takes a list of 80d vectors, fits scaler and pca, saves to disk and caches in memory
