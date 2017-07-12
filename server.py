from flask import Flask, render_template, send_from_directory, request
from os import environ, path
import pigpio
import time
import threading
from Queue import Queue

gpio = pigpio.pi()

radj = 1.1
gadj = 3.5
badj = 3.5
wadj = 2.0

red = 15
green = 14
blue = 18
white = 23

delta = 20

gpio.set_PWM_dutycycle(red, 0)
gpio.set_PWM_dutycycle(green, 0) 
gpio.set_PWM_dutycycle(blue, 0)
gpio.set_PWM_dutycycle(white, 0) 

here = path.abspath(path.dirname(__file__))

app = Flask(__name__, static_folder='templates')

def clip(x, lo, hi):
	return lo if x <= lo else hi if x >= hi else x

def sleep(s=1000):
	time.sleep(s/1000.0)

def setcols(cols, R=0, G=0, B=0, W=0):
	R = clip(R, 0.0, 255.0)
	G = clip(G, 0.0, 255.0)
	B = clip(B, 0.0, 255.0)
	W = clip(W, 0.0, 255.0)
	# print(str(R)+' '+str(G)+' '+str(B)+' '+str(W)+' ')
	if(R==cols.r and G==cols.g and B==cols.b and W==cols.w):
		return

	cols.r=R
	cols.g=G
	cols.b=B
	cols.w=W
	
	R = round(R/radj)
	G = round(G/gadj)
	B = round(B/badj)
	W = round(W/wadj)

	R = clip(R, 0.0, 255.0)
	G = clip(G, 0.0, 255.0)
	B = clip(B, 0.0, 255.0)
	W = clip(W, 0.0, 255.0)

	gpio.set_PWM_dutycycle(red, R)
	gpio.set_PWM_dutycycle(green, G) 
	gpio.set_PWM_dutycycle(blue, B) 
	gpio.set_PWM_dutycycle(white, W) 

def change(cols, R=0, G=0, B=0, W=0, wait=1000, changetime = 2000):
	diff = changetime//delta
	if(not (diff == 0)):
		dr = (R-cols.r)/float(diff)
		dg = (G-cols.g)/float(diff)
		db = (B-cols.b)/float(diff)
		dw = (W-cols.w)/float(diff)
		for i in range(diff):
			setcols(cols, cols.r+dr, cols.g+dg, cols.b+db, cols.w+dw)
			sleep(delta)
	setcols(cols, R, G, B, W)
	if(stopth.is_set()):
		return
	sleep(wait)

def iterate(cols, data):
	for val in data:
			if(stopth.is_set()):
				print('return')
				return
			change(cols, int(val['r']), int(val['g']), int(val['b']), 0, int(val['w']), int(val['t']))


def control(q):
	class Struct(object):pass
	cols=Struct()
	cols.r=0.0
	cols.g=0.0
	cols.b=0.0
	cols.w=0.0
	print('start thread')	
	while True:
		data = q.get()
		print('got queue')
		if(data is None):
			print('exit')
			return
		if(stopth.is_set()):
			print('clear')
			stopth.clear()
		if(data['inf']):
			while True:
				if(stopth.is_set()):
					print('break')
					break
				iterate(cols, data['colors'])
				sleep(1)
		else:
			for x in range(int(data['reps'])):
				if(stopth.is_set()):
					print('break')
					break
				iterate(cols, data['colors'])
				sleep(1)
		sleep(1)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/<path:filename>')
def send_asset(filename):
 	print(path.join(here, '/templates/') + filename)
 	return send_from_directory(app.static_folder, filename)

@app.route('/colors', methods=['POST'])
def setcolor():
	d=request.get_json()
	#change(d['r'], d['g'], d['b'], 0, 500, 3000)
	stopth.set()
	queue.put(d)
	return ('set!')

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@app.route('/stop')
def stop():
	stopth.set()
	queue.put(None)
	queue.put(None)
	queue.put(None)
	runth.join()
	gpio.set_PWM_dutycycle(red, 0)
	gpio.set_PWM_dutycycle(green, 0) 
	gpio.set_PWM_dutycycle(blue, 0)
	gpio.set_PWM_dutycycle(white, 0) 
	gpio.stop()
	print('joined')
	shutdown_server()
	return 'stopped'

queue = Queue()
runth = threading.Thread(target=control, args=(queue,))
runth.start()
stopth = threading.Event()

if __name__ == '__main__':
	app.run(host='0.0.0.0', debug=False, threaded=True)