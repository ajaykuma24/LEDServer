import logging, sys
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/home/pi/Documents/LEDServer')
from server import app as application
