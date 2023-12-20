import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

var docData = null;
var schools = ["mis", "fis", "ais", "zis", "sgsm", "bis"];

(function(window, document, undefined) {

    window.onload = init();

})(window, document, undefined);

var dynamodb;
var dynamoClient;

async function init() {  
    var inputs = document.getElementsByTagName("input")
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "Loading..."
    };
    // Initialize AWS SDK and DynamoDB client
    AWS.config.update({
        region: streamData.awsRegion,
        accessKeyId: streamData.awsAccessKey,
        secretAccessKey: streamData.awsSecretKey
    });

    dynamodb = new AWS.DynamoDB();
    dynamoClient = new AWS.DynamoDB.DocumentClient();

    initButtons();

    fetchData();
}


//Module functions

function initButtons() {
    function initNavBar() {
        function initNavTab(targetTab, targetPage) {
            var activeElements = document.getElementsByClassName("is-active");
            for (var i = 0; i <= activeElements.length; i++) {
                activeElements[0].classList.remove("is-active");
            }
            document.getElementById(targetTab).classList.add("is-active");
            document.getElementById(targetPage).classList.add("is-active");
        }

        var navBar = document.getElementById("navBar");
        for (var i = 0; i < navBar.children.length; i++) {
            document.getElementById(navBar.children[i].id).onclick = function() {
                var nameOfPage = this.id.charAt(4).toLowerCase() + this.id.slice(5).slice(0, -3)
                initNavTab(this.id, nameOfPage);
            };
        
        }
    }
    initNavBar();

    //Init Reset Value Button
    document.getElementById("resetValues").onclick = function() {
        updateData();

        var ms = docData['gameScreen']['stopwatch']['valueMs'];
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        document.getElementById("valueMs").value = hours + " h : " + minutes + " m : " + seconds%60 + " s : " + ms%1000 + " ms"
    };

    //Connections View
    document.getElementById("viewConnections").onclick = function() {
        document.getElementById("connectionInfo").classList.remove("hidden");
        document.getElementById("blurrableElement").classList.add("blur");
    }

    document.getElementById("closeConnections").onclick = function() {
        document.getElementById("connectionInfo").classList.add("hidden");
        document.getElementById("blurrableElement").classList.remove("blur");
    }


    //Upload Data for all inputs
    document.getElementById("saveValues").onclick = async function() {
        document.getElementById("saveValues").innerText = "Save Successful"
        document.getElementById("saveValues").style.backgroundColor = "green"
        var choiceIds = ["eventScene"];
        var toggleIds = ["showEvent"];


        //Save Color Page
        schools.forEach(school => {
            var params = {
                TableName: tableName,
                Key: {
                  "valueId": "primaryColors"
                },
                UpdateExpression: ("set " + school + " = :r"),
                ExpressionAttributeValues: {
                    ":r": document.getElementById(school + "Primary").value,

                },
                ReturnValues: "UPDATED_NEW"
              };
              
            dynamoClient.update(params, function(err, data) {});

            var params = {
                TableName: tableName,
                Key: {
                  "valueId": "secondaryColors"
                },
                UpdateExpression: ("set " + school + " = :r"),
                ExpressionAttributeValues: {
                    ":r": document.getElementById(school + "Secondary").value,

                },
                ReturnValues: "UPDATED_NEW"
              };
              
            dynamoClient.update(params, function(err, data) {});
        });

        var params = {
            TableName: tableName,
            Key: {
              "valueId": "eventClassifier"
            },
            UpdateExpression: ("set eventName = :r, eventScene = :s, showEvent = :t"),
            ExpressionAttributeValues: {
                ":r": document.getElementById("eventNameIs").value,
                ":s": document.getElementById("eventScene").value,
                ":t": document.getElementById("showEvent").checked
            },
            ReturnValues: "UPDATED_NEW"
          };
          
        dynamoClient.update(params, function(err, data) {});

        var params = {
            TableName: tableName,
            Key: {
              "valueId": "gameScreen"
            },
            UpdateExpression: ("set gameName = :r, showGame = :s, sideOneName = :t, sideTwoName = :u, sideOneScore = :v, sideTwoScore = :w, showStopwatch = :x"),
            ExpressionAttributeValues: {
                ":r": document.getElementById("gameName").value,
                ":s": document.getElementById("showGame").checked,
                ":t": document.getElementById("side_1-name-scores").value,
                ":u": document.getElementById("side_2-name-scores").value,
                ":v": document.getElementById("side_1-score").value,
                ":w": document.getElementById("side_2-score").value,
                ":x": document.getElementById("showStopwatch").checked
            },
            ReturnValues: "UPDATED_NEW"
          };
          
        dynamoClient.update(params, function(err, data) {});

        await new Promise(r => setTimeout(r, 500));

        document.getElementById("saveValues").innerText = "Save Values"
        document.getElementById("saveValues").style.removeProperty("background-color")
        
    }
}


