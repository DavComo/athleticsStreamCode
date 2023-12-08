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
var colors;
//Update Data (Source js + refactoring)
function updateData() {
    docData = {
        "team_1" : docDataTemp['gameScreen']['sideNames']['side_1'],
        "team_2" : docDataTemp['gameScreen']['sideNames']['side_2'],
        "team_1s" : docDataTemp['gameScreen']['scores']['side_1'],
        "team_2s" : docDataTemp['gameScreen']['scores']['side_2'],
        "gameName_1" : docDataTemp['gameScreen']['insets']['gameName'],
        "hide_1" : !docDataTemp['gameScreen']['insets']['showGame'],
        "stopwatchms" : docDataTemp['gameScreen']['stopwatch']['valueMs'],
        "stopwatchrunning" : docDataTemp['gameScreen']['stopwatch']['running'],
        "startedAt" : docDataTemp['gameScreen']['stopwatch']['startedAt'],
        "showStopwatch" : docDataTemp['gameScreen']['showStopwatch']['showStopwatch']
    }

    colors = {
        'mis_primary' : docDataTemp['colors']['mis']['primary'],
        'mis_secondary' : docDataTemp['colors']['mis']['secondary'],
        'ais_primary' : docDataTemp['colors']['ais']['primary'],
        'ais_secondary' : docDataTemp['colors']['ais']['secondary'],
        'fis_primary' : docDataTemp['colors']['fis']['primary'],
        'fis_secondary' : docDataTemp['colors']['fis']['secondary'],
        'zis_primary' : docDataTemp['colors']['zis']['primary'],
        'zis_secondary' : docDataTemp['colors']['zis']['secondary'],
        'sgsm_primary' : docDataTemp['colors']['sgsm']['primary'],
        'sgsm_secondary' : docDataTemp['colors']['sgsm']['secondary'],
    }
    updateStopwatch();
}

async function updateStopwatch() {
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