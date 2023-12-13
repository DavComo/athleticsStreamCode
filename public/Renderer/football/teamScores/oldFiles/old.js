import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

//Initiate Data
(function(window, document, undefined) {
  
    window.onload = init();

})(window, document, undefined);

var docDataTemp;
function init() {
    const firebaseConfig = {
        apiKey: "AIzaSyBokVHaaTBGEAlExbksVjDTXm-Q3cFSoKw",
        authDomain: "athleticsstream-bfe90.firebaseapp.com",
        projectId: "athleticsstream-bfe90",
        storageBucket: "athleticsstream-bfe90.appspot.com",
        messagingSenderId: "260965419764",
        appId: "1:260965419764:web:2ecac5005ae89c09006ca1",
        databaseURL : "https://athleticsstream-bfe90-default-rtdb.europe-west1.firebasedatabase.app/"
    };

    // Initialize Firebas
    const app = initializeApp(firebaseConfig);


    // Initialize Cloud Firestore and get a reference to the service
    const dbRef = ref(getDatabase(app));

    var db = getDatabase();

    set(ref(db, 'football/clients/teamScores'), true);

    //const querySnapshot = await getDocs(collection(db, "footballData"));
    //
    onValue(child(dbRef, `football`), (snapshot) => {
        const clientRef = ref(db, "football/clients/teamScores");
        onDisconnect(clientRef).set(false);
        set(ref(db, 'football/clients/teamScores'), true);
        docDataTemp = snapshot.val();
        localStorage.setItem("docData", JSON.stringify(docDataTemp));
        updateData()
    });
};

var docData;
//Update Data (Source js + refactoring)
function updateData() {
    docData = {
        "team_1" : docDataTemp['gameScreen']['sideNames']['side_1'],
        "team_2" : docDataTemp['gameScreen']['sideNames']['side_2'],
        "team_1s" : docDataTemp['gameScreen']['scores']['side_1'],
        "team_2s" : docDataTemp['gameScreen']['scores']['side_2'],
        "gameName_1" : docDataTemp['gameScreen']['insets']['gameName'],
        "hide_1" : !docDataTemp['gameScreen']['insets']['showGame']
    }

    if (docData['hide_1'] == false) {
        if ($('#team_1').text() != docData['team_1'] ||
            $('#team_2').text() != docData['team_2'] )
        {
            $('body')
                .queue(elemHide('.scores')).delay(1000)
                .queue(elemHide('.teams')).delay(1000)
                .queue(elemHide('.gameName')).delay(1000)
                .queue(elemUpdate()).delay(1000)
                .queue(elemShow('.gameName')).delay(1000)
                .queue(elemShow('.teams')).delay(1000)
                .queue(elemShow('.scores'))
        } else if ($('.gameName').text() != docData['gameName_1']) {
            $('body')
                .queue(elemHide('.gameName')).delay(1000)
                .queue(elemUpdate()).delay(1000)
                .queue(elemShow('.gameName'));
        }


        if ($('#team_1s').text() != docData['team_1s'] ||
            $('#team_2s').text() != docData['team_2s'] )
        {
            if (parseInt($('#team_1s').text()) < parseInt(docData['team_1s'])) {
                $('body')
                    .queue(elemShow('.goals.g1')).delay(4000)
                    .queue(elemHide('.goals.g1'))
            }
            if (parseInt($('#team_2s').text()) < parseInt(docData['team_2s'])) {
                $('body')
                    .queue(elemShow('.goals.g2')).delay(4000)
                    .queue(elemHide('.goals.g2'))
            }
            if ($('#team_1s').text() != docData['team_1s']) {
                $('body')
                    .queue(scoreHideLeft('.s1')).delay(1000)
                    .queue(elemUpdate()).delay(1000)
                    .queue(scoreShowLeft('.s1'))
            }
            if ($('#team_2s').text() != docData['team_2s']) {
                $('body')
                    .queue(scoreHideRight('.s2')).delay(1000)
                    .queue(elemUpdate()).delay(1000)
                    .queue(scoreShowRight('.s2'))
            }

        }
    } else {
        $('body')
            .queue(elemHide('.scores')).delay(1000)
            .queue(elemHide('.teams')).delay(1000)
            .queue(elemHide('.gameName')).delay(1000)
            .queue(elemUpdate())
        scoreHidden = 1
    }
    
    if (docData['hide_1'] != true && scoreHidden == 1) {
        scoreHidden = 0;
        $('body')
            .queue(elemShow('.gameName')).delay(1000)
            .queue(elemShow('.teams')).delay(1000)
            .queue(elemShow('.scores'))
    }
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
	return function (next) {
		$(elem).removeClass('fast hidden');	
		next();
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