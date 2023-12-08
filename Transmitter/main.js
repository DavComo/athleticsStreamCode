import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

var docData = null;
var schools = ["mis", "fis", "ais", "zis", "sgsm"];

(function(window, document, undefined) {

    window.onload = init();

})(window, document, undefined);

async function init() {  
    var inputs = document.getElementsByTagName("input")
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "Loading..."
    };

    initButtons();
    initData();
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

        const db = getDatabase();

        //Save Color Page
        schools.forEach(school => {
            set(ref(db, 'football/colors/' + school), { 
                'primary' : document.getElementById(school + "Primary").value, 
                'secondary' : document.getElementById(school + "Secondary").value
            });
        });

        //Save Event Name
        set(ref(db, 'football/eventClassifier/'), { 
            'eventName' : document.getElementById("eventNameIs").value, 
            'eventScene' : document.getElementById("eventScene").value,
            'showEvent' : document.getElementById("showEvent").checked
        });

        //Save Pitch Sides
        set(ref(db, 'football/pitchSides/showPitch'), { 
            'showPitch' : document.getElementById("showLayout").checked
        });

        set(ref(db, 'football/pitchSides/sideNames'), { 
            'side_1' : document.getElementById("side_1-name").value, 
            'side_2' : document.getElementById("side_2-name").value
        });

        set(ref(db, 'football/pitchSides/colors'), { 
            'side_1-goalie' : schoolColorToWebColor(document.getElementById("side_1-goalie").value), 
            'side_1-player' : schoolColorToWebColor(document.getElementById("side_1-player").value), 
            'side_2-goalie' : schoolColorToWebColor(document.getElementById("side_2-goalie").value), 
            'side_2-player' : schoolColorToWebColor(document.getElementById("side_2-player").value) 
        });

        set(ref(db, 'football/pitchSides/formations'), { 
            'formation_1' : document.getElementById("side_1-formation").value, 
            'formation_2' : document.getElementById("side_2-formation").value
        });

        //Save Team Scores
        set(ref(db, 'football/gameScreen/scores'), { 
            'side_1' : document.getElementById("side_1-score").value, 
            'side_2' : document.getElementById("side_2-score").value
        });

        set(ref(db, 'football/gameScreen/sideNames'), { 
            'side_1' : document.getElementById("side_1-name-scores").value, 
            'side_2' : document.getElementById("side_2-name-scores").value
        });

        set(ref(db, 'football/gameScreen/insets'), { 
            'showGame' : document.getElementById("showGame").checked, 
            'gameName' : document.getElementById("gameName").value
        });

        //Save Card System
        set(ref(db, 'football/cardPopup'), { 
            'team' : document.getElementById("cardTeam").value,
            'cardType' : document.getElementById("cardType").value, 
            'playerNumber' : document.getElementById("playerNumber").value,
            'playerName' : document.getElementById("playerName").value, 
            'showLengthMs' : document.getElementById("showLength-Card").value,
            'showCard' : document.getElementById("showCard").checked
        });

        //Save Announcements
        set(ref(db, 'football/miscPopup'), { 
            'announcementType' : document.getElementById("announcementType").value, 
            'awardedTeam' : document.getElementById("awardedTeam").value,
            'showLengthMs' : document.getElementById("showLength-Announcement").value, 
            'showPopup' : document.getElementById("showAnnouncement").checked,
        });

        //Save Stopwatch (Only works for "Show Stopwatch" button)
        set(ref(db, 'football/gameScreen/showStopwatch'), { 
            'showStopwatch' : document.getElementById("showStopwatch").checked, 
        });
        set(ref(db, 'football/gameScreen/stopwatch/valueMs'), timeStringToMs(document.getElementById("valueMs").value));
    
        /*catch (e) {
            if (e instanceof PERMISSION_DENIED) {
                alert("You do not have permission to write to this data. Please check permissions.")
            } else {
                alert("An unknown error has occured in database write. Please contact the administrator.")
            }
        }*/
        await new Promise(r => setTimeout(r, 500));

        document.getElementById("saveValues").innerText = "Save Values"
        document.getElementById("saveValues").style.removeProperty("background-color")
    }
}

