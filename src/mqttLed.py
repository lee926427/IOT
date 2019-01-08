import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import json

_g_cst_ToMQTTTopicServerIP = 'localhost'#ServerIP
_g_cst_ToMQTTTopicServerPort = 1883#Port
_g_cst_ToMQTTTopicName = 'Home/Light/1'#Sensor Article 主題
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

def on_connect(client, userdata, rc):
    print ("Connected with rc: " + str(rc))
    GPIO.output(19, True)
    GPIO.output(21, True)
    GPIO.output(23, True)

def on_subscribe(client, userdata, mid, granted_qos):
    print('{} subscribe Home/Light/1.'.format(userdata))

def on_publish(client, userdata, mid):
    print('published ')

def on_message(client, userdata, msg):
    print ("Topic: "+ msg.topic+"\nMessage: "+str(msg.payload))
    
    if "on" in str(msg.payload):
        print("on")
        GPIO.output(19, False)#根據硬體有時會發生true為關燈的負邏輯 https://www.raspberrypi.org/forums/viewtopic.php?t=23369
        GPIO.output(21, False)
        GPIO.output(23, False)
    else:
        print("off")
        GPIO.output(19, True)
        GPIO.output(21, True)
        GPIO.output(23, True)

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
if __name__ == '__main__':    
    try:
        client = mqtt.Client(_g_cst_ToMQTTTopicName)
    
        GPIO.setup(19, GPIO.OUT)
        GPIO.setup(21, GPIO.OUT)
        GPIO.setup(23, GPIO.OUT)
        client.on_connect = on_connect
        client.on_message = on_message
        client.on_subscribe = on_subscribe
        client.on_publish = on_publish
        client.connect(_g_cst_ToMQTTTopicServerIP, _g_cst_ToMQTTTopicServerPort,60)
        client.subscribe(_g_cst_ToMQTTTopicName)
        client.loop_forever()
    except KeyboardInterrupt:
        GPIO.cleanup()
        print("clean GPIO")