var dynamodb;
var docDataTempTemp;
var tableName;

function fetchData() {
    tableName = 'stream_' + streamData.streamId;
    const params = {
        TableName: tableName,
        // Add any other parameters as needed
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Error fetching data from DynamoDB:", err);
        } else {
            // Update the UI with the fetched data
            docDataTempTemp = data.Items;
            updateData()
        }
    });
}

var docDataTemp = {};
var colors;
var docData = {}
function updateData() {
    for (var index = 0; index < docDataTempTemp.length; index++) {
        var indexkey = docDataTempTemp[index].valueId.S;
        docDataTemp[indexkey] = docDataTempTemp[index];
    }


    docData = {
        "team_1" : docDataTemp['gameScreen']['sideOneName'].S,
        "team_2" : docDataTemp['gameScreen']['sideTwoName'].S,
        "team_1s" : docDataTemp['gameScreen']['sideOneScore'].S,
        "team_2s" : docDataTemp['gameScreen']['sideTwoScore'].S,
        "gameName_1" : docDataTemp['gameScreen']['gameName'].S,
        "hide_1" : docDataTemp['gameScreen']['showGame'].BOOL,
        "stopwatchms" : docDataTemp['gameScreen']['stopwatchValueMs'].N,
        "stopwatchrunning" : docDataTemp['gameScreen']['stopwatchRunning'].BOOL,
        "startedAt" : docDataTemp['gameScreen']['stopwatchStartedAt'].N,
        "showStopwatch" : docDataTemp['gameScreen']['showStopwatch'].BOOL,
        "eventName" : docDataTemp['eventClassifier']['eventName'].S,
        "eventScene" : docDataTemp['eventClassifier']['eventScene'].S,
        "showEvent" : docDataTemp['eventClassifier']['showEvent'].BOOL,
    }

    colors = {
        'mis_primary' : docDataTemp['primaryColors']['mis'].S,
        'mis_secondary' : docDataTemp['secondaryColors']['mis'].S,
        'ais_primary' : docDataTemp['primaryColors']['ais'].S,
        'ais_secondary' : docDataTemp['secondaryColors']['ais'].S,
        'fis_primary' : docDataTemp['primaryColors']['fis'].S,
        'fis_secondary' : docDataTemp['secondaryColors']['fis'].S,
        'zis_primary' : docDataTemp['primaryColors']['zis'].S,
        'zis_secondary' : docDataTemp['secondaryColors']['zis'].S,
        'sgsm_primary' : docDataTemp['primaryColors']['sgsm'].S,
        'sgsm_secondary' : docDataTemp['secondaryColors']['sgsm'].S,
        'bis_primary' : docDataTemp['primaryColors']['bis'].S,
        'bis_secondary' : docDataTemp['secondaryColors']['bis'].S,
    }

    //Color Page
    for (var i = 0; i < schools.length; i++) {
        document.getElementById(schools[i] + "Primary").value = colors[schools[i] + "_primary"];
        document.getElementById(schools[i] + "Secondary").value = colors[schools[i] + "_secondary"];

        document.getElementById(schools[i] + "PrimaryColor").style.backgroundColor = colors[schools[i] + "_primary"];
        document.getElementById(schools[i] + "SecondaryColor").style.backgroundColor = colors[schools[i] + "_secondary"];

    }

    //Event Name
    document.getElementById("eventNameIs").value = docData["eventName"];
    document.getElementById(docData["eventScene"]).selected = true;
    document.getElementById("showEvent").checked = docData["showEvent"];

    //Team Scores
    document.getElementById("side_1-name-scores").value = docData["team_1"];
    document.getElementById("side_2-name-scores").value = docData["team_2"];

    document.getElementById("side_1-score").value = docData["team_1s"];
    document.getElementById("side_2-score").value = docData["team_2s"];

    document.getElementById("gameName").value = docData["gameName_1"];

    document.getElementById("showGame").checked = docData["hide_1"];

    //Stopwatch
    //Rest of code in stopwatch.js file
    if (document.getElementById("valueMs").value == "Loading...") {
        document.getElementById("valueMs").value = "0 h : 0 m : 0 s : 000 ms"
    }
    document.getElementById("showStopwatch").checked = docData["showStopwatch"];

    initStopwatch();
}


