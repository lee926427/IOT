import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO 
import json
import datetime,time
import Adafruit_DHT
import random

#=============================Temp Sensor==============================
sensor_temp_GPIO=14#DAT=Pin_8,VCC=Pin_2,GND=Pin_6
sensor_module=Adafruit_DHT.DHT22
#===============================MQTT Setting============================
_g_cst_ToMQTTTopicServerIP = 'localhost'#ServerIP
_g_cst_ToMQTTTopicServerPort = 1883#監聽端口
_g_cst_ToMQTTTopicName = "Home/Temperature/1"#主題
mqttc = mqtt.Client(_g_cst_ToMQTTTopicName)
mqttc.connect(_g_cst_ToMQTTTopicServerIP,_g_cst_ToMQTTTopicServerPort)#(ServerIP,監聽端口)
#==============================message Format===========================

def sensor_log(humidity,temperature):

        dataformat={
        "topic":_g_cst_ToMQTTTopicName,
        "date":datetime.date.today().strftime("%Y-%m-%d"),
        "data":[{
                "class":"Temperature",
                "record":[{"time":round(time.time()),"data":round(temperature,3)}]
            },{
                "class":"Humidity",
                "record":[{"time":round(time.time()),"data":round(humidity,3)}]
            }],
        }
        print(json.dumps(dataformat))
        mqttc.publish('Home/Temperature/1',json.dumps(dataformat),0)#(主題,傳給伺服器的訊息,Qos)
def main():
    while True:
        humidity, temperature = Adafruit_DHT.read_retry(sensor_module, sensor_temp_GPIO)
        sensor_log(humidity,temperature)
        time.sleep(60)
    GPIO.cleanup()


if __name__=='__main__':
    main()