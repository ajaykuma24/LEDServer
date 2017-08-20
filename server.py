from flask import Flask, render_template, send_from_directory, request
import pigpio
import time
import os
import json
import threading
from Queue import Queue
import pexpect

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

airplay = False

wdstop = {'reps': '1', 'inf': False, 'data': [{'w': '0', 't': '0', 'value': '0'}]}
coldstop = {'reps': '1', 'inf': False, 'data': [{'w': '0', 'r': 0, 'b': 0, 't': '0', 'g': 0}]}

gpio.set_PWM_dutycycle(red, 0)
gpio.set_PWM_dutycycle(green, 0) 
gpio.set_PWM_dutycycle(blue, 0)
gpio.set_PWM_dutycycle(white, 0) 
gpio.set_PWM_frequency(red, 80)
gpio.set_PWM_frequency(green, 80)
gpio.set_PWM_frequency(blue, 80)
gpio.set_PWM_frequency(white, 80)

app = Flask(__name__, static_folder='public')
__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def clip(x, lo, hi):
	return lo if x <= lo else hi if x >= hi else x

def sleep(s=1000):
	time.sleep(s/1000.0)

def setcols(cols, R=0, G=0, B=0):
	R = clip(R, 0.0, 255.0)
	G = clip(G, 0.0, 255.0)
	B = clip(B, 0.0, 255.0)
	# print(str(R)+' '+str(G)+' '+str(B)+' '+str(W)+' ')
	if(R==cols.r and G==cols.g and B==cols.b):
		return

	cols.r=R
	cols.g=G
	cols.b=B
	
	R = round(R/radj)
	G = round(G/gadj)
	B = round(B/badj)

	R = clip(R, 0.0, 255.0)
	G = clip(G, 0.0, 255.0)
	B = clip(B, 0.0, 255.0)

	gpio.set_PWM_dutycycle(red, R)
 	gpio.set_PWM_dutycycle(green, G) 
 	gpio.set_PWM_dutycycle(blue, B) 

def colchange(cols, R=0, G=0, B=0, wait=1000, changetime = 2000):
	diff = changetime//delta
	if(not (diff == 0)):
		dr = (R-cols.r)/float(diff)
		dg = (G-cols.g)/float(diff)
		db = (B-cols.b)/float(diff)
		for i in range(diff):
			setcols(cols, cols.r+dr, cols.g+dg, cols.b+db)
			sleep(delta)
	setcols(cols, R, G, B)
	if(rgbstop.is_set()):
		return
	sleep(wait)

def coliterate(cols, data):
	for val in data:
			if(rgbstop.is_set()):
				print('return')
				return
			colchange(cols, int(val['r']), int(val['g']), int(val['b']), int(val['w']), int(val['t']))


def colcontrol(q):
	class Struct(object):pass
	cols=Struct()
	cols.r=0.0
	cols.g=0.0
	cols.b=0.0
	print('start thread')	
	while True:
		data = q.get()
		print('got queue')
		if(data is None):
			print('exit')
			return
		if(rgbstop.is_set()):
			print('clear')
			rgbstop.clear()
		if(data['inf']):
			while True:
				if(rgbstop.is_set()):
					print('break')
					break
				coliterate(cols, data['data'])
				sleep(1)
		else:
			for x in range(int(data['reps'])):
				if(rgbstop.is_set()):
					print('break')
					break
				coliterate(cols, data['data'])
				sleep(1)
		sleep(1)

def setw(val, W):
	W=clip(W, 0, 255)
	# print(str(R)+' '+str(G)+' '+str(B)+' '+str(W)+' ')
	if(val.w==W):
		return

	val.w=W
	
	W=round(W/wadj)

	W = clip(W, 0.0, 255.0)

	gpio.set_PWM_dutycycle(white, W)

def wchange(val, W=0, wait=1000, changetime = 2000):
	diff = changetime//delta
	if(not (diff == 0)):
		dw = (W-val.w)/float(diff)
		for i in range(diff):
			setw(val, val.w+dw)
			sleep(delta)
	setw(val, W)
	if(wstop.is_set()):
		return
	sleep(wait)

def witerate(val, data):
	for d in data:
			if(wstop.is_set()):
				print('return')
				return
			wchange(val, int(d['value']), int(d['w']), int(d['t']))


