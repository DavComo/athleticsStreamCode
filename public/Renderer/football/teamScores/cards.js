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

var db;
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

    set(ref(db, 'football/clients/cardSystem'), true);

    //const querySnapshot = await getDocs(collection(db, "footballData"));
    //
    onValue(child(dbRef, `football`), (snapshot) => {
        const clientRef = ref(db, "football/clients/cardSystem");
        onDisconnect(clientRef).set(false);
        set(ref(db, 'football/clients/cardSystem'), true);
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
        "team" : docDataTemp['cardPopup']['team'],
        "show" : docDataTemp['cardPopup']['showCard'],
        "playerNumber" : docDataTemp['cardPopup']['playerNumber'],
        "showLengthMs" : docDataTemp['cardPopup']['showLengthMs'],
        "cardType" : docDataTemp['cardPopup']['cardType'],
        "teamName" : docDataTemp['cardPopup']['playerName'],
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

    $('body')
        .queue(updateIcon('card_icon', docData['team']))
        .queue(updateSpecific('player_number', 'playerNumber'))
        .queue(updateSpecific('team_name', 'teamName'))
        .queue(updateCardImage())
        .queue(updateColors())

    if (docData['show'] == true) {
        if ($('.card-container').hasClass('hidden')) {
            $('body')
                .queue(elemHide('.top-container')).delay(500)
                .queue(elemShow('.card-container'))
                .queue(waitForBit()).delay(docData['showLengthMs'])
                .queue(elemHide('.card-container')).delay(500)
                .queue(elemShow('.top-container'))
        }
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
        if (elem == '.card-container') {
            var db = getDatabase();
            set(ref(db, 'football/cardPopup/showCard'), false)
        }
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

        $('#' + htmlelem).attr('src', '../../../CommonUse/' + schoolName + '_Logo-200x200.png');
        next();
    }
}

function updateCardImage() {
    if (docData['cardType'] == 'yellow') {
        $('#card_image').attr('src', './yellow.png');
        $('#card_type_name').text('Yellow Card');
    } else if (docData['cardType'] == 'red') {
        $('#card_image').attr('src', './red.png');
        $('#card_type_name').text('Red Card');
    } else if (docData['cardType'] == 'doubleYellow') {
        $('#card_image').attr('src', './doubleYellow.png');
        $('#card_type_name').text('Double Yellow Card');
    }
}

function waitForBit() {
    return function(next) {
        next();
    }
}

function updateColors() {
    return function(next) {
        var schoolName = docData['team'];
        for (var i = 0; i < schoolPseudonyms.length; i++) {
            if (schoolPseudonyms[i].includes(schoolName)) {
                schoolName = schoolPseudonyms[i][0]
            }
        }
        //Left side first
        var gradientCSSBorder = 'linear-gradient(to bottom, ' + colors[schoolName.toLowerCase() + '_secondary'] + ' 0%, ' + colors[schoolName.toLowerCase() + '_primary'] + ' 100%)'
        $('#card-container').css('background', gradientCSSBorder);

        var gradientCSSNumber = 'linear-gradient(to bottom, ' + colors[schoolName.toLowerCase() + '_primary'] + ' 0%, ' + colors[schoolName.toLowerCase() + '_secondary'] + ' 100%)'
        $('#player_number_container').css('background', gradientCSSNumber);
        //'linear-gradient(90deg, ' + colors[schoolName_left.toLowerCase() + '_secondary'] + ' 0%, ' + colors[schoolName_right.toLowerCase() + '_secondary'] + ' 100%);'
        next();
    }
}