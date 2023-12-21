import os
import sys
import json
import platform
import webbrowser

with open('streamData.js') as dataFile:
    data = dataFile.read()
    obj = data[data.find('{') : data.rfind('}')+1]
    jsonObj = json.loads(obj)

webpageIndex = {
    "Team Scores/Stopwatch" : "/Renderer/football/teamScores/main.html",
    "Event Name" : "/Renderer/football/eventName/main.html",
}

if platform.system() == "Windows":
    os.system("cls")
elif platform.system() == "Linux" or platform.system() == "Darwin":
    os.system("clear")
print("Starting server...\n")
print("->  Access the transmitter at http://localhost:5500/Transmitter/main.html\n")

print("Renderer page index:")
for page in webpageIndex:
    print("->  Access the " + page + " page at http://localhost:5500" + webpageIndex[page])
print(f"Rendering for database: \'{jsonObj['dbName']}\'\n")

print(f"Access Key: {jsonObj['accessKey']}")
print(f"Secret Key: {jsonObj['secretKey']}\n")

print("Press Ctrl+C to stop the server\n")
if len(sys.argv) > 1:
    if (sys.argv[1].lower() == "gui"):
        webbrowser.open("http://localhost:5500/Transmitter/main.html", new=1)
        
os.system("python3 -m http.server 5500")
