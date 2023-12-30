#!/usr/bin/env python

import os
import sys
import json
import time
import math
import shutil
import psutil
import atexit
import zipfile
import platform
import requests
import webbrowser
import subprocess

warningColor = '\033[91m'
dangerColor = '\033[93m'
goodColor = '\033[92m'
endColor = '\033[0m'
webpageIndex = None
jsonObj = None
serverRunning = False
serverPort = 5500
table = None
dynamodb = None;
pswd = None;
softwareInfo = None;
activeDb = None;




def main():
    global serverRunning
    global jsonObj
    global webpageIndex
    global serverPort
    global table
    global dynamodb
    global pswd
    global activeDb
    global softwareInfo

    startTime = time.time()



    def setupStreamData(check=True):
        response = requests.get('https://lgphy9q5lb.execute-api.eu-central-1.amazonaws.com/?licenseKey=' + softwareInfo['licensekey'])

        if response.status_code == 200:
            response = json.loads(response.text)
            accessKey = response['accessKey']
            secretKey = response['secretKey']
            
            temp = None
            if os.path.exists("./.streamData.js"):
                with open('./.streamData.js') as dataFile:
                    data = dataFile.read()
                    obj = data[data.find('{') : data.rfind('}')+1]
                    temp = json.loads(obj)

            if temp != None:
                if temp['dbName'] == "":
                    dbName = response['defaultStream']
                    print("setting to default stream")
                else:
                    dbName = temp['dbName']
                    print("setting to user stream")
            else:
                dbName = response['defaultStream']

            streamData = open("./.streamData.js", "w")
            streamData.write(f"var streamData = {{\n\t\"dbName\": \"{dbName}\",\n\t\"accessKey\": \"{accessKey}\",\n\t\"secretKey\": \"{secretKey}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};")
            streamData.close()

            if check:
                checkValidity()
        elif response.status_code == 403:
            print("Invalid license key.")
            exit()
        else:
            print("Error connecting to server. Please try again later.")
            print(response.text)
            exit()

    def printInfo():
        print(f"->  Access the control panel at http://localhost:{serverPort}/Transmitter/main.html\n")

        print("Renderer page index:")
        for page in webpageIndex:
            print("->  Access the " + page + f" page at http://localhost:{serverPort}" + webpageIndex[page])
        if jsonObj['dbName'] != "":
            print(f"Rendering for database: \'{jsonObj['dbName']}\'\n")
        else:
            print(warningColor + "Warning: No database name set. Please set in streamData.js" + endColor + "\n")

        print("Run the \'exit\' command to stop the server and exit\n")
        if not serverRunning:
            print("\nStarting integrated command console. Type \'help\' for a list of commands.")
        else:
            print("\nIntegrated command console started. Type \'help\' for a list of commands.")
        print("-"*80)

    def delete_all_except(except_name: list):
        current_directory = os.getcwd()

        for filename in os.listdir(current_directory):
            if filename not in except_name:
                file_path = os.path.join(current_directory, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f"Error deleting {file_path}: {e}")

    def updateSoftware():
        response = requests.get('https://g59302qee1.execute-api.eu-central-1.amazonaws.com?key=' + softwareInfo['licensekey'])
        filename = response.headers.get('Content-Disposition')[22:-1]

        if response.status_code == 200:
            with open(filename, 'wb') as file:
                file.write(response.content)
        elif json.loads(response.text)['error'] == 'Key not found':
            print('Invalid key.')
            exit()
        
        if not os.path.exists("temp"):
            os.system("mkdir temp")

        zipfile.ZipFile(filename).extractall('temp')

        zip_file_path = './temp'
        file = next(os.walk(zip_file_path))[1][0]
        sourceFolder = os.path.basename(os.path.normpath(zip_file_path))

        if platform.system() == "Linux" or platform.system() == "Darwin":
            if sourceFolder[0].isdigit():
                os.system(f"cp -a {zip_file_path}/{file}/. .")
            else:
                os.system(f"cp -a {zip_file_path}/. .")
        elif platform.system() == "Windows":
            os.system(f"xcopy /e /q /i \"{zip_file_path}/{file}\" \"./\"")

        if platform.system() == "Linux" or platform.system() == "Darwin":
            os.system("rm -rf temp")
            os.system(f"rm {filename}")
        elif platform.system() == "Windows":
            os.system("rmdir /s /q temp")
            os.system(f"del {filename}")
        
        with open('.softwareInfo.json', "w") as dataFile:
            softwareInfo['version'] = filename[:-4]
            dataFile.write(json.dumps(softwareInfo))
        

    def loadSoftwareInfo():
        global softwareInfo
        with open('.softwareInfo.json') as dataFile:
            data = dataFile.read()
            obj = data[data.find('{') : data.rfind('}')+1]
            softwareInfo = json.loads(obj)
    loadSoftwareInfo()     

    def checkValidity():
        validDirs = ['Transmitter', 'Renderer', 'CommonUse', '.streamData.js', '.softwareInfo.json', '.requirements.txt', 'run.py']
        missingFiles = []

        for file in validDirs:
            if not os.path.exists(file):
                missingFiles.append(file)

        if len(missingFiles) > 0:
            if os.path.exists(".initialSetupDone.txt"):
                print(f"Missing files/directories: {missingFiles}")
                repair = input("Would you like to repair the installation? (y/n) ")
            else:
                repair = "y"
            if repair.lower() == "y":
                print("Repairing installation...")
                delete_all_except([".streamData.js", ".softwareInfo.json"])
                updateSoftware()
                print("Installation repaired. Please restart the run.py file.")
                exit()

    def exit_handler():
        if jsonObj != None:
            jsonObj['accessKey'] = ''
            jsonObj['secretKey'] = ''
            with open('./.streamData.js', 'w') as outfile:
                
                string = f"var streamData = {{\n\t\"dbName\": \"{activeDb}\",\n\t\"accessKey\": \"{jsonObj['accessKey']}\",\n\t\"secretKey\": \"{jsonObj['secretKey']}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};"
                outfile.write(string)




    if not os.path.exists("./.initialSetupDone.txt"):
        if platform.system() == "Windows":
            os.system("cls")
            print("Performing initial setup...\n")
            os.system("python.exe -m pip install --upgrade pip")
            os.system("pip3 install -r ./.requirements.txt")
            os.system("cls")

            setupStreamData()

            os.system("type nul > ./.initialSetupDone.txt")
            os.system("cls")
            print("Initial setup complete.")

        elif platform.system() == "Linux" or platform.system() == "Darwin":
            os.system("clear")
            print("Performing initial setup...\n")
            os.system("pip3 install --upgrade pip")
            os.system("pip3 install -r ./.requirements.txt")
            os.system("clear")

            setupStreamData()

            os.system("touch ./.initialSetupDone.txt")
            os.system("clear")
            print("Initial setup complete.")

    else:
        if platform.system() == "Windows":
            os.system("cls")
        elif platform.system() == "Linux" or platform.system() == "Darwin":
            os.system("clear")



    webpageIndex = {
        "Team Scores/Stopwatch" : "/Renderer/football/teamScores/main.html",
        "Event Name" : "/Renderer/football/eventName/main.html",
    }

    if not os.path.exists("./.streamData.js"):
        print("streamData.js not found. Please fix and run again.")
        exit()

    setupStreamData(False)
    with open('./.streamData.js') as dataFile:
        data = dataFile.read()
        obj = data[data.find('{') : data.rfind('}')+1]
        jsonObj = json.loads(obj)
    atexit.register(exit_handler)

    executedArguments = " ".join(sys.argv[1:]).split('-')[1:]
    formattedArguments = {}
    for i in range(len(executedArguments)):
        parts = executedArguments[i].split()
        if len(parts) == 2:
            formattedArguments[parts[0]] = parts[1].lower()
        elif len(parts) == 1:
            formattedArguments[parts[0]] = ''

    validArguments = ['g', 'p', 'd', 'h', 'help']
    for arg in formattedArguments.keys():
        if arg not in validArguments:
            print(f"Invalid argument \'{arg}\'. Type \'python run.py -h\' for a list of valid arguments.")
            exit()
    if 'h' in formattedArguments.keys() or 'help' in formattedArguments.keys():
        print("Usage: python3 run.py [args]")
        print("Options:")
        print("  -g           : Opens the control panel in your default browser")
        print("  -p <port>    : Sets the port of the server")
        print("  -d <db name> : Sets the database name in streamData.js")
        print("  -h/-help     : Displays this help message")
        exit()
    if 'g' in formattedArguments.keys():
        webbrowser.open(f"http://localhost:{serverPort}/Transmitter/main.html", new=1)
    if 'p' in formattedArguments.keys():
        serverPort = formattedArguments['p']
    if 'd' in formattedArguments.keys():
        if formattedArguments['d'].startswith("admin"):
            print("Can't render an admin database.")
            exit()
        else:
            jsonObj['dbName'] = formattedArguments['d']
            streamData = open("./.streamData.js", "w")
            streamData.write(f"var streamData = {{\n\t\"dbName\": \"{jsonObj['dbName']}\",\n\t\"accessKey\": \"{jsonObj['accessKey']}\",\n\t\"secretKey\": \"{jsonObj['secretKey']}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};")
            streamData.close()
    
    checkValidity()
    print("Starting server...\n")
    printInfo()
    serverStartCommand = f"python3 -m http.server {serverPort}"
    server = subprocess.Popen(serverStartCommand.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    serverRunning = True
    if jsonObj['accessKey'] == '' or jsonObj['secretKey'] == '':
        print(warningColor + "Error: No access key or secret key set." + endColor + "\n")
    activeDb = jsonObj['dbName']

    while True:
        if serverRunning:
            commands = input(goodColor + ">>> " + endColor).split()
        else:
            commands = input(warningColor + ">>> " + endColor).split()
        commands[0] = commands[0].lower()

        if commands[0] == "help":
            print("  start: Starts the server")
            print("  stop: Stops the server")
            print("  restart [port number]: Restarts the server, optionally changing the port")
            print("  help: Displays this help message")
            print("  exit: Exits the program")
            print("  clear: Clears the console")
            print("  updatedb <database name>: Updates the database name in streamData.js")
            print("  port <port number>: Sets the port of the server")
            print("  info: Displays useful information about the current session")
            print("  gui: Opens the control panel in your default browser")
            print("  status: Displays the status of the server")
            print("  addresses: Displays the addresses of all available pages")
            print("  update: Updates the software to the latest purchased version")
        elif commands[0] == "start":
            if len(commands) == 2 and commands[1].isdigit():
                serverStartCommand = f"python3 -m http.server {commands[1]}"
                serverPort = commands[1]
            elif len(commands) == 2 and not commands[1].isdigit():
                print("  Invalid port number. Please enter a valid port number.")
                continue
            if not serverRunning:
                server = subprocess.Popen(serverStartCommand.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                serverRunning = True
                print(goodColor + f"  Starting Server on port {serverPort}." + endColor)
                startTime = time.time()
            else:
                print("  Server is already running.")
        elif commands[0] == "stop":
            if serverRunning:
                server.terminate()
                print(warningColor + "  Stopping Server." + endColor)
                serverRunning = False
            else:
                print("  Server is not running.")
        elif commands[0] == "restart" or commands[0] == "port":
            if serverRunning:
                if len(commands) == 2 and commands[1].isdigit():
                    serverStartCommand = f"python3 -m http.server {commands[1]}"
                    serverPort = commands[1]
                elif len(commands) == 2 and not commands[1].isdigit():
                    print(f"  Invalid port number \'{dangerColor + str(commands[1]) + endColor}\'. Please enter a valid port number.")
                    continue
                server.terminate()
                print(warningColor + "  Stopping Server." + endColor)
                serverRunning = False
                server = subprocess.Popen(serverStartCommand.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                serverRunning = True
                print(goodColor + f"  Starting Server on port {serverPort}." + endColor)
                startTime = time.time()
            else:
                print("  Server is not running. Use \'start\' to start the server.")
        elif commands[0] == "exit":
            if serverRunning:
                server.terminate()
                print("  Stopping Server.")
                serverRunning = False
            print("  Exiting...")
            exit()
        elif commands[0] == "clear":
            if platform.system() == "Windows":
                os.system("cls")
            elif platform.system() == "Linux" or platform.system() == "Darwin":
                os.system("clear")
            printInfo()
        elif commands[0] == "updatedb":
            if commands[1].startswith("admin"):
                print("  Can't render an admin database.")
                continue
            else:
                if len(commands) == 2:
                    dbName = commands[1]
                    activeDb = dbName
                    streamData = open("./.streamData.js", "w")
                    streamData.write(f"var streamData = {{\n\t\"dbName\": \"{dbName}\",\n\t\"accessKey\": \"{jsonObj['accessKey']}\",\n\t\"secretKey\": \"{jsonObj['secretKey']}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};")
                    streamData.close()
                    print("  Database name updated to " + goodColor + dbName + endColor + ". Reload sources in OBS to apply.")
                else:
                    print("  Invalid number of arguments. Usage: updatedb <database name>")
        elif commands[0] == "info":
            cpuUsage = psutil.cpu_percent()

            with open('./.streamData.js') as dataFile:
                data = dataFile.read()
                obj = data[data.find('{') : data.rfind('}')+1]
                jsonObj = json.loads(obj)
            uptimeStr = f"{str(math.floor((time.time() - startTime) / 60 / 60))}h {str(math.floor((time.time() - startTime) / 60) % 60)}m {str(math.floor(time.time() - startTime) % 60)}s"
            print(f"  Running PlayVision™ broadcasting software version {softwareInfo['version']}.\n")
            print(f"  Server Status: {goodColor + 'Running' + endColor if serverRunning else warningColor + 'Not Running' + endColor}")
            print(f"  Server Uptime: {uptimeStr if serverRunning else warningColor + 'Not Running' + endColor}")
            if cpuUsage <= 50:
                print(f"  CPU Usage: {goodColor + str(cpuUsage)}%" + endColor)
            elif cpuUsage <= 70:
                print(f"  CPU Usage: {dangerColor + str(cpuUsage)}%" + endColor)
            else:
                print(f"  CPU Usage: {warningColor + str(cpuUsage)}%" + endColor)
            print(f"  Port: {serverPort}\n")
            print(f"  OS: {platform.system()} {platform.release()}")
            print(f"  Python Version: {platform.python_version()}\n")
            print(f"  License Key: {softwareInfo['licensekey'] if softwareInfo['licensekey'] != '' else (warningColor + 'Not Found' + endColor)}")
            print(f"  Database Name: {jsonObj['dbName'] if jsonObj['dbName'] != '' else (warningColor + 'Not Set' + endColor)}")
        elif commands[0] == "gui":
            if serverRunning:
                webbrowser.open(f"http://localhost:{serverPort}/Transmitter/main.html", new=1)
                print("  Opened control panel in browser.")
            else:
                print("  Can't open GUI, server is not running.")
        elif commands[0] == "status":
            if serverRunning:
                print(goodColor + "  Server is running." + endColor)
            else:
                print(warningColor + "  Server is not running." + endColor)

            cpuUsage = psutil.cpu_percent()
            if cpuUsage > 90:
                print(warningColor + f"  High CPU Usage: {cpuUsage}%" + endColor)
        elif commands[0] == "addresses":
            for page in webpageIndex:
                print(f"  {page}\n    http://localhost:{serverPort}{webpageIndex[page]}")
            print(f"\n  Control Panel\n    http://localhost:{serverPort}/Transmitter/main.html")
        elif commands[0] == "update":
            if not serverRunning:
                confirm = input(warningColor + "  Are you sure you want to update the software? (y/n) " + endColor)
                if confirm.lower() == "y":
                    print("  Updating software...")
                    delete_all_except([".streamData.js", ".softwareInfo.json"])
                    updateSoftware()
                    print("  Software updated. Please restart the run.py file.")
                    exit()
                else:
                    print("  Update cancelled.")
            else:
                print("  Can't update software while server is running. Stop server first.")
        elif commands[0] == "":
            pass
        else:
            print(f"  \'{commands[0]}\' is not a recognized command. Type \'help\' for a list of commands.")


if __name__ == "__main__":
    main()