def wcontrol(q):
	class Struct(object):pass
	val=Struct()
	val.w=0.0
	print('start thread')	
	while True:
		data = q.get()
		print('got queue')
		if(data is None):
			print('exit')
			return
		if(wstop.is_set()):
			print('clear')
			wstop.clear()
		if(data['inf']):
			while True:
				if(wstop.is_set()):
					print('break')
					break
				witerate(val, data['data'])
				sleep(1)
		else:
			for x in range(int(data['reps'])):
				if(wstop.is_set()):
					print('break')
					break
				witerate(val, data['data'])
				sleep(1)
		sleep(1)

@app.route('/colors', methods=['POST'])
def setcolor():
	global airplay
	if(not airplay):
		d=request.get_json()
		rgbstop.set()
		rgbq.put(d)
	return ('set!')

@app.route('/bright', methods=['POST'])
def setbright():
	global airplay
	if(not airplay):
		d=request.get_json()
		wstop.set()
		wq.put(d)
	return ('set!')

@app.route('/save', methods=['POST', 'GET'])
def update():
	if(request.method == "GET"):
		with open(os.path.join(__location__, 'public/data.json'), "a+") as jsonFile:
			try:
				jsonFile.seek(0)  # rewind
				data = json.load(jsonFile)
			except:
				data = {"msg": 'error'}
			jsonFile.close()
			return json.dumps(data)

	if(request.method == "POST"):
		d=request.get_json()
		with open(os.path.join(__location__, 'public/data.json'), "a+") as jsonFile:
			jsonFile.seek(0)  # rewind
			olddata = json.load(jsonFile)
			toadd = request.get_json()
			if("colors" in toadd):
				olddata["colors"] = toadd["colors"]
			elif("values" in toadd):
				olddata["values"] = toadd["values"]

			jsonFile.seek(0)  # rewind
			jsonFile.truncate()
			jsonFile.seek(0)
			json.dump(olddata, jsonFile)
			jsonFile.truncate()
			jsonFile.close()
			return('set!')
	return ('set!')

@app.route('/switch', methods=['POST', 'GET'])
def switch():
	global proc
	global airplay
	if(request.method == "GET"):
		pack = {"data": airplay}
		return json.dumps(pack)
	if(request.method == "POST"):
		d=request.get_json()
		if(d["airplay"]):
			rgbstop.set()
			rgbq.put(coldstop)
			wstop.set()
			wq.put(wdstop)
			print('stopped')
			airplay=True
			proc = pexpect.spawn("sudo python /home/pi/lightshowpi/py/synchronized_lights.py")
		else:
			if(not(proc is None)):
				airplay = False
				print('start')
				proc.sendcontrol('c')
		return('switch')

def shutdown_server():
	func = request.environ.get('werkzeug.server.shutdown')
	if func is None:
		raise RuntimeError('Not running with the Werkzeug Server')
	func()

@app.route('/stop')
def stop():
	rgbstop.set()
	wstop.set()
	rgbq.put(None)
	rgbq.put(None)
	rgbq.put(None)
	wq.put(None)
	wq.put(None)
	wq.put(None)
	rgbthread.join()
	wthread.join()
	print('joined')
	gpio.set_PWM_dutycycle(red, 0)
 	gpio.set_PWM_dutycycle(green, 0) 
 	gpio.set_PWM_dutycycle(blue, 0)
 	gpio.set_PWM_dutycycle(white, 0) 
 	if(not(proc is None)):
	 	proc.sendcontrol('c')
	# shutdown_server()
	return 'stopped'

@app.route('/dll/<path:filename>')
def send_dll(filename):
	return send_from_directory(app.static_folder, 'dll/'+filename)
@app.route('/static/<path:filename>')
def send_static(filename):
	return send_from_directory(app.static_folder, 'static/'+filename)
@app.route('/favicon.ico')
def favicon():
	return ''
@app.route('/',  methods=["GET"])
def index():
	return send_from_directory(app.static_folder, 'index.html')
@app.route('/<path:path>',  methods=["GET"])
def catchall(path):
	return send_from_directory(app.static_folder, 'index.html')


proc=None
rgbq = Queue()
wq = Queue()
rgbthread = threading.Thread(target=colcontrol, args=(rgbq,))
wthread = threading.Thread(target=wcontrol, args=(wq,))
rgbthread.start()
wthread.start()
rgbstop = threading.Event()
wstop = threading.Event()

if __name__ == '__main__':
	app.run(host='0.0.0.0', debug=False, threaded=True, port=80)
