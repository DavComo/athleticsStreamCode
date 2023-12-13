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
    set(ref(db, 'football/clients/announcement'), true);

    //const querySnapshot = await getDocs(collection(db, "footballData"));
    onValue(child(dbRef, `football`), (snapshot) => {
        const clientRef = ref(db, "football/clients/announcement");
        onDisconnect(clientRef).set(false);
        set(ref(db, 'football/clients/announcement'), true);
        docData = snapshot.val();
        localStorage.setItem("docData", JSON.stringify(docData));
        updateData()
    });

};

var running = false;
//Update Data (Source js + refactoring)
function updateData() {

    docData = {
        "announcementType_1" : docData["miscPopup"]["announcementType"],
        "awardedTeam_1" : docData["miscPopup"]["awardedTeam"],
        "showLength_1" : docData["miscPopup"]["showLengthMs"],
        "show_1" : docData["miscPopup"]["showPopup"],
    }

    async function showAnnouncement() {
        for (var i = 0; i <= 100; i++) {
            document.getElementById('showrod_1').style.clipPath = "polygon(0% "+(50-i/2)+"%, 100% "+(50-i/2)+"%, 100% "+(50+i/2)+"%, 0% "+(50+i/2)+"%)"
        await sleep(1)
        }
        
        await sleep(500)
        
        for (var i = 0; i <= 100; i++) {
            var temptopRight = i;
            var tempbottomRight = i
            if (docData['announcementType_1'] == 'penalty') {
                document.getElementById('Penalty').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            } else if (docData['announcementType_1'] == 'freekick') {
                document.getElementById('Freekick').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            }
            document.getElementById('showrod_1').style.left = 620 + 13.1*i;
            await sleep(10)
        }
        document.getElementById('showrod_1').style.left = 1930;
        if (docData['announcementType_1'] == 'penalty') {
            document.getElementById('Penalty').style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        } else if (docData['announcementType_1'] == 'freekick') {
            document.getElementById('Freekick').style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }
            
        for (var i = 0; i <= 100; i++) {
            document.getElementById('showrod_1').style.clipPath = "polygon(0% "+(0+i/2)+"%, 100% "+(0+i/2)+"%, 100% "+(100-i/2)+"%, 0% "+(100-i/2)+"%)"
            await sleep(1)
        }
        
        await sleep(docData['showLength_1'])
        
        await sleep(100)
        for (var i = 0; i <= 100; i++) {
            document.getElementById('showrod_1').style.clipPath = "polygon(0% "+(50-i/2)+"%, 100% "+(50-i/2)+"%, 100% "+(50+i/2)+"%, 0% "+(50+i/2)+"%)"
            await sleep(1)
        }
        
        for (var i = 0; i <= 100; i++) {
            var temptopRight = 100-i;
            var tempbottomRight = 100-i
            if (docData['announcementType_1'] == 'penalty') {
                document.getElementById('Penalty').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            } else if (docData['announcementType_1'] == 'freekick') {
                document.getElementById('Freekick').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            }
            document.getElementById('showrod_1').style.left = 1930 - 13.1*i;
            await sleep(10)
        }
        document.getElementById('showrod_1').style.left = 620;
        if (docData['announcementType_1'] == 'penalty') {
            document.getElementById('Penalty').style.clipPath = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
        } else if (docData['announcementType_1'] == 'freekick') {
            document.getElementById('Freekick').style.clipPath = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
        }
            
        await sleep(500)
        
        for (var i = 0; i <= 100; i++) {
            var temptopRight = i;
            var tempbottomRight = i
            document.getElementById('School').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            document.getElementById('showrod_1').style.left = 620 + 13.1*i;
            document.getElementById('awardedTeam_1').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            await sleep(10)
        }
        document.getElementById('showrod_1').style.left = 1930;
        document.getElementById('School').style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        
        await sleep(500)
        
        for (var i = 0; i <= 100; i++) {
            document.getElementById('showrod_1').style.clipPath = "polygon(0% "+(0+i/2)+"%, 100% "+(0+i/2)+"%, 100% "+(100-i/2)+"%, 0% "+(100-i/2)+"%)"
            await sleep(1)
        }
        
        await sleep(docData['showLength_1'])
        
        for (var i = 0; i <= 100; i++) {
            document.getElementById('showrod_1').style.clipPath = "polygon(0% "+(50-i/2)+"%, 100% "+(50-i/2)+"%, 100% "+(50+i/2)+"%, 0% "+(50+i/2)+"%)"
        await sleep(1)
        }
        
        for (var i = 0; i <= 100; i++) {
            var temptopRight = 100-i;
            var tempbottomRight = 100-i
            document.getElementById('showrod_1').style.left = 1930 - 13.1*i;
            document.getElementById('School').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            document.getElementById('awardedTeam_1').style.clipPath = "polygon(0% 0%, "+(temptopRight)+"% 0%, "+(tempbottomRight)+"% 100%, 0% 100%)";
            await sleep(10)
        }
        document.getElementById('showrod_1').style.left = 620;
    
        await sleep(100)
        for (var i = 0; i <= 100; i++) {
            document.getElementById('showrod_1').style.clipPath = "polygon(0% "+(0+i/2)+"%, 100% "+(0+i/2)+"%, 100% "+(100-i/2)+"%, 0% "+(100-i/2)+"%)"
            await sleep(1)
        }

        var db = getDatabase();

        set(ref(db, 'football/miscPopup/showPopup'), 
            false
        );
    }
    
    if (docData['show_1'] == '1' && running == false) {
        $('body')
            .queue(elemUpdate())
        running = true;
        showAnnouncement()
        running = false;
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