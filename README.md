Documentation
=================

## 1. Initial Setup

In order to setup the broadcasting software, run the following command in terminal or command line:
```sh 
 python3 run.py
```
During the setup, you will be asked for your AWS access and secret keys. You may leave them blank and then add them manually in the [streamData.js](./streamData.js) file, however it is not recommended to complete the setup this way.<br>

<font style='color: red; weight: 300px'>**If you want to exit the setup at any point you may do so with Ctrl+C**</font>

Once the initial setup has been completed, the server should automatically start up. In the command line interface, you can see some useful info such as the local address of the control panel and renderers.
<br><br>

## 2. Post Setup Running

Once you have completed the initial setup, you can start the server with the same command used to set it up, however if you want the server to start with the control panel already open automatically, you can add the 'gui' keyword as such:
```sh 
 python3 run.py gui
```
Which will start the server like normally and open the control panel as well.
<br><br>

## 3. Switching Streams

The software allows for controlling multiple streams at once from one machine remotely, and there are two distinct ways to switch between streams depending on whether you want to switch the stream being rendered on a machine, or whether you want to switch which stream a contol panel is controlling. Currently, the software allows for rendering only one stream per machine.

