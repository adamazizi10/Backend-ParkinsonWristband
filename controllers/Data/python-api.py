from flask import Flask, request, jsonify
import random

app = Flask(__name__)

def get_random_parkinson_status():
    statuses = ['none', 'low', 'moderate', 'high']
    return random.choice(statuses)

@app.route('/double-data', methods=['POST'])
def double_data():
    try:
        # Get the input data from the request
        input_data = request.json

        # Perform the computation (double x, y, z, t)
        result_data = {
            't': [2 * val for val in input_data['t']],
            'x': [2 * val for val in input_data['x']],
            'y': [2 * val for val in input_data['y']],
            'z': [2 * val for val in input_data['z']],
            'parkinson_status': get_random_parkinson_status(),
        }

        return jsonify(result_data)
    except Exception as e:
        print('Error processing data:', str(e))
        return jsonify({'error': 'An error occurred'}), 500

portNum= 3002
@app.route('/', methods=['GET'])
def home():
    return f'<h1>Python Script is running on port {portNum}'


if __name__ == '__main__':
    app.run(port=portNum)
