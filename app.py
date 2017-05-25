from flask import Flask, render_template, send_from_directory, request
from os import environ, path
import json

here = path.abspath(path.dirname(__file__))

app = Flask(__name__, static_folder='templates')

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/<path:filename>')
def send_asset(filename):
    print(path.join(here, '/templates/') + filename)
    return send_from_directory(app.static_folder, filename)

@app.route('/colors', methods=['POST'])
def setcolor():
	d = json.loads(request.data)
	R = d["R"]
	G = d["G"]
	B = d["B"]
	print('R: ' + str(R) + ' G: ' + str(G) +' B: ' + str(B) )
	return ('set!')

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)
