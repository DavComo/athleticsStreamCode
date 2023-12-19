import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

var schoolPseudonyms = [
    ['MIS', 'Munich'],
    ['FIS', 'Frankfurt'],
    ['AIS', 'Vienna'],
    ['ZIS', 'Zurich'],
    ['BUD', 'Budapest'],
    ['ISB', 'Brussels'],
    ['SGSM', 'St Georges']
];

(function(window, document, undefined) {
  
    window.onload = init();

})(window, document, undefined);

var dynamodb;
var docDataTempTemp;

function fetchData() {
    const params = {
        TableName: 'stream_' + streamData.streamId,
        // Add any other parameters as needed
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error("Error fetching data from DynamoDB:", err);
        } else {
            // Update the UI with the fetched data
            docDataTempTemp = data.Items;
            console.log("Updating data")
            updateData()
        }
    });
}

function init() {
    // Initialize AWS SDK and DynamoDB client
    AWS.config.update({
        region: streamData.awsRegion,
        accessKeyId: streamData.awsAccessKey,
        secretAccessKey: streamData.awsSecretKey
    });

    dynamodb = new AWS.DynamoDB();

    fetchData();
};

var docData = {};
var docDataTemp = {};
var colors;
//Update Data (Source js + refactoring)
async function updateData() {
    var deltaStart = Date.now();
    var minTimeout = 0;

    for (var index = 0; index < docDataTempTemp.length; index++) {
        var indexkey = docDataTempTemp[index].valueId.S;
        docDataTemp[indexkey] = docDataTempTemp[index];
    }

    docData = {
        "team_1" : docDataTemp['gameScreen']['sideOneName'].S,
        "team_2" : docDataTemp['gameScreen']['sideTwoName'].S,
        "team_1s" : docDataTemp['gameScreen']['sideOneScore'].N,
        "team_2s" : docDataTemp['gameScreen']['sideTwoScore'].N,
        "gameName_1" : docDataTemp['gameScreen']['gameName'].S,
        "hide_1" : !docDataTemp['gameScreen']['showGame'].BOOL,
        "stopwatchms" : docDataTemp['gameScreen']['stopwatchValueMs'].N,
        "stopwatchrunning" : docDataTemp['gameScreen']['stopwatchRunning'].BOOL,
        "startedAt" : docDataTemp['gameScreen']['stopwatchStartedAt'].N,
        "showStopwatch" : docDataTemp['gameScreen']['showStopwatch'].BOOL
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
    //updateStopwatch();

    var timeDelta = Date.now() - deltaStart;
    if (minTimeout < timeDelta) {
        minTimeout = timeDelta + 1000;
    }
    if (minTimeout < 1000) {
        minTimeout = 1000;
    }

    await sleep(minTimeout - timeDelta);
    //fetchData();
}

async function updateStopwatch(docData) {
    if (docData['stopwatchrunning'] == false) {
        var timeinms = docData['stopwatchms'];
        var minutes = Math.floor(timeinms / 60000);
        var seconds = ((timeinms % 60000) / 1000).toFixed(0);
        console.log(String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'))
        $('#stopwatch').text(String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'));
    } else {
        while (docData['stopwatchrunning'] == true) {
            var timeinms = Date.now() - docData['startedAt'];
            var minutes = Math.floor(timeinms / 60000);
            var seconds = ((timeinms % 60000) / 1000).toFixed(0);
            $('#stopwatch').text(String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'));
            if (timeinms > 2700000) {
                $('#halfid').text('2nd')
            } else {
                $('#halfid').text('1st')
            }
            await sleep(10)
        }
    }

    if (timeinms > 2700000) {
        $('#halfid').text('2nd')
    } else {
        $('#halfid').text('1st')
    }

    if (docData["showStopwatch"] == false) {
        $('body')
            .queue(elemHide('.bottom-container')).delay(500);
    } else if (docData["showStopwatch"] == true) {
        $('body')
            .queue(elemShow('.bottom-container')).delay(500);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function elemHide(elem) {
	return function (next) {
		$(elem).addClass('fast hidden');
		next();
	}
}

function elemShow(elem) {
	return function (next) {
		$(elem).removeClass('fast hidden');	
		next();
	}
}