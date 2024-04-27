# Input is dataframe containing acclerometer values
# Output are the features for each acceleration axis
# 18 Total Features

import pandas as pd 
import numpy as np
from scipy import stats
from scipy.signal import find_peaks
import time
import random
import json
import pickle

with open('model.pkl', 'rb') as f:
    lr = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Returns JSON formatted string
def calculateFeatures(x, y, z):
  X_train = {}

  # Mean
  X_train['x_mean'] = x.mean()
  X_train['y_mean'] = y.mean()
  X_train['z_mean'] = z.mean()

  # std dev
  X_train['x_std'] = x.std()
  X_train['y_std'] = y.std()
  X_train['z_std'] = z.std()
  
  # avg absolute diff
  X_train['x_aad'] = np.mean(np.absolute(x - np.mean(x)))
  X_train['y_aad'] = np.mean(np.absolute(y - np.mean(y)))
  X_train['z_aad'] = np.mean(np.absolute(z - np.mean(z)))

  # min
  X_train['x_min'] = x.min()
  X_train['y_min'] = y.min()
  X_train['z_min'] = z.min()

  # max
  X_train['x_max'] = x.max()
  X_train['y_max'] = y.max()
  X_train['z_max'] = z.max()

  # max-min diff
  X_train['x_maxmin_diff'] = X_train['x_max'] - X_train['x_min']
  X_train['y_maxmin_diff'] = X_train['y_max'] - X_train['y_min']
  X_train['z_maxmin_diff'] = X_train['z_max'] - X_train['z_min']

  # median
  X_train['x_median'] = np.median(x)
  X_train['y_median'] = np.median(y)
  X_train['z_median'] = np.median(z)

  # median abs dev 
  X_train['x_mad'] = np.median(np.absolute(x - np.median(x)))
  X_train['y_mad'] = np.median(np.absolute(y - np.median(y)))
  X_train['z_mad'] = np.median(np.absolute(z - np.median(z)))

  # interquartile range
  X_train['x_IQR'] = np.percentile(x, 75) - np.percentile(x, 25)
  X_train['y_IQR'] = np.percentile(y, 75) - np.percentile(y, 25)
  X_train['z_IQR'] = np.percentile(z, 75) - np.percentile(z, 25)

  # negtive count
  X_train['x_neg_count'] = np.sum(x < 0)
  X_train['y_neg_count'] = np.sum(y < 0)
  X_train['z_neg_count'] = np.sum(z < 0)

  # positive count
  X_train['x_pos_count'] = np.sum(x > 0)
  X_train['y_pos_count'] = np.sum(y > 0)
  X_train['z_pos_count'] = np.sum(z > 0)

  # values above mean
  X_train['x_above_mean'] = np.sum(x > x.mean())
  X_train['y_above_mean'] = np.sum(y > y.mean())
  X_train['z_above_mean'] = np.sum(z > z.mean())

  # number of peaks
  X_train['x_peak_count'] = len(find_peaks(x)[0])
  X_train['y_peak_count'] = len(find_peaks(y)[0])
  X_train['z_peak_count'] = len(find_peaks(z)[0])

  # skewness
  X_train['x_skewness'] = stats.skew(x)
  X_train['y_skewness'] = stats.skew(y)
  X_train['z_skewness'] = stats.skew(z)

  # kurtosis
  X_train['x_kurtosis'] = stats.kurtosis(x)
  X_train['y_kurtosis'] = stats.kurtosis(y)
  X_train['z_kurtosis'] = stats.kurtosis(z)

  # energy
  X_train['x_energy'] = np.sum(x**2)/100
  X_train['y_energy'] = np.sum(y**2)/100
  X_train['z_energy'] = np.sum(z**2)/100

  # avg resultant
  X_train['avg_result_accl'] = ((x.values**2 + y.values**2 + z.values**2)**0.5).mean()
  
  X_train['sma'] = np.sum(abs(x)/100) + np.sum(abs(y)/100) + np.sum(abs(z)/100)

  label = classifer(X_train)
  X_train['label'] = label

  return json.dumps(X_train, cls=NpEncoder)


def classifer(X_train):
   df = pd.DataFrame([X_train])
   X_train_lr = scaler.transform(df)
   pred = lr.predict(X_train_lr)
   return pred


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

# def test():
#     input_data = {
#    't': ['30', '30', '0', '0', '0', '0', '0', '0', '0', '0'], 
#    'x': ['0.05', '0.01', '-0.07', '0.01', '0.00', '0.00', '-0.05', '0.00', '0.01', '-0.02'], 
#    'y': ['-4.56', '-4.59', '-4.68', '-4.60', '-4.61', '-4.60', '-4.66', '-4.61', '-4.59', '-4.63'], 
#    'z': ['9.57', '9.53', '9.45', '9.53', '9.52', '9.53', '9.47', '9.52', '9.53', '9.50']
#     }

#     df = pd.DataFrame.from_dict(input_data)
#     df = df.astype(float)
#     calculateFeatures(df['x'], df['y'], df['z'])

# test()