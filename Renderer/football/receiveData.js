import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

var docData;
export default function updateValues() {
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
        updateData();
    });
};