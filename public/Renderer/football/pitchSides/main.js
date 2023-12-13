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

    set(ref(db, 'football/clients/pitchSides'), true);

    //const querySnapshot = await getDocs(collection(db, "footballData"));
    //
    onValue(child(dbRef, `football`), (snapshot) => {
        const clientRef = ref(db, "football/clients/pitchSides");
        onDisconnect(clientRef).set(false);
        set(ref(db, 'football/clients/pitchSides'), true);
        docData = snapshot.val();
        localStorage.setItem("docData", JSON.stringify(docData));
        updateData()
    });
};


//Update Data (Source js + refactoring)
function updateData() {
    docData = {
        "sideName_1" : docData["pitchSides"]["sideNames"]["side_1"],
        "sideName_2" : docData["pitchSides"]["sideNames"]["side_2"],
        "clickToShow_1" : docData["pitchSides"]["showPitch"]["showPitch"],
        "color_1" : docData["pitchSides"]["colors"]["side_1-goalie"],
        "color_2" : docData["pitchSides"]["colors"]["side_1-player"],
        "color_3" : docData["pitchSides"]["colors"]["side_2-player"],
        "color_4" : docData["pitchSides"]["colors"]["side_2-goalie"],
        "formation_1" : docData["pitchSides"]["formations"]["formation_1"],
        "formation_2" : docData["pitchSides"]["formations"]["formation_2"]
    }

    function bannerHide(elem) {
        return function (next) {
            $(elem).addClass('fast hiddenBanner');
            next();
        }
    }
    
    function bannerShow(elem) {
        return function (next) {
            $(elem).removeClass('fast hiddenBanner');	
            next();
        }
    }
    
    function rgbtohex(color) {
        if (color.slice(0, 3) == "rgb") {
            var a = color.split("(")[1].split(")")[0];
            a = a.split(",");
            var b = a.map(function(x){             //For each array element
                x = parseInt(x).toString(16).toUpperCase();      //Convert to a base16 string
                return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
            })
            b = "#"+b.join("");
            return b
        } else {
            return color
        }
    }
    
    
    if (docData['clickToShow_1'] != isShown) {
        if (docData['clickToShow_1'] == '1') {
            $('body')
                .queue(bannerShow('#pitchBanner')).delay(1000)
                .queue(elemShow('#container')).delay(1000);
            
            isShown = '1';
        } else {
            $('body')
                .queue(elemHide('#container'))
                .queue(bannerHide('#pitchBanner'))
            
            isShown = '0';
        }
    }
    
    
    async function animatePlayers() {
        if (rgbtohex(document.getElementById('leftGoalie').style.backgroundColor) != checkColor(docData['color_1']) || rgbtohex(document.getElementById('leftPlayer_1').style.backgroundColor) != checkColor(docData['color_2']) || rgbtohex(document.getElementById('rightGoalie').style.backgroundColor) != checkColor(docData['color_4']) || rgbtohex(document.getElementById('rightPlayer_1').style.backgroundColor) != checkColor(docData['color_3']) || $('#sideName_1').text() != docData['sideName_1'] || $('#sideName_2').text() != docData['sideName_2'] || formation1 != docData['formation_1'] || formation2 != docData['formation_2']) {		
            if (isShown == '1')	{
                //Hiding
                $('body')
                    .queue(elemHide('#container')).delay(1000)
                    .queue(elemUpdate()).delay(1000)
                await sleep(500)
                
                //Positioning system
                //Left Side
                var formations = docData['formation_1'].split('-')
                for (var i = 0; i < formations.length; i++) {
                    formations[i] = parseInt(formations[i]);
                    await sleep(100);
                }
                
                
                var topMax = 672;
                var topMin = 72;
                var leftMax = 1183;
                var leftMin = 875;
                var playerCounter = 1;
                
                for (var column = 0; column < formations.length; column++) {
                    if (formations[column] > 2) {
                        var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                        for (var player = 0; player < formations[column]; player++) {
                            if (formations[column] % 2 != 0) {
                                var topPosition = ((topMax - topMin) / (2*formations[column])) * (player * 2 + 1) + 65;
                            } else {
                                var topPosition = ((topMax - topMin) / (formations[column] - 1)) * player + topMin;
                            }
    
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = topPosition + 'px';
                            playerCounter += 1;
                        }
                    } else {
                        if (formations[column] == 2) {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = '272px';
                            playerCounter += 1;
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = '472px';
                            playerCounter += 1;
                        } else {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = '365px';
                            playerCounter += 1;
                        }
                    }
                }
                formation1 = docData['formation_1'];
                
                
                //Left Side
                var formations = docData['formation_2'].split('-')
                for (var i = 0; i < formations.length; i++) {
                    formations[i] = parseInt(formations[i]);
                    
                    await sleep(100);
                }
                
                
                topMax = 672;
                topMin = 72;
                var rightMax = 1200;
                var rightMin = 875;
                playerCounter = 1;
                
                for (var column = 0; column < formations.length; column++) {
                    if (formations[column] > 2) {
                        var rightPosition = ((rightMax - rightMin) / (formations.length - 1)) * column + rightMin;
                        for (var player = 0; player < formations[column]; player++) {
                            if (formations[column] % 2 != 0) {
                                topPosition = ((topMax - topMin) / (2*formations[column])) * (player * 2 + 1) + 65;
                            } else {
                                topPosition = ((topMax - topMin) / (formations[column] - 1)) * player + topMin;
                            }
    
                            document.getElementById('rightPlayer_'+playerCounter).style.right = rightPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = topPosition + 'px';
                            playerCounter += 1;
                        }
                    } else {
                        if (formations[column] == 2) {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('rightPlayer_'+playerCounter).style.right = leftPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = '272px';
                            playerCounter += 1;
                            document.getElementById('rightPlayer_'+playerCounter).style.right = leftPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = '472px';
                            playerCounter += 1;
                        } else {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('rightPlayer_'+playerCounter).style.right = leftPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = '365px';
                            playerCounter += 1;
                        }
                    }
                }
                formation2 = docData['formation_2'];
                
                //Color coding
                document.getElementById('leftGoalie').style.backgroundColor = checkColor(docData['color_1'])
                for (var i = 1; i <= document.getElementsByClassName('color_2').length; i++) {
                    document.getElementById('leftPlayer_'+i).style.backgroundColor = checkColor(docData['color_2'])
                }
    
    
                for (var i = 1; i <= document.getElementsByClassName('color_3').length; i++) {
                    document.getElementById('rightPlayer_'+i).style.backgroundColor = checkColor(docData['color_3'])
                }
                document.getElementById('rightGoalie').style.backgroundColor = checkColor(docData['color_4'])
                $('body')
                    .queue(elemShow('#container')).delay(1000)
            } else {
                //Positioning system
                //Left Side
                var formations = docData['formation_1'].split('-')
                for (var i = 0; i < formations.length; i++) {
                    formations[i] = parseInt(formations[i]);
                    
                    await sleep(100);
                }
                
                
                var topMax = 672;
                var topMin = 72;
                var leftMax = 1183;
                var leftMin = 875;
                var playerCounter = 1;
                
                for (var column = 0; column < formations.length; column++) {
                    if (formations[column] > 2) {
                        var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                        for (var player = 0; player < formations[column]; player++) {
                            if (formations[column] % 2 != 0) {
                                var topPosition = ((topMax - topMin) / (2*formations[column])) * (player * 2 + 1) + 65;
                            } else {
                                var topPosition = ((topMax - topMin) / (formations[column] - 1)) * player + topMin;
                            }
    
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = topPosition + 'px';
                            playerCounter += 1;
                        }
                    } else {
                        if (formations[column] == 2) {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = '272px';
                            playerCounter += 1;
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = '472px';
                            playerCounter += 1;
                        } else {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('leftPlayer_'+playerCounter).style.left = leftPosition + 'px';
                            document.getElementById('leftPlayer_'+playerCounter).style.top = '365px';
                            playerCounter += 1;
                        }
                    }
                }
                formation1 = docData['formation_1'];
                
                
                //Left Side
                var formations = docData['formation_2'].split('-')
                for (var i = 0; i < formations.length; i++) {
                    formations[i] = parseInt(formations[i]);
                    
                    await sleep(100);
                }
                
                
                topMax = 672;
                topMin = 72;
                var rightMax = 1200;
                var rightMin = 875;
                playerCounter = 1;
                
                for (var column = 0; column < formations.length; column++) {
                    if (formations[column] > 2) {
                        var rightPosition = ((rightMax - rightMin) / (formations.length - 1)) * column + rightMin;
                        for (var player = 0; player < formations[column]; player++) {
                            if (formations[column] % 2 != 0) {
                                topPosition = ((topMax - topMin) / (2*formations[column])) * (player * 2 + 1) + 65;
                            } else {
                                topPosition = ((topMax - topMin) / (formations[column] - 1)) * player + topMin;
                            }
    
                            document.getElementById('rightPlayer_'+playerCounter).style.right = rightPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = topPosition + 'px';
                            playerCounter += 1;
                        }
                    } else {
                        if (formations[column] == 2) {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('rightPlayer_'+playerCounter).style.right = leftPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = '272px';
                            playerCounter += 1;
                            document.getElementById('rightPlayer_'+playerCounter).style.right = leftPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = '472px';
                            playerCounter += 1;
                        } else {
                            var leftPosition = ((leftMax - leftMin) / (formations.length - 1)) * column + leftMin;
                            document.getElementById('rightPlayer_'+playerCounter).style.right = leftPosition + 'px';
                            document.getElementById('rightPlayer_'+playerCounter).style.top = '365px';
                            playerCounter += 1;
                        }
                    }
                }
                formation2 = docData['formation_2'];
                
                $('body')
                    .queue(elemUpdate())
                document.getElementById('leftGoalie').style.backgroundColor = docData['color_1']
                for (var i = 1; i <= document.getElementsByClassName('color_2').length; i++) {
                    document.getElementById('leftPlayer_'+i).style.backgroundColor = docData['color_2']
                }
    
    
                for (var i = 1; i <= document.getElementsByClassName('color_3').length; i++) {
                    document.getElementById('rightPlayer_'+i).style.backgroundColor = docData['color_3']
                }
                document.getElementById('rightGoalie').style.backgroundColor = docData['color_4']
            }
        }
    }
    
    animatePlayers();
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