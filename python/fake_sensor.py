import sys
import math
from time import sleep
import numpy as np
import msgpack

def main():
    n = 2
    if len(sys.argv) >= 2:
        n = int(sys.argv[1])

    #print(n)
    # initialize array
    arr = np.array([.0, .1, .2, .3, .4, .5, .6, .7, .8, .9]) 
    while(True):
        values = np.sin(arr*np.pi)
        #scale values and add noise
        values = values*92 + np.random.rand(10)*10
        sys.stdout.buffer.write(msgpack.packb(values.tolist()))
        sys.stdout.buffer.flush()
        sleep(n)
        arr = arr + 1 # prepare next loop

if __name__ == "__main__":
    main()