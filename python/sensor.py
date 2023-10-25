#ultrasonic sensor


import RPi.GPIO as GPIO
import time
import numpy as np


#GPIO Mode BCM setzen
GPIO.setmode(GPIO.BCM)

#GPIO Pins setzen
GPIO_TRIGGER = 18
GPIO_ECHO = 24

#GPIO IN / OUT setzen
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)


def distance():

    # Trigger -> HIGH
    GPIO.output(GPIO_TRIGGER, True)

    # Trigger nach 0.01ms zu LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    # Zeit setzen
    StartTime = time.time()
    StopTime = time.time()
    # Startzeit
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()

        # Ankunftszeit
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    # Zeitunterschied zwischen Start und Ankunft
    TimeDiff = StopTime - StartTime
    # mit der Schallgeschwindigkeit (34300 cm/s) multiplizieren
    # und dividieren durch 2, denn hin und zurück
    distance = (TimeDiff * 34300) / 2

    return distance

if __name__ == '__main__':
    try:
        while True:
            dist = distance()
            #print ("Gemessener Abstand = %.1f cm" % dist)
            values = []
            for i in np.arange(10):
                dist = distance()
                values.append(dist)
            time.sleep(2)
        # Zurücksetzen durch Drücken von CTRL + C

    except KeyboardInterrupt:
        #print("Messung durch Benutzer gestoppt")
        GPIO.cleanup()