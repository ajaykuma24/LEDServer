from flask import Flask, render_template, send_from_directory, request
from os import environ, path
import json
import pigpio
import time

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

here = path.abspath(path.dirname(__file__))

app = Flask(__name__, static_folder='templates')

def setcols(R=0, G=0, B=0, W=0):
	if(R>255.0):
		R=255.0
	if(R<0.0):
		R=0.0

	if(G>255.0):
		G=255.0
	if(G<0.0):
		G=0.0

	if(B>255.0):
		B=255.0
	if(B<0.0):
		B=0.0

	if(W>255.0):
		W=255.0
	if(W<0.0):
		W=0.0
	currcolor['r']=R
	currcolor['g']=G
	currcolor['b']=B
	currcolor['w']=W
	R = round(R/radj)
	G = round(G/gadj)
	B = round(B/badj)
	W = round(W/wadj)
	if(R>255):
		R=255
	if(R<0):
		R=0

	if(G>255):
		G=255
	if(G<0):
		G=0

	if(B>255):
		B=255
	if(B<0):
		B=0

	if(W>255):
		W=255
	if(W<0):
		W=0
	print(str(R)+' '+str(G)+' '+str(B)+' '+str(W)+' ')
	gpio.set_PWM_dutycycle(red, R)
	gpio.set_PWM_dutycycle(green, G) 
	gpio.set_PWM_dutycycle(blue, B) 
	gpio.set_PWM_dutycycle(white, W) 

def change(R=0, G=0, B=0, W=0, changet = 2000):
	diff = changet//delta
	dr = (R-currcolor['r'])/diff
	dg = (G-currcolor['g'])/diff
	db = (B-currcolor['b'])/diff
	dw = (W-currcolor['w'])/diff
	for i in range(diff-1):
		setcols(currcolor['r']+dr, currcolor['g']+dg, currcolor['b']+db, currcolor['w']+dw)
		sleep(delta)
	setcols(R, G, B, W)

def sleep(s=1000):
	time.sleep(s/1000.0)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/<path:filename>')
def send_asset(filename):
    print(path.join(here, '/templates/') + filename)
    return send_from_directory(app.static_folder, filename)

@app.route('/colors', methods=['POST'])
def setcolor():
	d=request.json
	R = d["r"]
	G = d["g"]
	B = d["b"]
	change(R, G, B)
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


