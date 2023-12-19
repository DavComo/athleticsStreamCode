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
    ['SGSM', 'St Georges'],
    ['BIS', 'Bavarian']
];

//Initiate Data
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

    updateStopwatch(docData);

    if (docData['hide_1'] == false) {
        if ($('#gameName').text() != docData['gameName_1']) {
            minTimeout += 1000;
            $('body')
                .queue(elemHide('.top-container')).delay(1000)
                .queue(updateSpecific('gameName', 'gameName_1'))
                .queue(elemShow('.top-container'))
        }

        if ($('#team_1').text() != docData['team_1'] || $('#team_2').text() != docData['team_2']) {
            minTimeout += 3000;
            $('body')
                .queue(elemHide('.top-container')).delay(500)
                .queue(elemHide('.bottom-container')).delay(500)
                .queue(elemHide('.main-container')).delay(500)
                .queue(updateSpecific('team_1', 'team_1'))
                .queue(updateIcon('team_1_icon', docData['team_1']))
                .queue(updateIcon('team_2_icon', docData['team_2']))
                .queue(updateColors())
                .queue(updateSpecific('team_2', 'team_2'))
                .queue(updateSpecific('team_1s', 'team_1s'))
                .queue(updateSpecific('team_2s', 'team_2s'))
                .queue(elemShow('.main-container')).delay(500)
                .queue(elemShow('.bottom-container')).delay(500)
                .queue(elemShow('.top-container')).delay(500)
        }

        if ($('#team_1s').text() != docData['team_1s'] || $('#team_2s').text() != docData['team_2s']) {
            $('body')
                .queue(updateSpecific('team_1s', 'team_1s'))
                .queue(updateSpecific('team_2s', 'team_2s'))
        }

        if ($('.main-container').hasClass('hidden')) {
            minTimeout += 1000;
            $('body')
                .queue(elemShow('.main-container')).delay(500)
                .queue(elemShow('.bottom-container')).delay(500)
                .queue(elemShow('.top-container'))
        }
    } else {
        minTimeout += 1000;
        $('body')
            .queue(elemHide('.top-container')).delay(500)
            .queue(elemHide('.bottom-container')).delay(500)
            .queue(elemHide('.main-container'))
            .queue(updateSpecific('team_1', 'team_1'))
            .queue(updateIcon('team_1_icon', docData['team_1']))
            .queue(updateIcon('team_2_icon', docData['team_2']))
            .queue(updateColors())
            .queue(updateSpecific('team_2', 'team_2'))
            .queue(updateSpecific('team_1s', 'team_1s'))
            .queue(updateSpecific('team_2s', 'team_2s'))
    }

    var timeDelta = Date.now() - deltaStart;
    if (minTimeout < timeDelta) {
        minTimeout = timeDelta + 1000;
    }
    if (minTimeout < 1000) {
        minTimeout = 1000;
    }

    await sleep(minTimeout - timeDelta);
    fetchData();

}


//Package JS
var stopwatch = null;
var isShown = 0;
var scoreHidden = '0';

var mis = '#252C75';
var fis = '#A40033'
var ais = '#006C38'
var zis = '#EAAA02'

var formation1 = [];
var formation2 = [];

function elemHide(elem) {
	return function (next) {
		$(elem).addClass('fast hidden');
		next();
	}
}

function scoreHideLeft(elem) {
	return function (next) {
		$(elem).addClass('fast hiddenLeft');	
		next();
	}
}

function scoreHideRight(elem) {
	return function (next) {
		$(elem).addClass('fast hiddenRight');	
		next();
	}
}

function elemShow(elem) {
    if (elem != '.bottom-container') {
        return function (next) {
            $(elem).removeClass('fast hidden');	
            next();
        }
    } else {
        if (docData['showStopwatch'] == true) {
            return function (next) {
                $(elem).removeClass('fast hidden');	
                next();
            }
        }
    }
}

function scoreShowLeft(elem) {
	return function (next) {
		$(elem).removeClass('fast hiddenLeft');	
		next();
	}
}

function scoreShowRight(elem) {
	return function (next) {
		$(elem).removeClass('fast hiddenRight');	
		next();
	}
}

function elemUpdate() {
	return function(next) {
		for (var prop in docData) {
			$('#' + prop).text(docData[prop]);
		}
		next();
	}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkColor(color) {
	if (color == 'mis' || color == 'fis' || color == 'ais' || color == 'zis') {
		return window[color]
	} else {
		return color
	}
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function updateSpecific(htmlelem, docelem) {
	return function(next) {
		$('#' + htmlelem).text(docData[docelem]);
		next();
	}
}

function updateIcon(htmlelem, schoolName) {
    return function(next) {
        for (var i = 0; i < schoolPseudonyms.length; i++) {
            if (schoolPseudonyms[i].includes(schoolName)) {
                schoolName = schoolPseudonyms[i][0]
            }
        }

        $('#' + htmlelem).attr('src', './' + schoolName + '_Logo-200x200.png');
        next();
    }
}

function updateColors() {
    return function(next) {
        var schoolName_left = docData['team_1'];
        var schoolName_right = docData['team_2'];
        for (var i = 0; i < schoolPseudonyms.length; i++) {
            if (schoolPseudonyms[i].includes(schoolName_left)) {
                schoolName_left = schoolPseudonyms[i][0]
            } else if (schoolPseudonyms[i].includes(schoolName_right)) {
                schoolName_right = schoolPseudonyms[i][0]
            }
        }
        //Left side first
        $('#score-block-left').css('background-color', colors[schoolName_left.toLowerCase() + '_secondary']);
        $('#team_1').css('color', colors[schoolName_left.toLowerCase() + '_secondary']);

        $('#score-block-right').css('background-color', colors[schoolName_right.toLowerCase() + '_secondary']);
        $('#team_2').css('color', colors[schoolName_right.toLowerCase() + '_secondary']);

        var gradientCSS = 'linear-gradient(to right, ' + colors[schoolName_right.toLowerCase() + '_primary'] + ' 0%, ' + colors[schoolName_left.toLowerCase() + '_primary'] + ' 100%)'
        $('#top-colored').css('background', gradientCSS);
        $('#bottom-colored').css('background', gradientCSS);
        //'linear-gradient(90deg, ' + colors[schoolName_left.toLowerCase() + '_secondary'] + ' 0%, ' + colors[schoolName_right.toLowerCase() + '_secondary'] + ' 100%);'
        next();
    }
}

/*Deprecated, view stopwatch.js for updated version*/
async function updateStopwatch() {
    if (docData['stopwatchrunning'] == false) {
        var timeinms = docData['stopwatchms'];
        var minutes = Math.floor(timeinms / 60000);
        var seconds = ((timeinms % 60000) / 1000).toFixed(0);
        $('#stopwatch').text(String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'));
    } else {
        while (docData['stopwatchrunning'] == true) {
            var timeinms = Date.now() - docData['startedAt'];
            var minutes = Math.floor(timeinms / 60000);
            var seconds = ((timeinms % 60000) / 1000).toFixed(0);
            $('#stopwatch').text(String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'));
            await sleep(10)
        }
    }
}