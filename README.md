PlayVision™ Documentation
=================

### Page Index
1. [First Time Setup](#1-first-time-setup)
2. [Post-Setup Running](#2-post-setup-running)
3. [Switching Stream Databases](#3-switching-stream-databases)
4. [Add/Remove Custom Schools](#4-addremove-custom-schools)
5. [Control Panel Specifications](#5-control-panel-specifications)
6. [Integrated Command Console](#6-integrated-command-console)
7. [Toubleshooting](#7-troubleshooting)

<br>

## 1. First Time Setup

In order to setup your PlayVision™ software, navigate to your file directory with the 'cd' command. For example:
```sh
cd /Users/livestreamCodeFolder/
```
And then run the following command in terminal or command line to initialize the server:
```sh 
python run.py
```
During the setup, you will be asked for your AWS access and secret keys as well as your database name, which can be changed later, as per section 3. You may leave them blank and then add them manually in the [streamData.js](./streamData.js) file, however it is not recommended to complete the setup this way. The server will start as normal, however most parts of it won't work.<br>

<font style='color: red; weight: 300px'>**If you want to stop the setup or server at any point you may do so with Ctrl+C**</font>

Once the initial setup has been completed, the server should automatically start up. In the command line interface, you can see some useful info such as the local address of the control panel and renderers.
<br><br>

## 2. Post Setup Running

Once you have completed the initial setup, you can start the server with the same command used to set it up, however if you want the server to start with the control panel already open automatically, you can add the 'gui' keyword as such:
```sh 
 python run.py gui
```
Which will start the server like normally and open the control panel as well.
<br><br>

## 3. Switching Stream Databases

PlayVision™ software allows for controlling multiple streams at once from one machine remotely, and there are two distinct ways to switch between streams depending on whether you want to switch the stream being rendered on a machine, or whether you want to switch which stream your contol panel is controlling. 


>#### Control Panel Switching
>Switching the subject of a control panel instance is very easy. Just change the name of the database in the top right to one of your assigned databases (Syntax matters), and click on 'Sync/Reset Values'. <br><br>
>![](./readme-images/panelSwitching.png)<br><br>
>Once the text in the top right says you are connected, you are good to go.<br><br>

>#### Renderer Switching
>Switching renderers isn't as simple as switching control panel since it isn't assumed you would need to switch database mid-stream, but it still is far from complicated. <br>
>To switch renderer database, go to your [streamData.js](./streamData.js) file and change the value of `dbName` to one of your assigned databases. Then, start or restart the broadcasting server and your new stream should be attached to your chosen database.<br>
>Since the release of version 1.3.0, it is also possible to switch your renderer database in real time without shutting down the stream through the integrated command console (ICC) with the `updatedb` command. For more instructions on how to use the ICC, use the `help` command.

<br><br>

## 4. Add/Remove Custom Schools
Once the initial setup has been completed, you can add or remove any custom school or use the preloaded ones. In order to add or remove custom schools, run the following command in terminal or command line:
```sh
python modifySchoolList.py {add/remove}
```
When running the command, ignore the curly brackets and pick either the add or remove keyword based on what you would like to do.
<br><br>

#### Adding
If you are adding a new school, follow the instructions of the program and when prompted for the path of the logo for the school you want, it's important to ensure the picture is exactly 200 by 200 pixels in size and that you enter the absolute path of the image in your system (Starting with for example C:/ on Windows and /Users on MacOS). After you have entered, if your [streamData.js](./streamData.js) is valid and existant, you will be asked to provide the names of all the databases you want to add the school to. Enter these comma separated, for example:
`MIS-stream-1, MIS-stream_2, MIS-stream_3` <br>
After all that, you should receive confirmation of each successfull change to the databases and able to seamlessly use your new custom school.
<br><br>

#### Removing
To remove a school from the database use the 'remove' keyword when running the `modifySchoolList.py` file. Most steps will be similar to the steps used for adding schools and follow the same rules, for example, database names will need to be comma separated. If you want to know what schools each database has attached, check through the color view in the control panel for each database. <br>
<font style='color: red; weight: 300px'>**Warning: Removing a school for ANY database will erase the corresponding picture therefore, without adding it back manually, it isn't possible to have only one database with a school and other not without some manual changes needed.**</font>

<br><br>

## 5. Control Panel Specifications
Using the control panel is mostly self explanatory however there are multiple things to watch out for, or that need slightly more explanation. <br><br>
Every value has to be saved with 'Save Values' button except for some aspects of the 'Stopwatch' tab, specifically the stopwatch itself and the period interval (While it is not required, it is recommended to save when changing the period interval). The period interval value is meant for automatic period stopping, such as every 45 minutes in football or 12 minutes in basketball, that the stopwatch will automatically stop at when it is a multiple of that number (For example, at 45, 90 and 135 minutes, the stopwatch will stop at for football). The stopwatch can then be easily started again by pressing the start button. For the stopwatch, pressing either the start/stop or reset buttons is separate from the 'Save Values' button so you don't need to save when you manipulate the stopwatch. <br><br>
If you need to reset the values in the control panel with those last saved, you can do so with the 'Sync/Reset Values' button in the top right. You also need to use that button whenever switching databases in realtime so as to update your panel with the chosen database. <br><br>
For setting data on the teamscores page, everything is straightforward, however it is important to make sure that the side names being used are corresponding with the acronyms saved in the corresponding database, as visible on the color page (For example, if a school is titled 'MIS Colors' in the color page, the acronym 'MIS' must be used when setting the side name in the team scores page). If this procedure isn't followed correctly, the score renderer won't work correctly or even at all. <br><br>
Finally, on the color setter page, each value must be saved as a valid hex code with the `#` included.

<br><br>

## 6. Integrated Command Console
It is not recommended to use the integrated command console without familiarizing youself with its uses first. Due to the everchanging nature of the ICC, this documentation won't referr to every command in the console, however, invoking the `help` command will display every command and a short explanation of its function.

<br><br>

## 7. Troubleshooting
To Be Added When Encountering Issues. <br>
For solving any issues that aren't listed here, please email live@mis-munich.de with the email subject being `Issue:` followed by a description of your issue.