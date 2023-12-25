PlayVision™ Documentation
=================

## 1. First Time Setup

In order to setup your PlayVision™ software, navigate to your file directory with the 'cd' command. For example:
```sh
cd /Users/livestreamCodeFolder/
```
And then run the following command in terminal or command line to initialize the server:
```sh 
python3 run.py
```
During the setup, you will be asked for your AWS access and secret keys as well as your database name, which can be changed later, as per section 3. You may leave them blank and then add them manually in the [streamData.js](./streamData.js) file, however it is not recommended to complete the setup this way. The server will start as normal, however most parts of it won't work.<br>

<font style='color: red; weight: 300px'>**If you want to stop the setup or server at any point you may do so with Ctrl+C**</font>

Once the initial setup has been completed, the server should automatically start up. In the command line interface, you can see some useful info such as the local address of the control panel and renderers.
<br><br>

## 2. Post Setup Running

Once you have completed the initial setup, you can start the server with the same command used to set it up, however if you want the server to start with the control panel already open automatically, you can add the 'gui' keyword as such:
```sh 
 python3 run.py gui
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
>To switch renderer database, go to your [streamData.js](./streamData.js) file and change the value of `dbName` to one of your assigned databases. Then, start or restart the broadcasting server and your new stream should be attached to your chosen database.<br><br>

<br>

## 4. Add/Remove Custom School
Once the initial setup has been completed, you can add or remove any custom school or use the preloaded ones. In order to add or remove custom schools, run the following command in terminal or command line:
```sh
python3 modifySchoolList.py {add/remove}
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

## Control Panel Basics
