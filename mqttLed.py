import paho.mqtt.client as mqtt
#import RPi.GPIO as GPIO

def setMqtt():
    _g_cst_ToMQTTTopicServerIP = 'localhost'#ServerIP
    _g_cst_ToMQTTTopicServerPort = 1883#監聽端口
    _g_cst_ToMQTTTopicName = 'Home/Temperature/1'#主題

def gpiosetup():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(19, GPIO.OUT)
    GPIO.setup(21, GPIO.OUT)
    GPIO.setup(23, GPIO.OUT)
    

def on_connect(client, userdata, rc):
    #print ("Connected with rc: " + str(rc))
    client.subscribe("Home/webClient")

def on_message(client, userdata, msg):
    #print ("Topic: "+ msg.topic+"\nMessage: "+str(msg.payload))
    if "on" in msg.payload:
        print(" on!")
        #GPIO.output(19, True)
        #GPIO.output(21, True)
        #GPIO.output(23, True)
    else:
        print(" off!")
        #GPIO.output(19, False)
        #GPIO.output(21, False)
        #GPIO.output(23, False)
    client.publish("Home/webClient","Light was {}".format(msg.payload))
    '''
    if "green" in msg.payload:
        #print("  Green on!")
        GPIO.output(23, True)
    else:
        #print("  Green off!")
        GPIO.output(23, False)
    if "yellow" in msg.payload:
        #print("  Blue on!")
        GPIO.output(21, True)
    else:
        #print("  Blue off!")
        GPIO.output(21, False)
    if "red" in msg.payload:
        #print("  Red on!")
        GPIO.output(19, True)
    else:
        #print("  Red off!")
        GPIO.output(19, False)
    '''    

if __name__ == '__main':
    client = mqtt.Client("Home/Light/1")
    setMqtt()
    client.on_connect = on_connect
    client.on_message = on_message
    client.loop_forever()
    try:
        client.connect(_g_cst_ToMQTTTopicServerIP, _g_cst_ToMQTTTopicServerPort)
    except KeyboardInterrupt:
        client.disconnect()
        #gpio.clean()
    