var stopwatchStarted;
var startOfStopwatch;
var addedTime = "notInitialized";

function initStopwatch() {
    stopwatchStarted = docData["stopwatchrunning"];
    startOfStopwatch = docData["startedAt"];
    //Init stopwatch buttons
    if (stopwatchStarted) {
        document.getElementById("startAndStop").innerText = 'Stop';
    }

    document.getElementById("startAndStop").onclick = function() {
        if (stopwatchStarted == true) {
            stopwatchStarted = false;
            document.getElementById("startAndStop").innerText = 'Start';
            var params = {
                TableName: tableName,
                Key: {
                  "valueId": "gameScreen"
                },
                UpdateExpression: "set stopwatchRunning = :r, stopwatchStartedAt = :s, stopwatchValueMs = :v",
                ExpressionAttributeValues: {
                    ":r": false,
                    ":s": startOfStopwatch - addedTime,
                    ":v": timeStringToMs(document.getElementById("valueMs").value)

                },
                ReturnValues: "UPDATED_NEW"
              };
              
            dynamoClient.update(params, function(err, data) {});

        } else if (stopwatchStarted == false) {
            startOfStopwatch = Date.now();
            if (document.getElementById("valueMs").value != NaN) {
                addedTime = timeStringToMs(document.getElementById("valueMs").value);
            } else {
                addedTime = 0;
            }
            stopwatchStarted = true;
            document.getElementById("startAndStop").innerText = 'Stop';

            var params = {
                TableName: tableName,
                Key: {
                  "valueId": "gameScreen"
                },
                UpdateExpression: "set stopwatchRunning = :r, stopwatchStartedAt = :s, stopwatchValueMs = :v",
                ExpressionAttributeValues: {
                    ":r": true,
                    ":s": startOfStopwatch - addedTime,
                    ":v": timeStringToMs(document.getElementById("valueMs").value)
                },
                ReturnValues: "UPDATED_NEW"
              };
              
            dynamoClient.update(params, function(err, data) {});

            updateStopwatch();
        }
    };
    updateStopwatch();

    document.getElementById("reset").onclick = function() {
        startOfStopwatch = Date.now();
        document.getElementById("valueMs").value = "0 h : 0 m : 0 s : 000 ms"

        var params = {
            TableName: tableName,
            Key: {
              "valueId": "gameScreen"
            },
            UpdateExpression: "set stopwatchRunning = :r, stopwatchStartedAt = :s, stopwatchValueMs = :v",
            ExpressionAttributeValues: {
                ":r": stopwatchStarted,
                ":s": Date.now(),
                ":v": 0
            },
            ReturnValues: "UPDATED_NEW"
          };
          
        dynamoClient.update(params, function(err, data) {});
    }
}

async function updateStopwatch() {
    while (stopwatchStarted) {
        var ms = (Date.now() - startOfStopwatch) + addedTime;
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        document.getElementById("valueMs").value = hours + " h : " + minutes%60 + " m : " + seconds%60 + " s : " + String(ms%1000).padStart(3, '0') + " ms"
        await sleep(1);
    }
    if (stopwatchStarted == false) {
        if (docData["stopwatchms"] != timeStringToMs(document.getElementById("valueMs").value)) {
            var params = {
                Key: {
                  "valueId": "gameScreen"
                },
                UpdateExpression: "set stopwatchValueMs = :v",
                ExpressionAttributeValues: {
                    ":v": timeStringToMs(document.getElementById("valueMs").value)

                },
                ReturnValues: "UPDATED_NEW"
              };
              
            dynamoClient.update(params, function(err, data) {});
        }
    }
}

function timeStringToMs(timeString) {
    var [hours, minutes, seconds, milliseconds] = timeString.split(" : ")
    hours = parseInt(hours.slice(0, -2));
    minutes = parseInt(minutes.slice(0, -2));
    seconds = parseInt(seconds.slice(0, -2));
    milliseconds = parseInt(milliseconds.slice(0, -2));
  
    const msInHour = hours * 60 * 60 * 1000;
    const msInMinute = minutes * 60 * 1000;
    const msInSecond = seconds * 1000;
  
    const totalMs = msInHour + msInMinute + msInSecond + milliseconds;
    return totalMs;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
