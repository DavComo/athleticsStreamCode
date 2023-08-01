import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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

    var db = getDatabase();

    set(ref(db, 'football/clients/stopwatch'), true);

    //const querySnapshot = await getDocs(collection(db, "footballData"));
    //
    onValue(child(dbRef, `football`), (snapshot) => {
        const clientRef = ref(db, "football/clients/stopwatch");
        onDisconnect(clientRef).set(false);
        set(ref(db, 'football/clients/stopwatch'), true);
        docData = snapshot.val();
        localStorage.setItem("docData", JSON.stringify(docData));
        updateData()
    });
};


//Update Data (Source js + refactoring)
async function updateData() {
    if (docData['gameScreen']['stopwatch']['running'] == true ) {
        while (docData['gameScreen']['stopwatch']['running'] == true) {
            var ms = Date.now() - docData['gameScreen']['stopwatch']['startedAt'];
            let seconds = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
            let minutes = String(Math.floor(ms / 1000 / 60)).padStart(2, '0');
            document.getElementById("gameTime").innerText = minutes + " : " + seconds
            await sleep(1)
            if (docData['gameScreen']['showStopwatch']['showStopwatch'] == false) {
                $("body")
                    .queue(elemHide("#gameTime"))
            } else if (docData['gameScreen']['showStopwatch']['showStopwatch'] == true) {
                if (docData["gameScreen"]['insets']['showGame'] == true) {
                    document.getElementById("gameTime").style.top = "80px"
    
                } else {
                    document.getElementById("gameTime").style.top = "0px"
                }

                $("body")
                        .queue(elemShow("#gameTime"))
            }
        }
    } else if (docData['gameScreen']['showStopwatch']['showStopwatch'] == false) {
        $("body")
            .queue(elemHide("#gameTime"))
        var ms = docData['gameScreen']['stopwatch']['valueMs'];
        let seconds = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
        let minutes = String(Math.floor(ms / 1000 / 60)).padStart(2, '0');
        document.getElementById("gameTime").innerText = minutes + " : " + seconds
    } else {
        if (docData["gameScreen"]['insets']['showGame'] == true) {
            document.getElementById("gameTime").style.top = "80px"

        } else {
            document.getElementById("gameTime").style.top = "0px"
        }

        $("body")
                .queue(elemShow("#gameTime"))
        var ms = docData['gameScreen']['stopwatch']['valueMs'];
        let seconds = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
        let minutes = String(Math.floor(ms / 1000 / 60)).padStart(2, '0');
        document.getElementById("gameTime").innerText = minutes + " : " + seconds
    }
};


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