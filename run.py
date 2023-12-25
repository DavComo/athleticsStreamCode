import os
import sys
import json
import platform
import webbrowser



def setupStreamData():
    accessKey = input("Enter your given access key (Leave blank to set up manually later): ")
    secretKey = input("Enter your given secret key (Leave black to set up manually later): ")

    streamData = open("./streamData.js", "w")
    streamData.write(f"var streamData = {{\n\t\"dbName\": \"\",\n\t\"accessKey\": \"{accessKey}\",\n\t\"secretKey\": \"{secretKey}\",\n\t\"awsRegion\": \"eu-central-1\"\n}};")
    streamData.close()

def main():
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

    print("->  Access the control panel at http://localhost:5500/Transmitter/main.html\n")

    print("Renderer page index:")
    for page in webpageIndex:
        print("->  Access the " + page + " page at http://localhost:5500" + webpageIndex[page])
    print(f"Rendering for database: \'{jsonObj['dbName']}\'\n")

    print(f"Access Key: {jsonObj['accessKey'] if jsonObj['accessKey'] != '' else 'Not set'}")
    print(f"Secret Key: {jsonObj['secretKey'] if jsonObj['secretKey'] != '' else 'Not set'}\n")

    print("Press Ctrl+C to stop the server\n")
    if len(sys.argv) > 1:
        if (sys.argv[1].lower() == "gui"):
            webbrowser.open("http://localhost:5500/Transmitter/main.html", new=1)
            
    os.system("python3 -m http.server 5500")


if __name__ == "__main__":
    main()