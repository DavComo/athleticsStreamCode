import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

//Initiate Data
(function(window, document, undefined) {
  
    window.onload = init();

})(window, document, undefined);

var docData;
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

    //const querySnapshot = await getDocs(collection(db, "footballData"));
    //console.log(querySnapshot.docs[0].data()['testValue']);
    onValue(child(dbRef, `football`), (snapshot) => {
        docData = snapshot.val();
        localStorage.setItem("docData", JSON.stringify(docData));
        updateData()
    });
};



var currentScene;
var currentStatus;
//Update Data (Source js + refactoring)
function updateData() {
    docData = {
        "eventName_1" : docData["eventClassifier"]['eventName'],
        "eventScene_1" : docData["eventClassifier"]['eventScene'],
        "showEvent" : docData["eventClassifier"]["showEvent"]
    }

    if ($('#eventName_1').text() != docData['eventName_1'])
    {
        $('body')
            .queue(elemHide('div')).delay(1000)
            .queue(elemUpdate())
            .queue(elemShow('div'))
    }

    async function updateEvent () {
        if (currentScene != docData['eventScene_1'] || currentStatus != docData['showEvent']) {
            currentScene = docData['eventScene_1'];
            currentStatus = docData['showEvent']
            if (docData['eventScene_1'] == 'startingSoon' && docData["showEvent"] == true) {
                $('body')
                    .queue(elemHide('div')).delay(1000)
                $('#eventName_1').removeClass('eventNameBottom');
                $('#eventName_1').addClass('eventNameTop');
                $('body')
                    .queue(elemShow('div')).delay(1000)
            } else if (docData['eventScene_1'] == 'gamePlay' && docData["showEvent"] == true){
                $('body')
                    .queue(elemHide('div')).delay(1000)
                $('#eventName_1').removeClass('eventNameTop');
                $('#eventName_1').addClass('eventNameBottom');
                $('body')
                    .queue(elemShow('div')).delay(1000)
            } else {
                $('body')
                    .queue(elemHide('div')).delay(1000)
            }
        }
    }

    updateEvent()
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