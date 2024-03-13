import random
import json
from flask import Flask, request, jsonify
from featureExtraction import calculateFeatures
import pandas as pd


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