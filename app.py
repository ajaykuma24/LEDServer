from flask import Flask, render_template, send_from_directory
from os import environ, path

here = path.abspath(path.dirname(__file__))

app = Flask(__name__, static_folder='templates')

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route("/<path:filename>")
def send_asset(filename):
    print(path.join(here, "/templates/") + filename)
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)
