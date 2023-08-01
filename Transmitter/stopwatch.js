import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";


var docData;
var stopwatchStarted;
var startOfStopwatch
var addedTime;

(function(window, document, undefined) {
  
    window.onload = initData();

})(window, document, undefined);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initStopwatch() {
    const db = getDatabase();
    stopwatchStarted = docData["gameScreen"]["stopwatch"]["running"];
    //Init stopwatch buttons
    document.getElementById("startAndStop").onclick = function() {
        if (stopwatchStarted == true) {
            stopwatchStarted = false;
            document.getElementById("startAndStop").innerText = 'Start';
            set(ref(db, 'football/gameScreen/stopwatch'), {
                "running" : false,
                "startedAt" : startOfStopwatch - addedTime,
                "valueMs" : timeStringToMs(document.getElementById("valueMs").value)
            });
        } else if (stopwatchStarted == false) {
            startOfStopwatch = new Date();
            if (document.getElementById("valueMs").value != NaN) {
                addedTime = timeStringToMs(document.getElementById("valueMs").value);
            } else {
                addedTime = 0;
            }
            stopwatchStarted = true;
            document.getElementById("startAndStop").innerText = 'Stop';
            set(ref(db, 'football/gameScreen/stopwatch'), { 
                'startedAt' : startOfStopwatch - addedTime, 
                'running' : true,
                'valueMs' : timeStringToMs(document.getElementById("valueMs").value)
            });
            updateStopwatch();
        }
    };

    document.getElementById("reset").onclick = function() {
        startOfStopwatch = new Date();
        document.getElementById("valueMs").value = "0 h : 0 m : 0 s : 0 ms"
        set(ref(db, 'football/gameScreen/stopwatch'), {
            "running" : stopwatchStarted,
            "startedAt" : Date.now(),
            "valueMs" : 0
        });
    }
}

async function updateStopwatch() {
    var db = getDatabase();
    while (stopwatchStarted) {
        var ms = Date.now() - startOfStopwatch + addedTime;
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        document.getElementById("valueMs").value = hours + " h : " + minutes%60 + " m : " + seconds%60 + " s : " + ms%1000 + " ms"
        await sleep(1);
    }
    if (stopwatchStarted == false) {
        if (docData['gameScreen']['stopwatch']['valueMs'] != timeStringToMs(document.getElementById("valueMs").value)) {
            console.log("updating")
            set(ref(db, 'football/gameScreen/stopwatch/valueMs'), timeStringToMs(document.getElementById("valueMs").value));
        }
    }

}

function initData() {
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
        if (document.getElementById("valueMs").value == "Loading...") {
            document.getElementById("valueMs").value = "0 h : 0 m : 0 s : 0 ms"
        }
        initStopwatch()
    });
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