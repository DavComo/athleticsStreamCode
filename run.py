import os
import sys
import json
import time
import math
import shutil
import psutil
import platform
import webbrowser
import subprocess

warningColor = '\033[91m'
dangerColor = '\033[93m'
goodColor = '\033[92m'
endColor = '\033[0m'
webpageIndex = None
jsonObj = None
serverRunning = False




def main():
    global serverRunning
    global jsonObj
    global webpageIndex

    startTime = time.time()

    def setupStreamData():
        accessKey = input("Enter your given access key (Leave blank to set up manually later): ")
        secretKey = input("Enter your given secret key (Leave black to set up manually later): ")
        dbName = input("Enter your given database name (Leave blank to set up manually later): ")

        streamData = open("./streamData.js", "w")
        streamData.write(f"var streamData = {{\n\t\"dbName\": \"{dbName}\",\n\t\"accessKey\": \"{accessKey}\",\n\t\"secretKey\": \"{secretKey}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};")
        streamData.close()

    def printInfo():
        print("->  Access the control panel at http://localhost:5500/Transmitter/main.html\n")

        print("Renderer page index:")
        for page in webpageIndex:
            print("->  Access the " + page + " page at http://localhost:5500" + webpageIndex[page])
        if jsonObj['dbName'] != "":
            print(f"Rendering for database: \'{jsonObj['dbName']}\'\n")
        else:
            print(warningColor + "Warning: No database name set. Please set in streamData.js" + endColor + "\n")

        print(f"Access Key: {jsonObj['accessKey'] if jsonObj['accessKey'] != '' else (warningColor + 'Not set' + endColor)}")
        print(f"Secret Key: {jsonObj['secretKey'] if jsonObj['secretKey'] != '' else (warningColor + 'Not set' + endColor)}\n")

        print("Run the \'stop\' command to stop the server\n")
        if len(sys.argv) > 1:
            if (sys.argv[1].lower() == "gui"):
                webbrowser.open("http://localhost:5500/Transmitter/main.html", new=1)
        if not serverRunning:
            print("\nStarting integrated command console. Type \'help\' for a list of commands.")
        else:
            print("\nIntegrated command console started. Type \'help\' for a list of commands.")
        print("-"*80)

    def delete_all_except_one(except_name):
        current_directory = os.getcwd()

        for filename in os.listdir(current_directory):
            if filename != except_name:
                file_path = os.path.join(current_directory, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f"Error deleting {file_path}: {e}")

    def extract_folder(zip_file_path):
        file = next(os.walk(zip_file_path))[1][0]
        sourceFolder = os.path.basename(os.path.normpath(zip_file_path))

        if platform.system() == "Linux" or platform.system() == "Darwin":
            if sourceFolder[0].isdigit():
                os.system(f"cp -a {zip_file_path}/{file}/. .")
            else:
                os.system(f"cp -a {zip_file_path}/. .")
        elif platform.system() == "Windows":
            os.system(f"xcopy /e /q /i \"{zip_file_path}/{file}\" \"./\"")
            






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
    print("Starting server...\n")

    if not os.path.exists("streamData.js"):
        print("streamData.js not found. Please fix and run again.")
        exit()

    with open('streamData.js') as dataFile:
        data = dataFile.read()
        obj = data[data.find('{') : data.rfind('}')+1]
        jsonObj = json.loads(obj)

    printInfo()

    serverStartCommand = "python3 -m http.server 5500"
    server = subprocess.Popen(serverStartCommand.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    serverRunning = True

    while True:
        if serverRunning:
            command = input(goodColor + ">>> " + endColor)
        else:
            command = input(warningColor + ">>> " + endColor)
        if command == "help":
            print("  start: Starts the server")
            print("  stop: Stops the server")
            print("  restart: Restarts the server")
            print("  help: Displays this help message")
            print("  exit: Exits the program")
            print("  clear: Clears the console")
            print("  updatedb <database name>: Updates the database name in streamData.js")
            print("  info: Displays useful information about the current session")
            print("  gui: Opens the control panel in your default browser")
            print("  status: Displays the status of the server")
            print("  update <folder path>: Updates the software to the specified version")
        elif command == "start":
            if not serverRunning:
                server = subprocess.Popen(serverStartCommand.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                serverRunning = True
                print(goodColor + "  Starting Server." + endColor)
                startTime = time.time()
            else:
                print("  Server is already running.")
        elif command == "stop":
            server.terminate()
            print(warningColor + "  Stopping Server." + endColor)
            serverRunning = False
        elif command == "restart":
            if serverRunning:
                server.terminate()
                print(warningColor + "  Stopping Server." + endColor)
                serverRunning = False
                server = subprocess.Popen(serverStartCommand.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                serverRunning = True
                print(goodColor + "  Starting Server." + endColor)
                startTime = time.time()
            else:
                print("  Server is not running. Use \'start\' to start the server.")
        elif command == "exit":
            if serverRunning:
                server.terminate()
                print("  Stopping Server.")
                serverRunning = False
            print("  Exiting...")
            exit()
        elif command == "clear":
            if platform.system() == "Windows":
                os.system("cls")
            elif platform.system() == "Linux" or platform.system() == "Darwin":
                os.system("clear")
            printInfo()
        elif "updatedb" in command:
            arguments = command.split()
            if len(arguments) == 2:
                dbName = arguments[1]
                streamData = open("./streamData.js", "w")
                streamData.write(f"var streamData = {{\n\t\"dbName\": \"{dbName}\",\n\t\"accessKey\": \"{jsonObj['accessKey']}\",\n\t\"secretKey\": \"{jsonObj['secretKey']}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};")
                streamData.close()
                print("  Database name updated to " + goodColor + dbName + endColor + ". Reload sources in OBS to apply.")
            else:
                print("  Invalid number of arguments. Usage: updatedb <database name>")
        elif command == "info":
            cpuUsage = psutil.cpu_percent()

            with open('streamData.js') as dataFile:
                data = dataFile.read()
                obj = data[data.find('{') : data.rfind('}')+1]
                jsonObj = json.loads(obj)
            uptimeStr = f"{str(math.floor((time.time() - startTime) / 60 / 60))}h {str(math.floor((time.time() - startTime) / 60) % 60)}m {str(math.floor(time.time() - startTime) % 60)}s"
            print("  Running PlayVision™ broadcasting software.\n")
            print(f"  Server Status: {goodColor + 'Running' + endColor if serverRunning else warningColor + 'Not Running' + endColor}")
            print(f"  Server Uptime: {uptimeStr if serverRunning else warningColor + 'Not Running' + endColor}")
            if cpuUsage <= 50:
                print(f"  CPU Usage: {goodColor + str(cpuUsage) + endColor}%")
            elif cpuUsage <= 70:
                print(f"  CPU Usage: {dangerColor + str(cpuUsage) + endColor}%")
            else:
                print(f"  CPU Usage: {warningColor + str(cpuUsage) + endColor}%")
            print(f"  OS: {platform.system()} {platform.release()}")
            print(f"  Python Version: {platform.python_version()}\n")
            print(f"  Access Key: {jsonObj['accessKey'] if jsonObj['accessKey'] != '' else (warningColor + 'Not set' + endColor)}")
            print(f"  Secret Key: {jsonObj['secretKey'] if jsonObj['secretKey'] != '' else (warningColor + 'Not set' + endColor)}")
            print(f"  Database Name: {jsonObj['dbName'] if jsonObj['dbName'] != '' else (warningColor + 'Not set' + endColor)}")
        elif command == "gui":
            if serverRunning:
                webbrowser.open("http://localhost:5500/Transmitter/main.html", new=1)
                print("  Opened control panel in browser.")
            else:
                print("  Can't open GUI, server is not running.")
        elif command == "status":
            if serverRunning:
                print(goodColor + "  Server is running." + endColor)
            else:
                print(warningColor + "  Server is not running." + endColor)

            cpuUsage = psutil.cpu_percent()
            if cpuUsage > 90:
                print(warningColor + f"  High CPU Usage: {cpuUsage}%" + endColor)
        elif "update" in command:
            if not serverRunning:
                arguments = command.split()
                if len(arguments) != 2:
                    print("  Invalid number of arguments. Usage: update <zip file path>")
                    continue
                if not os.path.exists(arguments[1]):
                    print("  File not found. Please use absolute path.")
                    continue
                
                print("  Updating software...")
                delete_all_except_one("streamData.js")
                extract_folder(arguments[1])
                print("  Software updated. Please restart the run.py file.")
                exit()
            else:
                print("  Can't update software while server is running. Stop server first.")
        elif command == "":
            pass
        else:
            print(f"  \'{command}\' is not a recognized command. Type \'help\' for a list of commands.")


if __name__ == "__main__":
    main()