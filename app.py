from flask import Flask, render_template, send_from_directory, request
from os import environ, path
import pigpio
import time
import threading

gpio = pigpio.pi()

radj = 1.2
gadj = 3.2
badj = 3.5
wadj = 2.0

red = 15
green = 14
blue = 18
white = 23

delta = 20

currcolor = {'r': 0.0, 'g': 0.0, 'b': 0.0, 'w': 0.0}

gpio.set_PWM_dutycycle(red, 0)
gpio.set_PWM_dutycycle(green, 0) 
gpio.set_PWM_dutycycle(blue, 0)
gpio.set_PWM_dutycycle(white, 0) 

testvals = [(150, 0  , 0  , 0, 500, 5000),
			(150, 75 , 0  , 0, 500, 5000),
			(75 , 75 , 0  , 0, 500, 5000),
			(75 , 150, 0  , 0, 500, 5000),
			(0  , 150, 0  , 0, 500, 5000),
			(0  , 150, 75 , 0, 500, 5000),
			(0  , 75 , 75 , 0, 500, 5000),
			(0  , 75 , 150, 0, 500, 5000),
			(0  , 0  , 150, 0, 500, 5000),
			(75 , 0  , 150, 0, 500, 5000),
			(75 , 0  , 75 , 0, 500, 5000),
			(150, 0  , 75 , 0, 500, 5000),
			(0  , 0  , 0 , 0, 500, 5000)]

class FuncThread(threading.Thread):
    def __init__(self, target, *args):
        self._target = target
        self._args = args
        threading.Thread.__init__(self)
 
    def run(self):
        self._target(*self._args)

here = path.abspath(path.dirname(__file__))

app = Flask(__name__, static_folder='templates')

def clip(x, lo, hi):
    return lo if x <= lo else hi if x >= hi else x

def setcols(R=0, G=0, B=0, W=0):
	R = clip(R, 0.0, 255.0)
	G = clip(G, 0.0, 255.0)
	B = clip(B, 0.0, 255.0)
	W = clip(W, 0.0, 255.0)

	currcolor['r']=R
	currcolor['g']=G
	currcolor['b']=B
	currcolor['w']=W
	R = round(R/radj)
	G = round(G/gadj)
	B = round(B/badj)
	W = round(W/wadj)

	R = clip(R, 0.0, 255.0)
	G = clip(G, 0.0, 255.0)
	B = clip(B, 0.0, 255.0)
	W = clip(W, 0.0, 255.0)

	print(str(R)+' '+str(G)+' '+str(B)+' '+str(W)+' ')

	gpio.set_PWM_dutycycle(red, R)
	gpio.set_PWM_dutycycle(green, G) 
	gpio.set_PWM_dutycycle(blue, B) 
	gpio.set_PWM_dutycycle(white, W) 

def change(R=0, G=0, B=0, W=0, wait=1000, changet = 2000):
	diff = changet//delta
	dr = (R-currcolor['r'])/diff
	dg = (G-currcolor['g'])/diff
	db = (B-currcolor['b'])/diff
	dw = (W-currcolor['w'])/diff
	for i in range(diff-1):
		setcols(currcolor['r']+dr, currcolor['g']+dg, currcolor['b']+db, currcolor['w']+dw)
		sleep(delta)
	setcols(R, G, B, W)
	sleep(wait)

def sleep(s=1000):
	time.sleep(s/1000.0)

def control(data):
	for val in data:
		change(*val)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/<path:filename>')
def send_asset(filename):
    print(path.join(here, '/templates/') + filename)
    return send_from_directory(app.static_folder, filename)

@app.route('/colors', methods=['POST'])
def setcolor():
	d=request.get_json()
	R = d["r"]
	G = d["g"]
	B = d["b"]
	#change(R, G, B)
	control(testvals)
	print('R: ' + str(R) + ' G: ' + str(G) +' B: ' + str(B) )
	return ('set!')

@app.route('/stop')
def stopgpio():
	gpio.set_PWM_dutycycle(red, 0)
	gpio.set_PWM_dutycycle(green, 0) 
	gpio.set_PWM_dutycycle(blue, 0)
	gpio.set_PWM_dutycycle(white, 0) 
	gpio.stop()
	return 'stopped'

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)


