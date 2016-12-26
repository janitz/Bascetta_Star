#!/bin/bash

#type "bash flash.sh" in terminal to run this script

sudo chmod go+rwx /dev/ttyUSB0
esptool.py --port /dev/ttyUSB0 write_flash 0x0 nodemcu-master-8-modules-2016-12-17-11-00-21-integer.bin