function initData() {
    const firebaseConfig = {
        apiKey: "AIzaSyBokVHaaTBGEAlExbksVjDTXm-Q3cFSoKw",
        authDomain: "athleticsstream-bfe90.firebaseapp.com",
        databaseURL: "https://athleticsstream-bfe90-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "athleticsstream-bfe90",
        storageBucket: "athleticsstream-bfe90.appspot.com",
        messagingSenderId: "260965419764",
        appId: "1:260965419764:web:2ecac5005ae89c09006ca1",
        measurementId: "G-20KJ9JRV7H"
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
}

var db = getDatabase();
var isConnected;
onValue(ref(db, ".info/connected"), (snap) => {
    if (snap.val() == true) {
        isConnected = true
        if (docData == null) {docData = JSON.parse(localStorage.getItem("docData"))};
        flipConnectionsServerError()
    } else if (snap.val() == false) {
        isConnected = false
        flipConnectionsServerError()
    }
});


function flipConnectionsServerError() {
    var connectionBlocks = document.getElementsByClassName("connectionBlock")
    if (isConnected == false) {
        var serverBlock = document.getElementById("serverBlock")
        serverBlock.style.color = "red"
        serverBlock.children[2].innerText = "Not Connected"
        serverBlock.children[0].style.backgroundColor = "red"
        document.getElementById("serverStatus").style.color = "red";
        document.getElementById("serverStatus").innerText = "Server Disconnected";
        document.getElementsByClassName('formSubmitRow-main')[0].style.display = "none";
    } else {
        var serverBlock = document.getElementById("serverBlock")
        serverBlock.style.color = "green"
        serverBlock.children[2].innerText = "Connected"
        serverBlock.children[0].style.backgroundColor = "green"
        document.getElementById("serverStatus").style.color = "green";
        document.getElementById("serverStatus").innerText = "Server Online";
        document.getElementsByClassName('formSubmitRow-main')[0].style.display = "block";
    }
    for (var i = 0; i < connectionBlocks.length; i++) {
        if (isConnected == false) {
            connectionBlocks[i].style.color = "red"
            connectionBlocks[i].children[2].innerText = "No Server Connection"
            connectionBlocks[i].children[0].style.backgroundColor = "red"
        }
    }
}

function updateData() {
    //Connection Info
    var serverBlock = document.getElementById("serverBlock")
    serverBlock.style.color = "green"
    serverBlock.children[2].innerText = "Connected"
    serverBlock.children[0].style.backgroundColor = "green"
    document.getElementById("serverStatus").style.color = "green";
    document.getElementById("serverStatus").innerText = "Server Online";
    document.getElementsByClassName('formSubmitRow-main')[0].style.display = "block";

    var connectionBlocks = document.getElementsByClassName("connectionBlock")
    for (var i = 0; i < connectionBlocks.length; i++) {
        if (docData['clients'][connectionBlocks[i].id.slice(0, -6)] == true) {
            connectionBlocks[i].style.color = "green"
            connectionBlocks[i].children[2].innerText = "Connected"
            connectionBlocks[i].children[0].style.backgroundColor = "green"
        } else {
            connectionBlocks[i].style.color = "red"
            connectionBlocks[i].children[2].innerText = "Not Connected"
            connectionBlocks[i].children[0].style.backgroundColor = "red"
        }
    }


    //Color Page
    for (var i = 0; i < schools.length; i++) {
        document.getElementById(schools[i] + "Primary").value = docData["colors"][schools[i]]["primary"];
        document.getElementById(schools[i] + "Secondary").value = docData["colors"][schools[i]]["secondary"];

        document.getElementById(schools[i] + "PrimaryColor").style.backgroundColor = docData["colors"][schools[i]]["primary"];
        document.getElementById(schools[i] + "SecondaryColor").style.backgroundColor = docData["colors"][schools[i]]["secondary"];

    }

    //Event Name
    document.getElementById("eventNameIs").value = docData["eventClassifier"]["eventName"];
    document.getElementById(docData["eventClassifier"]["eventScene"]).selected = true;
    document.getElementById("showEvent").checked = docData["eventClassifier"]["showEvent"];

    //Pitch Layout
    document.getElementById("side_1-name").value = docData["pitchSides"]["sideNames"]["side_1"];
    document.getElementById("side_2-name").value = docData["pitchSides"]["sideNames"]["side_2"];

    document.getElementById("showLayout").checked = docData["pitchSides"]["showPitch"]["showPitch"];

    document.getElementById("side_1-goalie").value = docData["pitchSides"]["colors"]["side_1-goalie"];
    document.getElementById("side_1-player").value = docData["pitchSides"]["colors"]["side_1-player"];
    document.getElementById("side_2-goalie").value = docData["pitchSides"]["colors"]["side_2-goalie"];
    document.getElementById("side_2-player").value = docData["pitchSides"]["colors"]["side_2-player"];

    document.getElementById("side_1-formation").value = docData["pitchSides"]["formations"]["formation_1"];
    document.getElementById("side_2-formation").value = docData["pitchSides"]["formations"]["formation_2"];

    //Team Scores
    document.getElementById("side_1-name-scores").value = docData["gameScreen"]["sideNames"]["side_1"];
    document.getElementById("side_2-name-scores").value = docData["gameScreen"]["sideNames"]["side_2"];

    document.getElementById("side_1-score").value = docData["gameScreen"]["scores"]["side_1"];
    document.getElementById("side_2-score").value = docData["gameScreen"]["scores"]["side_2"];

    document.getElementById("gameName").value = docData["gameScreen"]["insets"]["gameName"];

    document.getElementById("showGame").checked = docData["gameScreen"]["insets"]["showGame"];

    //Stopwatch
    //Rest of code in stopwatch.js file
    if (document.getElementById("valueMs").value == "") {
        document.getElementById("valueMs").value = "0 h : 0 m : 0 s : 0 ms"
    }
    document.getElementById("showStopwatch").checked = docData["gameScreen"]["showStopwatch"]["showStopwatch"];
    
    //Card System
    document.getElementById(docData["cardPopup"]["cardType"]).selected = true;

    document.getElementById("cardTeam").value = docData["cardPopup"]["team"];
    document.getElementById("playerNumber").value = docData["cardPopup"]["playerNumber"];
    document.getElementById("playerName").value = docData["cardPopup"]["playerName"];

    document.getElementById("showCard").checked = docData["cardPopup"]["showCard"];

    document.getElementById("showLength-Card").value = docData["cardPopup"]["showLengthMs"];


    //Announcement
    document.getElementById(docData["miscPopup"]["announcementType"]).selected = true;

    document.getElementById("awardedTeam").value = docData["miscPopup"]["awardedTeam"];
    document.getElementById("showLength-Announcement").value = docData["miscPopup"]["showLengthMs"];

    document.getElementById("showAnnouncement").checked = docData["miscPopup"]["showPopup"];
}

function schoolColorToWebColor(schoolColor) {
    if (schoolColor.toLowerCase().includes("primary") || schoolColor.toLowerCase().includes("secondary")) {
        var school = schoolColor.slice(0, 3).toLowerCase();
        var identifier = schoolColor.slice(3).toLowerCase();
        return docData["colors"][school][identifier];
    } else {
        return schoolColor;
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
