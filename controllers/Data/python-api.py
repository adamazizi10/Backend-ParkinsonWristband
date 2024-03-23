import random
import json
from flask import Flask, request, jsonify
from featureExtraction import calculateFeatures
import pandas as pd

# input_data = {
#    't': ['30', '30', '0', '0', '0', '0', '0', '0', '0', '0'], 
#    'x': ['0.05', '0.01', '-0.07', '0.01', '0.00', '0.00', '-0.05', '0.00', '0.01', '-0.02'], 
#    'y': ['-4.56', '-4.59', '-4.68', '-4.60', '-4.61', '-4.60', '-4.66', '-4.61', '-4.59', '-4.63'], 
#    'z': ['9.57', '9.53', '9.45', '9.53', '9.52', '9.53', '9.47', '9.52', '9.53', '9.50']
# }

app = Flask(__name__)
@app.route('/double-data', methods=['POST'])
def double_data():
    try:
        input_data = request.json  
        df = pd.DataFrame.from_dict(input_data)
        df = df.astype(float)
        featuresJson = calculateFeatures(df['x'], df['y'], df['z'])
        print(featuresJson)
        print('----------------------------------------')
        return featuresJson  
    except Exception as e:
        print('Error processing data:', str(e))
        return jsonify({'error': 'An error occurred'}), 500


portNum= 3002
@app.route('/', methods=['GET'])
def home():
    return f'<h1>Python Script is running on port {portNum}'



if __name__ == '__main__':
    app.run(port=portNum)