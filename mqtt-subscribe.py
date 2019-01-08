import paho.mqtt.client as mqtt
import json
import time
import RPi.GPIO as GPIO

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

r_pin=27
g_pin=29
b_pin=31 

#===============================MQTT Setting============================
_g_cst_ToMQTTTopicServerIP = 'localhost'#ServerIP
_g_cst_ToMQTTTopicServerPort = 1883#監聽端口
_g_cst_ToMQTTTopicName = 'Home/Temperature/Light/1'#主題

mqttc = mqtt.Client(_g_cst_ToMQTTTopicName)
mqttc.connect(_g_cst_ToMQTTTopicServerIP,_g_cst_ToMQTTTopicServerPort)#(ServerIP,監聽端口)

def on_connect(client ,usersata ,flags ,rc):
    print("Connected with result code "+str(rc))
    client.subscribe("Home/Temperature/1")

def on_message(client, userdata, msg):
    #print(msg.topic+" "+str(msg.payload.decode("utf-8")))
    data=json.loads(msg.payload)
    if data['meta']['temperature']>28:
        print("warning")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("192.168.137.10", 1883, 60)
client.loop_forever()

def colorSwitch(code):
    def flashColor(pin):
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin,True)
        global p 
        p = GPIO.PWM(pin, 50)  # 通道为 12 频率为 50Hz
        p.start(0)
        for dc in range(0, 101, 2):
            p.ChangeDutyCycle(dc)
            time.sleep(0.1)
        for dc in range(100, -1, -2):
            p.ChangeDutyCycle(dc)
            time.sleep(0.1)
    try:
        while True:
            if code is 'waiting':
                flashColor(r_pin)
                flashColor(g_pin)
                flashColor(b_pin)
            elif code is 'running':
                flashColor(b_pin)
            elif code is 'serius':
                flashColor(r_pin)
                flashColor(b_pin)
            elif code is 'alert':
                flashColor(g_pin)
            elif code is 'warning':
                flashColor(r_pin)
    except KeyboardInterrupt:
        pass
    p.stop()
    GPIO.cleanup()

if __name__ == "__main__": 
    colorSwitch('waiting')